//! Folds: rewrites that replace a runtime call of yak with plain markup or one
//! plain function at build time. Code a fold does not support keeps its
//! compiled runtime call

/// `<div css={css`...`} />` to `<div className="yX" />`
pub(crate) mod css_jsx_prop_fold;
/// `styled.button`${({ $on }) => $on && css`...`}`` to one function that
/// returns the class names of the component
pub(crate) mod styled_arrow_function_fold;
/// `<Button $primary />` to `<button className="yB yB1" />`
pub(crate) mod styled_jsx_fold;

/// `css("yB1")` to the class names it stands for, shared by the three folds
pub(crate) mod css_call_to_class_name;
