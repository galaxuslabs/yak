use super::ClassNameFolder;
use crate::utils::ast_helper::{paren, str_expr, unwrap_type_casts};
use swc_core::{
  common::DUMMY_SP,
  ecma::ast::{
    AssignExpr, AssignOp, AssignTarget, BinaryOp, CallExpr, Callee, ComputedPropName, Expr,
    KeyValueProp, MemberExpr, MemberProp, ObjectLit, Prop, PropName, PropOrSpread, SeqExpr,
    SimpleAssignTarget,
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
  /// not, so `fold_style_value` only takes values it knows are no functions.
  /// The return value of an arrow is the exception: it is not called again
  ///
  /// `nested` says that the variable sits in a nested `css(...)` call
  pub(super) fn fold_css_variable_definition(
    &mut self,
    key: &str,
    value: &Expr,
    nested: bool,
  ) -> Option<Box<Expr>> {
    let value = self.fold_style_value(value, nested)?;
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
  /// A value inside a nested `css(...)` call is an expression of the
  /// enclosing arrow, e.g. `$x` in `({ $x }) => css`left: ${$x}px;``. It is
  /// only rewritten, and only if it cannot be a function: the runtime calls
  /// a function with the props, e.g. the result of `themeColor("primary")`.
  ///
  /// Outside a nested `css` the compiler accepts only arrows as property
  /// values
  pub(super) fn fold_style_value(&mut self, value: &Expr, nested: bool) -> Option<Box<Expr>> {
    match unwrap_type_casts(value) {
      Expr::Arrow(_) => {
        let body = self.bind_arrow(value)?;
        // `({ $x }) => () => $x`: the runtime calls the returned function
        if matches!(unwrap_type_casts(&body), Expr::Arrow(_) | Expr::Fn(_)) {
          return None;
        }
        self.params.substitute(&body)
      }
      Expr::Call(call) if is_css_value_call(call) => {
        let mut call = call.clone();
        let first = call.args.first_mut()?;
        if first.spread.is_some() {
          return None;
        }
        first.expr = self.fold_style_value(&first.expr, nested)?;
        for arg in call.args.iter().skip(1) {
          if !matches!(&*arg.expr, Expr::Lit(_)) {
            return None;
          }
        }
        Some(Box::new(Expr::Call(call)))
      }
      other if nested && self.is_plain_value(other) => self.params.substitute(other),
      _ => None,
    }
  }

  /// A value that cannot be a helper function, which the runtime would call
  /// with the props: a literal, a prop read like `$x` or `p.$x`, or an
  /// operator on such values like `$x * 2` or `$big ? 8 : 4`. An identifier
  /// from outside the arrow or a call like `themeColor("primary")` can
  /// return a function
  pub(super) fn is_plain_value(&self, value: &Expr) -> bool {
    match unwrap_type_casts(value) {
      Expr::Lit(_) | Expr::Tpl(_) | Expr::Unary(_) => true,
      Expr::Paren(paren) => self.is_plain_value(&paren.expr),
      Expr::Ident(ident) => self.params.locals.contains_key(&ident.to_id()),
      Expr::Member(member) => {
        matches!(&*member.obj, Expr::Ident(obj) if self.params.member_params.contains(&obj.to_id()))
      }
      Expr::Bin(bin) => match bin.op {
        BinaryOp::LogicalAnd | BinaryOp::LogicalOr | BinaryOp::NullishCoalescing => {
          self.is_plain_value(&bin.left) && self.is_plain_value(&bin.right)
        }
        _ => true,
      },
      Expr::Cond(cond) => self.is_plain_value(&cond.cons) && self.is_plain_value(&cond.alt),
      _ => false,
    }
  }

  /// Folds the `{ style: { "--yX": value } }` argument of a nested css call
  /// into CSS variable definitions: `(style["--yX"] = value, "")`
  pub(super) fn fold_style_object(&mut self, object: &ObjectLit) -> Option<Box<Expr>> {
    let [PropOrSpread::Prop(prop)] = object.props.as_slice() else {
      return None;
    };
    let Prop::KeyValue(KeyValueProp { key, value }) = &**prop else {
      return None;
    };
    if prop_name(key)? != "style" {
      return None;
    }
    let Expr::Object(variables) = &**value else {
      return None;
    };
    let mut definitions = Vec::new();
    for variable in &variables.props {
      let PropOrSpread::Prop(variable) = variable else {
        return None;
      };
      let Prop::KeyValue(KeyValueProp { key, value }) = &**variable else {
        return None;
      };
      definitions.push(self.fold_css_variable_definition(&prop_name(key)?, value, true)?);
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
