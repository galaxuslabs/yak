import { styled } from "@yak/react";

// A value with a unit always goes through `__yak_cssValue`, which throws for
// `undefined` in development. A value without a unit goes through it in
// development only: production assigns the value as it is.

// folded: `style["--x"] = ...` inside the folded function
export const WithUnit = styled.div<{ $w?: number }>`
  width: ${({ $w }) => $w}px;
`;

export const WithoutUnit = styled.div<{ $w?: number }>`
  width: ${({ $w }) => $w};
`;

export const WithoutUnitBlockBody = styled.div<{ $on?: boolean }>`
  z-index: ${({ $on }) => {
    if ($on) return 2;
  }};
`;

// unfolded: the function stays in the style object, because a `let`
// keeps the folder from turning the block body into one expression
export const UnfoldedWithUnit = styled.div<{ $w?: number }>`
  width: ${({ $w }) => {
    let w = $w;
    return w;
  }}px;
`;

export const UnfoldedWithoutUnit = styled.div<{ $w?: number }>`
  width: ${({ $w }) => {
    let w = $w;
    return w;
  }};
`;
