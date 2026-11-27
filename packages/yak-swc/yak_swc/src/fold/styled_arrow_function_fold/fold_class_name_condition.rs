use super::block_body_to_expr::is_discarded_expression;
use super::ClassNameFolder;
use crate::fold::css_call_to_class_name::{
  is_yak_atoms_callee, is_yak_css_callee, merge_class_names, with_leading_space,
};
use crate::utils::ast_helper::{binary, condition, paren, str_expr, unwrap_type_casts, void_zero};
use swc_core::{
  atoms::Wtf8Atom,
  common::DUMMY_SP,
  ecma::ast::{BinaryOp, CallExpr, Expr, Lit, SeqExpr},
};

impl ClassNameFolder<'_> {
  /// Folds what a runtime expression returns: a `css(...)` call, a falsy
  /// literal, `cond && <value>`, `cond || <value>`,
  /// `cond ? <value> : <value>`, `(call, <value>)` or the `??` of a guard
  /// block, see `fall_through_to_expr`
  ///
  /// The result is a folded class name expression: the class names the value
  /// adds, as a string that is empty or starts with a space, e.g.
  /// `(on ? " yB1" : "")`. Every `fold_` method returns one, and the
  /// `create_folded_` helpers build one
  ///
  /// Every condition stays where the user wrote it, so it runs as often and in
  /// the same order as without the folded function: a nested condition only
  /// runs inside its branch. Nothing is simplified, the minifier does that
  pub(super) fn fold_value(&mut self, value: &Expr) -> Option<Box<Expr>> {
    let value = unwrap_type_casts(value);
    if is_falsy_literal(value) {
      return Some(create_folded_empty_class_name());
    }
    match value {
      Expr::Call(call) if is_yak_atoms_callee(&call.callee, self.yak_imports) => {
        self.fold_atoms_call(call)
      }
      Expr::Call(call) => self.fold_css_call(call),
      // `cond && css("x")` -> `(cond ? " x" : "")`
      Expr::Bin(bin) if bin.op == BinaryOp::LogicalAnd => {
        let test = self.params.substitute(&bin.left)?;
        let cons = self.fold_value(&bin.right)?;
        Some(create_folded_class_name_condition(
          test,
          cons,
          create_folded_empty_class_name(),
        ))
      }
      // `cond || css("x")` -> `(cond ? "" : " x")`. A truthy left side adds
      // nothing, so a function or a `{ className }` object in `cond` is not
      // applied, e.g. `<Box $extra={atoms("flex")} />` for `$extra || css("x")`
      Expr::Bin(bin) if bin.op == BinaryOp::LogicalOr => {
        let test = self.params.substitute(&bin.left)?;
        let alt = self.fold_value(&bin.right)?;
        Some(create_folded_class_name_condition(
          test,
          create_folded_empty_class_name(),
          alt,
        ))
      }
      // `cond ? css("x") : css("y")` -> `(cond ? " x" : " y")`
      Expr::Cond(cond) => {
        let test = self.params.substitute(&cond.test)?;
        let cons = self.fold_value(&cond.cons)?;
        let alt = self.fold_value(&cond.alt)?;
        Some(create_folded_class_name_condition(test, cons, alt))
      }
      // a call before the value, e.g. from a statement in a block body:
      // `(assertNever($size), undefined)` -> `(assertNever($size), "")`.
      // Only the last expression is the value, see `is_discarded_expression`
      Expr::Seq(seq) => {
        let (value, discarded) = seq.exprs.split_last()?;
        let mut exprs = Vec::new();
        for expr in discarded {
          if !is_discarded_expression(expr) {
            return None;
          }
          exprs.push(self.params.substitute(unwrap_type_casts(expr))?);
        }
        exprs.push(self.fold_value(value)?);
        Some(paren(Box::new(Expr::Seq(SeqExpr {
          span: DUMMY_SP,
          exprs,
        }))))
      }
      // `(size === "l" ? ($n >= 12 ? css("yB1") : <marker>) : <marker>) ?? css("yB2")`
      // -> `((size === "l" ? ($n >= 12 ? " yB1" : void 0) : void 0) ?? " yB2")`
      //
      // `block_body_to_expr` builds this `??` for a path that leaves a guard
      // block, see `fall_through_to_expr`. A user-written `??` has no marker
      // on its left side and stays unfolded
      Expr::Bin(bin) if bin.op == BinaryOp::NullishCoalescing => {
        let outer = self.fall_through.replace(false);
        let branch = self.fold_value(&bin.left);
        let has_marker = self.fall_through == Some(true);
        self.fall_through = outer;
        if !has_marker {
          return None;
        }
        let rest = self.fold_value(&bin.right)?;
        Some(paren(binary(BinaryOp::NullishCoalescing, branch?, rest)))
      }
      // `void 0` is nullish, so `??` goes on with the statements after the
      // guard block. Outside the left side of its `??` the marker stops the
      // fold, so `undefined` never becomes a class name
      Expr::Invalid(_) => {
        *self.fall_through.as_mut()? = true;
        Some(void_zero())
      }
      _ => None,
    }
  }

  /// Folds an `atoms(...)` call into the class names it adds, e.g.
  /// `atoms("flex", $wide && "gap-2", "rounded")` ->
  /// `" flex" + ($wide ? " gap-2" : "") + " rounded"`
  ///
  /// A function argument like `atoms((props, classNames) => ...)` runs with
  /// the class names of the render, which the folded function does not have
  pub(super) fn fold_atoms_call(&mut self, call: &CallExpr) -> Option<Box<Expr>> {
    if !is_yak_atoms_callee(&call.callee, self.yak_imports) {
      return None;
    }
    let mut result = create_folded_empty_class_name();
    // class names in a row stay one string, e.g. `" flex gap-2"`
    let mut class_names: Option<Wtf8Atom> = None;
    for arg in &call.args {
      if arg.spread.is_some() {
        return None;
      }
      match unwrap_type_casts(&arg.expr) {
        Expr::Lit(Lit::Str(value)) if !value.value.is_empty() => {
          class_names = Some(match &class_names {
            Some(class_names) => merge_class_names(class_names, &value.value),
            None => value.value.clone(),
          });
        }
        argument => {
          let folded = self.fold_atoms_argument(argument)?;
          if is_folded_empty_class_name(&folded) {
            continue;
          }
          if let Some(class_names) = class_names.take() {
            result = join_folded_class_names(result, str_expr(with_leading_space(&class_names)));
          }
          result = join_folded_class_names(result, folded);
        }
      }
    }
    if let Some(class_names) = class_names {
      result = join_folded_class_names(result, str_expr(with_leading_space(&class_names)));
    }
    Some(result)
  }

  /// Folds one argument of an `atoms(...)` call: a class name, `false`,
  /// `null`, `undefined`, `cond && <argument>` or `cond ? <argument> : <argument>`, e.g.
  /// `$wide && "gap-2"` -> `($wide ? " gap-2" : "")`
  ///
  /// The runtime skips every falsy argument, so a falsy `cond` adds nothing.
  /// Any other argument can hold a function, e.g. `atoms($extra)` or
  /// `atoms($extra || "flex")`, and stays unfolded
  fn fold_atoms_argument(&mut self, argument: &Expr) -> Option<Box<Expr>> {
    match unwrap_type_casts(argument) {
      Expr::Lit(Lit::Str(value)) if !value.value.is_empty() => {
        Some(str_expr(with_leading_space(&value.value)))
      }
      Expr::Lit(Lit::Bool(value)) if !value.value => Some(create_folded_empty_class_name()),
      Expr::Lit(Lit::Null(_)) => Some(create_folded_empty_class_name()),
      Expr::Ident(ident) if ident.sym == "undefined" => Some(create_folded_empty_class_name()),
      Expr::Bin(bin) if bin.op == BinaryOp::LogicalAnd => {
        let test = self.params.substitute(&bin.left)?;
        let cons = self.fold_atoms_argument(&bin.right)?;
        Some(create_folded_class_name_condition(
          test,
          cons,
          create_folded_empty_class_name(),
        ))
      }
      Expr::Cond(cond) => {
        let test = self.params.substitute(&cond.test)?;
        let cons = self.fold_atoms_argument(&cond.cons)?;
        let alt = self.fold_atoms_argument(&cond.alt)?;
        Some(create_folded_class_name_condition(test, cons, alt))
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
    // the arguments add class names to a concatenation, where a fall through
    // marker of the enclosing function must not appear. A `None` stops the
    // whole fold, so only the success path restores `fall_through`
    let outer = self.fall_through.take();
    let mut class_name = None;
    let mut folded_arguments = Vec::new();
    for arg in &call.args {
      if arg.spread.is_some() {
        return None;
      }
      match unwrap_type_casts(&arg.expr) {
        Expr::Lit(Lit::Str(value)) if class_name.is_none() => {
          class_name = Some(value.value.clone())
        }
        Expr::Arrow(_) => folded_arguments.push(self.fold_arrow(&arg.expr)?),
        // css variables: `css("x", { "--yX": value })`
        Expr::Object(object) => folded_arguments.push(self.fold_style_object(object)?),
        // a value inside the function of the user, e.g.
        // `({ $on, $big }) => $on && css("x", $big && css("y"))`. A mixin
        // reference and anything else `fold_value` can not fold stops here
        value => folded_arguments.push(self.fold_value(value)?),
      }
    }
    let mut result = class_name
      .map(|class_name| str_expr(with_leading_space(&class_name)))
      .unwrap_or_else(create_folded_empty_class_name);
    for folded_class_names in folded_arguments {
      result = join_folded_class_names(result, folded_class_names);
    }
    self.fall_through = outer;
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

pub(super) fn create_folded_empty_class_name() -> Box<Expr> {
  str_expr("".into())
}

pub(super) fn is_folded_empty_class_name(expr: &Expr) -> bool {
  matches!(expr, Expr::Lit(Lit::Str(value)) if value.value.is_empty())
}

/// `(test ? cons : alt)`
pub(super) fn create_folded_class_name_condition(
  test: Box<Expr>,
  cons: Box<Expr>,
  alt: Box<Expr>,
) -> Box<Expr> {
  paren(condition(test, cons, alt))
}

/// `left + right`, skipping an empty string on either side
pub(super) fn join_folded_class_names(left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
  if is_folded_empty_class_name(&right) {
    return left;
  }
  if is_folded_empty_class_name(&left) {
    return right;
  }
  let right = match *right {
    Expr::Bin(bin) => paren(Box::new(Expr::Bin(bin))),
    other => Box::new(other),
  };
  binary(BinaryOp::Add, left, right)
}
