use swc_core::{
  common::{SyntaxContext, DUMMY_SP},
  ecma::ast::{BinaryOp, Expr, Ident, Lit, MemberProp, ParenExpr, Stmt, SwitchCase, SwitchStmt},
};

use crate::utils::ast_helper::{binary, condition, unwrap_type_casts};

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
/// The body may hold `if`, `else`, `switch`, `return`, `;` and nested `{}`
/// blocks only. Every other statement, e.g. a `const` or a `console.log`, has
/// no place in an expression, so the component keeps its unfolded output.
/// That also holds for a statement after a `return`, see `can_drop`
///
/// Each condition stays in the order the user wrote it and runs as often as
/// in the block. A path that ends without a `return` yields `undefined`
pub fn block_body_to_expr(stmts: &[Stmt]) -> Option<Box<Expr>> {
  let Some((first, rest)) = stmts.split_first() else {
    return Some(undefined());
  };
  match first {
    Stmt::Return(return_stmt) if can_drop(rest) => Some(match &return_stmt.arg {
      Some(arg) => wrap_in_parens(arg),
      None => undefined(),
    }),
    Stmt::Empty(_) => block_body_to_expr(rest),
    Stmt::Block(block) if can_drop(rest) => branch_to_expr(&block.stmts, rest),
    // `if (a) { return x; } return y;` -> `a ? x : y`
    Stmt::If(if_stmt) => {
      // with an `else` the statements after the `if` never run, or they are
      // the one `return` that `branch_to_expr` copies
      if if_stmt.alt.is_some() && !can_drop(rest) {
        return None;
      }
      let cons = branch_to_expr(std::slice::from_ref(&*if_stmt.cons), rest)?;
      let alt = match &if_stmt.alt {
        Some(alt) => branch_to_expr(std::slice::from_ref(&**alt), rest)?,
        None => block_body_to_expr(rest)?,
      };
      Some(condition(if_stmt.test.clone(), cons, alt))
    }
    Stmt::Switch(switch) => switch_to_expr(switch, rest),
    _ => None,
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
fn branch_to_expr(branch: &[Stmt], rest: &[Stmt]) -> Option<Box<Expr>> {
  if rest.is_empty() || always_returns(branch) {
    block_body_to_expr(branch)
  } else if matches!(rest, [Stmt::Return(_)]) {
    block_body_to_expr(&[branch, rest].concat())
  } else {
    None
  }
}

/// `switch ($size) { case "s": return a; case "m": case "l": return b; default: return c; }`
/// -> `$size === "s" ? a : $size === "m" || $size === "l" ? b : c`
///
/// The expression reads the switched value once per `case`, so it has to be a
/// plain read like `$size` or `props.$size`. A `case` compares with `===`,
/// and so does the expression: the case values are literals to keep that
/// comparison free of side effects. Every `case` returns: a `break` or a
/// `case` that runs into the next one would need the statements after the
/// `switch` a second time
fn switch_to_expr(switch: &SwitchStmt, rest: &[Stmt]) -> Option<Box<Expr>> {
  let discriminant = unwrap_type_casts(&switch.discriminant);
  if !is_plain_read(discriminant) {
    return None;
  }
  // `case "m": case "l": return b;` is one group with two tests
  let mut groups: Vec<(Vec<&Expr>, &SwitchCase)> = Vec::new();
  let mut tests: Vec<&Expr> = Vec::new();
  let mut default_case: Option<&SwitchCase> = None;
  let mut default_label_seen = false;
  for case in &switch.cases {
    // `default` is the last group, so that the order of the tests stays
    if default_case.is_some() {
      return None;
    }
    match &case.test {
      Some(test) => {
        if default_label_seen
          || !matches!(unwrap_type_casts(test), Expr::Lit(lit) if is_case_literal(lit))
        {
          return None;
        }
        tests.push(test);
      }
      None => default_label_seen = true,
    }
    if case.cons.is_empty() {
      continue;
    }
    if !always_returns(&case.cons) {
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
    // the statements after a `switch` with a `default` never run
    Some(_) if !can_drop(rest) => return None,
    Some(case) => block_body_to_expr(&case.cons)?,
    None => block_body_to_expr(rest)?,
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
    result = condition(test, block_body_to_expr(&case.cons)?, result);
  }
  Some(result)
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

fn is_case_literal(lit: &Lit) -> bool {
  matches!(lit, Lit::Str(_) | Lit::Num(_) | Lit::Bool(_) | Lit::Null(_))
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
