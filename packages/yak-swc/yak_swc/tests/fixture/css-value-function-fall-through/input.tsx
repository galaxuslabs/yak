import { styled, css } from "@yak/react";
import { log, getWidth } from "./helpers";

type Size = "s" | "m" | "l";

// every `return` in the guard block returns a number, which is never
// `null` or `undefined`, so `??` goes on after the block only for its end
export const NumberReturns = styled.div<{ $on: boolean; $big: boolean; $wide: boolean }>`
  width: ${({ $on, $big, $wide }) => {
    if ($on) {
      if ($big) return 1;
    }
    if ($wide) return 3;
    return 2;
  }}px;
`;

// a nested ternary of literals, a template literal, a calculation, `||` and
// `??` with a number on the right side
export const NeverNullishShapes = styled.div<{ $a: boolean; $b: boolean; $n: number }>`
  width: ${({ $a, $b, $n }) => {
    if ($a) {
      if ($b) return $n > 2 ? ($n > 4 ? 4 : 2) : 1;
      if ($n > 8) return `${$n}px`;
      if ($n > 6) return $n * 2;
      if ($n > 4) return $n || 4;
      if ($n > 3) return $n ?? 3;
    }
    if ($b) return $n;
    return 0;
  }};
`;

// the last case of a `switch` ends without `return`
export const SwitchLastCaseThenStatements = styled.div<{ $size: Size; $on: boolean }>`
  width: ${({ $size, $on }) => {
    switch ($size) {
      case "s":
        return 2;
      default:
        log($size);
    }
    if ($on) return 4;
    return 8;
  }}px;
`;

// `$width` can be `undefined`, so its `return` gets a wrapper and `??` never
// goes on after the block for it
export const ReadReturn = styled.div<{ $on: boolean; $big: boolean; $width?: number }>`
  width: ${({ $on, $big, $width }) => {
    if ($on) {
      if ($big) return $width;
    }
    if ($big) return 4;
    return 8;
  }}px;
`;

// `$a && 1` returns `$a` when it is falsy, e.g. `null`, so it gets a wrapper
export const AndReturn = styled.div<{ $on: boolean; $a: number | null }>`
  width: ${({ $on, $a }) => {
    if ($on) {
      if ($a) return $a && 1;
    }
    if ($a) return 4;
    return 8;
  }}px;
`;

// a call can return anything, so it gets a wrapper, also in a nested `switch`
export const CallReturnInSwitch = styled.div<{ $on: boolean; $size: Size }>`
  width: ${({ $on, $size }) => {
    if ($on) {
      switch ($size) {
        case "s":
          return getWidth($size);
        case "m":
          return 2;
      }
    }
    if ($size === "l") return 4;
    return 8;
  }}px;
`;

// `return;` is `undefined` and gets a wrapper
export const EmptyReturn = styled.div<{ $on: boolean; $big: boolean }>`
  width: ${({ $on, $big }) => {
    if ($on) {
      if ($big) return;
    }
    if ($big) return 4;
    return 8;
  }}px;
`;

// a `null` in the `else` of the branch gets a wrapper
export const NullInElse = styled.div<{ $on: boolean; $big: boolean }>`
  width: ${({ $on, $big }) => {
    if ($on) {
      if ($big) return 2;
    } else {
      return null;
    }
    if ($big) return 4;
    return 8;
  }}px;
`;

// a CSS value folds into the same function as the class names next to it
export const NextToClassNames = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on }) => $on && css`color: red;`}
  height: ${({ $on, $big }) => {
    if ($on) {
      if ($big) return 10;
    }
    log($big);
    return 20;
  }}px;
`;

// a value without a unit gets the same wrapper
export const ReadReturnWithoutUnit = styled.div<{ $on: boolean; $big: boolean; $width?: number }>`
  width: ${({ $on, $big, $width }) => {
    if ($on) {
      if ($big) return $width;
      if ($width) return 1;
    }
    if ($big) return 2;
    return 3;
  }};
`;

// a call without a unit, and a call after the block that runs only when the
// block ends without `return`
export const CallReturnWithoutUnit = styled.div<{ $on: boolean; $size: Size }>`
  width: ${({ $on, $size }) => {
    if ($on) {
      if ($size === "s") return getWidth($size);
    }
    log($size);
    return 8;
  }};
`;
