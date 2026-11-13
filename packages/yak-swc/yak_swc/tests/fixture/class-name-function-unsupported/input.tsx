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

export const CssVariable = styled.div<{ $x: number }>`
  ${({ $x }) => $x > 1 && css`color: red;`}
  left: ${({ $x }) => $x}px;
`;

export const OrOperator = styled.div<{ $on: boolean }>`
  ${({ $on }) => !$on || css`color: red;`}
`;

export const StyleRead = styled.div`
  ${({ style }) => style && css`color: red;`}
`;

export const MixinInterpolation = styled.div`
  ${mixin}
`;
