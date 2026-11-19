use super::ClassNameFolder;
use crate::fold::css_call_to_class_name::{is_yak_css_callee, with_leading_space};
use crate::utils::ast_helper::{binary, condition, paren, str_expr, unwrap_type_casts};
use swc_core::ecma::ast::{BinaryOp, CallExpr, Expr, Lit};

impl ClassNameFolder<'_> {
  /// Folds what a runtime expression returns: a `css(...)` call, a falsy
  /// literal, `cond && <value>` or `cond ? <value> : <value>`
  ///
  /// The result is a piece: the class names the value adds, as a string
  /// expression that is empty or starts with a space, e.g. `(on ? " yB1" : "")`
  ///
  /// Every condition stays where the user wrote it, so it runs as often and in
  /// the same order as without the folded function: a nested condition only
  /// runs inside its branch. Nothing is simplified, the minifier does that
  pub(super) fn fold_value(&mut self, value: &Expr) -> Option<Box<Expr>> {
    let value = unwrap_type_casts(value);
    if is_falsy_literal(value) {
      return Some(empty_piece());
    }
    match value {
      Expr::Call(call) => self.fold_css_call(call),
      // `cond && css("x")` -> `(cond ? " x" : "")`
      Expr::Bin(bin) if bin.op == BinaryOp::LogicalAnd => {
        let test = self.params.substitute(&bin.left)?;
        let cons = self.fold_value(&bin.right)?;
        Some(cond_piece(test, cons, empty_piece()))
      }
      // `cond ? css("x") : css("y")` -> `(cond ? " x" : " y")`
      Expr::Cond(cond) => {
        let test = self.params.substitute(&cond.test)?;
        let cons = self.fold_value(&cond.cons)?;
        let alt = self.fold_value(&cond.alt)?;
        Some(cond_piece(test, cons, alt))
      }
      _ => None,
    }
  }

  /// Folds a compiled `css(...)` call: an optional class name plus nested
  /// runtime expressions, e.g. `css("x", ({ $on }) => $on && css("y"))` ->
  /// `" x" + ($on ? " y" : "")`. The class name comes first, like the
  /// runtime adds it before it runs the nested expressions
  pub(super) fn fold_css_call(&mut self, call: &CallExpr) -> Option<Box<Expr>> {
    if !is_yak_css_callee(&call.callee, self.yak_imports) {
      return None;
    }
    let mut class_name = None;
    let mut pieces = Vec::new();
    for arg in &call.args {
      if arg.spread.is_some() {
        return None;
      }
      match unwrap_type_casts(&arg.expr) {
        Expr::Lit(Lit::Str(value)) if class_name.is_none() => {
          class_name = Some(value.value.clone())
        }
        Expr::Arrow(_) => pieces.push(self.fold_arrow(&arg.expr)?),
        // css variables (`{ style: {...} }`), mixin references and anything else
        _ => return None,
      }
    }
    let mut result = class_name
      .map(|class_name| str_expr(with_leading_space(&class_name)))
      .unwrap_or_else(empty_piece);
    for piece in pieces {
      result = concat(result, piece);
    }
    Some(result)
  }
}

/// `false`, `null`, `undefined`, `""` and `0`: the runtime adds nothing for them
pub(super) fn is_falsy_literal(expr: &Expr) -> bool {
  match expr {
    Expr::Lit(Lit::Null(_)) => true,
    Expr::Lit(Lit::Bool(value)) => !value.value,
    Expr::Lit(Lit::Str(value)) => value.value.is_empty(),
    Expr::Lit(Lit::Num(value)) => value.value == 0.0,
    Expr::Ident(ident) => ident.sym == "undefined",
    _ => false,
  }
}

pub(super) fn empty_piece() -> Box<Expr> {
  str_expr("".into())
}

pub(super) fn is_empty_piece(expr: &Expr) -> bool {
  matches!(expr, Expr::Lit(Lit::Str(value)) if value.value.is_empty())
}

/// `(test ? cons : alt)`
pub(super) fn cond_piece(test: Box<Expr>, cons: Box<Expr>, alt: Box<Expr>) -> Box<Expr> {
  paren(condition(test, cons, alt))
}

/// `left + right`, skipping an empty piece on either side
pub(super) fn concat(left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
  if is_empty_piece(&right) {
    return left;
  }
  if is_empty_piece(&left) {
    return right;
  }
  let right = match *right {
    Expr::Bin(bin) => paren(Box::new(Expr::Bin(bin))),
    other => Box::new(other),
  };
  binary(BinaryOp::Add, left, right)
}
