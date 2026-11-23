//! Compiles the `css` prop of a JSX element: to a plain `className` where the
//! styles are known at build time, and to the runtime `mergeCssProp` spread
//! everywhere else

use self::css_prop_compile_errors::UnsupportedCssProp;
use crate::fold::css_call_to_class_name::{is_yak_css_callee, is_yak_style_callee};
use crate::utils::ast_helper::unwrap_type_casts;
use crate::yak_imports::{YakImports, YakRuntime};
use swc_core::{
  common::comments::Comments,
  common::{Span, Spanned},
  ecma::ast::{
    BinaryOp, Expr, JSXAttr, JSXAttrName, JSXAttrOrSpread, JSXAttrValue, JSXExpr, JSXExprContainer,
    JSXOpeningElement, Lit,
  },
};

mod css_prop_compile_errors;
mod css_prop_to_class_name;
mod css_prop_to_merge_call;

/// An attribute that has to be merged with the css prop
#[derive(Debug, Clone, Copy, PartialEq)]
enum RelevantProp {
  ClassName,
  Style,
  /// A spread may carry a className or style only known at runtime
  Spread,
}

#[derive(Debug)]
pub struct CSSProp {
  index: usize,
  relevant_props: Vec<(usize, RelevantProp)>,
}

impl CSSProp {
  /// Transforms the css prop to a spread attribute, changes the call to invoke it without parameters
  /// and inserts it into the correct position.
  /// If the css prop has relevant props, they are removed and transformed into a merge call.
  ///
  /// e.g.
  /// ```jsx
  /// <div css={css("divClassName")} />
  /// ```
  /// becomes
  /// ```jsx
  /// <div {...css("divClassName")({})} />
  /// ```
  /// and
  /// ```jsx
  /// <div className="myClassName" {...rest} style={{color: red}} css={css("divClassName")} />
  /// ```
  /// becomes
  /// ```jsx
  /// <div {...__yak_mergeCssProp(
  ///   css("divClassName"),
  ///   { className: "myClassName" },
  ///   rest,
  ///   { style: {color: red} }
  /// )} />
  /// ```
  /// The css value comes first, then one argument per merged source in JSX
  /// order: a run of plain attributes as one object literal, a spread as the
  /// expression it was written as. The helper never receives a props object
  /// spread at the call site, so it can copy property descriptors instead of
  /// reading values (the Solid runtime relies on that for hydration).
  /// An empty css prop (e.g. `css``) is always dropped. Otherwise, when
  /// `fold_static` is on, a statically known css prop skips the merge call and
  /// folds into a plain `className` instead (see `try_fold`).
  pub fn transform(
    &self,
    opening_element: &mut JSXOpeningElement,
    yak_imports: &mut YakImports,
    comments: &impl Comments,
    strict_css_prop: bool,
    fold_static: bool,
  ) {
    if Self::is_noop_css_prop(&opening_element.attrs[self.index], yak_imports) {
      opening_element.attrs.remove(self.index);
      return;
    }
    if fold_static && self.try_fold(opening_element, yak_imports, comments) {
      return;
    }
    // The parts are collected from borrowed attributes before anything is
    // mutated, so both outcomes below start from the element as written.
    match self.collect_merge_parts(opening_element, yak_imports) {
      // We own this css prop and replaces it with the merge call
      Ok((sources, css_expr)) => {
        let merge_ident = yak_imports.get_yak_utility_ident("mergeCssProp");
        let merge_call = Self::create_merge_call(sources, css_expr, &merge_ident);
        self.replace_with_merge_call(opening_element, merge_call);
      }
      // We can't compile this value, so the element keeps every attribute as written
      // and another library on it can still own the css prop.
      // Default strict mode reports the value on top, since in a yak project it is almost always a mistake.
      Err(unsupported) => {
        if strict_css_prop {
          unsupported.report();
        }
      }
    }
  }

  /// Matches a css prop that compiles to a bare `css()` with no arguments,
  /// produced by an empty css template such as `css``
  fn is_noop_css_prop(attr: &JSXAttrOrSpread, yak_imports: &YakImports) -> bool {
    let JSXAttrOrSpread::JSXAttr(JSXAttr {
      value:
        Some(JSXAttrValue::JSXExprContainer(JSXExprContainer {
          expr: JSXExpr::Expr(expr),
          ..
        })),
      ..
    }) = attr
    else {
      return false;
    };
    matches!(
      unwrap_type_casts(expr),
      Expr::Call(call)
        if is_yak_css_callee(&call.callee, yak_imports) && call.args.is_empty()
    )
  }

  /// Checks that a css value can apply styles, both at the top level and in
  /// the value arms of ternaries and logical expressions
  ///
  /// The css prop only compiles styles written in place, so it accepts an
  /// inline css template (already transformed into a `css(...)` call when this
  /// runs), an `atoms(...)` call and the falsy values, which apply no styles.
  /// Everything else is rejected here.
  fn validate_css_value(expr: &Expr, yak_imports: &YakImports) -> Result<(), UnsupportedCssProp> {
    match unwrap_type_casts(expr) {
      Expr::Cond(cond) => {
        Self::validate_css_value(&cond.cons, yak_imports)?;
        Self::validate_css_value(&cond.alt, yak_imports)
      }
      // `cond && css` - only the right hand side is a css value
      Expr::Bin(bin) if bin.op == BinaryOp::LogicalAnd => {
        Self::validate_css_value(&bin.right, yak_imports)
      }
      // `a || b` and `a ?? b` - both sides are css values
      Expr::Bin(bin) if matches!(bin.op, BinaryOp::LogicalOr | BinaryOp::NullishCoalescing) => {
        Self::validate_css_value(&bin.left, yak_imports)?;
        Self::validate_css_value(&bin.right, yak_imports)
      }
      Expr::Call(call) if is_yak_style_callee(&call.callee, yak_imports) => Ok(()),
      // the falsy css values apply no styles. `true` is not one of them
      Expr::Lit(Lit::Null(_)) => Ok(()),
      Expr::Lit(Lit::Bool(bool_lit)) if !bool_lit.value => Ok(()),
      Expr::Ident(ident) if ident.sym == "undefined" => Ok(()),
      // a reference to styles declared elsewhere keeps its own message. It is
      // fixed by wrapping the reference in a css template
      Expr::Ident(ident) => Err(UnsupportedCssProp::StyleReference(ident.span)),
      Expr::Member(member) => Err(UnsupportedCssProp::StyleReference(member.span)),
      Expr::OptChain(opt_chain) => Err(UnsupportedCssProp::StyleReference(opt_chain.span)),
      unsupported => Err(UnsupportedCssProp::UnsupportedValue(unsupported.span())),
    }
  }

  /// Extracts the CSS expression from a JSX attribute or spread element.
  fn extract_css_expr(attr: &JSXAttrOrSpread, span: Span) -> Result<Box<Expr>, UnsupportedCssProp> {
    match attr {
      JSXAttrOrSpread::JSXAttr(jsx_attr) => jsx_attr
        .value
        .as_ref()
        .ok_or(UnsupportedCssProp::InvalidCSSAttribute(span))
        .and_then(|value| match value {
          JSXAttrValue::JSXExprContainer(container) => match &container.expr {
            JSXExpr::Expr(expr) => Ok(expr.clone()),
            _ => Err(UnsupportedCssProp::InvalidCSSAttribute(container.span)),
          },
          _ => Err(UnsupportedCssProp::InvalidCSSAttribute(span)),
        }),
      JSXAttrOrSpread::SpreadElement(_) => Err(UnsupportedCssProp::UnsupportedSpreadElement(span)),
      #[cfg(swc_ast_unknown)]
      _ => Err(UnsupportedCssProp::UnsupportedSpreadElement(span)),
    }
  }
}

pub trait HasCSSProp {
  fn has_css_prop(&self) -> Option<CSSProp>;
}

impl HasCSSProp for JSXOpeningElement {
  /// Returns the index of the `css` attribute and the indices of other relevant attributes
  /// (like `className` and `style`).
  fn has_css_prop(&self) -> Option<CSSProp> {
    let mut css_index = None;
    let mut relevant_props = Vec::new();

    for (index, attr) in self.attrs.iter().enumerate() {
      match attr {
        JSXAttrOrSpread::JSXAttr(attr) => {
          if let JSXAttrName::Ident(ident) = &attr.name {
            match ident.sym.as_ref() {
              "css" => css_index = Some(index),
              s if YakRuntime::is_class_attr(s) => {
                relevant_props.push((index, RelevantProp::ClassName))
              }
              "style" => relevant_props.push((index, RelevantProp::Style)),
              _ => {}
            }
          }
        }
        _ => relevant_props.push((index, RelevantProp::Spread)),
      }
    }

    css_index.map(|index| CSSProp {
      index,
      relevant_props,
    })
  }
}
