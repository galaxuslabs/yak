import { styled } from "@yak/react";

// The first value without a unit gets a wrapper before the second one stops
// the fold. The output keeps the unfolded runtime and imports no
// `__yak_cssValue`.
export const Box = styled.div<{ $color?: string; $w?: number }>`
  color: ${({ $color }) => $color};
  width: ${({ $w }) => {
    let w = $w;
    return w;
  }};
`;
