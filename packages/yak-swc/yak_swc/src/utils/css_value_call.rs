use swc_core::{
  common::{source_map::PURE_SP, SyntaxContext, DUMMY_SP},
  ecma::ast::*,
};

/// Wraps a dynamic value in the `cssValue` runtime helper, which adds the
/// unit and the sign that the compiler removed from the css around it
/// e.g. `left: ${({$x}) => $x}px;`  -> __yak_cssValue(({$x}) => $x, "px")
/// e.g. `left: -${({$x}) => $x}px;` -> __yak_cssValue(({$x}) => $x, "px", true)
pub fn css_value_call(expr: Expr, helper: Ident, unit: &str, negate: bool) -> Expr {
  let mut args = vec![
    expr.into(),
    Expr::Lit(Lit::Str(Str {
      span: DUMMY_SP,
      value: unit.into(),
      raw: None,
    }))
    .into(),
  ];
  if negate {
    args.push(
      Expr::Lit(Lit::Bool(Bool {
        span: DUMMY_SP,
        value: true,
      }))
      .into(),
    );
  }
  Expr::Call(CallExpr {
    span: PURE_SP,
    ctxt: SyntaxContext::empty(),
    callee: Callee::Expr(helper.into()),
    args,
    type_args: None,
  })
}
