use super::{CSSProp, RelevantProp};
use crate::fold::css_call_to_class_name::{class_name_attr, expr_attr_value, fold_css_expr};
use crate::remove_pure_annotation;
use crate::yak_imports::YakImports;
use swc_core::{
  common::comments::Comments,
  ecma::ast::{
    JSXAttr, JSXAttrOrSpread, JSXAttrValue, JSXExpr, JSXExprContainer, JSXOpeningElement,
  },
};

impl CSSProp {
  /// Replaces a statically known css prop with a plain className attribute
  /// to avoid the runtime `mergeCssProp` call
  /// Bails out (returns false) if the element has a className or spread attribute
  /// or if the css expression contains dynamic values or mixin references
  ///
  /// e.g.
  /// ```jsx
  /// <div css={css("a")} />                        // -> <div className={"a"} />
  /// <div css={css(() => on && css("b"), "a")} />  // -> <div className={"a" + (on ? " b" : "")} />
  /// <div css={on ? css("a") : css("b")} />        // -> <div className={on ? "a" : "b"} />
  /// ```
  pub(super) fn try_fold(
    &self,
    opening_element: &mut JSXOpeningElement,
    yak_imports: &YakImports,
    comments: &impl Comments,
  ) -> bool {
    // a spread or className may carry class names only known at runtime
    if self
      .relevant_props
      .iter()
      .any(|&(_, kind)| kind != RelevantProp::Style)
    {
      return false;
    }
    let JSXAttrOrSpread::JSXAttr(JSXAttr {
      value:
        Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
          expr: JSXExpr::Expr(css_expr),
          ..
        })),
      ..
    }) = &opening_element.attrs[self.index]
    else {
      // invalid css attribute - the runtime path reports the error
      return false;
    };
    let Some((class_name_expr, folded_call_spans)) = fold_css_expr(css_expr, yak_imports) else {
      return false;
    };
    // a folded class name is a string, not a call, so the `/*#__PURE__*/` comment it inherits from its css call is invalid
    for span in folded_call_spans {
      remove_pure_annotation(comments, span.lo);
    }
    opening_element.attrs[self.index] =
      class_name_attr(yak_imports.runtime(), expr_attr_value(class_name_expr));
    true
  }
}
