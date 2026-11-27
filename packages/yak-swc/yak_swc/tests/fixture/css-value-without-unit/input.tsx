import { styled, css } from "@yak/react";

// The folded function turns a value without a unit into text like the
// unfolded runtime does: `` `${$color}` `` with `minify` and
// `__yak_cssValue($color, "")` without it. A value with a unit or a minus
// keeps the `__yak_cssValue` call it has.
export const WithoutUnit = styled.div<{ $color?: string }>`
  color: ${({ $color }) => $color};
`;

export const WithoutUnitBlockBody = styled.div<{ $on?: boolean }>`
  z-index: ${({ $on }) => {
    if ($on) return 2;
  }};
`;

// a value in a nested `css` literal
export const NestedWithoutUnit = styled.div<{ $on?: boolean; $color?: string }>`
  ${({ $on, $color }) =>
    $on &&
    css`
      color: ${() => $color};
    `}
`;

export const WithUnit = styled.div<{ $w?: number }>`
  width: ${({ $w }) => $w}px;
`;

export const MinusWithoutUnit = styled.div<{ $z?: number }>`
  z-index: -${({ $z }) => $z};
`;

// stays unfolded: a `let` keeps the folder from turning the block body into
// one expression, so the runtime writes `String(value)`
export const Unfolded = styled.div<{ $w?: number }>`
  width: ${({ $w }) => {
    let w = $w;
    return w;
  }};
`;
