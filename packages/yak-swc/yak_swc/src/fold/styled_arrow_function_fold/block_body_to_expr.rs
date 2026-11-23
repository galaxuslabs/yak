use rustc_hash::FxHashMap;
use swc_core::{
  common::{SyntaxContext, DUMMY_SP},
  ecma::ast::{
    BinaryOp, BreakStmt, CallExpr, Callee, Decl, Expr, Id, Ident, Lit, MemberProp, OptChainBase,
    ParenExpr, Pat, SeqExpr, Stmt, SwitchCase, SwitchStmt, VarDecl, VarDeclKind,
  },
  ecma::visit::{Visit, VisitWith},
};

use crate::utils::ast_helper::{binary, condition, paren, unwrap_type_casts};

/// Turns the block body of a runtime expression into the one expression it
/// returns, so the folded function can take it like an arrow without a block:
///
/// ```text
/// ({ $size }) => {
///   if ($size === "s") {
///     return css("yB1");
///   }
///   return css("yB2");
/// }
/// ->
/// $size === "s" ? css("yB1") : css("yB2")
/// ```
///
/// The body may hold `if`, `else`, `switch`, `return`, `;`, nested `{}`
/// blocks, calls like `assertNever($size);`, see `is_discarded_expression`,
/// and a `const` that names a prop read, see `bind_consts`. Every other
/// statement, e.g. a `let` or `$size++`, has no place in the expression, so
/// the component keeps its unfolded output. That also holds for a statement
/// after a `return`, see `can_drop`
///
/// Each condition stays in the order the user wrote it and runs as often as
/// in the block. A path that ends without a `return` yields `undefined`
pub fn block_body_to_expr(stmts: &[Stmt], consts: &mut ConstReads) -> Option<Box<Expr>> {
  let Some((first, rest)) = stmts.split_first() else {
    return Some(undefined());
  };
  // `if (w) return css("yB1"); const w = $a.w;` reads `w` before its
  // declaration and throws, which the folded function would not
  if reads_later_const(first, rest) {
    return None;
  }
  match first {
    Stmt::Return(return_stmt) if can_drop(rest) => Some(match &return_stmt.arg {
      Some(arg) => wrap_in_parens(arg),
      None => undefined(),
    }),
    Stmt::Empty(_) => block_body_to_expr(rest, consts),
    Stmt::Block(block) if can_drop(rest) => branch_to_expr(&block.stmts, rest, consts),
    // `if (a) { return x; } return y;` -> `a ? x : y`
    Stmt::If(if_stmt) => {
      // with an `else` the statements after the `if` never run, or they are
      // the one `return` that `branch_to_expr` copies
      if if_stmt.alt.is_some() && !can_drop(rest) {
        return None;
      }
      let cons = branch_to_expr(std::slice::from_ref(&*if_stmt.cons), rest, consts)?;
      let alt = match &if_stmt.alt {
        Some(alt) => branch_to_expr(std::slice::from_ref(&**alt), rest, consts)?,
        None => block_body_to_expr(rest, consts)?,
      };
      Some(condition(if_stmt.test.clone(), cons, alt))
    }
    Stmt::Switch(switch) => switch_to_expr(switch, rest, consts),
    // `const size = $layout.medium?.size;` leaves no trace in the expression:
    // every read of `size` becomes `$layout.medium?.size`, see `bind_consts`
    Stmt::Decl(Decl::Var(var)) if var.kind == VarDeclKind::Const => {
      bind_consts(var, consts)?;
      block_body_to_expr(rest, consts)
    }
    // Devs write an exhaustive check like `assertNever($size);` or add a
    // `console.log($size);` while they debug. The source throws the value of
    // the statement away, so it can add no class name. The call stays at its
    // place in a sequence, so it still runs as often and in the same order,
    // and `assertNever` still throws for an unknown value:
    //
    // switch ($size) {
    //   case "s": return css("yB1");
    //   default: assertNever($size);
    // }
    // ->
    // $size === "s" ? css("yB1") : (assertNever($size), undefined)
    //
    // `{ log($a); return css("yB1"); }` -> `(log($a), css("yB1"))` keeps the
    // order of the statements. `fold_value` later turns the `undefined` into
    // `""` and the `css("yB1")` into `" yB1"`
    Stmt::Expr(statement) if is_discarded_expression(&statement.expr) => {
      Some(paren(Box::new(Expr::Seq(SeqExpr {
        span: DUMMY_SP,
        exprs: vec![
          Box::new(unwrap_type_casts(&statement.expr).clone()),
          block_body_to_expr(rest, consts)?,
        ],
      }))))
    }
    _ => None,
  }
}

/// The initializer of each `const` that names a prop read, e.g. `$a.width`
/// for `const width = $a.width;`. `FoldParams::substitute` writes it at every
/// read of the name. SWC gives each binding an `Id` of its own, so a `const`
/// of the same name in another block or function is another entry
pub(super) type ConstReads = FxHashMap<Id, Box<Expr>>;

/// Registers the declarators of a `const` statement in `consts`
///
/// Devs give a prop read a short name, so that the conditions after it stay
/// readable. The folded function has no statements, so it writes the
/// initializer at each read of the name instead:
///
/// ```text
/// const size = $layout.medium?.size;
/// if (size === "s") return css("yB1");
/// return css("yB2");
/// ->
/// $layout.medium?.size === "s" ? css("yB1") : css("yB2")
/// ```
///
/// The initializer runs once per read, so it has to be a plain read like
/// `$a`, `p.$a.b` or `$a?.b`, or a literal like `2`: a call like `calc($a)`
/// would run several times. `let` and `var` stay unfolded, because an
/// assignment between two reads could change their value
///
/// A getter on a prop runs once per read of the name instead of once. We
/// accept that, because a React render has to be free of side effects, and
/// React itself renders a component more than once, e.g. in strict mode. The
/// same holds for a call in a condition that changes the prop between two
/// reads. Getters on props are rare, and a default value from the
/// destructuring like `({ $a = SIZES.s })` is already read this way
fn bind_consts(var: &VarDecl, consts: &mut ConstReads) -> Option<()> {
  if var.declare {
    return None;
  }
  for (index, declarator) in var.decls.iter().enumerate() {
    // a destructuring like `const { medium } = $layout;` stays unfolded
    let Pat::Ident(name) = &declarator.name else {
      return None;
    };
    let init = unwrap_type_casts(declarator.init.as_deref()?);
    if !is_const_initializer(init) {
      return None;
    }
    // `const a = a.b;` and `const a = b.c, b = $d;` read a name before its
    // declaration. A read of an earlier name like `b = a.c` in
    // `const a = $d, b = a.c;` stays in the initializer of `b`. The
    // substitution replaces it when it writes the initializer at a read of `b`
    let later: Vec<Id> = var.decls[index..]
      .iter()
      .filter_map(|later| later.name.as_ident().map(|later| later.to_id()))
      .collect();
    if reads_any(init, &later) {
      return None;
    }
    consts.insert(name.to_id(), Box::new(init.clone()));
  }
  Some(())
}

/// `"s"`, `2`, `true`, `null` or a plain read, see `is_read_chain`
fn is_const_initializer(expr: &Expr) -> bool {
  matches!(
    expr,
    Expr::Lit(Lit::Str(_) | Lit::Num(_) | Lit::Bool(_) | Lit::Null(_))
  ) || is_read_chain(expr)
}

/// A plain read with or without optional chaining: `$a`, `props.$a.b`,
/// `$a?.b` or `$a.b?.c`
fn is_read_chain(expr: &Expr) -> bool {
  let member = match expr {
    Expr::Ident(_) => return true,
    Expr::Member(member) => member,
    Expr::OptChain(chain) => match &*chain.base {
      OptChainBase::Member(member) => member,
      _ => return false,
    },
    _ => return false,
  };
  matches!(member.prop, MemberProp::Ident(_)) && is_read_chain(unwrap_type_casts(&member.obj))
}

/// Returns true if `first` reads a `const` that `rest` declares, see
/// `block_body_to_expr`. A body without a `const` skips the visit
fn reads_later_const(first: &Stmt, rest: &[Stmt]) -> bool {
  let later = declared_consts(rest);
  !later.is_empty() && reads_any(first, &later)
}

/// Returns true if a `const` of one `case` is read outside of that case:
/// `case "s": const w = $a.w; return w; case "m": return w;`. All cases
/// share the block of the `switch`, so the second `w` reads the first one
/// before its declaration and throws, which the folded function would not
fn reads_const_of_other_case(switch: &SwitchStmt) -> bool {
  switch.cases.iter().enumerate().any(|(index, case)| {
    let ids = declared_consts(&case.cons);
    !ids.is_empty()
      && (reads_any(&*switch.discriminant, &ids)
        || reads_any(&case.test, &ids)
        || (switch.cases.iter().enumerate())
          .any(|(other, case)| other != index && reads_any(case, &ids)))
  })
}

/// The names that the `const` statements in `stmts` declare, without the
/// ones in nested blocks
fn declared_consts(stmts: &[Stmt]) -> Vec<Id> {
  stmts
    .iter()
    .filter_map(|stmt| match stmt {
      Stmt::Decl(Decl::Var(var)) if var.kind == VarDeclKind::Const => Some(var),
      _ => None,
    })
    .flat_map(|var| &var.decls)
    .filter_map(|declarator| declarator.name.as_ident().map(|name| name.to_id()))
    .collect()
}

/// Returns true if one of the `ids` appears anywhere in `node`
fn reads_any<N: for<'a> VisitWith<ReadsAny<'a>>>(node: &N, ids: &[Id]) -> bool {
  let mut visitor = ReadsAny { ids, found: false };
  node.visit_with(&mut visitor);
  visitor.found
}

struct ReadsAny<'a> {
  ids: &'a [Id],
  found: bool,
}

impl Visit for ReadsAny<'_> {
  fn visit_ident(&mut self, ident: &Ident) {
    if self.ids.contains(&ident.to_id()) {
      self.found = true;
    }
  }
}

/// A statement or a part of a sequence whose value the source throws away:
/// a call like `assertNever($size)` or `console.log($size)`, or a plain read
/// like `$size`, which is what `$size satisfies never;` leaves after the
/// types are stripped
///
/// The callee is a plain read, so the call is the only thing that runs. A
/// plain read stays in the sequence like a call, so the folded function reads
/// what the source reads. An assignment, `$size++`, `await` and `yield` stay
/// unfolded: an assignment or an update could write to a prop that the other
/// conditions read from the same parameter, and `await` or `yield` pause the
/// function, which an expression of the folded function can not do. The
/// arguments go through `FoldParams::substitute` like a condition, which
/// fails for a write to a prop inside them
pub(super) fn is_discarded_expression(expr: &Expr) -> bool {
  match unwrap_type_casts(expr) {
    Expr::Call(CallExpr {
      callee: Callee::Expr(callee),
      ..
    }) => is_plain_read(unwrap_type_casts(callee)),
    expr => is_plain_read(expr),
  }
}

/// Returns the expression for one branch. `rest` holds the statements after
/// the `if` or the block of that branch.
///
/// A branch that returns on every path never reaches those statements. A
/// branch that does not continues with them, so its expression needs a copy.
/// The copy is only made for a single `return`, to keep the output small:
///
/// ```text
/// if ($on) {
///   if ($big) return css("yB1");
/// }
/// return css("yB2");
/// ->
/// $on ? ($big ? css("yB1") : css("yB2")) : css("yB2")
/// ```
fn branch_to_expr(branch: &[Stmt], rest: &[Stmt], consts: &mut ConstReads) -> Option<Box<Expr>> {
  if rest.is_empty() || always_returns(branch) {
    block_body_to_expr(branch, consts)
  } else if matches!(rest, [Stmt::Return(_)]) {
    block_body_to_expr(&[branch, rest].concat(), consts)
  } else {
    None
  }
}

/// `switch ($size) { case "s": return a; case "m": case "l": return b; default: return c; }`
/// -> `$size === "s" ? a : $size === "m" || $size === "l" ? b : c`
///
/// The expression reads the switched value once per `case`, so it has to be a
/// plain read like `$size` or `props.$size`. A `case` compares with `===`,
/// and so does the expression. A case value is a literal or a plain read
/// like `Size.Small`: it can not change the switched value between two
/// comparisons, which a call like `case next():` could. Every `case` but the
/// last returns: a `break` or a `case` that runs into the next one would need
/// the statements after the `switch` a second time
///
/// The last case may end without a `return` or with a `break`, e.g.
/// `default: assertNever($size);`. It runs out of the `switch` and continues
/// with the statements after it, which `branch_to_expr` copies if they are
/// one `return`, like for an `if` without `return`
fn switch_to_expr(
  switch: &SwitchStmt,
  rest: &[Stmt],
  consts: &mut ConstReads,
) -> Option<Box<Expr>> {
  let discriminant = unwrap_type_casts(&switch.discriminant);
  if !is_plain_read(discriminant) || reads_const_of_other_case(switch) {
    return None;
  }
  // `case "m": case "l": return b;` is one group with two tests
  let mut groups: Vec<(Vec<&Expr>, &SwitchCase)> = Vec::new();
  let mut tests: Vec<&Expr> = Vec::new();
  let mut default_case: Option<&SwitchCase> = None;
  let mut default_label_seen = false;
  for (index, case) in switch.cases.iter().enumerate() {
    // `default` is the last group, so that the order of the tests stays
    if default_case.is_some() {
      return None;
    }
    match &case.test {
      Some(test) => {
        if default_label_seen || !is_case_value(unwrap_type_casts(test)) {
          return None;
        }
        tests.push(test);
      }
      None => default_label_seen = true,
    }
    if case.cons.is_empty() {
      continue;
    }
    // a case before the last one without `return` runs into the next case
    if !always_returns(&case.cons) && index + 1 < switch.cases.len() {
      return None;
    }
    if default_label_seen {
      default_case = Some(case);
    } else {
      groups.push((std::mem::take(&mut tests), case));
    }
  }
  // labels without statements at the end run out of the `switch`
  if default_case.is_none() && (default_label_seen || !tests.is_empty()) {
    return None;
  }
  let mut result = match default_case {
    // the statements after a `switch` whose `default` returns never run
    Some(case) if always_returns(&case.cons) && !can_drop(rest) => return None,
    Some(case) => case_to_expr(case, rest, consts)?,
    None => block_body_to_expr(rest, consts)?,
  };
  for (tests, case) in groups.into_iter().rev() {
    let test = tests
      .into_iter()
      .map(|test| {
        binary(
          BinaryOp::EqEqEq,
          Box::new(discriminant.clone()),
          Box::new(test.clone()),
        )
      })
      .reduce(|left, right| binary(BinaryOp::LogicalOr, left, right))?;
    result = condition(test, case_to_expr(case, rest, consts)?, result);
  }
  Some(result)
}

/// Returns the expression for the statements of one `case`. Only the last
/// case can end without a `return`, see `switch_to_expr`. A `break` at its
/// end leaves the `switch` like the end of the case does, so it is left out:
/// `default: assertNever($size); break;` -> `(assertNever($size), undefined)`
fn case_to_expr(case: &SwitchCase, rest: &[Stmt], consts: &mut ConstReads) -> Option<Box<Expr>> {
  let cons = match case.cons.split_last() {
    Some((Stmt::Break(BreakStmt { label: None, .. }), init)) => init,
    _ => &case.cons[..],
  };
  branch_to_expr(cons, rest, consts)
}

/// Statements that never run are left out of the expression, e.g. the `break`
/// in `case "s": return a; break;`. That is only safe for `return`, `break`
/// and `;`. A `function` or a `var` is declared for the whole body even after
/// a `return`, e.g. `return isBig($size); function isBig(s) { ... }`, so the
/// component keeps its unfolded output
fn can_drop(stmts: &[Stmt]) -> bool {
  stmts
    .iter()
    .all(|stmt| matches!(stmt, Stmt::Return(_) | Stmt::Break(_) | Stmt::Empty(_)))
}

/// Returns true if every path through the statements ends with a `return`.
/// It also counts a `break` path inside a `switch` case as a return:
/// `block_body_to_expr` rejects every `break` that can run
fn always_returns(stmts: &[Stmt]) -> bool {
  stmts.iter().any(|stmt| match stmt {
    Stmt::Return(_) => true,
    Stmt::Block(block) => always_returns(&block.stmts),
    Stmt::If(if_stmt) => match &if_stmt.alt {
      Some(alt) => {
        always_returns(std::slice::from_ref(&*if_stmt.cons))
          && always_returns(std::slice::from_ref(&**alt))
      }
      None => false,
    },
    // every group of a foldable `switch` returns, so only `default` decides
    Stmt::Switch(switch) => {
      switch.cases.iter().any(|case| case.test.is_none())
        && switch
          .cases
          .iter()
          .all(|case| case.cons.is_empty() || always_returns(&case.cons))
        && switch
          .cases
          .last()
          .is_some_and(|case| !case.cons.is_empty())
    }
    _ => false,
  })
}

/// `$size`, `props.$size` or `props.theme.mode`: reading it again has no side
/// effect the user wrote
fn is_plain_read(expr: &Expr) -> bool {
  match expr {
    Expr::Ident(_) => true,
    Expr::Member(member) => {
      matches!(member.prop, MemberProp::Ident(_)) && is_plain_read(unwrap_type_casts(&member.obj))
    }
    _ => false,
  }
}

/// `"s"`, `1`, `Size.Small` or `SMALL`
fn is_case_value(expr: &Expr) -> bool {
  match expr {
    Expr::Lit(lit) => matches!(lit, Lit::Str(_) | Lit::Num(_) | Lit::Bool(_) | Lit::Null(_)),
    _ => is_plain_read(expr),
  }
}

/// A returned value keeps its meaning as a branch of `a ? b : c`: e.g.
/// `return a, b;` becomes `(a, b)`
fn wrap_in_parens(expr: &Expr) -> Box<Expr> {
  match expr {
    Expr::Seq(_) | Expr::Assign(_) | Expr::Arrow(_) | Expr::Yield(_) => {
      Box::new(Expr::Paren(ParenExpr {
        span: DUMMY_SP,
        expr: Box::new(expr.clone()),
      }))
    }
    _ => Box::new(expr.clone()),
  }
}

fn undefined() -> Box<Expr> {
  Box::new(Expr::Ident(Ident::new(
    "undefined".into(),
    DUMMY_SP,
    SyntaxContext::empty(),
  )))
}
