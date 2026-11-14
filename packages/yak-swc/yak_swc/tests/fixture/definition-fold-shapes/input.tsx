import { styled, css } from "@yak/react";
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
