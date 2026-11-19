use super::css_prop_compile_errors::UnsupportedCssProp;
use super::CSSProp;
use crate::yak_imports::YakImports;
use swc_core::{
  common::{Span, SyntaxContext, DUMMY_SP},
  ecma::ast::{
    CallExpr, Callee, Expr, ExprOrSpread, Ident, JSXAttr, JSXAttrName, JSXAttrOrSpread,
    JSXAttrValue, JSXExpr, JSXOpeningElement, KeyValueProp, Lit, ObjectLit, Prop, PropName,
    PropOrSpread, SpreadElement, Str,
  },
};

impl CSSProp {
  /// The css expression and the merge sources in JSX order: consecutive plain
  /// attributes become one object literal, a spread stays the expression it is
  pub(super) fn collect_merge_parts(
    &self,
    opening_element: &JSXOpeningElement,
    yak_imports: &YakImports,
  ) -> Result<(Vec<Box<Expr>>, Box<Expr>), UnsupportedCssProp> {
    let css_expr =
      Self::extract_css_expr(&opening_element.attrs[self.index], opening_element.span)?;
    Self::validate_css_value(&css_expr, yak_imports)?;
    let mut sources: Vec<Box<Expr>> = Vec::new();
    let mut attr_run: Vec<PropOrSpread> = Vec::new();
    for &(index, _) in self.relevant_props.iter() {
      match &opening_element.attrs[index] {
        JSXAttrOrSpread::JSXAttr(attr) => attr_run.push(Self::map_jsx_attr(attr)?),
        JSXAttrOrSpread::SpreadElement(spread) => {
          Self::close_attr_run(&mut attr_run, &mut sources);
          sources.push(spread.expr.clone());
        }
        #[cfg(swc_ast_unknown)]
        _ => return Err(UnsupportedCssProp::UnsupportedJSXAttrOrSpread()),
      }
    }
    Self::close_attr_run(&mut attr_run, &mut sources);
    Ok((sources, css_expr))
  }

  /// Turns the open run of plain attributes into one object literal source
  fn close_attr_run(attr_run: &mut Vec<PropOrSpread>, sources: &mut Vec<Box<Expr>>) {
    if attr_run.is_empty() {
      return;
    }
    sources.push(Box::new(Expr::Object(ObjectLit {
      span: DUMMY_SP,
      props: std::mem::take(attr_run),
    })));
  }

  /// Swaps the css prop and the props merged into it for the merge call spread
  pub(super) fn replace_with_merge_call(
    &self,
    opening_element: &mut JSXOpeningElement,
    merge_call: Box<Expr>,
  ) {
    opening_element.attrs.remove(self.index);
    for &(index, _) in self.relevant_props.iter().rev() {
      let adjusted_index = if index > self.index { index - 1 } else { index };
      opening_element.attrs.remove(adjusted_index);
    }
    opening_element
      .attrs
      .push(JSXAttrOrSpread::SpreadElement(SpreadElement {
        dot3_token: DUMMY_SP,
        expr: merge_call,
      }));
  }

  /// Maps a single JSX attribute to a PropOrSpread element.
  /// This is used to convert a JSX attribute to an object property for the merge call.
  /// e.g. `style={{color: red}}` becomes `{style: {color: red}}`
  fn map_jsx_attr(attr: &JSXAttr) -> Result<PropOrSpread, UnsupportedCssProp> {
    match &attr.name {
      JSXAttrName::Ident(ident) => Ok(PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
        key: PropName::Ident(ident.clone()),
        value: Self::extract_value(&attr.value, attr.span)?,
      })))),
      _ => Err(UnsupportedCssProp::InvalidJSXAttribute(attr.span)),
    }
  }

  /// Extracts the value from a JSX attribute.
  /// This handles different types of attribute values and converts them to expressions.
  /// e.g. `style={{color: red}}` becomes `{color: red}`
  fn extract_value(
    value: &Option<JSXAttrValue>,
    span: Span,
  ) -> Result<Box<Expr>, UnsupportedCssProp> {
    value
      .as_ref()
      .ok_or(UnsupportedCssProp::MissingAttributeValue(span))
      .and_then(|v| match v {
        // Drop `raw`: a JSX attribute raw is JSX-encoded text (HTML entities stay
        // encoded, backslashes are literal). Moved into JS expression position it
        // would be printed verbatim, so emit from the decoded `value` instead.
        JSXAttrValue::Str(str_lit) => Ok(Box::new(Expr::Lit(Lit::Str(Str {
          span: str_lit.span,
          value: str_lit.value.clone(),
          raw: None,
        })))),
        JSXAttrValue::JSXExprContainer(container) => match &container.expr {
          JSXExpr::Expr(expr) => Ok(expr.clone()),
          _ => Err(UnsupportedCssProp::InvalidJSXEmptyExpr(container.span)),
        },
        _ => Err(UnsupportedCssProp::UnsupportedAttributeValue(span)),
      })
  }

  /// Creates the merge call: the css value first, then every source in JSX
  /// order. Later sources win, as they did in one object literal.
  /// e.g. `className="foo" {...rest}` becomes `__yak_mergeCssProp(css, { className: "foo" }, rest)`
  pub(super) fn create_merge_call(
    sources: Vec<Box<Expr>>,
    css_expr: Box<Expr>,
    merge_ident: &Ident,
  ) -> Box<Expr> {
    let mut args = Vec::with_capacity(sources.len() + 1);
    args.push(ExprOrSpread {
      spread: None,
      expr: css_expr,
    });
    args.extend(
      sources
        .into_iter()
        .map(|expr| ExprOrSpread { spread: None, expr }),
    );
    Box::new(Expr::Call(CallExpr {
      span: DUMMY_SP,
      callee: Callee::Expr(Box::new(Expr::Ident(merge_ident.clone()))),
      args,
      ctxt: SyntaxContext::empty(),
      type_args: None,
    }))
  }
}
