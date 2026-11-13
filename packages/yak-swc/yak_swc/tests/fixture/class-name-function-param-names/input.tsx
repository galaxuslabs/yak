import { css, styled } from "@yak/react";

const $size = 4;
const items = [1, 2, 3];

// every spelling of one prop shares one parameter with the name of the prop
export const SharedName = styled.div`
  ${({ $on }) => $on && css`color: red;`}
  ${({ $on: on }) => on && css`color: blue;`}
  ${(p) => p.$on && css`color: green;`}
`;

// the second expression reads the constant `$size` of the module,
// so the parameter for the prop keeps its prefix
export const ModuleConstant = styled.div`
  ${({ $size }) => $size > 2 && css`padding: 8px;`}
  ${(p) => p.$on && $size > 2 && css`margin: 8px;`}
`;

// `Math` is a global, so the parameter for the prop keeps its prefix
export const Global = styled.div`
  ${(p) => p.Math && Math.max(p.$a, 2) > 2 && css`color: red;`}
`;

// the callback has its own `$on`, which would hide a parameter of that name
export const InnerBinding = styled.div`
  ${(p) => items.some(($on) => $on > 2 && p.$on) && css`color: red;`}
`;

// `class` is a reserved word and can not be a parameter name
export const ReservedWord = styled.div`
  ${(p) => p.class && css`color: red;`}
  ${({ default: d }) => d && css`color: blue;`}
`;

// a property name is no identifier, so the parameter can be `$on`
export const PropertyName = styled.div`
  ${(p) => p.$on && items.$on !== 0 && css`color: red;`}
`;

// `class` is a reserved word, so its parameter is `__yak_class`. A prop with
// that very name is next to it, and the hygiene pass of SWC renames one
export const ReservedClash = styled.div`
  ${(p) => p.class && css`color: red;`}
  ${(p) => p.__yak_class && css`color: blue;`}
`;
