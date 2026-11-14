import { css, CSSInterpolation, ClassNames, yakComponentSymbol } from "./cssLiteral.js";
import * as INTERNAL from "./internals/propMarkers.js";
import React from "react";
// the automatic runtime reuses the filtered props object instead of copying it
import { jsx } from "react/jsx-runtime";
import type {
  Attrs,
  AttrsMerged,
  Styled,
  YakComponent,
  AttrsFunction,
  StyledFn,
  HtmlTags,
  Substitute,
  StyledLiteral,
  RuntimeStyleProcessor,
  FoldFunction,
  ClassNameCollector,
} from "./publicStyledApi.js";

// the following export is not relative as "@yak/react/context"
// links to one file for react server components and
// to another file for classic react components
import { useTheme } from "@yak/react/context";
import type { YakTheme } from "./context/index.tsx";
import { mergeClassNames } from "./internals/mergeClassNames.js";

//
// The `styled()` API without `styled.` syntax
//
// The API design is inspired by styled-components:
// https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/constructors/styled.tsx
// https://github.com/styled-components/styled-components/blob/main/packages/styled-components/src/models/StyledComponent.ts
//
const styledFactory: StyledFn = (Component) =>
  Object.assign(yakStyled(Component), {
    attrs: (attrs: Attrs<any>) => yakStyled(Component, attrs),
  });

/**
 * The `styled` method works perfectly on all of your own or any third-party component,
 * as long as they attach the passed className prop to a DOM element.
 *
 * @usage
 *
 * ```tsx
 * const StyledLink = styled(Link)`
 *  color: #BF4F74;
 *  font-weight: bold;
 * `;
 * ```
 */
export const styled = styledFactory as Styled;

/**
 * Real shape of the yakComponentSymbol tuple, which the public `YakComponent`
 * keeps opaque as `[unknown, ...]`
 */
type YakComponentInternals = [
  self: React.FunctionComponent,
  attrsFn: AttrsFunction<any, any, any> | undefined,
  styleProcessor: RuntimeStyleProcessor<unknown>,
  target: React.FunctionComponent | string,
];

const yakStyled: StyledInternal = (Component, attrs) => {
  const isYakComponent = typeof Component !== "string" && yakComponentSymbol in Component;

  // if the component that is wrapped is a yak component, we can extract it to render the underlying component directly
  // and we can also extract the attrs function and the dynamic style function to merge it with the current attrs function (or dynamic style function)
  // so that the sequence of the attrs functions is preserved
  const [, parentAttrsFn, parentRuntimeStylesFn, parentTarget] = isYakComponent
    ? (Component[yakComponentSymbol] as [
        YakComponent<unknown>,
        ExtractAttrsFunction<typeof attrs>,
        RuntimeStyleProcessor<unknown>,
        React.FunctionComponent | string,
      ])
    : [];

  // the ultimate render target of the whole styled(styled(...)) chain:
  // attrs and style processors are already merged at construction time, so
  // a chain of N levels renders the target directly in ONE wrapper instead
  // of re-entering every parent wrapper per element per render
  const targetComponent = (isYakComponent ? parentTarget : Component) as
    | React.FunctionComponent
    | string;

  const mergedAttrsFn = buildRuntimeAttrsProcessor(attrs, parentAttrsFn);
  const staticAttrs = (mergedAttrsFn as StaticAttrsCarrier | undefined)?.[INTERNAL.STATIC_ATTRS];

  return (styles, ...values) => {
    // combine all interpolated logic into a single function
    // e.g. styled.button`color: ${props => props.color}; margin: ${props => props.margin};`
    //
    // A number as the first value marks the folded shape: the compiler
    // turned every runtime expression into one fold function
    // e.g. `__yak_button("yB", 0, ({ $on: __yak_$on }) => "yB" + (__yak_$on ? " yB1" : ""))`
    const runtimeStylesFn = (
      typeof values[0] === "number"
        ? foldedProcessor(values[0], values[1] as unknown as FoldFunction)
        : css(styles, ...(values as CSSInterpolation<unknown>[]))
    ) as RuntimeStyleProcessor<unknown>;
    const runtimeStyleProcessor = buildRuntimeStylesProcessor(
      runtimeStylesFn,
      parentRuntimeStylesFn,
    );
    const Target = targetComponent as React.ElementType;
    // A component is static when it has no attrs or a constant `.attrs({...})`,
    // and no dynamic styles. A constant attrs object cannot read the theme, so
    // a static component adds the same class names on every render and its
    // processor carries them as the string `$className`. `styled()` picks the
    // render function here: the static one skips the theme lookup and the
    // style copy. A static processor without `$className` renders through the
    // dynamic function, which asks the processor for its class names
    const staticClassName = runtimeStyleProcessor.$className;
    const isStatic =
      (!mergedAttrsFn || staticAttrs) &&
      !runtimeStyleProcessor.$dynamic &&
      staticClassName !== undefined;
    // a fold function without attrs functions takes the short render function
    // below: it reads the theme only if the function asks for it, creates no
    // style object and builds the props of the target in one loop. Attrs
    // functions receive the theme and the merged props, so they keep the
    // generic path, which calls the fold function through the processor
    const fold = !mergedAttrsFn || staticAttrs ? runtimeStyleProcessor.$fold : undefined;
    const foldFlags = runtimeStyleProcessor.$flags || 0;

    const Yak: React.FunctionComponent = fold
      ? (props) => {
          // the flags are fixed per component, so the hook order is stable
          const contextTheme = foldFlags & FOLD_THEME ? useTheme() : undefined;
          const source = (
            staticAttrs
              ? combineProps(
                  props as { className?: string; style?: React.CSSProperties },
                  staticAttrs,
                )
              : props
          ) as { className?: string; style?: React.CSSProperties; theme?: YakTheme };
          // a `theme` prop passed by the caller wins over the context theme,
          // like `{ theme, ...props }` on the generic path
          const className = fold(
            source,
            undefined,
            foldFlags & FOLD_THEME ? ("theme" in source ? source.theme : contextTheme) : undefined,
          );
          const incoming = source.className;
          return renderTarget(
            Target,
            foldedDomProperties(
              source,
              contextTheme,
              incoming ? incoming + " " + className : className,
            ),
          );
        }
      : isStatic
        ? (props) => {
            // without attrs `source` aliases `props`, so the class names are
            // written to the fresh, filtered object rather than back into props
            const source = (
              staticAttrs
                ? combineProps(
                    props as { className?: string; style?: React.CSSProperties },
                    staticAttrs,
                  )
                : props
            ) as { className?: string; style?: React.CSSProperties };
            const filteredProps = removeNonDomProperties(source) as {
              className?: string;
            };
            // The incoming class names come first, like in the dynamic function:
            // styled(styled.div("a"))("b") with className="in" renders "in a b".
            // A component without any class name renders no class attribute
            const incoming = source.className;
            filteredProps.className = staticClassName
              ? incoming
                ? incoming + " " + staticClassName
                : staticClassName
              : incoming || undefined;
            return renderTarget(Target, filteredProps);
          }
        : (props) => {
            // attrs functions and dynamic style functions receive the theme
            const theme = useTheme();

            // overwrite and merge the current props with the processed attrs, the
            // merged attrs function runs the attrs of every level of the chain
            // from the innermost to the outermost
            const combinedProps = combineProps(
              {
                theme,
                ...(props as {
                  className?: string;
                  style?: React.CSSProperties;
                }),
              } as {
                theme: YakTheme;
                className?: string;
                style?: React.CSSProperties;
              },
              mergedAttrsFn?.({ theme, ...(props as any) }),
            );

            // execute all functions inside the style literal
            // e.g. styled.button`color: ${props => props.color};`
            const classNames = new ClassNames(combinedProps.className);
            // static processors never write style values, so the incoming style
            // object can be passed through without a defensive copy
            const styles = runtimeStyleProcessor.$dynamic
              ? { ...combinedProps.style }
              : combinedProps.style;
            runtimeStyleProcessor(combinedProps, classNames, styles as React.CSSProperties);

            combinedProps.className = classNames.value || undefined;
            if (styles !== combinedProps.style) {
              combinedProps.style = styles;
            }

            // removes the yak theme (after the runtime styles read it) together with
            // all $-props, so they reach neither DOM elements nor custom components
            const filteredProps = removeNonDomProperties(combinedProps, theme);

            // render the chain's target directly — parent wrappers contribute only
            // their (already merged) attrs and style processors
            return renderTarget(Target, filteredProps);
          };

    // Direct write instead of Object.assign (faster & smaller)
    const taggedYak = Yak as React.FunctionComponent & {
      [yakComponentSymbol]: YakComponentInternals;
    };
    taggedYak[yakComponentSymbol] = [Yak, mergedAttrsFn, runtimeStyleProcessor, targetComponent];
    return taggedYak;
  };
};

/**
 * Renders the target with the filtered props, which belong to this render only
 *
 * `jsx()` keeps the props object. JSX syntax copies it in both JSX runtimes:
 * `<Target {...props} />` becomes `createElement(Target, props)` or
 * `jsx(Target, { ...props })`. React freezes the props object in development,
 * so nothing may write to it after this call, and it must never be an object
 * the caller owns
 *
 * A `key` from attrs is passed separately, like JSX does, so React does not
 * warn about a spread key: `.attrs({ key: "a" })` renders
 * `jsx(Target, { className: "x" }, "a")`
 *
 * Like JSX in React 19, `jsx()` ignores the `defaultProps` of a function
 * component
 */
const renderTarget = (Target: React.ElementType, props: Record<string, unknown>) => {
  if ("key" in props) {
    const { key, ...rest } = props;
    return jsx(Target, rest, key as React.Key);
  }
  return jsx(Target, props);
};

/**
 * Remove all entries that start with a $ sign
 *
 * This allows to have props that are used for internal styling purposes
 * but are not be passed to the DOM element
 *
 * A `theme` entry is removed only if it is the same object as the injected
 * yak theme. A `theme` from the caller or from attrs reaches the target, like
 * `<Link theme={{ dark: true }} />`
 */
const removeNonDomProperties = <T extends Record<string, unknown>>(obj: T, theme?: unknown): T => {
  const result = {} as T;
  for (const key in obj) {
    if (key.startsWith("$")) {
      continue;
    }
    const value = obj[key];
    if (value !== undefined && (key !== "theme" || value !== theme)) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * `removeNonDomProperties` for the fold path, which also sets the class
 * string
 *
 * A `className` key keeps its position, even with an undefined value, so the
 * attribute order matches the generic path, which assigns it onto the merged
 * props
 *
 * `theme` is the context theme, or undefined when the fold function does not
 * read the theme. In that case no `theme` entry is removed, like for a static
 * component
 */
const foldedDomProperties = (obj: Record<string, unknown>, theme: unknown, className: string) => {
  const result: Record<string, unknown> = {};
  for (const key in obj) {
    if (key.startsWith("$")) {
      continue;
    }
    if (key === "className") {
      result.className = className;
      continue;
    }
    const value = obj[key];
    if (value !== undefined && (key !== "theme" || value !== theme)) {
      result[key] = value;
    }
  }
  if (!("className" in result)) {
    result.className = className;
  }
  return result;
};

/**
 * merge props and processed props (including class names and styles)
 * e.g.:\
 * `{ className: "a", foo: 1 }` and `{ className: "b", bar: 2 }` \
 * => `{ className: "a b", foo: 1, bar: 2 }`
 */
const combineProps = <
  T extends {
    className?: string;
    style?: React.CSSProperties;
  },
  TOther extends
    | {
        className?: string;
        style?: React.CSSProperties;
      }
    | null
    | undefined,
>(
  props: T,
  newProps: TOther,
) =>
  newProps
    ? (props.className === newProps.className || !newProps.className) &&
      (props.style === newProps.style || !newProps.style)
      ? // shortcut if no style and class merging is necessary
        {
          ...props,
          ...newProps,
        }
      : // merge class names and styles
        {
          ...props,
          ...newProps,
          className: mergeClassNames(props.className, newProps.className),
          style: { ...props.style, ...newProps.style },
        }
    : // if no new props are provided, no merging is necessary
      props;

/**
 * Merges the attrs function of the current component with the attrs function of the parent component
 * in order to preserve the sequence of the attrs functions.
 * Note: In theory, the parentAttrsFn can have different types for TAttrsIn and TAttrsOut
 * but as this is only used internally, we can ignore and simplify this case
 * @param attrs The attrs object or function of the current component (if any)
 * @param parentAttrsFn The attrs function of the parent/wrapped component (if any)
 * @returns A function that receives the props and returns the transformed props
 */
const buildRuntimeAttrsProcessor = <
  T,
  TAttrsIn extends object,
  TAttrsOut extends AttrsMerged<T, TAttrsIn>,
>(
  attrs?: Attrs<T, TAttrsIn, TAttrsOut>,
  parentAttrsFn?: AttrsFunction<T, TAttrsIn, TAttrsOut>,
): AttrsFunction<T, TAttrsIn, TAttrsOut> | undefined => {
  const ownAttrsFn = attrs && (typeof attrs === "function" ? attrs : () => attrs);

  if (ownAttrsFn && parentAttrsFn) {
    return (props) => {
      const parentProps = parentAttrsFn(props);

      // overwrite and merge the parent props with the props received from the attrs function
      // after they went through the parent attrs function.
      //
      // This makes sure the linearity of the attrs functions is preserved and all attrs function receive
      // the whole props object calculated from the previous attrs functions
      return combineProps(parentProps, ownAttrsFn(combineProps(props, parentProps)));
    };
  }

  // A constant `.attrs({...})` is wrapped into `() => attrs`, which makes it
  // indistinguishable from `.attrs(props => ...)` at render time — so record the
  // object it will always return. Only the wrapper closure is tagged, never a
  // user-supplied attrs function.
  //
  // A `styled(StyledWithAttrs).attrs({...})` chain merges its levels per render
  // and is not tagged, which keeps a mutation of an attrs object observable
  if (ownAttrsFn && typeof attrs !== "function") {
    return Object.assign(ownAttrsFn, {
      [INTERNAL.STATIC_ATTRS]: attrs,
    } as StaticAttrsCarrier);
  }

  return ownAttrsFn || parentAttrsFn;
};

/**
 * The constant object a `.attrs({...})` processor always returns
 *
 * Kept local to this module — like the `yakComponentSymbol` tuple, it is an
 * implementation detail and must not reach the public `AttrsFunction` type
 */
type StaticAttrsCarrier = { [K in typeof INTERNAL.STATIC_ATTRS]?: object };

/**
 * Merges the runtime style function of the current component with the runtime style function of the parent component
 * in order to preserve the sequence of the attrs functions.
 * @param runtimeStylesFn The current runtime styles function
 * @param parentRuntimeStylesFn The parent runtime styles function
 * @returns The merged runtime styles function
 */
const buildRuntimeStylesProcessor = <T,>(
  runtimeStylesFn: RuntimeStyleProcessor<T>,
  parentRuntimeStylesFn?: RuntimeStyleProcessor<T>,
) => {
  if (runtimeStylesFn && parentRuntimeStylesFn) {
    // a chain of folded and static levels stays folded: one function returns
    // the class string of every level, parent first
    const chainFold = joinFoldFunctions(parentRuntimeStylesFn, runtimeStylesFn);
    if (chainFold) {
      return foldedProcessor(
        (parentRuntimeStylesFn.$flags || 0) | (runtimeStylesFn.$flags || 0),
        chainFold,
      ) as RuntimeStyleProcessor<T>;
    }
    const combined: RuntimeStyleProcessor<T> = Object.assign(
      (
        props: T,
        classNames: Parameters<RuntimeStyleProcessor<T>>[1],
        style: React.CSSProperties,
      ) => {
        parentRuntimeStylesFn(props, classNames, style);
        runtimeStylesFn(props, classNames, style);
      },
      // the chain is dynamic if any level is dynamic
      runtimeStylesFn.$dynamic || parentRuntimeStylesFn.$dynamic
        ? { $dynamic: true }
        : {
            $dynamic: false,
            $className: joinStaticClassNames(
              parentRuntimeStylesFn.$className,
              runtimeStylesFn.$className,
            ),
          },
    );
    return combined;
  }
  return runtimeStylesFn || parentRuntimeStylesFn;
};

/** Fold flag: the fold function reads the theme, its third argument */
const FOLD_THEME = 1;

/**
 * Wraps a compiled fold function into a style processor
 *
 * The processor itself serves the generic path (attrs functions, chains with
 * an unfolded level): it adds the class string the fold function returns and
 * reads the theme from the props, where the generic path puts it. The short
 * path calls `$fold` directly
 */
const foldedProcessor = (flags: number, fold: FoldFunction) =>
  Object.assign(
    (props: { theme?: YakTheme }, classNames: ClassNameCollector, style: React.CSSProperties) => {
      classNames.add(fold(props, style, props.theme));
    },
    { $dynamic: true, $fold: fold, $flags: flags },
  );

/**
 * Combines the levels of a `styled(styled(...))` chain into one fold
 * function if every level is folded or static, e.g. a static parent `"yA"`
 * and a folded child `f` give `(p, s, t) => "yA " + f(p, s, t)`
 *
 * Returns undefined if one level is neither, so the chain keeps the generic
 * path
 */
const joinFoldFunctions = (
  parent: RuntimeStyleProcessor<any>,
  own: RuntimeStyleProcessor<any>,
): FoldFunction | undefined => {
  const parentFold = parent.$fold;
  const ownFold = own.$fold;
  if (!parentFold && !ownFold) {
    return undefined;
  }
  if (parentFold && ownFold) {
    return (props, style, theme) =>
      parentFold(props, style, theme) + " " + ownFold(props, style, theme);
  }
  // one level is folded: the other one must be static with known class names
  const other = parentFold ? own : parent;
  if (other.$dynamic || other.$className === undefined) {
    return undefined;
  }
  const className = other.$className;
  if (!className) {
    return parentFold || ownFold;
  }
  return parentFold
    ? (props, style, theme) => parentFold(props, style, theme) + " " + className
    : (props, style, theme) => className + " " + ownFold!(props, style, theme);
};

/**
 * Joins the `$className` of two static processors, the parent first:
 * join("a", "b") gives "a b" and join("", "b") gives "b". Returns undefined
 * if either level does not know its class names
 */
const joinStaticClassNames = (parent: string | undefined, own: string | undefined) =>
  parent === undefined || own === undefined
    ? undefined
    : parent && own
      ? parent + " " + own
      : parent || own;

/**
 * Internal function where attrs are passed to be processed
 */
export type StyledInternal = <
  T extends object,
  TAttrsIn extends object = {},
  TAttrsOut extends AttrsMerged<T, TAttrsIn> = AttrsMerged<T, TAttrsIn>,
>(
  Component: React.FunctionComponent<T> | YakComponent<T> | HtmlTags | string,
  attrs?: Attrs<T, TAttrsIn, TAttrsOut>,
) => StyledLiteral<Substitute<T, TAttrsIn>>;

/**
 * Utility type to extract the AttrsFunction from the Attrs type
 */
export type ExtractAttrsFunction<T> = T extends (p: any) => any ? T : never;
