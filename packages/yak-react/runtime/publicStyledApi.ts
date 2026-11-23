// This is the public facing API for the styled object.
import React from "react";
import type { YakTheme } from "./context/index.js";
import { CSSInterpolation, yakComponentSymbol } from "./cssLiteral.js";

/**
 * Main styled interface that combines HTML tag mappings with the styled function.
 * This is the primary entry point for creating styled components.
 */
export interface Styled extends MappedHtmlTags, StyledFn {}

/**
 * Function interface for creating styled components from any component or HTML tag.
 * Supports React components, HTML tags, and custom web components.
 */
export interface StyledFn {
  <TProps extends object = React.DOMAttributes<Element> & React.RefAttributes<Element>>(
    Component: HtmlTags | React.FunctionComponent<TProps> | CustomWebComponentTag,
  ): LiteralWithAttrs<TProps>;
}

/**
 * A yak component with a special symbol that allows component targeting
 * and proper attrs function handling.
 * @example styled.svg`${Button}:hover & { fill: red; }` or styled(Button)`color: red;`
 */
export interface YakComponent<T> extends React.FunctionComponent<T> {
  // This is intentionally typed to hide the internal implementation details.
  [yakComponentSymbol]: [unknown, unknown, unknown, unknown];
}

/**
 * Styled component with attrs method for adding default props.
 * Extends StyledLiteral with the ability to specify default attributes.
 */
export interface LiteralWithAttrs<T extends object> extends StyledLiteral<T> {
  attrs: <TAttrsIn extends object = {}, TAttrsOut extends object = {}>(
    attrs: Attrs<T, TAttrsIn, TAttrsOut>,
  ) => StyledLiteral<
    Substitute<T, TAttrsIn>,
    Substitute<Substitute<T, TAttrsIn>, TAttrsOut>,
    keyof TAttrsOut
  >;
}

/**
 * Template literal function for defining CSS styles with interpolation support.
 * Accepts CSS template strings and interpolated values with proper typing.
 */
export interface StyledLiteral<T, TInterpolationProps = T, TAttrsKeys extends PropertyKey = never> {
  <TCSSProps>(
    styles: TemplateStringsArray,
    ...values: Array<
      CSSInterpolation<
        TInterpolationProps &
          // Prevent TypeScript from inferring types from template literal usage
          // This ensures proper typing and enables destructuring hints
          NoInfer<TCSSProps> & { theme: YakTheme }
      >
    >
  ): YakComponent<MakeOptional<TCSSProps & T, TAttrsKeys>>;
}

type MakeOptional<TProps, TKeys extends PropertyKey> = [TKeys] extends [never]
  ? TProps
  : FastOmit<TProps & object, TKeys> & Partial<Pick<TProps, Extract<keyof TProps, TKeys>>>;

/**
 * Function variant of attrs that receives current props and returns additional props.
 * Allows for dynamic prop generation based on component state.
 */
export interface AttrsFunction<TBaseProps, TIn extends object = {}, TOut extends object = {}> {
  (p: Substitute<TBaseProps & { theme: YakTheme }, TIn>): AttrsResult<TBaseProps, TIn, TOut>;
}

/**
 * A bare `TOut` would also infer the attrs function itself, and
 * `Partial<TOut>` would drop `undefined` from the inferred props
 */
type AttrsResult<TBaseProps, TIn extends object, TOut extends object> = Partial<
  AttrsMerged<TBaseProps, NoInfer<TIn>>
> & { [K in keyof TOut]: TOut[K] };

/**
 * Merges provided props with initial props, making specified props optional.
 * Includes theme support for styled components.
 */
export type AttrsMerged<TBaseProps, TIn extends object = {}> = Substitute<
  TBaseProps & { theme?: YakTheme },
  TIn
>;

/**
 * Maps all HTML tag names to their corresponding styled component types with attributes support.
 * Provides typed access to all standard HTML elements through the styled interface.
 */
export type MappedHtmlTags = {
  [Tag in HtmlTags]: LiteralWithAttrs<React.JSX.IntrinsicElements[Tag]>;
};

/**
 * The attrs function allows adding additional props to a styled component.
 * Props can be specified as an object or as a function that receives current props.
 */
export type Attrs<TBaseProps, TIn extends object = {}, TOut extends object = {}> =
  | AttrsResult<TBaseProps, TIn, TOut>
  | AttrsFunction<TBaseProps, TIn, TOut>;

/**
 * Utility type to merge two object types, with properties from B taking precedence.
 * If a property exists in both A and B, the property from B is used.
 */
export type Substitute<A extends object, B extends object> = FastOmit<A, keyof B> & B;

/**
 * Union type of all valid HTML element tag names.
 * Derived from React's JSX intrinsic elements.
 */
export type HtmlTags = keyof React.JSX.IntrinsicElements;

/**
 * Custom web component tag pattern that must contain at least one hyphen.
 * Follows the web component naming convention.
 */
export type CustomWebComponentTag = `${string}-${string}`;

/**
 * Utility type to efficiently remove properties from an object type.
 * More performant than the built-in Omit type for large object types.
 */
export type FastOmit<T extends object, U extends string | number | symbol> = {
  [K in keyof T as K extends U ? never : K]: T[K];
};

/**
 * Set-like collector for class names
 *
 * The runtime implements this as a string builder, a real `Set<string>`
 * satisfies it as well
 */
export type ClassNameCollector = {
  add(className: string): void;
  has(className: string): boolean;
  delete(className: string): void;
};

/**
 * A function that adds the class names and style values of one render
 *
 * User code passes one to `atoms()`. The functions that `css()` returns
 * carry a flag on top, see `RuntimeStyleProcessor`
 */
export type StyleFunction<T> = (
  props: T,
  classNames: ClassNameCollector,
  style: React.CSSProperties,
) => void;

/**
 * A static processor adds the same class names on every render
 *
 * Static means that the result does not depend on the props or the theme.
 * A static processor does
 * - NOT run a function from the template like `${(props) => ...}`
 * - NOT write CSS variables into the style prop
 *
 * `$className` holds its class names as one string, e.g. "yA yB". It is empty
 * if the processor adds no class name
 * e.g. styled.div`color: red;` -> css("yA") -> { $dynamic: false, $className: "yA" }
 */
type StaticStyleProcessor<T> = StyleFunction<T> & {
  $dynamic: false;
  $className: string;
};

/**
 * A processor that runs user functions or writes style values at render
 * time, so its class names are only known after it ran
 * e.g. styled.div`${({ $on }) => $on && css`color: red;`}`
 *
 * A processor built from a compiled fold function carries it as `$fold`,
 * together with its `$flags` (see `FoldFunction` below)
 */
type DynamicStyleProcessor<T> = StyleFunction<T> & {
  $dynamic: true;
  $fold?: FoldFunction;
  $flags?: number;
};

/**
 * What `css()` returns after compilation. Check `$dynamic` to tell which of
 * the two kinds a processor is: only the static kind has a `$className`, only
 * the dynamic kind can have a `$fold`
 */
export type RuntimeStyleProcessor<T> = StaticStyleProcessor<T> | DynamicStyleProcessor<T>;

/**
 * The function the compiler emits for a styled component whose runtime
 * expressions only toggle class names. It returns the complete class string:
 *
 * ```js
 * styled.button`${({ $on }) => $on && css`color: red;`}`
 * // compiled
 * __yak_button("yB", 0, ({ $on }) => "yB" + ($on ? " yB1" : ""))
 * ```
 *
 * `theme` is the yak theme. The fold render function passes it only when the
 * flags ask for it. The function does not use the second parameter.
 */
export type FoldFunction = (props: any, style: any, theme: any) => string;

/**
 * Utility type to keep the generic API of a component while still being able to use it in a selector
 */
export type GenericYakComponentOf<T, P = {}> = T &
  YakComponent<P> & {
    <G = {}>(props: P & G): React.ReactElement | null;
  };
