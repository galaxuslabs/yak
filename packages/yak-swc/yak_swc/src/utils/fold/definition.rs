//! Definition-site fold of a dynamic styled component for the React runtime
//!
//! A dynamic styled component compiles to its class name plus one runtime
//! expression per interpolation. At runtime every nested `css("x")` call
//! allocates a style processor, which the runtime then calls only to add a
//! class name. When every runtime expression only toggles class names or
//! sets CSS variables, this module compiles them into one function that
//! returns the complete class string instead:
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
//! A dynamic value inside a property is a CSS variable. The fold function
//! writes it into the style object it gets as its second argument:
//!
//! ```js
//! // source
//! styled.div`left: ${({ $x }) => $x}px;`
//! // compiled without this fold
//! __yak.__yak_div("yD", { style: { "--yD1": __yak_cssValue(({ $x }) => $x, "px") } })
//! // compiled with this fold
//! __yak.__yak_div("yD", 2, ({ $x: __yak_$x }, __yak_style) =>
//!   "yD" + (__yak_style["--yD1"] = String(__yak_cssValue(__yak_$x, "px")), ""))
//! ```
//!
//! Words used in this module:
//! - *fold function*: the generated arrow `(props, style, theme) => classString`.
//! - *flags*: the number before the fold function. Its presence tells the
//!   runtime that the next argument is a fold function, and its bits say what
//!   the runtime has to pass in ([`FLAG_THEME`], [`FLAG_STYLE`]).
//! - *style object*: the copy of the `style` prop the runtime passes as the
//!   second argument when the flags ask for it. The runtime renders it.
//! - *piece*: the class names one runtime expression adds, as a string
//!   expression that is either empty or starts with a space, e.g.
//!   `(on ? " yB1" : "")`.
//! - *write piece*: the piece of a CSS variable. It writes to the style
//!   object and adds no class name: `(__yak_style["--yD1"] = String(x), "")`.
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
    ArrowExpr, ArrowFunctionBody, AssignExpr, AssignOp, AssignPatProp, AssignTarget, BinExpr,
    BinaryOp, BindingIdent, CallExpr, Callee, ComputedPropName, CondExpr, Expr, Id, Ident,
    IdentName, KeyValuePatProp, KeyValueProp, Lit, MemberExpr, MemberProp, Number, ObjectLit,
    ObjectPat, ObjectPatProp, ParenExpr, Pat, Prop, PropName, PropOrSpread, SeqExpr,
    SimpleAssignTarget, UnaryOp,
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
/// The fold function writes CSS variables: the runtime passes a fresh copy of
/// the style prop as the second argument and renders it
pub(crate) const FLAG_STYLE: u32 = 2;

/// The third parameter of the fold function, e.g. `({ theme }) => theme.dark`
/// reads `__yak_theme.dark`
const THEME_PARAM: &str = "__yak_theme";
/// The second parameter of the fold function, reserved for the style object
/// the function writes CSS variables into
const STYLE_PARAM: &str = "__yak_style";

/// Compiles the runtime expressions of a styled component into the flags and
/// the fold function, e.g. `[0, ({ $on: __yak_$on }) => "yB" + (__yak_$on ? " yB1" : "")]`
///
/// Returns `None` if any expression is not an arrow that toggles class names
/// or if a CSS variable has a value the fold cannot take over; the component
/// then keeps its runtime expressions unchanged
pub(crate) fn fold_definition(
  class_name: &str,
  runtime_expressions: &[Expr],
  css_variables: &FxHashMap<String, Expr>,
  yak_imports: &YakImports,
) -> Option<Vec<Expr>> {
  if runtime_expressions.is_empty() && css_variables.is_empty() {
    return None;
  }
  let mut folder = DefinitionFolder {
    yak_imports,
    params: FoldParams::default(),
    writes_style: false,
  };
  let mut class_name_expr = str_expr(class_name.into());
  for expression in runtime_expressions {
    let piece = folder.fold_arrow(expression)?;
    class_name_expr = concat(class_name_expr, piece);
  }
  // the runtime writes the CSS variables of the component after it ran the
  // runtime expressions, in the key order of the compiled `{ style: {...} }`
  if !css_variables.is_empty() {
    let mut keys: Vec<&String> = css_variables.keys().collect();
    keys.sort();
    let mut writes = Vec::new();
    for key in keys {
      writes.push(folder.fold_style_write(key, &css_variables[key])?);
    }
    class_name_expr = concat(class_name_expr, write_piece(writes));
  }
  let mut flags = 0;
  if folder.params.reads_theme {
    flags |= FLAG_THEME;
  }
  if folder.writes_style {
    flags |= FLAG_STYLE;
  }
  let fold_function = Expr::Arrow(ArrowExpr {
    span: DUMMY_SP,
    ctxt: SyntaxContext::empty(),
    params: folder.params.into_params(folder.writes_style),
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
  writes_style: bool,
}

impl DefinitionFolder<'_> {
  /// Folds one runtime expression, e.g. `({ $on }) => $on && css("yB1")`,
  /// into its piece `(__yak_$on ? " yB1" : "")`
  ///
  /// The arrow takes no parameter, a destructuring with plain keys, or one
  /// identifier which is only read through members (`p => p.$on`). The body is
  /// an expression or a block with a single `return`
  fn fold_arrow(&mut self, expression: &Expr) -> Option<Box<Expr>> {
    let body = self.bind_arrow(expression)?;
    self.fold_value(body)
  }

  /// Registers the props parameter of a runtime expression and returns the
  /// expression the arrow returns
  fn bind_arrow<'e>(&mut self, expression: &'e Expr) -> Option<&'e Expr> {
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
    Some(body)
  }

  /// Compiles one CSS variable into a write to the style object, e.g.
  /// `"--yX": __yak_cssValue(({ $x }) => $x, "px")` ->
  /// `__yak_style["--yX"] = String(__yak_cssValue(__yak_$x, "px"))`
  ///
  /// The runtime stores `String(value)`, so the write does too. The runtime
  /// also calls a value again while it is a function; the fold function does
  /// not, so a value that evaluates to a function is a known difference
  fn fold_style_write(&mut self, key: &str, value: &Expr) -> Option<Box<Expr>> {
    let value = self.fold_style_value(value)?;
    self.writes_style = true;
    Some(Box::new(Expr::Assign(AssignExpr {
      span: DUMMY_SP,
      op: AssignOp::Assign,
      left: AssignTarget::Simple(SimpleAssignTarget::Member(MemberExpr {
        span: DUMMY_SP,
        obj: Box::new(Expr::Ident(Ident::from(STYLE_PARAM))),
        prop: MemberProp::Computed(ComputedPropName {
          span: DUMMY_SP,
          expr: str_expr(key.into()),
        }),
      })),
      right: Box::new(Expr::Call(CallExpr {
        span: DUMMY_SP,
        ctxt: SyntaxContext::empty(),
        callee: Callee::Expr(Box::new(Expr::Ident(Ident::from("String")))),
        args: vec![value.into()],
        type_args: None,
      })),
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
  fn fold_style_value(&mut self, value: &Expr) -> Option<Box<Expr>> {
    match unwrap_type_casts(value) {
      Expr::Arrow(_) => {
        let body = self.bind_arrow(value)?;
        self.params.substitute(body)
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

  /// Folds the `{ style: { "--yX": value } }` argument of a nested css call
  /// into its writes: `(__yak_style["--yX"] = String(value), "")`
  fn fold_style_object(&mut self, object: &ObjectLit) -> Option<Box<Expr>> {
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
    let mut writes = Vec::new();
    for variable in &variables.props {
      let PropOrSpread::Prop(variable) = variable else {
        return None;
      };
      let Prop::KeyValue(KeyValueProp { key, value }) = &**variable else {
        return None;
      };
      writes.push(self.fold_style_write(&prop_name(key)?, value)?);
    }
    Some(write_piece(writes))
  }

  /// Folds what a runtime expression returns: a `css(...)` call, a falsy
  /// literal, `cond && <value>`, `boolean || <value>` or
  /// `cond ? <value> : <value>`
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
      // `!cond || css("x")` -> `(!cond ? "" : " x")`. The runtime adds
      // nothing for `true`, but it adds the class name of a returned object
      // and calls a returned function, so the left side must be a boolean
      Expr::Bin(bin) if bin.op == BinaryOp::LogicalOr && is_boolean_expr(&bin.left) => {
        let test = self.params.substitute(&bin.left)?;
        let alt = self.fold_value(&bin.right)?;
        Some(cond_piece(test, empty_piece(), alt))
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
        // css variables: `css("x", { style: { "--yX": value } })`
        Expr::Object(object) => pieces.push(self.fold_style_object(object)?),
        // mixin references and anything else
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

  /// `({ $on: __yak_$on }, __yak_style, __yak_theme)`, with the style
  /// parameter only when the function writes CSS variables or reads the
  /// theme, and the theme parameter only when it reads the theme
  fn into_params(self, writes_style: bool) -> Vec<Pat> {
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
    let style = Pat::Ident(BindingIdent::from(Ident::from(STYLE_PARAM)));
    if self.reads_theme {
      vec![
        props,
        style,
        Pat::Ident(BindingIdent::from(Ident::from(THEME_PARAM))),
      ]
    } else if writes_style {
      vec![props, style]
    } else if empty_props {
      vec![]
    } else {
      vec![props]
    }
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

/// `__yak_cssValue(...)`, the helper that adds the unit to a CSS variable
fn is_css_value_call(call: &CallExpr) -> bool {
  matches!(&call.callee, Callee::Expr(callee) if matches!(&**callee, Expr::Ident(ident) if ident.sym == "__yak_cssValue"))
}

/// The text of a plain or quoted object key
fn prop_name(key: &PropName) -> Option<String> {
  match key {
    PropName::Ident(ident) => Some(ident.sym.to_string()),
    PropName::Str(value) => value.value.as_str().map(str::to_string),
    _ => None,
  }
}

/// `(write1, write2, "")`: style writes as a piece that adds no class name,
/// so they run at their place in the class string expression
fn write_piece(mut writes: Vec<Box<Expr>>) -> Box<Expr> {
  writes.push(str_expr("".into()));
  Box::new(Expr::Paren(ParenExpr {
    span: DUMMY_SP,
    expr: Box::new(Expr::Seq(SeqExpr {
      span: DUMMY_SP,
      exprs: writes,
    })),
  }))
}

/// An expression that always evaluates to `true` or `false`, e.g. `!$on`,
/// `$size === "s"` or `!$a || !$b`
fn is_boolean_expr(expr: &Expr) -> bool {
  match unwrap_type_casts(expr) {
    Expr::Lit(Lit::Bool(_)) => true,
    Expr::Unary(unary) => unary.op == UnaryOp::Bang,
    Expr::Bin(bin) => {
      matches!(
        bin.op,
        BinaryOp::EqEq
          | BinaryOp::NotEq
          | BinaryOp::EqEqEq
          | BinaryOp::NotEqEq
          | BinaryOp::Lt
          | BinaryOp::LtEq
          | BinaryOp::Gt
          | BinaryOp::GtEq
          | BinaryOp::In
          | BinaryOp::InstanceOf
      ) || (matches!(
        bin.op,
        BinaryOp::LogicalAnd | BinaryOp::LogicalOr | BinaryOp::NullishCoalescing
      ) && is_boolean_expr(&bin.left)
        && is_boolean_expr(&bin.right))
    }
    Expr::Cond(cond) => is_boolean_expr(&cond.cons) && is_boolean_expr(&cond.alt),
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
