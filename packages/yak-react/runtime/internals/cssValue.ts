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
 * `negate` flips the sign: a number is negated, so -32 becomes "32px",
 * and a string loses or gains a leading minus, so "-2rem" becomes "2rem".
 * A string like "var(--gap)" turns into the invalid "-var(--gap)".
 * Any value other than a number or a string returns undefined, so the
 * css variable stays unset.
 */
export const cssValue = (
  arg: unknown,
  unit: string,
  negate?: boolean,
): unknown => {
  switch (typeof arg) {
    case "function":
      return (props: unknown) => cssValue(arg(props), unit, negate);
    case "number":
      return `${negate ? -arg : arg}${unit}`;
    case "string":
      return (
        (negate ? (arg.startsWith("-") ? arg.slice(1) : "-" + arg) : arg) +
        unit
      );
  }
};
