use super::block_body_to_expr::ConstReads;
use crate::utils::ast_helper::{binary, condition, paren, unwrap_type_casts};
use rustc_hash::{FxHashMap, FxHashSet};
use swc_core::{
  atoms::Atom,
  common::{Mark, SyntaxContext, DUMMY_SP},
  ecma::ast::{
    AssignPatProp, BinaryOp, BindingIdent, Callee, EsReserved, Expr, Id, Ident, IdentName,
    KeyValuePatProp, KeyValueProp, Lit, MemberExpr, MemberProp, NewExpr, Number, ObjectPat,
    ObjectPatProp, OptCall, Pat, Prop, PropName, TaggedTpl, UnaryExpr, UnaryOp,
  },
  ecma::visit::{VisitMut, VisitMutWith},
};

/// The parameters of the folded function, collected while the conditions are
/// rewritten
#[derive(Default)]
pub(super) struct FoldParams {
  /// the syntax context of the parameters, which tells them apart from
  /// every identifier of the same name in the source
  ctxt: Option<SyntaxContext>,
  /// the props the function reads, in order of their first read, with their
  /// parameter
  read: Vec<(Atom, Ident)>,
  /// the prop name of each local binding of a destructured props parameter,
  /// e.g. `on` is `$on` for `({ $on: on })`
  pub(super) locals: FxHashMap<Id, Atom>,
  /// the default value of a local binding, e.g. `"start"` for
  /// `({ $align = "start" })`
  pub(super) defaults: FxHashMap<Id, Box<Expr>>,
  /// identifier props parameters, e.g. `p` in `(p) => p.$on`
  pub(super) member_params: FxHashSet<Id>,
  /// the initializer of a `const` in a block body, e.g. `$a.width` for
  /// `const width = $a.width;`, see `bind_consts`
  pub(super) consts: ConstReads,
  pub(super) reads_theme: bool,
}

impl FoldParams {
  /// The props the function reads, in order of their first read, with their
  /// parameter
  pub(super) fn read(&self) -> &[(Atom, Ident)] {
    &self.read
  }

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
  /// __yak.__yak_button(0, ({ $size: $size1, $on }) =>
  ///   "yB" + ($size1 > 2 ? " yB1" : "") + ($on && $size > 2 ? " yB2" : ""))
  /// ```
  ///
  /// `theme` is the third argument, because the folded render function passes
  /// the theme separately instead of copying it into the props. A read of
  /// `style` stops the fold: the second parameter is the style object the
  /// function writes to, not the style prop
  pub(super) fn param_for(&mut self, name: &Atom) -> Option<Ident> {
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
  pub(super) fn substitute(&mut self, condition: &Expr) -> Option<Box<Expr>> {
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
  pub(super) fn style_param(&mut self) -> Ident {
    Ident::new("style".into(), DUMMY_SP, self.ctxt())
  }

  /// The third parameter, e.g. `({ theme }) => theme.dark` reads `theme.dark`
  pub(super) fn theme_param(&mut self) -> Ident {
    Ident::new("theme".into(), DUMMY_SP, self.ctxt())
  }

  /// `({ $on, class: __yak_class }, style, theme)`, with the style parameter
  /// only when the function writes CSS variables or reads the theme, and the
  /// theme parameter only when it reads the theme
  pub(super) fn into_params(mut self, writes_style: bool) -> Vec<Pat> {
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
    let style = Pat::Ident(BindingIdent::from(style));
    if self.reads_theme {
      vec![props, style, Pat::Ident(BindingIdent::from(theme))]
    } else if writes_style {
      vec![props, style]
    } else if empty_props {
      vec![]
    } else {
      vec![props]
    }
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
  pub(super) fn param_for(&mut self, name: &Atom) -> Option<Ident> {
    let param = self.params.param_for(name);
    if param.is_none() {
      self.failed = true;
    }
    param
  }

  /// The read of a local binding, e.g. `$on` for `({ $on: on })`
  ///
  /// A default value moves from the parameter to the read, because other
  /// runtime expressions share the parameter and may read the prop without
  /// that default: `({ $align = "start" }) => $align` ->
  /// `($align === void 0 ? "start" : $align)`
  fn local_read(&mut self, local: &Id) -> Option<Expr> {
    let name = self.params.locals.get(local)?.clone();
    let param = self.param_for(&name)?;
    let Some(mut default) = self.params.defaults.get(local).cloned() else {
      return Some(Expr::Ident(param));
    };
    // `({ $a, $b = $a })`
    self.visit_mut_expr(&mut default);
    let is_undefined = binary(
      BinaryOp::EqEqEq,
      Box::new(Expr::Ident(param.clone())),
      Box::new(Expr::Unary(UnaryExpr {
        span: DUMMY_SP,
        op: UnaryOp::Void,
        arg: Box::new(Expr::Lit(Lit::Num(Number::from(0.0)))),
      })),
    );
    Some(*paren(condition(
      is_undefined,
      default,
      Box::new(Expr::Ident(param)),
    )))
  }

  /// `p.$on` for the props parameter `p`
  fn is_props_member(&self, expr: &Expr) -> bool {
    matches!(unwrap_type_casts(expr), Expr::Member(member)
      if matches!(unwrap_type_casts(&member.obj), Expr::Ident(obj) if self.params.member_params.contains(&obj.to_id())))
  }

  /// `w` for `const w = $a.w;`
  fn is_const_read(&self, expr: &Expr) -> bool {
    matches!(unwrap_type_casts(expr), Expr::Ident(ident) if self.params.consts.contains_key(&ident.to_id()))
  }

  /// A function that the folded function calls, e.g. `p.onRender()`, needs
  /// the same `this` and the same callee as in the source
  ///
  /// A method call on the props runs with the props object as `this`. The
  /// folded function has no props object, and `onRender()` would run with
  /// `this` undefined. A `const` read like `fn()` for `const fn = $a.fn;`
  /// would turn into `$a.fn()`, which runs with `$a` as `this`, and
  /// `$a?.fn()` would not throw for a missing `$a` like `fn()` does
  fn is_unsafe_callee(&self, expr: &Expr) -> bool {
    self.is_props_member(expr) || self.is_const_read(expr)
  }
}

impl VisitMut for SubstituteReads<'_> {
  fn visit_mut_expr(&mut self, expr: &mut Expr) {
    if self.failed {
      return;
    }
    match expr {
      Expr::Ident(ident) => {
        let id = ident.to_id();
        if self.params.locals.contains_key(&id) {
          if let Some(read) = self.local_read(&id) {
            *expr = read;
          }
          return;
        }
        // `w` -> `$a.w` for `const w = $a.w;`. The initializer reads props
        // and earlier consts, which this visit replaces as well
        if let Some(init) = self.params.consts.get(&id) {
          let mut init = init.clone();
          self.visit_mut_expr(&mut init);
          *expr = *init;
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

  /// `p.onRender()`, see `is_unsafe_callee`
  fn visit_mut_callee(&mut self, callee: &mut Callee) {
    if let Callee::Expr(expr) = callee {
      if self.is_unsafe_callee(expr) {
        self.failed = true;
        return;
      }
    }
    callee.visit_mut_children_with(self);
  }

  /// `p.onRender?.()`, see `is_unsafe_callee`
  fn visit_mut_opt_call(&mut self, call: &mut OptCall) {
    if self.is_unsafe_callee(&call.callee) {
      self.failed = true;
      return;
    }
    call.visit_mut_children_with(self);
  }

  /// `` tag`x` `` for `const tag = $a.tag;`, see `is_unsafe_callee`
  fn visit_mut_tagged_tpl(&mut self, tagged: &mut TaggedTpl) {
    if self.is_const_read(&tagged.tag) {
      self.failed = true;
      return;
    }
    tagged.visit_mut_children_with(self);
  }

  /// `new Shape()` for `const Shape = $a?.Shape;` would turn into
  /// `new $a?.Shape()`, which is a syntax error
  fn visit_mut_new_expr(&mut self, new: &mut NewExpr) {
    if self.is_const_read(&new.callee) {
      self.failed = true;
      return;
    }
    new.visit_mut_children_with(self);
  }

  /// `w.b` for `const w = $a?.w;` becomes `($a?.w).b`. Without the parens
  /// `$a?.w.b` would stop at a missing `$a` where `w.b` throws. A literal
  /// like `2` needs them as well: `(2).toFixed`
  fn visit_mut_member_expr(&mut self, member: &mut MemberExpr) {
    let reads_const = self.is_const_read(&member.obj);
    member.visit_mut_children_with(self);
    if reads_const && matches!(&*member.obj, Expr::OptChain(_) | Expr::Lit(_)) {
      member.obj = paren(member.obj.clone());
    }
  }

  /// Expands a shorthand `{ on }` to `{ on: $on }` for `({ $on: on })` and
  /// `{ w }` to `{ w: $a.w }` for `const w = $a.w;`
  fn visit_mut_prop(&mut self, prop: &mut Prop) {
    if let Prop::Shorthand(ident) = prop {
      let id = ident.to_id();
      if self.params.locals.contains_key(&id) || self.params.consts.contains_key(&id) {
        let mut read = Box::new(Expr::Ident(ident.clone()));
        self.visit_mut_expr(&mut read);
        *prop = Prop::KeyValue(KeyValueProp {
          key: PropName::Ident(IdentName::new(ident.sym.clone(), ident.span)),
          value: read,
        });
        return;
      }
    }
    prop.visit_mut_children_with(self);
  }

  /// A props or const binding left after the expression rewrite sits
  /// somewhere the rewrite cannot reach, e.g. the target of `p.$on = 1` or
  /// `$on++`
  fn visit_mut_ident(&mut self, ident: &mut Ident) {
    let id = ident.to_id();
    if self.params.locals.contains_key(&id)
      || self.params.member_params.contains(&id)
      || self.params.consts.contains_key(&id)
    {
      self.failed = true;
    }
  }
}
