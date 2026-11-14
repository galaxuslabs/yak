import { styled, css, atoms } from "@yak/react";
import { mixin, calc } from "./helpers";

export const Rest = styled.div<{ $on: boolean }>`
  ${({ $on, ...rest }) => $on && css`color: red;`}
`;

export const Default = styled.div<{ $on?: boolean }>`
  ${({ $on = true }) => $on && css`color: red;`}
`;

export const Computed = styled.div<{ $on: boolean }>`
  ${(p) => p["$on"] && css`color: red;`}
`;

export const Escaping = styled.div<{ $on: boolean }>`
  ${(p) => calc(p) && css`color: red;`}
`;

export const MultiStatement = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    const on = !!$on;
    return on && css`color: red;`;
  }}
`;

export const FunctionExpression = styled.div<{ $on: boolean }>`
  ${function ({ $on }) {
    return $on && css`color: red;`;
  }}
`;

export const MixinReturn = styled.div<{ $on: boolean }>`
  ${({ $on }) => $on && mixin}
`;

export const AtomsReturn = styled.div<{ $on: boolean }>`
  ${({ $on }) => $on && atoms("flex")}
`;

// the runtime evaluates a value inside a nested css once per render and
// calls the result with the props if it is a function
export const NestedHelperValue = styled.div<{ $on: boolean }>`
  ${({ $on }) =>
    $on &&
    css`
      color: ${calc("primary")};
    `}
`;

export const ValueReturnsFunction = styled.div<{ $x: number }>`
  left: ${({ $x }) => () => $x}px;
`;

export const StyleReadInValue = styled.div`
  left: ${({ style }) => style.left}px;
`;

export const NullishOperator = styled.div<{ $on?: boolean }>`
  ${({ $on }) => $on ?? css`color: red;`}
`;

export const StyleRead = styled.div`
  ${({ style }) => style && css`color: red;`}
`;

export const MixinInterpolation = styled.div`
  ${mixin}
`;

// a statement next to the `if` and `return` has no place in an expression
export const BlockWithLog = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    console.log($on);
    if ($on) {
      return css`color: red;`;
    }
  }}
`;

export const BlockWithDebugger = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    if ($on) {
      debugger;
      return css`color: red;`;
    }
  }}
`;

// the expression would hold the statements after the first `if` twice
export const IfWithoutReturnThenStatements = styled.div<{ $on: boolean; $big: boolean }>`
  ${({ $on, $big }) => {
    if ($on) {
      if ($big) return css`color: red;`;
    }
    if ($big) return css`color: green;`;
    return css`color: blue;`;
  }}
`;

// the expression would call the helper once per case
export const SwitchOnCall = styled.div<{ $on: boolean }>`
  ${({ $on }) => {
    switch (String($on)) {
      case "true":
        return css`color: red;`;
    }
  }}
`;

export const SwitchWithBreak = styled.div<{ $size: "s" | "m" }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        break;
      case "m":
        return css`color: red;`;
    }
    return css`color: blue;`;
  }}
`;

export const SwitchFallThrough = styled.div<{ $size: "s" | "m"; $on: boolean }>`
  ${({ $size, $on }) => {
    switch ($size) {
      case "s":
        if ($on) return css`color: red;`;
      case "m":
        return css`color: blue;`;
    }
  }}
`;

export const SwitchDefaultFirst = styled.div<{ $size: "s" | "m" }>`
  ${({ $size }) => {
    switch ($size) {
      default:
        return css`color: red;`;
      case "m":
        return css`color: blue;`;
    }
  }}
`;

// a function declaration after a return still exists in the whole body
export const FunctionAfterReturn = styled.div<{ $size: number }>`
  ${({ $size }) => {
    if (isBig($size)) return css`padding: 8px;`;
    return null;
    function isBig(size: number) {
      return size > 2;
    }
  }}
`;

export const FunctionAfterReturnedValue = styled.div<{ $x: number }>`
  left: ${({ $x }) => {
    return toPx($x);
    function toPx(value: number) {
      return value * 2;
    }
  }}px;
`;

export const FunctionAfterIfElse = styled.div<{ $size: number }>`
  ${({ $size }) => {
    if (isBig($size)) return css`padding: 8px;`;
    else return null;
    function isBig(size: number) {
      return size > 2;
    }
  }}
`;

export const FunctionAfterSwitchDefault = styled.div<{ $size: number }>`
  ${({ $size }) => {
    switch ($size) {
      case 1:
        return css`padding: 8px;`;
      default:
        return isBig($size) ? css`padding: 16px;` : null;
    }
    function isBig(size: number) {
      return size > 2;
    }
  }}
`;
