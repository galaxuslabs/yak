use rustc_hash::{FxHashMap, FxHashSet};
use swc_core::{
  atoms::Atom,
  common::{Mark, SyntaxContext, DUMMY_SP},
  ecma::ast::{
    ArrowExpr, ArrowFunctionBody, AssignPatProp, BinExpr, BinaryOp, BindingIdent, CallExpr,
    CondExpr, EsReserved, Expr, Id, Ident, IdentName, KeyValuePatProp, KeyValueProp, Lit,
    MemberProp, Number, ObjectPat, ObjectPatProp, ParenExpr, Pat, Prop, PropName,
  },
  ecma::visit::{VisitMut, VisitMutWith},
};

use super::css_expr::{is_yak_css_callee, str_expr, with_leading_space};
use super::usage::single_return_expr;
use crate::utils::ast_helper::unwrap_type_casts;
use crate::yak_imports::YakImports;

/// The flags are the number before the folded function, e.g. the `0` in
/// `__yak_button("yB", 0, fn)`. A number at that place tells the runtime that
/// a folded function follows, and each bit says what the runtime has to pass
/// in. A component can need several bits at once, so the flags are numbers
/// the compiler combines with `|`
///
/// No bit is set: the folded function reads only the props
///
/// This is the empty set of flags and not a flag of its own. A flag is one
/// bit, and `0` has none: `flags | 0` adds nothing and `flags & 0` is never
/// true. So an enum of flags can not have it as a variant
const FLAGS_PROPS_ONLY: u32 = 0;
/// The folded function reads the theme: the runtime calls `useTheme()` and
/// passes the theme as the third argument
const FLAG_THEME: u32 = 1;

/// Turns the conditions of a styled component into one "folded" function that
/// returns its class names
///
/// ```js
/// // source
/// styled.button`
///   ${({ $active }) => $active && css`color: red;`}
///   ${({ $size }) => $size === "s" ? css`padding: 0;` : css`padding: 4px;`}
/// `
/// // compiled without the folded function
/// __yak.__yak_button("yB",
///   ({ $active }) => $active && css("yB1"),
///   ({ $size }) => $size === "s" ? css("yB2") : css("yB3"))
/// // compiled with the folded function
/// __yak.__yak_button("yB", 0, ({ $active, $size }) =>
///   "yB" + ($active ? " yB1" : "") + ($size === "s" ? " yB2" : " yB3"))
/// ```
///
/// `runtime_expressions` holds the compiled form of each `${...}` in the
/// template. Without the folded function, each `css("yB1")` call inside one
/// creates a function on every render, which the runtime calls only to add a
/// class name
///
/// Returns the flags and the folded function, e.g.
/// `[0, ({ $on }) => "yB" + ($on ? " yB1" : "")]`, or `None` if a runtime
/// expression is not an arrow that toggles class names. The component then
/// keeps its compiled shape with one function per condition, so nothing
/// changes for it
pub(crate) fn fold_class_names(
  class_name: &str,
  runtime_expressions: &[Expr],
  yak_imports: &YakImports,
) -> Option<Vec<Expr>> {
  if runtime_expressions.is_empty() {
    return None;
  }
  let mut folder = ClassNameFolder {
    yak_imports,
    params: FoldParams::default(),
  };
  let mut class_name_expr = str_expr(class_name.into());
  for expression in runtime_expressions {
    let piece = folder.fold_arrow(expression)?;
    class_name_expr = concat(class_name_expr, piece);
  }
  let mut flags = FLAGS_PROPS_ONLY;
  if folder.params.reads_theme {
    flags |= FLAG_THEME;
  }
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

struct ClassNameFolder<'a> {
  yak_imports: &'a YakImports,
  params: FoldParams,
}

impl ClassNameFolder<'_> {
  /// Folds one runtime expression, e.g. `({ $on }) => $on && css("yB1")`,
  /// into its piece `($on ? " yB1" : "")`
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
  ///
  /// The result is a piece: the class names the value adds, as a string
  /// expression that is empty or starts with a space, e.g. `(on ? " yB1" : "")`
  ///
  /// Every condition stays where the user wrote it, so it runs as often and in
  /// the same order as without the folded function: a nested condition only
  /// runs inside its branch. Nothing is simplified, the minifier does that
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
  /// `" x" + ($on ? " y" : "")`. The class name comes first, like the
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

/// The parameters of the folded function, collected while the conditions are
/// rewritten
#[derive(Default)]
struct FoldParams {
  /// the syntax context of the parameters, which tells them apart from
  /// every identifier of the same name in the source
  ctxt: Option<SyntaxContext>,
  /// the props the function reads, in order of their first read, with their
  /// parameter
  read: Vec<(Atom, Ident)>,
  /// the prop name of each local binding of a destructured props parameter,
  /// e.g. `on` is `$on` for `({ $on: on })`
  locals: FxHashMap<Id, Atom>,
  /// identifier props parameters, e.g. `p` in `(p) => p.$on`
  member_params: FxHashSet<Id>,
  reads_theme: bool,
}

impl FoldParams {
  /// The parameter that stands for a prop. Every runtime expression which
  /// reads the prop shares it, however it spells the read: `({ $on })`,
  /// `({ $on: on })` or `(p) => p.$on`
  ///
  /// The parameter has the name of the prop and a syntax context of its own.
  /// The hygiene pass of SWC runs after this plugin and renames the parameter
  /// where the function uses the same name for another value:
  ///
  /// ```js
  /// // source, where the second `$size` is a constant of the module
  /// styled.button`
  ///   ${({ $size }) => $size > 2 && css`padding: 8px;`}
  ///   ${(p) => p.$on && $size > 2 && css`margin: 8px;`}
  /// `
  /// // after the hygiene pass
  /// __yak.__yak_button("yB", 0, ({ $size: $size1, $on }) =>
  ///   "yB" + ($size1 > 2 ? " yB1" : "") + ($on && $size > 2 ? " yB2" : ""))
  /// ```
  ///
  /// `theme` is the third argument, because the folded render function passes
  /// the theme separately instead of copying it into the props. A read of
  /// `style` stops the fold: the second parameter is the style object the
  /// function writes to, not the style prop
  fn param_for(&mut self, name: &Atom) -> Option<Ident> {
    match name.as_ref() {
      "theme" => {
        self.reads_theme = true;
        Some(self.theme_param())
      }
      "style" => None,
      _ => {
        if let Some((_, param)) = self.read.iter().find(|(read, _)| read == name) {
          return Some(param.clone());
        }
        // a prop like `class` can not be the name of a parameter. Its
        // `__yak_class` gets a syntax context of its own, so the hygiene pass
        // renames it next to a prop that is called `__yak_class`
        let param = if is_reserved_word(name) {
          Ident::new(
            format!("__yak_{name}").into(),
            DUMMY_SP,
            SyntaxContext::empty().apply_mark(Mark::new()),
          )
        } else {
          Ident::new(name.clone(), DUMMY_SP, self.ctxt())
        };
        self.read.push((name.clone(), param.clone()));
        Some(param)
      }
    }
  }

  /// A copy of a condition with every prop read replaced by its parameter,
  /// e.g. `on && !p.$off` -> `$on && !$off`
  fn substitute(&mut self, condition: &Expr) -> Option<Box<Expr>> {
    let mut condition = Box::new(condition.clone());
    let mut substitution = SubstituteReads {
      params: self,
      failed: false,
    };
    condition.visit_mut_with(&mut substitution);
    (!substitution.failed).then_some(condition)
  }

  /// The syntax context of every parameter. It tells a parameter apart from
  /// an identifier of the same name in the source
  fn ctxt(&mut self) -> SyntaxContext {
    *self
      .ctxt
      .get_or_insert_with(|| SyntaxContext::empty().apply_mark(Mark::new()))
  }

  /// The second parameter, reserved for the style object the folded function
  /// writes CSS variables into
  fn style_param(&mut self) -> Ident {
    Ident::new("style".into(), DUMMY_SP, self.ctxt())
  }

  /// The third parameter, e.g. `({ theme }) => theme.dark` reads `theme.dark`
  fn theme_param(&mut self) -> Ident {
    Ident::new("theme".into(), DUMMY_SP, self.ctxt())
  }

  /// `({ $on, class: __yak_class }, style, theme)`, with the style and theme
  /// parameters only when the theme is read
  fn into_params(mut self) -> Vec<Pat> {
    let style = self.style_param();
    let theme = self.theme_param();
    let props = Pat::Object(ObjectPat {
      span: DUMMY_SP,
      props: self
        .read
        .into_iter()
        .map(|(name, param)| {
          if name == param.sym {
            return ObjectPatProp::Assign(AssignPatProp {
              span: DUMMY_SP,
              key: BindingIdent::from(param),
              value: None,
            });
          }
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
      Pat::Ident(BindingIdent::from(style)),
      Pat::Ident(BindingIdent::from(theme)),
    ]
  }
}

/// A prop like `class` or `arguments` can not be the name of a parameter
fn is_reserved_word(name: &Atom) -> bool {
  name.is_reserved() || name.is_reserved_in_strict_mode(true) || name.is_reserved_in_strict_bind()
}

/// Replaces prop reads in a condition with the folded function's parameters
///
/// A props identifier used in any other way than a member read (forwarding it
/// with `calc(p)`, a computed `p[key]`, an assignment) fails the fold, because
/// the folded function has no props object to hand on
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

  /// Expands a shorthand `{ on }` to `{ on: $on }` for `({ $on: on })`
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
