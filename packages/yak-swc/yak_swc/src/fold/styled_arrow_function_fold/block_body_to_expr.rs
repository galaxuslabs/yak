use rustc_hash::FxHashMap;
use swc_core::{
  common::{SyntaxContext, DUMMY_SP},
  ecma::ast::{
    BinaryOp, BreakStmt, CallExpr, Callee, Decl, Expr, Id, Ident, Invalid, Lit, MemberProp,
    OptChainBase, ParenExpr, Pat, SeqExpr, Stmt, SwitchCase, SwitchStmt, UnaryOp, VarDecl,
    VarDeclKind,
  },
  ecma::visit::{Visit, VisitWith},
};

use super::fold_css_variable_function::CssValueText;
use crate::utils::ast_helper::{binary, condition, paren, unwrap_type_casts, void_zero};

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
/// in the block. A path that reaches the end of the function without a
/// `return` yields `undefined`. A path that leaves an `if`, a block or a
/// `switch` without a `return` and has more statements after it yields the
/// fall through marker, or `void 0` at a CSS value position, see
/// `fall_through_to_expr`
pub(super) fn block_body_to_expr(
  stmts: &[Stmt],
  consts: &mut ConstReads,
  end: BodyEnd,
  css_text: &mut CssValueText,
) -> Option<Box<Expr>> {
  let Some((first, rest)) = stmts.split_first() else {
    return Some(match end {
      BodyEnd::FallThrough => fall_through_marker(),
      BodyEnd::CssValueFallThrough => void_zero(),
      BodyEnd::ClassNames | BodyEnd::CssValue => undefined(),
    });
  };
  // `if (w) return css("yB1"); const w = $a.w;` reads `w` before its
  // declaration and throws, which the folded function would not
  if reads_later_const(first, rest) {
    return None;
  }
  // a single `return` after the branch is copied, see `branch_to_expr`
  if has_open_branch(first) && !rest.is_empty() && !matches!(rest, [Stmt::Return(_)]) {
    return fall_through_to_expr(first, rest, consts, end, css_text);
  }
  match first {
    Stmt::Return(return_stmt) if can_drop(rest) => {
      let value = match &return_stmt.arg {
        Some(arg) => wrap_in_parens(arg),
        None => undefined(),
      };
      // `??` would skip a returned `null`, see `BodyEnd::CssValueFallThrough`
      if end == BodyEnd::CssValueFallThrough
        && !return_stmt.arg.as_deref().is_some_and(is_never_nullish)
      {
        return Some(css_text.wrap(value));
      }
      Some(value)
    }
    Stmt::Empty(_) => block_body_to_expr(rest, consts, end, css_text),
    Stmt::Block(block) if can_drop(rest) => {
      branch_to_expr(&block.stmts, rest, consts, end, css_text)
    }
    // `if (a) { return x; } return y;` -> `a ? x : y`
    Stmt::If(if_stmt) => {
      // with an `else` the statements after the `if` never run, or they are
      // the one `return` that `branch_to_expr` copies. `fall_through_to_expr`
      // takes every other `if` that reaches them
      if if_stmt.alt.is_some() && !can_drop(rest) {
        return None;
      }
      let cons = branch_to_expr(
        std::slice::from_ref(&*if_stmt.cons),
        rest,
        consts,
        end,
        css_text,
      )?;
      let alt = match &if_stmt.alt {
        Some(alt) => branch_to_expr(std::slice::from_ref(&**alt), rest, consts, end, css_text)?,
        None => block_body_to_expr(rest, consts, end, css_text)?,
      };
      Some(condition(if_stmt.test.clone(), cons, alt))
    }
    Stmt::Switch(switch) => switch_to_expr(switch, rest, consts, end, css_text),
    // `const size = $layout.medium?.size;` leaves no trace in the expression:
    // every read of `size` becomes `$layout.medium?.size`, see `bind_consts`
    Stmt::Decl(Decl::Var(var)) if var.kind == VarDeclKind::Const => {
      bind_consts(var, consts)?;
      block_body_to_expr(rest, consts, end, css_text)
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
          block_body_to_expr(rest, consts, end, css_text)?,
        ],
      }))))
    }
    _ => None,
  }
}

/// What the end of a statement list yields, and whether a branch may fall
/// through to the statements after it
#[derive(Clone, Copy, PartialEq, Eq)]
pub(super) enum BodyEnd {
  /// The end of a function that returns class names: `undefined`, which adds
  /// nothing
  ClassNames,
  /// The end of a function at a CSS value position like `width: ${fn}px;`:
  /// `undefined`
  CssValue,
  /// The end of a branch with more statements after it in a function of
  /// class names: the fall through marker
  FallThrough,
  /// The end of a branch with more statements after it in a function at a
  /// CSS value position: `void 0`
  ///
  /// That function returns its value as it is, and `null` or `undefined` is a
  /// real value there. `??` would go on with the statements after the branch
  /// for it. So a `return` in the branch whose value can be nullish gets the
  /// wrapper of `CssValueText`, which turns the value into text or throws in
  /// development. A value that `is_never_nullish` accepts stays as it is.
  /// `void 0` is then the only nullish value the branch yields, and it stands
  /// for the path that leaves the branch:
  ///
  /// ```text
  /// if ($on) {
  ///   if ($big) return $width;
  /// }
  /// if ($big) return 4;
  /// return 2;
  /// ->
  /// minify:    ($on ? $big ? `${$width}` : void 0 : void 0) ?? ($big ? 4 : 2)
  /// no minify: ($on ? $big ? __yak_cssValue($width, "") : void 0 : void 0) ?? ($big ? 4 : 2)
  /// ```
  ///
  /// The wrapped value gives the same CSS as the source for every string and
  /// number. A missing value gives other text in a production build, which is
  /// invalid CSS either way:
  ///
  /// - With a unit, the source gives `"undefined"` and the fold gives
  ///   `"undefinedpx"`.
  /// - With a minus before the value, the fold gives `"-undefinedpx"`.
  /// - With a minus, `$x={0}` gives `"-0px"` where the source gives `"0px"`.
  ///   The browser reads both as zero.
  CssValueFallThrough,
}

/// Folds an `if`, a block or a `switch` that can end without a `return` and
/// the statements after it into `branch ?? rest`
///
/// Devs write guard blocks in an early return style. A path through the block
/// returns or leaves it and goes on with the next statement:
///
/// ```text
/// if (size === "l") {
///   if ($n >= 12) return css("yB1");
///   if ($n >= 6) return css("yB2");
/// }
/// if ($on) return css("yB3");
/// return css("yB4");
/// ->
/// (size === "l" ? ($n >= 12 ? " yB1" : $n >= 6 ? " yB2" : void 0) : void 0)
///   ?? ($on ? " yB3" : " yB4")
/// ```
///
/// Each path that leaves the block yields the fall through marker, which
/// `fold_value` writes as `void 0`. A folded value is always a string of
/// class names, and `""` is not nullish, so `??` goes on with the statements
/// after the block only for the marker. A `return;` or `return null;` ends
/// the function and folds to `""`, so it stops there. Each condition runs once
/// and in source order, and no statement is copied
///
/// A function at a CSS value position like `width: ${fn}px;` returns its value
/// as it is, and `null` or `undefined` is a real value there. Each `return`
/// in the block whose value can be nullish gets a wrapper, so `??` never
/// skips it. A value that is never nullish stays as it is, see
/// `BodyEnd::CssValueFallThrough`:
///
/// ```text
/// if ($on) {
///   if ($big) return $width;
///   if ($wide) return 1;
/// }
/// if ($wide) return 3;
/// return 2;
/// ->
/// minify:
/// ($on ? $big ? `${$width}` : $wide ? 1 : void 0 : void 0) ?? ($wide ? 3 : 2)
/// no minify:
/// ($on ? $big ? __yak_cssValue($width, "") : $wide ? 1 : void 0 : void 0) ?? ($wide ? 3 : 2)
/// ```
///
/// A `return` after the block, on the right side of `??`, stays as it is
fn fall_through_to_expr(
  first: &Stmt,
  rest: &[Stmt],
  consts: &mut ConstReads,
  end: BodyEnd,
  css_text: &mut CssValueText,
) -> Option<Box<Expr>> {
  let branch_end = match end {
    BodyEnd::ClassNames | BodyEnd::FallThrough => BodyEnd::FallThrough,
    BodyEnd::CssValue | BodyEnd::CssValueFallThrough => BodyEnd::CssValueFallThrough,
  };
  let branch = block_body_to_expr(std::slice::from_ref(first), consts, branch_end, css_text)?;
  let rest = block_body_to_expr(rest, consts, end, css_text)?;
  Some(binary(BinaryOp::NullishCoalescing, branch, rest))
}

/// Returns true if a branch of the statement can end without a `return`. The
/// false test of an `if` without `else` and a value without a `case` in a
/// `switch` without `default` are no such branch: they go on with the next
/// statement as the `alt` of the condition, see `block_body_to_expr`
fn has_open_branch(stmt: &Stmt) -> bool {
  let open = |branch: &Stmt| !always_returns(std::slice::from_ref(branch));
  match stmt {
    Stmt::Block(block) => !always_returns(&block.stmts),
    Stmt::If(if_stmt) => open(&if_stmt.cons) || if_stmt.alt.as_deref().is_some_and(open),
    // only the last case can end without a `return`, see `switch_to_expr`
    Stmt::Switch(switch) => (switch.cases.last()).is_some_and(|case| !always_returns(&case.cons)),
    _ => false,
  }
}

/// The value of a path that leaves a branch without a `return`, see
/// `fall_through_to_expr`. Only `block_body_to_expr` creates it: the parser
/// creates no `Invalid` node for valid source, so the user can not write it.
/// `fold_value` accepts it only on the left side of the `??` of
/// `fall_through_to_expr`
pub(super) fn fall_through_marker() -> Box<Expr> {
  Box::new(Expr::Invalid(Invalid { span: DUMMY_SP }))
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
/// branch that does not continues with them. If they are a single `return`,
/// the expression of the branch gets a copy of it:
///
/// ```text
/// if ($on) {
///   if ($big) return css("yB1");
/// }
/// return css("yB2");
/// ->
/// $on ? ($big ? css("yB1") : css("yB2")) : css("yB2")
/// ```
///
/// Other statements after the branch need `fall_through_to_expr`, which
/// `block_body_to_expr` takes before it gets here
fn branch_to_expr(
  branch: &[Stmt],
  rest: &[Stmt],
  consts: &mut ConstReads,
  end: BodyEnd,
  css_text: &mut CssValueText,
) -> Option<Box<Expr>> {
  if rest.is_empty() || always_returns(branch) {
    block_body_to_expr(branch, consts, end, css_text)
  } else if matches!(rest, [Stmt::Return(_)]) {
    block_body_to_expr(&[branch, rest].concat(), consts, end, css_text)
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
/// with the statements after it like an `if` without `return`, see
/// `branch_to_expr` and `fall_through_to_expr`
fn switch_to_expr(
  switch: &SwitchStmt,
  rest: &[Stmt],
  consts: &mut ConstReads,
  end: BodyEnd,
  css_text: &mut CssValueText,
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
    Some(case) => case_to_expr(case, rest, consts, end, css_text)?,
    None => block_body_to_expr(rest, consts, end, css_text)?,
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
    result = condition(
      test,
      case_to_expr(case, rest, consts, end, css_text)?,
      result,
    );
  }
  Some(result)
}

/// Returns the expression for the statements of one `case`. Only the last
/// case can end without a `return`, see `switch_to_expr`. A `break` at its
/// end leaves the `switch` like the end of the case does, so it is left out:
/// `default: assertNever($size); break;` -> `(assertNever($size), undefined)`
fn case_to_expr(
  case: &SwitchCase,
  rest: &[Stmt],
  consts: &mut ConstReads,
  end: BodyEnd,
  css_text: &mut CssValueText,
) -> Option<Box<Expr>> {
  let cons = match case.cons.split_last() {
    Some((Stmt::Break(BreakStmt { label: None, .. }), init)) => init,
    _ => &case.cons[..],
  };
  branch_to_expr(cons, rest, consts, end, css_text)
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

/// Returns true if the value can never be `null` or `undefined`. A `return`
/// of such a value in a branch with more statements after it needs no
/// wrapper, see `BodyEnd::CssValueFallThrough`:
/// `if ($on) return $n * 2;` -> `$on ? $n * 2 : void 0`, but
/// `if ($on) return $n;` -> ``$on ? `${$n}` : void 0`` with `minify`
///
/// - a literal other than `null`, e.g. `2`, `"auto"` or `true`, and a template
///   literal like `` `${$n}px` ``
/// - `-$n`, `!$on` or `typeof $n`: every unary operator but `void` returns a
///   number, a string or a boolean
/// - `$n * 2`, `$n + "px"` or `$n > 2`: every binary operator but `&&`, `||`
///   and `??` returns a number, a string or a boolean
/// - `a ? 1 : 2` when both branches count
/// - `a || 1` and `a ?? 1` when the right side counts: they return the left
///   side only when it is truthy or not nullish
/// - `a && 1` when both sides count: it returns the left side when it is
///   falsy, and a falsy `$a` can be `null`
/// - `(log($a), 1)` when the last expression counts
///
/// A read like `$width` or `props.x` and a call like `getWidth()` can return
/// anything
fn is_never_nullish(expr: &Expr) -> bool {
  match unwrap_type_casts(expr) {
    Expr::Lit(lit) => !matches!(lit, Lit::Null(_)),
    Expr::Tpl(_) => true,
    Expr::Unary(unary) => unary.op != UnaryOp::Void,
    Expr::Bin(bin) => match bin.op {
      BinaryOp::LogicalAnd => is_never_nullish(&bin.left) && is_never_nullish(&bin.right),
      BinaryOp::LogicalOr | BinaryOp::NullishCoalescing => is_never_nullish(&bin.right),
      _ => true,
    },
    Expr::Cond(cond) => is_never_nullish(&cond.cons) && is_never_nullish(&cond.alt),
    Expr::Seq(seq) => seq.exprs.last().is_some_and(|last| is_never_nullish(last)),
    _ => false,
  }
}

fn undefined() -> Box<Expr> {
  Box::new(Expr::Ident(Ident::new(
    "undefined".into(),
    DUMMY_SP,
    SyntaxContext::empty(),
  )))
}
