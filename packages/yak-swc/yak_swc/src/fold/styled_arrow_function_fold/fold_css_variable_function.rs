use super::ClassNameFolder;
use crate::utils::ast_helper::{paren, str_expr, unwrap_type_casts};
use swc_core::{
  common::DUMMY_SP,
  ecma::ast::{
    AssignExpr, AssignOp, AssignTarget, CallExpr, Callee, ComputedPropName, Expr, KeyValueProp,
    MemberExpr, MemberProp, ObjectLit, Prop, PropName, PropOrSpread, SeqExpr, SimpleAssignTarget,
  },
};

impl ClassNameFolder<'_> {
  /// Folds one CSS variable into a definition on the style object, e.g.
  /// `"--yX": __yak_cssValue(({ $x }) => $x, "px")` ->
  /// `style["--yX"] = __yak_cssValue($x, "px")`
  ///
  /// `__yak_cssValue` returns a string for every value. A value without a
  /// unit is written as it is, e.g. `style["--yX"] = $color`, so a missing
  /// `$color` leaves the variable out of the style attribute
  ///
  /// The runtime
  /// also calls a value again while it is a function; the folded function does
  /// not, so a value that evaluates to a function is a known difference
  pub(super) fn fold_css_variable_definition(
    &mut self,
    key: &str,
    value: &Expr,
  ) -> Option<Box<Expr>> {
    let value = self.fold_style_value(value)?;
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
        let body = self.bind_arrow(value)?;
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
