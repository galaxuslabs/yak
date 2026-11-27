use super::block_body_to_expr::BodyEnd;
use super::ClassNameFolder;
use crate::utils::ast_helper::{expr_to_template_string, paren, str_expr, unwrap_type_casts};
use crate::utils::css_value_call::css_value_call;
use crate::yak_imports::YakImports;
use swc_core::{
  common::DUMMY_SP,
  ecma::ast::{
    AssignExpr, AssignOp, AssignTarget, CallExpr, Callee, ComputedPropName, Expr, Ident,
    KeyValueProp, MemberExpr, MemberProp, ObjectLit, Prop, PropName, PropOrSpread, SeqExpr,
    SimpleAssignTarget,
  },
};

impl ClassNameFolder<'_> {
  /// Folds one CSS variable into a definition on the style object
  ///
  /// A value with a unit or a minus keeps its `__yak_cssValue` call, which
  /// turns every value into text:
  /// `"--yX": __yak_cssValue(({ $x }) => $x, "px")` ->
  /// `style["--yX"] = __yak_cssValue($x, "px")`
  ///
  /// A value without a unit has no such call. The unfolded runtime writes
  /// `String(value)` and throws in development for a value that is no string
  /// or number. Written as it is, a missing `$bg` would throw nothing, and
  /// React would leave the variable out of the style attribute. The element
  /// would then take the variable from an outer element of the same component.
  /// So the fold wraps the value, see `CssValueText`:
  ///
  /// ```text
  /// "--yX": ({ $bg }) => $bg
  /// -> minify:    style["--yX"] = `${$bg}`
  /// -> no minify: style["--yX"] = __yak_cssValue($bg, "")
  /// ```
  ///
  /// The runtime also calls a value again while it is a function. The folded
  /// function does not, so a value that evaluates to a function is a known
  /// difference
  pub(super) fn fold_css_variable_definition(
    &mut self,
    key: &str,
    value: &Expr,
  ) -> Option<Box<Expr>> {
    let has_css_value_call =
      matches!(unwrap_type_casts(value), Expr::Call(call) if is_css_value_call(call));
    let mut value = self.fold_style_value(value)?;
    if !has_css_value_call {
      value = self.css_value_text.wrap(value);
    }
    self.writes_style = true;
    Some(Box::new(Expr::Assign(AssignExpr {
      span: DUMMY_SP,
      op: AssignOp::Assign,
      left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(Expr::Ident(self.params.style_param())),
        prop: MemberProp::Computed(ComputedPropName {
          span: DUMMY_SP,
          expr: str_expr(key.into()),
        }),
      })),
      right: value,
    })))
  }

  /// The value of a CSS variable with its prop reads replaced: an arrow
  /// becomes its return value and `__yak_cssValue(arrow, unit)` keeps the
  /// call around the return value.
  ///
  /// Every other value sits in a nested `css(...)` call and is an expression
  /// of the enclosing arrow, e.g. `$x` in `({ $x }) => css`left: ${$x}px;``.
  /// It is only rewritten. Outside a nested `css` the compiler accepts only
  /// arrows as property values
  pub(super) fn fold_style_value(&mut self, value: &Expr) -> Option<Box<Expr>> {
    match unwrap_type_casts(value) {
      Expr::Arrow(_) => {
        // `null` is a value here, so no branch falls through, see `BodyEnd`
        let body = self.bind_arrow(value, BodyEnd::CssValue)?;
        self.params.substitute(&body)
      }
      Expr::Call(call) if is_css_value_call(call) => {
        let mut call = call.clone();
        let first = call.args.first_mut()?;
        if first.spread.is_some() {
          return None;
        }
        first.expr = self.fold_style_value(&first.expr)?;
        for arg in call.args.iter().skip(1) {
          if !matches!(&*arg.expr, Expr::Lit(_)) {
            return None;
          }
        }
        Some(Box::new(Expr::Call(call)))
      }
      // `const w = $a.w;` stands for its initializer, e.g. in
      // `css("yB1", { "--yX": w })`
      Expr::Ident(ident) if self.params.consts.contains_key(&ident.to_id()) => {
        let init = self.params.consts[&ident.to_id()].clone();
        self.fold_style_value(&init)
      }
      // an identifier or member could hold a helper function, which the
      // runtime would call with the props: only a destructured prop is safe
      Expr::Ident(ident) if !self.params.locals.contains_key(&ident.to_id()) => None,
      Expr::Member(member) if !matches!(&*member.obj, Expr::Ident(obj) if self.params.member_params.contains(&obj.to_id())) => {
        None
      }
      Expr::Fn(_) => None,
      other => self.params.substitute(other),
    }
  }

  /// Folds the `{ "--yX": value }` argument of a nested css call into CSS
  /// variable definitions: `(style["--yX"] = value, "")`
  pub(super) fn fold_style_object(&mut self, object: &ObjectLit) -> Option<Box<Expr>> {
    let mut definitions = Vec::new();
    for variable in &object.props {
      let PropOrSpread::Prop(variable) = variable else {
        return None;
      };
      let Prop::KeyValue(KeyValueProp { key, value }) = &**variable else {
        return None;
      };
      definitions.push(self.fold_css_variable_definition(&prop_name(key)?, value)?);
    }
    Some(create_folded_css_variable_definition(definitions))
  }
}

/// Turns a folded CSS value into text, like the unfolded runtime does with
/// `String(value)` and its development check, see
/// `fold_css_variable_definition`
///
/// Both forms give the same text for a string or a number. The plugin option
/// `minify` picks the form, and only the second one has the development
/// check:
///
/// - `` `${$bg}` `` with `minify`. It gives the text of `String($bg)` and
///   throws nothing. Only a Symbol throws here, which `String` turns into
///   text. A development build with `minify` turned on has no check for
///   these values.
/// - `__yak_cssValue($bg, "")` without `minify`. The helper throws in
///   development for a value that is no string or number, like the unfolded
///   runtime, and returns `String($bg)` in production. So this form is
///   right in every build.
pub(super) struct CssValueText {
  /// `__yak_cssValue`, or `None` with `minify`
  helper: Option<Ident>,
  /// `true` once `wrap` wrote the helper, so the caller adds its import.
  /// The fold can still fail after a wrap, so the import waits for its result
  pub(super) uses_helper: bool,
}

impl CssValueText {
  pub(super) fn new(minify: bool, yak_imports: &YakImports) -> Self {
    Self {
      helper: (!minify).then(|| yak_imports.yak_utility_ident("cssValue")),
      uses_helper: false,
    }
  }

  /// `$bg` -> `` `${$bg}` `` or `__yak_cssValue($bg, "")`
  pub(super) fn wrap(&mut self, value: Box<Expr>) -> Box<Expr> {
    match &self.helper {
      Some(helper) => {
        self.uses_helper = true;
        Box::new(css_value_call(*value, helper.clone(), "", false))
      }
      None => expr_to_template_string(value),
    }
  }
}

/// `__yak_cssValue(...)`, the helper that adds the unit to a CSS variable
pub(super) fn is_css_value_call(call: &CallExpr) -> bool {
  matches!(&call.callee, Callee::Expr(callee) if matches!(&**callee, Expr::Ident(ident) if ident.sym == "__yak_cssValue"))
}

/// The text of a plain or quoted object key
pub(super) fn prop_name(key: &PropName) -> Option<String> {
  match key {
    PropName::Ident(ident) => Some(ident.sym.to_string()),
    PropName::Str(value) => value.value.as_str().map(str::to_string),
    _ => None,
  }
}

/// `(style["--yX"] = $x, style["--yY"] = $y, "")`: the CSS variable definitions
/// as an expression that adds no class name, so they run at their place in the
/// class string expression
pub(super) fn create_folded_css_variable_definition(mut definitions: Vec<Box<Expr>>) -> Box<Expr> {
  definitions.push(str_expr("".into()));
  paren(Box::new(Expr::Seq(SeqExpr {
    span: DUMMY_SP,
    exprs: definitions,
  })))
}
