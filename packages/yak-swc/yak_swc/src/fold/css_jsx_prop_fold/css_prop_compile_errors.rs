use swc_core::{common::errors::HANDLER, common::Span};

#[derive(Debug)]
pub(super) enum UnsupportedCssProp {
  InvalidCSSAttribute(Span),
  UnsupportedSpreadElement(Span),
  InvalidJSXAttribute(Span),
  MissingAttributeValue(Span),
  InvalidJSXEmptyExpr(Span),
  UnsupportedAttributeValue(Span),
  StyleReference(Span),
  UnsupportedValue(Span),
  #[cfg(swc_ast_unknown)]
  UnsupportedJSXAttrOrSpread(),
}

impl UnsupportedCssProp {
  /// Reports the value as a build error
  pub(super) fn report(&self) {
    HANDLER.with(|handler| {
      handler.struct_span_err(self.span(), self.message()).emit();
    });
  }

  fn span(&self) -> Span {
    match self {
      UnsupportedCssProp::InvalidCSSAttribute(span)
      | UnsupportedCssProp::UnsupportedSpreadElement(span)
      | UnsupportedCssProp::InvalidJSXAttribute(span)
      | UnsupportedCssProp::MissingAttributeValue(span)
      | UnsupportedCssProp::InvalidJSXEmptyExpr(span)
      | UnsupportedCssProp::UnsupportedAttributeValue(span)
      | UnsupportedCssProp::StyleReference(span)
      | UnsupportedCssProp::UnsupportedValue(span) => *span,
      #[cfg(swc_ast_unknown)]
      UnsupportedCssProp::UnsupportedJSXAttrOrSpread() => Span::default(),
    }
  }

  fn message(&self) -> &'static str {
    match self {
            UnsupportedCssProp::InvalidCSSAttribute(_) =>
                "Invalid CSS attribute. The 'css' prop should contain a valid CSS-in-JS expression. \
                Example: css={css`color: red;`}",

            UnsupportedCssProp::UnsupportedSpreadElement(_) =>
                "Spread elements are not supported in the 'css' prop. \
                    Instead, use a css template literals for your styles. \
                    Example: css={css`color: red;`}",

            UnsupportedCssProp::InvalidJSXAttribute(_) =>
                "Invalid JSX attribute detected. Ensure all attributes have valid names and values. \
                Example: className=\"my-class\" or style={{ color: 'red' }}",

            UnsupportedCssProp::MissingAttributeValue(_) =>
                "An attribute is missing its value. All attributes should have a value assigned. \
                Example: css={styles} or className=\"my-class\"",

            UnsupportedCssProp::InvalidJSXEmptyExpr(_) =>
                "Invalid empty JSX expression found. Ensure your JSX expressions are valid JavaScript expressions.",

            UnsupportedCssProp::UnsupportedAttributeValue(_) =>
                "Unsupported attribute value type. Use string literals for className, \
                template literals for css prop, and object literals for style prop.",

            UnsupportedCssProp::StyleReference(_) =>
                "References to styles declared elsewhere are not supported in the 'css' prop - \
                the referenced styles are not compiled at this usage and would silently never apply. \
                Wrap the reference in a css template instead. \
                Example: css={css`${mixin}`}",

            UnsupportedCssProp::UnsupportedValue(_) =>
                "Unsupported value for the 'css' prop. Only styles written in place apply: \
                a css template, an atoms() call, those combined with ?:, && or ||, \
                and the falsy values false, null and undefined.\n\
                Combine several styles in one template instead of an array. \
                Example: css={css`${first}; ${second};`}\n\
                Write declarations in a template instead of an object. \
                Example: css={css`color: red;`}",

            #[cfg(swc_ast_unknown)]
            UnsupportedCssProp::UnsupportedJSXAttrOrSpread() =>
                "Unsupported JSX attribute or spread element detected. Ensure all attributes have valid names and values. \
                Example: className=\"my-class\" or style={{ color: 'red' }}",
        }
  }
}
