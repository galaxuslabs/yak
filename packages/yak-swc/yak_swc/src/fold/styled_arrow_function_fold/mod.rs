use self::fold_class_name_condition::concat;
use self::merge_arrow_parameters::FoldParams;
use crate::utils::ast_helper::{single_return_expr, str_expr, unwrap_type_casts};
use crate::yak_imports::{YakImports, YakRuntime};
use swc_core::{
  common::{SyntaxContext, DUMMY_SP},
  ecma::ast::{
    ArrowExpr, ArrowFunctionBody, AssignPatProp, Expr, KeyValuePatProp, Lit, Number, ObjectPatProp,
    Pat, PropName,
  },
};

mod fold_class_name_condition;
mod merge_arrow_parameters;

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
  // The Solid runtime takes no folded function
  if yak_imports.runtime() != YakRuntime::React {
    return None;
  }
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
}
