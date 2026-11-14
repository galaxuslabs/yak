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

export const OrOperator = styled.div<{ $on: boolean }>`
  ${({ $on }) => !$on || css`color: red;`}
`;

// `OrOperator` above folds because `!$on` is a boolean; here the left side
// could be an object, whose class name the runtime would add
export const OrUnprovable = styled.div<{ $on: unknown }>`
  ${({ $on }) => $on || css`color: red;`}
`;

export const OrChainUnprovable = styled.div<{ $a: boolean; $b: unknown }>`
  ${({ $a, $b }) => !$a || $b || css`color: red;`}
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
