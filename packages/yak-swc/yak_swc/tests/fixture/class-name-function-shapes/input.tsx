import { styled, css, atoms } from "@yak/react";
import { isLarge } from "./helpers";

// identifier props parameter read through members
export const Ident = styled.div<{ $on: boolean }>`
  ${(p) => p.$on && css`color: red;`}
`;

// block body with a single return and a renamed key
export const Block = styled.div<{ $size: "s" | "l" }>`
  ${({ $size: size }) => {
    return size === "s" ? css`padding: 0;` : css`padding: 4px;`;
  }}
`;

// helper call in a condition and a shorthand object read
export const Helper = styled.div<{ $size: number; $mode: string }>`
  ${({ $size, $mode }) => isLarge({ $size }, $mode) && css`font-size: 2em;`}
`;

// theme read through destructuring and through a member
export const Themed = styled.div<{ $on: boolean }>`
  ${({ theme }) => theme.dark && css`color: white;`}
  ${(p) => p.$on && p.theme.dark && css`color: black;`}
`;

// falsy branches, nested ternaries and an empty css
export const Nested = styled.span<{ $a: boolean; $b: boolean; $c: number }>`
  ${({ $a, $b }) => ($a ? ($b ? css`color: red;` : null) : false)}
  ${({ $c }) => $c > 1 && css`
    margin: 0;
    ${({ $a }) => $a && css``}
  `}
  ${() => undefined}
`;

// a nested condition that reads a prop of the enclosing arrow
export const Outer = styled.span<{ $a: boolean; $b: boolean }>`
  ${({ $a }) => css`
    ${({ $b }) => $a && $b && css`color: red;`}
  `}
`;

// styled(Component) and attrs keep their target but fold their conditions
export const Wrapped = styled(Ident).attrs({ role: "note" })<{ $x: boolean }>`
  ${({ $x }) => $x && css`color: green;`}
`;

// a dynamic value inside a property is a CSS variable, which the fold
// function writes into the style object
export const CssVariable = styled.div<{ $x: number }>`
  ${({ $x }) => $x > 1 && css`color: red;`}
  left: ${({ $x }) => $x}px;
`;

export const ThemeVariable = styled.div`
  color: ${({ theme }) => theme.color};
`;

// a variable in a nested css is written only when its branch runs
export const NestedVariable = styled.div<{ $on: boolean; $x: number; $big: boolean }>`
  ${({ $on, $x, $big }) =>
    $on &&
    css`
      left: ${$x * 2}px;
      top: ${$big ? 8 : 4}px;
    `}
`;

// a truthy left side of `||` adds nothing
export const OrProp = styled.div<{ $label?: string }>`
  ${({ $label }) => $label || css`color: red;`}
`;

export const OrComparison = styled.div<{ $size: string }>`
  ${({ $size }) => $size !== "s" || css`padding: 0;`}
`;

export const OrChain = styled.div<{ $a: boolean; $b: boolean }>`
  ${({ $a, $b }) => !$a || !$b || css`color: orange;`}
`;

export const AtomsCondition = styled.div<{ $on: boolean }>`
  ${atoms("flex", "gap-2")}
  ${({ $on }) => $on && atoms("shadow-md", false, "rounded")}
  ${({ $on }) => ($on ? atoms("text-white") : css`color: black;`)}
`;

// conditions inside atoms(): any condition folds, the class name is a string
export const AtomsNestedCondition = styled.div<{ $on: boolean; $off: boolean }>`
  ${({ $on, $off }) =>
    $on &&
    atoms(
      "shadow-md",
      $off && "ring",
      "rounded",
      "p-2",
      $off ? "text-white" : "text-black",
      $off ? "border" : null,
      undefined,
      true === false && "never",
      isLarge && "large",
    )}
`;

const paddingSmall = css`padding: 1px;`;
const paddingLarge = css`padding: 2px;`;
const SIZES = { small: 16 };

// a condition inside a nested css literal, without an arrow of its own
export const NestedCondition = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on, $big }) =>
    $on &&
    css`
      color: red;
      ${$big &&
      css`
        font-size: 2em;
      `}
    `}
`;

// a nested value that picks between two css constants
export const NestedConstants = styled.div<{ $big: boolean }>`
  ${({ $big }) => css`
    ${$big ? paddingLarge : paddingSmall}
  `}
`;

// default values in the destructuring
export const DefaultCondition = styled.div<{ $align?: "start" | "end"; $on?: boolean }>`
  ${({ $align = "start" }) =>
    $align === "start" ? css`text-align: start;` : css`text-align: end;`}
  ${({ $on: on = true }) => on && css`color: red;`}
  ${({ $on }) => $on && css`color: blue;`}
`;

export const DefaultValue = styled.div<{ $size?: number; $width?: number }>`
  height: ${({ $size = 32 }) => $size}px;
  width: ${({ $size = SIZES.small, $width = $size }) => $width}px;
`;
