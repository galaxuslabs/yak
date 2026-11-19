use rustc_hash::{FxHashMap, FxHashSet};
use swc_core::{
  atoms::Atom,
  common::{Mark, SyntaxContext, DUMMY_SP},
  ecma::ast::{
    AssignPatProp, BindingIdent, EsReserved, Expr, Id, Ident, IdentName, KeyValuePatProp,
    KeyValueProp, MemberProp, ObjectPat, ObjectPatProp, Pat, Prop, PropName,
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
  /// identifier props parameters, e.g. `p` in `(p) => p.$on`
  pub(super) member_params: FxHashSet<Id>,
  pub(super) reads_theme: bool,
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

  /// `({ $on, class: __yak_class }, style, theme)`, with the style and theme
  /// parameters only when the theme is read
  pub(super) fn into_params(mut self) -> Vec<Pat> {
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
  pub(super) fn param_for(&mut self, name: &Atom) -> Option<Ident> {
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
