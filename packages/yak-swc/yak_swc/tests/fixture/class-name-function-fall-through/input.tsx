import { styled, css } from "@yak/react";
import { log } from "./helpers";

type Size = "s" | "m" | "l";
type Layout = { large?: { size: Size } };

// a path that leaves a guard block goes on with the next statement
export const GuardBlocks = styled.div<{ $layout: Layout; $n: number }>`
  ${({ $layout, $n }) => {
    const size = $layout.large?.size;
    if (size === "s") return css`padding: 1px;`;
    if (size === "l") {
      if ($n >= 12) return css`padding: 12px;`;
      if ($n >= 6) return css`padding: 6px;`;
    }
    if (size === "m") {
      if ($n >= 9) return css`padding: 9px;`;
    }
    return css`padding: 0;`;
  }}
`;

// `return;` and `return null;` end the function and add nothing
export const ReturnNothingInGuard = styled.div<{ $on: boolean; $big: boolean; $wide: boolean }>`
  ${({ $on, $big, $wide }) => {
    if ($on) {
      if ($big) return;
      if ($wide) return null;
    }
    if ($big) return css`color: red;`;
    return css`color: blue;`;
  }}
`;

export const IfElseWithOpenBranch = styled.div<{ $a: boolean; $b: boolean; $c: boolean }>`
  ${({ $a, $b, $c }) => {
    if ($a) {
      if ($b) return css`color: red;`;
    } else {
      return css`color: green;`;
    }
    if ($c) return css`color: blue;`;
    return css`color: black;`;
  }}
`;

export const PlainBlock = styled.div<{ $a: boolean; $b: boolean }>`
  ${({ $a, $b }) => {
    {
      if ($a) return css`color: red;`;
    }
    if ($b) return css`color: blue;`;
    return css`color: black;`;
  }}
`;

export const SwitchDefaultThenStatements = styled.div<{ $size: Size; $on: boolean }>`
  ${({ $size, $on }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        log($size);
        break;
    }
    if ($on) return css`padding: 4px;`;
    return css`padding: 8px;`;
  }}
`;

export const SwitchLastCaseThenStatements = styled.div<{ $size: Size; $on: boolean }>`
  ${({ $size, $on }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      case "m":
        if ($on) return css`padding: 4px;`;
    }
    if ($on) return css`padding: 6px;`;
    return css`padding: 8px;`;
  }}
`;

export const ThreeLevels = styled.div<{ $a: boolean; $b: boolean; $c: boolean; $d: boolean }>`
  ${({ $a, $b, $c, $d }) => {
    if ($a) {
      if ($b) {
        if ($c) return css`color: red;`;
        log($c);
      }
      if ($d) return css`color: green;`;
    }
    if ($c) return css`color: blue;`;
    return css`color: black;`;
  }}
`;

export const CallInGuard = styled.div<{ $on: boolean; $a: number; $b: boolean }>`
  ${({ $on, $a, $b }) => {
    if ($on) {
      log($a);
    }
    if ($b) return css`color: red;`;
    return css`color: blue;`;
  }}
`;

export const ConstInGuard = styled.div<{ $on: boolean; $layout: Layout }>`
  ${({ $on, $layout }) => {
    if ($on) {
      const size = $layout.large?.size;
      if (size === "s") return css`padding: 2px;`;
    }
    if (!$on) return css`padding: 4px;`;
    return css`padding: 8px;`;
  }}
`;

// the conditions of the returned values keep their parens next to `??`
export const ConditionalValues = styled.div<{ $a: boolean; $b: boolean; $c: boolean }>`
  ${({ $a, $b, $c }) => {
    if ($a) {
      if ($b) return $c && css`color: red;`;
      if ($c) return $b ? css`color: green;` : null;
    }
    if ($b) return $c || css`color: blue;`;
    return css`
      color: black;
      ${$c && css`font-weight: bold;`}
    `;
  }}
  ${({ $a, $b }) => {
    if ($a) {
      if ($b) return css`margin: 0;`;
    }
    if ($b) return css`margin: 2px;`;
    return css`margin: 4px;`;
  }}
`;

// a nested function has fall through markers of its own
export const NestedFunction = styled.div<{ $on: boolean; $size: Size; $n: number }>`
  ${({ $on, $size }) => {
    if ($on) {
      if ($size === "s")
        return css`
          color: red;
          ${({ $n }) => {
            if ($n > 2) {
              if ($n > 4) return css`padding: 4px;`;
            }
            if ($n > 1) return css`padding: 1px;`;
            return css`padding: 0;`;
          }}
        `;
    }
    if ($size === "m") return css`color: blue;`;
    return css`color: black;`;
  }}
`;

// a guard block at the end of the function adds nothing when no `return` runs
export const GuardBlockAtTheEnd = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on, $big }) => {
    if ($on) {
      if ($big) return css`color: red;`;
    }
  }}
`;

// stays unfolded: `return void 0;` is no value the fold knows
export const ReturnVoidZeroInGuard = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on, $big }) => {
    if ($on) {
      if ($big) return void 0;
    }
    if ($big) return css`color: red;`;
    return css`color: blue;`;
  }}
`;

// stays unfolded: a `??` that the user writes
export const UserNullish = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    if ($on) return css`color: red;` ?? css`color: blue;`;
    return css`color: black;`;
  }}
`;

// stays unfolded: a `break` inside an `if` of the last case
export const BreakInsideIf = styled.div<{ $size: Size; $on: boolean }>`
  ${({ $size, $on }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        if ($on) break;
        return css`padding: 4px;`;
    }
    if ($on) return css`padding: 6px;`;
    return css`padding: 8px;`;
  }}
`;
