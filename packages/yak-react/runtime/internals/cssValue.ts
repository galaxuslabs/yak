/**
 * Internal helper called by transformed code - Do not use directly
 *
 * Turns the result of a dynamic value into the value of its css variable.
 * The compiler moves a unit after the interpolation and a minus before it
 * out of the css and into this call, because css cannot attach either one
 * to a `var()`: `-var(--x)px` is invalid css.
 *
 * ```tsx
 * import { styled } from "@yak/react";
 *
 * const Button = styled.button<{ $x: number }>`
 *   left: ${({ $x }) => $x}px;
 *   top: -${({ $x }) => $x}px;
 * `;
 * ```
 *
 * Which will be transformed to:
 * ```tsx
 * // css: left: var(--left); top: var(--top);
 * "--left": cssValue(({ $x }) => $x, "px"),
 * "--top": cssValue(({ $x }) => $x, "px", true),
 * ```
 *
 * Development builds also wrap a value without a unit, so it gets the same
 * check for a missing value. Production builds assign it as it is:
 * ```tsx
 * // width: ${({ $w }) => $w};
 * "--width": cssValue(({ $w }) => $w, ""), // development
 * "--width": ({ $w }) => $w,               // production
 * ```
 * With an empty unit a string stays the same and a number becomes its
 * string, e.g. 2 becomes "2". React writes both the same way into a custom
 * property, so the wrapper changes no valid value.
 *
 * `negate` flips the sign: a number is negated, so -32 becomes "32px",
 * and a string loses or gains a leading minus, so "-2rem" becomes "2rem".
 * A string like "var(--gap)" turns into the invalid "-var(--gap)".
 *
 * Any other value is a mistake, like the `undefined` of a missing prop. It
 * throws in development. In production it becomes text like "undefined",
 * which is no valid css value, so the property falls back to its default.
 * It must not stay `undefined`: React leaves such a style value out, and the
 * element would inherit the variable from an ancestor that renders the same
 * component.
 */
export const cssValue = (
  arg: unknown,
  unit: string,
  negate?: boolean,
): string | ((props: unknown) => unknown) => {
  switch (typeof arg) {
    case "function":
      return (props: unknown) => cssValue(arg(props), unit, negate);
    case "number":
      return `${negate ? -arg : arg}${unit}`;
    case "string":
      return (negate ? (arg.startsWith("-") ? arg.slice(1) : "-" + arg) : arg) + unit;
  }
  // the `process.env` lookup costs time in Node without a bundler, so it
  // stays on this path for invalid values
  if (process.env.NODE_ENV === "development") {
    throw new Error(`Dynamic CSS values must be a string or number but got ${JSON.stringify(arg)}`);
  }
  return String(arg);
};
