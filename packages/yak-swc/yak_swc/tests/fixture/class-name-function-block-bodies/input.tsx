import { styled, css } from "@yak/react";

export const IfReturn = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    if ($on) {
      return css`color: red;`;
    }
  }}
`;

export const IfElse = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    if ($on) {
      return css`color: red;`;
    } else {
      return css`color: blue;`;
    }
  }}
`;

export const EarlyReturns = styled.div<{ $size: "s" | "m" | "l" }>`
  ${({ $size }) => {
    if ($size === "s") return css`padding: 1px;`;
    if ($size === "m") return css`padding: 2px;`;
    return css`padding: 3px;`;
  }}
`;

export const NestedIf = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on, $big }) => {
    if ($on) {
      if ($big) {
        return css`color: red;`;
      }
      return css`color: blue;`;
    }
    return null;
  }}
`;

export const Switch = styled.div<{ $variant: "primary" | "danger" | "ghost" }>`
  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return css`color: blue;`;
      case "danger":
        return css`color: red;`;
      default:
        return css`color: gray;`;
    }
  }}
`;

export const SwitchGroupedLabels = styled.div<{ $size: "s" | "m" | "l" }>`
  ${(props) => {
    switch (props.$size) {
      case "s":
      case "m": {
        return css`padding: 1px;`;
      }
      case "l":
        return css`padding: 2px;`;
    }
  }}
`;

export const SwitchThenReturn = styled.div<{ $level: 1 | 2 | 3 }>`
  ${({ $level }) => {
    switch ($level) {
      case 1:
        return css`opacity: 0.5;`;
    }
    return css`opacity: 1;`;
  }}
`;

export const ValueWithIf = styled.div<{ $x?: number }>`
  left: ${({ $x }) => {
    if ($x === undefined) {
      return 0;
    }
    return $x;
  }}px;
`;

export const NestedCssWithIf = styled.div<{ $on: boolean; $color?: string }>`
  ${({ $on, $color }) => {
    if ($on) {
      return css`
        color: ${() => {
          if ($color) return $color;
          return "red";
        }};
      `;
    }
  }}
`;

// the path with `$on` and without `$big` continues with the last `return`
export const IfWithoutReturnThenReturn = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on, $big }) => {
    if ($on) {
      if ($big) return css`color: red;`;
    }
    return css`color: blue;`;
  }}
`;

export const IfElseWithoutReturnThenReturn = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on, $big }) => {
    if ($on) {
      if ($big) return css`color: red;`;
    } else {
      return css`color: green;`;
    }
    return css`color: blue;`;
  }}
`;

enum Animation {
  In = "in",
  Out = "out",
  None = "none",
}
const LARGE = "l";

// enum members and constants as case values
export const SwitchEnum = styled.div<{ $animation: Animation }>`
  ${({ $animation }) => {
    switch ($animation) {
      case Animation.In:
        return css`opacity: 1;`;
      case Animation.Out:
        return css`opacity: 0;`;
      case Animation.None:
      default:
        return;
    }
  }}
`;

export const SwitchConstant = styled.div<{ $size: string; $other: string }>`
  ${({ $size, $other }) => {
    switch ($size) {
      case LARGE:
        return css`padding: 8px;`;
      case $other:
        return css`padding: 4px;`;
    }
  }}
`;
