//! Definition-site fold of a dynamic styled component for the React runtime
//!
//! A dynamic styled component compiles to its class name plus one runtime
//! expression per interpolation. At runtime every nested `css("x")` call
//! allocates a style processor, which the runtime then calls only to add a
//! class name. When every runtime expression only toggles class names, this
//! module compiles them into one function that returns the complete class
//! string instead:
//!
//! ```js
//! // source
//! styled.button`
//!   ${({ $active }) => $active && css`color: red;`}
//!   ${({ $size }) => $size === "s" ? css`padding: 0;` : css`padding: 4px;`}
//! `
//! // compiled without this fold
//! __yak.__yak_button("yB",
//!   ({ $active }) => $active && css("yB1"),
//!   ({ $size }) => $size === "s" ? css("yB2") : css("yB3"))
//! // compiled with this fold
//! __yak.__yak_button("yB", 0, ({ $active: __yak_$active, $size: __yak_$size }) =>
//!   "yB" + (__yak_$active ? " yB1" : "") + (__yak_$size === "s" ? " yB2" : " yB3"))
//! ```
//!
//! Words used in this module:
//! - *fold function*: the generated arrow `(props, style, theme) => classString`.
//! - *flags*: the number before the fold function. Its presence tells the
//!   runtime that the next argument is a fold function, and its bits say what
//!   the runtime has to pass in ([`FLAG_THEME`]).
//! - *piece*: the class names one runtime expression adds, as a string
//!   expression that is either empty or starts with a space, e.g.
//!   `(on ? " yB1" : "")`.
//!
//! Every condition stays where the user wrote it, so it runs exactly as often
//! and in the same order as on the runtime path: a nested condition only runs
//! inside its branch. Nothing is constant folded; the minifier does that.
//!
//! Anything this module does not understand keeps the compiled shape with one
//! runtime expression per interpolation for the whole component, so a
//! bail-out is never a behaviour change.

use rustc_hash::{FxHashMap, FxHashSet};
use swc_core::{
  atoms::Atom,
  common::{SyntaxContext, DUMMY_SP},
  ecma::ast::{
    ArrowExpr, ArrowFunctionBody, AssignExpr, AssignPatProp, BinExpr, BinaryOp, BindingIdent,
    CallExpr, CondExpr, Expr, Id, Ident, IdentName, KeyValuePatProp, KeyValueProp, Lit, MemberProp,
    Number, ObjectPat, ObjectPatProp, ParenExpr, Pat, Prop, PropName,
  },
  ecma::visit::{VisitMut, VisitMutWith},
};

use super::css_expr::{is_yak_css_callee, str_expr, with_leading_space};
use super::usage::{single_return_expr, ParamBinder};
use crate::utils::ast_helper::unwrap_type_casts;
use crate::yak_imports::YakImports;

/// The fold function reads the theme: the runtime calls `useTheme()` and passes
/// the theme as the third argument
pub(crate) const FLAG_THEME: u32 = 1;

/// The third parameter of the fold function, e.g. `({ theme }) => theme.dark`
/// reads `__yak_theme.dark`
const THEME_PARAM: &str = "__yak_theme";
/// The second parameter of the fold function, reserved for the style object
/// the function writes CSS variables into
const STYLE_PARAM: &str = "__yak_style";

/// Compiles the runtime expressions of a styled component into the flags and
/// the fold function, e.g. `[0, ({ $on: __yak_$on }) => "yB" + (__yak_$on ? " yB1" : "")]`
///
/// Returns `None` if any expression is not a class-toggling arrow; the
/// component then keeps its runtime expressions unchanged
pub(crate) fn fold_definition(
  class_name: &str,
  runtime_expressions: &[Expr],
  yak_imports: &YakImports,
) -> Option<Vec<Expr>> {
  if runtime_expressions.is_empty() {
    return None;
  }
  let mut folder = DefinitionFolder {
    yak_imports,
    params: FoldParams::default(),
  };
  let mut class_name_expr = str_expr(class_name.into());
  for expression in runtime_expressions {
    let piece = folder.fold_arrow(expression)?;
    class_name_expr = concat(class_name_expr, piece);
  }
  let flags = if folder.params.reads_theme {
    FLAG_THEME
  } else {
    0
  };
  let fold_function = Expr::Arrow(ArrowExpr {
    span: DUMMY_SP,
    ctxt: SyntaxContext::empty(),
    params: folder.params.into_params(),
    body: Box::new(ArrowFunctionBody::Expr(class_name_expr)),
    is_async: false,
    is_generator: false,
    type_params: None,
    return_type: None,
  });
  Some(vec![
    Expr::Lit(Lit::Num(Number {
      span: DUMMY_SP,
      value: flags as f64,
      raw: None,
    })),
    fold_function,
  ])
}

struct DefinitionFolder<'a> {
  yak_imports: &'a YakImports,
  params: FoldParams,
}

impl DefinitionFolder<'_> {
  /// Folds one runtime expression, e.g. `({ $on }) => $on && css("yB1")`,
  /// into its piece `(__yak_$on ? " yB1" : "")`
  ///
  /// The arrow takes no parameter, a destructuring with plain keys, or one
  /// identifier which is only read through members (`p => p.$on`). The body is
  /// an expression or a block with a single `return`
  fn fold_arrow(&mut self, expression: &Expr) -> Option<Box<Expr>> {
    let Expr::Arrow(arrow) = unwrap_type_casts(expression) else {
      return None;
    };
    if arrow.is_async || arrow.is_generator {
      return None;
    }
    let body: &Expr = match &*arrow.body {
      ArrowFunctionBody::Expr(expr) => expr,
      ArrowFunctionBody::FunctionBody(block) => single_return_expr(block)?,
      #[cfg(swc_ast_unknown)]
      _ => return None,
    };
    match arrow.params.as_slice() {
      [] => {}
      [Pat::Object(pattern)] => {
        for prop in &pattern.props {
          match prop {
            // `({ $on })`
            ObjectPatProp::Assign(AssignPatProp {
              key, value: None, ..
            }) => {
              self.params.locals.insert(key.to_id(), key.sym.clone());
            }
            // `({ $on: on })`
            ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
              let (PropName::Ident(key), Pat::Ident(local)) = (key, &**value) else {
                return None;
              };
              self.params.locals.insert(local.to_id(), key.sym.clone());
            }
            // defaults and rest patterns
            _ => return None,
          }
        }
      }
      // `(p) => p.$on && css("yB1")`
      [Pat::Ident(param)] => {
        self.params.member_params.insert(param.to_id());
      }
      _ => return None,
    }
    self.fold_value(body)
  }

  /// Folds what a runtime expression returns: a `css(...)` call, a falsy
  /// literal, `cond && <value>` or `cond ? <value> : <value>`
  fn fold_value(&mut self, value: &Expr) -> Option<Box<Expr>> {
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
  /// `" x" + (__yak_$on ? " y" : "")`. The class name comes first, like the
  /// runtime adds it before it runs the nested expressions
  fn fold_css_call(&mut self, call: &CallExpr) -> Option<Box<Expr>> {
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

/// The parameters of the fold function, collected while the conditions are
/// rewritten
#[derive(Default)]
struct FoldParams {
  /// hands out one `__yak_<prop>` parameter per prop name
  binder: ParamBinder,
  /// the props the function reads, in order of their first read, with their
  /// parameter
  read: Vec<(Atom, Ident)>,
  /// local bindings of a destructured props parameter -> prop name,
  /// e.g. `on` -> `$on` for `({ $on: on })`
  locals: FxHashMap<Id, Atom>,
  /// identifier props parameters, e.g. `p` in `(p) => p.$on`
  member_params: FxHashSet<Id>,
  reads_theme: bool,
}

impl FoldParams {
  /// The parameter that stands for a prop. `theme` is the third argument,
  /// because the fold render function passes the theme separately instead of
  /// copying it into the props. A read
  /// of `style` bails: the second parameter is the style object the function
  /// writes to, not the style prop
  fn param_for(&mut self, name: &Atom) -> Option<Ident> {
    match name.as_ref() {
      "theme" => {
        self.reads_theme = true;
        Some(Ident::from(THEME_PARAM))
      }
      "style" => None,
      _ => {
        let param = self.binder.param_for(name);
        if !self.read.iter().any(|(read, _)| read == name) {
          self.read.push((name.clone(), param.clone()));
        }
        Some(param)
      }
    }
  }

  /// A copy of a condition with every prop read replaced by its parameter,
  /// e.g. `$on && !p.$off` -> `__yak_$on && !__yak_$off`
  fn substitute(&mut self, condition: &Expr) -> Option<Box<Expr>> {
    let mut condition = Box::new(condition.clone());
    let mut substitution = SubstituteReads {
      params: self,
      failed: false,
    };
    condition.visit_mut_with(&mut substitution);
    (!substitution.failed).then_some(condition)
  }

  /// `({ $on: __yak_$on }, __yak_style, __yak_theme)`, with the style and
  /// theme parameters only when the theme is read
  fn into_params(self) -> Vec<Pat> {
    let props = Pat::Object(ObjectPat {
      span: DUMMY_SP,
      props: self
        .read
        .into_iter()
        .map(|(name, param)| {
          ObjectPatProp::KeyValue(KeyValuePatProp {
            key: PropName::Ident(IdentName::new(name, DUMMY_SP)),
            value: Box::new(Pat::Ident(BindingIdent::from(param))),
          })
        })
        .collect(),
      optional: false,
      type_ann: None,
    });
    let empty_props = matches!(&props, Pat::Object(pattern) if pattern.props.is_empty());
    if !self.reads_theme {
      return if empty_props { vec![] } else { vec![props] };
    }
    vec![
      props,
      Pat::Ident(BindingIdent::from(Ident::from(STYLE_PARAM))),
      Pat::Ident(BindingIdent::from(Ident::from(THEME_PARAM))),
    ]
  }
}

/// Replaces prop reads in a condition with the fold function's parameters
///
/// A props identifier used in any other way than a member read (forwarding it
/// with `calc(p)`, a computed `p[key]`, an assignment) fails the fold, because
/// the fold function has no props object to hand on
struct SubstituteReads<'a> {
  params: &'a mut FoldParams,
  failed: bool,
}

impl SubstituteReads<'_> {
  fn param_for(&mut self, name: &Atom) -> Option<Ident> {
    let param = self.params.param_for(name);
    if param.is_none() {
      self.failed = true;
    }
    param
  }
}

impl VisitMut for SubstituteReads<'_> {
  fn visit_mut_expr(&mut self, expr: &mut Expr) {
    if self.failed {
      return;
    }
    match expr {
      Expr::Ident(ident) => {
        if let Some(name) = self.params.locals.get(&ident.to_id()).cloned() {
          if let Some(param) = self.param_for(&name) {
            *expr = Expr::Ident(param);
          }
          return;
        }
      }
      Expr::Member(member) => {
        if let Expr::Ident(obj) = &*member.obj {
          if self.params.member_params.contains(&obj.to_id()) {
            let MemberProp::Ident(name) = &member.prop else {
              self.failed = true;
              return;
            };
            let name = name.sym.clone();
            if let Some(param) = self.param_for(&name) {
              *expr = Expr::Ident(param);
            }
            return;
          }
        }
      }
      _ => {}
    }
    expr.visit_mut_children_with(self);
  }

  /// Expands a shorthand `{ $on }` to `{ $on: __yak_$on }`
  fn visit_mut_prop(&mut self, prop: &mut Prop) {
    if let Prop::Shorthand(ident) = prop {
      if let Some(name) = self.params.locals.get(&ident.to_id()).cloned() {
        if let Some(param) = self.param_for(&name) {
          *prop = Prop::KeyValue(KeyValueProp {
            key: PropName::Ident(IdentName::new(ident.sym.clone(), ident.span)),
            value: Box::new(Expr::Ident(param)),
          });
        }
        return;
      }
    }
    prop.visit_mut_children_with(self);
  }

  /// A props binding left after the expression rewrite sits somewhere the
  /// rewrite cannot reach, e.g. the target of `p.$on = 1` or `$on++`
  fn visit_mut_ident(&mut self, ident: &mut Ident) {
    let id = ident.to_id();
    if self.params.locals.contains_key(&id) || self.params.member_params.contains(&id) {
      self.failed = true;
    }
  }
}

/// `false`, `null`, `undefined`, `""` and `0`: the runtime adds nothing for them
fn is_falsy_literal(expr: &Expr) -> bool {
  match expr {
    Expr::Lit(Lit::Null(_)) => true,
    Expr::Lit(Lit::Bool(value)) => !value.value,
    Expr::Lit(Lit::Str(value)) => value.value.is_empty(),
    Expr::Lit(Lit::Num(value)) => value.value == 0.0,
    Expr::Ident(ident) => ident.sym == "undefined",
    _ => false,
  }
}

fn empty_piece() -> Box<Expr> {
  str_expr("".into())
}

fn is_empty_piece(expr: &Expr) -> bool {
  matches!(expr, Expr::Lit(Lit::Str(value)) if value.value.is_empty())
}

/// `(test ? cons : alt)`
fn cond_piece(test: Box<Expr>, cons: Box<Expr>, alt: Box<Expr>) -> Box<Expr> {
  Box::new(Expr::Paren(ParenExpr {
    span: DUMMY_SP,
    expr: Box::new(Expr::Cond(CondExpr {
      span: DUMMY_SP,
      test,
      cons,
      alt,
    })),
  }))
}

/// `left + right`, skipping an empty piece on either side
fn concat(left: Box<Expr>, right: Box<Expr>) -> Box<Expr> {
  if is_empty_piece(&right) {
    return left;
  }
  if is_empty_piece(&left) {
    return right;
  }
  let right = match *right {
    Expr::Bin(bin) => Box::new(Expr::Paren(ParenExpr {
      span: DUMMY_SP,
      expr: Box::new(Expr::Bin(bin)),
    })),
    other => Box::new(other),
  };
  Box::new(Expr::Bin(BinExpr {
    span: DUMMY_SP,
    op: BinaryOp::Add,
    left,
    right,
  }))
}
