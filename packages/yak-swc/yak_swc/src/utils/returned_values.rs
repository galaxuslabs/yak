use crate::utils::ast_helper::unwrap_type_casts;
use swc_core::ecma::ast::*;

/// Collects the expressions that a template interpolation can give to the
/// runtime, e.g. `outlined` for `${(p) => p.$on && outlined}`
///
/// If the interpolation returns a function, the runtime calls it too, so its
/// result counts, e.g. `outlined` in `${(p) => () => outlined}`.
/// A helper declared in a body does not count, e.g. `outlined` in
/// `${(p) => { const get = () => outlined; return get(); }}`, where only the
/// call `get()` is returned
pub fn returned_values(expr: &Expr) -> Vec<&Expr> {
  let mut values = Vec::new();
  collect_value(expr, &mut values);
  values
}

fn collect_value<'a>(expr: &'a Expr, values: &mut Vec<&'a Expr>) {
  match unwrap_type_casts(expr) {
    Expr::Arrow(arrow) => match &*arrow.body {
      ArrowFunctionBody::Expr(body) => collect_value(body, values),
      ArrowFunctionBody::FunctionBody(body) => collect_returns(&body.stmts, values),
      #[cfg(swc_ast_unknown)]
      _ => {}
    },
    Expr::Fn(function) => {
      if let Some(body) = &function.function.body {
        collect_returns(&body.stmts, values);
      }
    }
    // `a && b` gives `a` only when it is falsy, and a falsy value applies no styles
    Expr::Bin(bin) if bin.op == BinaryOp::LogicalAnd => collect_value(&bin.right, values),
    Expr::Bin(bin) if bin.op == BinaryOp::LogicalOr || bin.op == BinaryOp::NullishCoalescing => {
      collect_value(&bin.left, values);
      collect_value(&bin.right, values);
    }
    Expr::Cond(cond) => {
      collect_value(&cond.cons, values);
      collect_value(&cond.alt, values);
    }
    Expr::Seq(seq) => {
      if let Some(last) = seq.exprs.last() {
        collect_value(last, values);
      }
    }
    value => values.push(value),
  }
}

fn collect_returns<'a>(stmts: &'a [Stmt], values: &mut Vec<&'a Expr>) {
  for stmt in stmts {
    collect_returns_in_stmt(stmt, values);
  }
}

fn collect_returns_in_stmt<'a>(stmt: &'a Stmt, values: &mut Vec<&'a Expr>) {
  match stmt {
    Stmt::Return(ReturnStmt { arg: Some(arg), .. }) => collect_value(arg, values),
    Stmt::Block(block) => collect_returns(&block.stmts, values),
    Stmt::If(if_stmt) => {
      collect_returns_in_stmt(&if_stmt.cons, values);
      if let Some(alt) = &if_stmt.alt {
        collect_returns_in_stmt(alt, values);
      }
    }
    Stmt::Switch(switch) => {
      for case in &switch.cases {
        collect_returns(&case.cons, values);
      }
    }
    Stmt::Try(try_stmt) => {
      collect_returns(&try_stmt.block.stmts, values);
      if let Some(handler) = &try_stmt.handler {
        collect_returns(&handler.body.stmts, values);
      }
      if let Some(finalizer) = &try_stmt.finalizer {
        collect_returns(&finalizer.stmts, values);
      }
    }
    Stmt::Labeled(labeled) => collect_returns_in_stmt(&labeled.body, values),
    Stmt::For(for_stmt) => collect_returns_in_stmt(&for_stmt.body, values),
    Stmt::ForIn(for_in) => collect_returns_in_stmt(&for_in.body, values),
    Stmt::ForOf(for_of) => collect_returns_in_stmt(&for_of.body, values),
    Stmt::While(while_stmt) => collect_returns_in_stmt(&while_stmt.body, values),
    Stmt::DoWhile(do_while) => collect_returns_in_stmt(&do_while.body, values),
    _ => {}
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use swc_core::common::{sync::Lrc, FileName, SourceMap, Spanned};
  use swc_core::ecma::parser::{parse_file_as_expr, Syntax, TsSyntax};

  fn returned(source: &str) -> Vec<String> {
    let cm: Lrc<SourceMap> = Default::default();
    let fm = cm.new_source_file(FileName::Anon.into(), source.to_string());
    let expr = parse_file_as_expr(
      &fm,
      Syntax::Typescript(TsSyntax::default()),
      Default::default(),
      None,
      &mut vec![],
    )
    .unwrap();
    returned_values(&expr)
      .into_iter()
      .map(|value| {
        let span = value.span();
        let start = (span.lo - fm.start_pos).0 as usize;
        let end = (span.hi - fm.start_pos).0 as usize;
        source[start..end].to_string()
      })
      .collect()
  }

  #[test]
  fn follows_conditions() {
    assert_eq!(returned("(p) => p.$on && a"), vec!["a"]);
    assert_eq!(returned("(p) => p.$on ? a : b.c"), vec!["a", "b.c"]);
    assert_eq!(returned("(p) => a || b ?? c"), vec!["a", "b", "c"]);
    assert_eq!(returned("(p) => (p.$on && (a as any))"), vec!["a"]);
    assert_eq!(returned("p.$on && a"), vec!["a"]);
  }

  #[test]
  fn follows_returns_in_blocks() {
    assert_eq!(
      returned("(p) => { if (p.$on) { return a; } switch (p.$size) { case 1: return b; } return null; }"),
      vec!["a", "b", "null"]
    );
  }

  #[test]
  fn follows_returned_functions() {
    assert_eq!(returned("(p) => () => a"), vec!["a"]);
  }

  #[test]
  fn skips_functions_declared_in_a_body() {
    assert_eq!(
      returned("(p) => { const f = () => a; function g() { return b; } return f(); }"),
      vec!["f()"]
    );
  }

  #[test]
  fn keeps_calls_as_values() {
    assert_eq!(returned("(p) => p.$on && atoms(\"x\")"), vec!["atoms(\"x\")"]);
  }
}
