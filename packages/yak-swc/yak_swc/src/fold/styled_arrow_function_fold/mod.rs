use self::block_body_to_expr::{block_body_to_expr, BodyEnd};
use self::fold_class_name_condition::join_folded_class_names;
use self::fold_css_variable_function::create_folded_css_variable_definition;
use self::merge_arrow_parameters::FoldParams;
use crate::utils::ast_helper::{str_expr, unwrap_type_casts};
use crate::yak_imports::{YakImports, YakRuntime};
use rustc_hash::FxHashMap;
use std::borrow::Cow;
use swc_core::{
  atoms::Atom,
  common::{SyntaxContext, DUMMY_SP},
  ecma::ast::{
    ArrowExpr, ArrowFunctionBody, AssignPat, AssignPatProp, Expr, Id, Ident, KeyValuePatProp, Lit,
    MemberProp, Number, ObjectPatProp, Pat, PropName,
  },
};

mod block_body_to_expr;
mod fold_class_name_condition;
mod fold_css_variable_function;
mod merge_arrow_parameters;

/// The flags are the number before the folded function, e.g. the `0` in
/// `__yak_button(0, fn)`. A number as the first argument tells the runtime that
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

/// The folded function writes CSS variables: the runtime passes a fresh copy
/// of the style prop as the second argument and renders it
const FLAG_STYLE: u32 = 2;

/// The class names of one styled component as a single expression over its
/// props, e.g. `"yB" + ($on ? " yB1" : "")`, plus what a caller needs to put
/// the expression into a function or inline it at a JSX usage
pub(crate) struct FoldedClassNames {
  /// The class name expression. It reads each prop through the parameter that
  /// `props()` lists for it, the theme through `theme` and writes CSS variables
  /// to `style`, and all of these parameters carry a syntax context of their own
  pub(crate) class_name: Box<Expr>,
  params: FoldParams,
  /// `true` when the expression writes CSS variables to the style parameter
  pub(crate) writes_style: bool,
  /// `false` for a component with nothing but `atoms("flex")` calls, whose
  /// class names never change
  has_condition: bool,
}

impl FoldedClassNames {
  /// The props the expression reads, in order of their first read, with the
  /// parameter that stands for each, e.g. `[("$on", $on)]` for
  /// `"yB" + ($on ? " yB1" : "")`
  pub(crate) fn props(&self) -> &[(Atom, Ident)] {
    self.params.read()
  }

  /// `true` when the expression reads the theme through the theme parameter
  pub(crate) fn reads_theme(&self) -> bool {
    self.params.reads_theme
  }
}

/// Turns the conditions of a styled component into one class name expression
/// over its props
///
/// ```js
/// // source
/// styled.button`
///   ${({ $active }) => $active && css`color: red;`}
///   ${({ $size }) => $size === "s" ? css`padding: 0;` : css`padding: 4px;`}
/// `
/// // compiled runtime expressions
/// ({ $active }) => $active && css("yB1")
/// ({ $size }) => $size === "s" ? css("yB2") : css("yB3")
/// // class name expression
/// "yB" + ($active ? " yB1" : "") + ($size === "s" ? " yB2" : " yB3")
/// ```
///
/// `runtime_expressions` holds the compiled form of each `${...}` in the
/// template. The builder works for every runtime: `fold_class_names` wraps the
/// result into the folded function of the React runtime, and the styled JSX
/// fold inlines it at the usages of a component
///
/// Each runtime expression must be an arrow that toggles class names or an
/// `atoms(...)` call such as `${atoms("flex")}`. Returns `None` for any other
/// expression, or when a CSS variable has a value the expression cannot write
pub(crate) fn build_class_names(
  class_name: &str,
  runtime_expressions: &[Expr],
  css_variables: &FxHashMap<String, Expr>,
  yak_imports: &YakImports,
) -> Option<FoldedClassNames> {
  let mut folder = ClassNameFolder {
    yak_imports,
    params: FoldParams::default(),
    writes_style: false,
    fall_through: None,
  };
  let mut class_name_expr = str_expr(class_name.into());
  let mut has_arrow = false;
  for expression in runtime_expressions {
    let folded_class_names = match unwrap_type_casts(expression) {
      // `${atoms("flex")}` next to the conditions
      Expr::Call(call) => folder.fold_atoms_call(call)?,
      _ => {
        has_arrow = true;
        folder.fold_arrow(expression)?
      }
    };
    class_name_expr = join_folded_class_names(class_name_expr, folded_class_names);
  }
  // the runtime writes the CSS variables of the component after it ran the
  // runtime expressions, in the key order of the compiled `{ "--yX": value }` object
  if !css_variables.is_empty() {
    let mut keys: Vec<&String> = css_variables.keys().collect();
    keys.sort();
    let mut definitions = Vec::new();
    for key in keys {
      definitions.push(folder.fold_css_variable_definition(key, &css_variables[key])?);
    }
    class_name_expr = join_folded_class_names(
      class_name_expr,
      create_folded_css_variable_definition(definitions),
    );
  }
  Some(FoldedClassNames {
    class_name: class_name_expr,
    params: folder.params,
    writes_style: folder.writes_style,
    has_condition: has_arrow || !css_variables.is_empty(),
  })
}

/// Turns the class name expression of a styled component into the "folded"
/// function of the React runtime
///
/// ```js
/// // compiled without the folded function
/// __yak.__yak_button("yB",
///   ({ $active }) => $active && css("yB1"),
///   ({ $size }) => $size === "s" ? css("yB2") : css("yB3"))
/// // compiled with the folded function
/// __yak.__yak_button(0, ({ $active, $size }) =>
///   "yB" + ($active ? " yB1" : "") + ($size === "s" ? " yB2" : " yB3"))
/// ```
///
/// The folded function returns the root class name `"yB"` itself, so the
/// compiled call leaves out the class name argument and starts with the flags
///
/// Without the folded function, each `css("yB1")` call inside a runtime
/// expression creates a function on every render, which the runtime calls
/// only to add a class name
///
/// Returns the flags and the folded function, e.g.
/// `[0, ({ $on }) => "yB" + ($on ? " yB1" : "")]`, or `None` for the Solid
/// runtime, which takes no folded function, and for a component without a
/// condition. The component then keeps its compiled shape with one function
/// per condition, so nothing changes for it
pub(crate) fn fold_class_names(
  folded: FoldedClassNames,
  yak_imports: &YakImports,
) -> Option<Vec<Expr>> {
  if yak_imports.runtime() != YakRuntime::React {
    return None;
  }
  // a component with nothing but `atoms("flex")` calls has no condition. The
  // runtime joins its class names once at definition, which a folded function
  // would do on every render
  if !folded.has_condition {
    return None;
  }
  let mut flags = FLAGS_PROPS_ONLY;
  if folded.reads_theme() {
    flags |= FLAG_THEME;
  }
  if folded.writes_style {
    flags |= FLAG_STYLE;
  }
  let fold_function = Expr::Arrow(ArrowExpr {
    span: DUMMY_SP,
    ctxt: SyntaxContext::empty(),
    params: folded.params.into_params(folded.writes_style),
    body: Box::new(ArrowFunctionBody::Expr(folded.class_name)),
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
  writes_style: bool,
  /// `Some` while `fold_value` folds the left side of a fall through `??`,
  /// where the fall through marker may appear. It turns `true` once a marker
  /// was folded, see `fall_through_to_expr`
  fall_through: Option<bool>,
}

impl ClassNameFolder<'_> {
  /// Folds one runtime expression, e.g. `({ $on }) => $on && css("yB1")`,
  /// into the class names it adds: `($on ? " yB1" : "")`
  ///
  /// The arrow takes no parameter, a destructuring with plain keys, or one
  /// identifier which is only read through members (`p => p.$on`). The body is
  /// an expression or a block of `if`, `switch` and `return` statements
  fn fold_arrow(&mut self, expression: &Expr) -> Option<Box<Expr>> {
    let body = self.bind_arrow(expression, BodyEnd::ClassNames)?;
    self.fold_value(&body)
  }

  /// Registers the props parameter of a runtime expression and returns the
  /// expression the arrow returns. `end` tells a function of class names from
  /// one at a CSS value position, see `BodyEnd`
  fn bind_arrow<'e>(&mut self, expression: &'e Expr, end: BodyEnd) -> Option<Cow<'e, Expr>> {
    let Expr::Arrow(arrow) = unwrap_type_casts(expression) else {
      return None;
    };
    if arrow.is_async || arrow.is_generator {
      return None;
    }
    let body = match &*arrow.body {
      ArrowFunctionBody::Expr(expr) => Cow::Borrowed(&**expr),
      // `{ if ($on) { return css("yB1"); } }` -> `$on ? css("yB1") : undefined`
      ArrowFunctionBody::FunctionBody(block) => Cow::Owned(*block_body_to_expr(
        &block.stmts,
        &mut self.params.consts,
        end,
      )?),
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
            // `({ $align = "start" })`
            ObjectPatProp::Assign(AssignPatProp {
              key,
              value: Some(default),
              ..
            }) => {
              self.bind_default(key.to_id(), default)?;
              self.params.locals.insert(key.to_id(), key.sym.clone());
            }
            ObjectPatProp::KeyValue(KeyValuePatProp { key, value }) => {
              let PropName::Ident(key) = key else {
                return None;
              };
              let local = match &**value {
                // `({ $on: on })`
                Pat::Ident(local) => local,
                // `({ $align: align = "start" })`
                Pat::Assign(AssignPat { left, right, .. }) => {
                  let Pat::Ident(local) = &**left else {
                    return None;
                  };
                  self.bind_default(local.to_id(), right)?;
                  local
                }
                _ => return None,
              };
              self.params.locals.insert(local.to_id(), key.sym.clone());
            }
            // rest patterns
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

  /// Registers the default value of a destructured prop, e.g. `"start"` for
  /// `({ $align = "start" })`
  ///
  /// The folded function writes the default at every read of the prop, so it
  /// is a literal or a plain read like `SIZES.small`: a call would run once
  /// per read instead of once per render
  fn bind_default(&mut self, local: Id, default: &Expr) -> Option<()> {
    if !is_literal_or_plain_read(unwrap_type_casts(default)) {
      return None;
    }
    self
      .params
      .defaults
      .insert(local, Box::new(default.clone()));
    Some(())
  }
}

fn is_literal_or_plain_read(expr: &Expr) -> bool {
  match expr {
    Expr::Lit(Lit::Str(_) | Lit::Num(_) | Lit::Bool(_) | Lit::Null(_)) | Expr::Ident(_) => true,
    Expr::Member(member) => {
      matches!(member.prop, MemberProp::Ident(_))
        && is_literal_or_plain_read(unwrap_type_casts(&member.obj))
    }
    _ => false,
  }
}
