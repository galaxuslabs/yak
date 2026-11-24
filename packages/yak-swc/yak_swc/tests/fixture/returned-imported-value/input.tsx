import { atoms, css, styled } from "@yak/react";
import { outlined, colors, spacing } from "./other";
import * as mixins from "./mixins";

const local = css`
  outline: 3px solid red;
`;

const getMixin = () => outlined;

// errors: an imported value that a function returns
const Imported = styled.div<{ $on?: boolean }>`
  ${(p) => p.$on && outlined}
`;

const Namespace = styled.div<{ $on?: boolean }>`
  ${(p) => (p.$on ? mixins.large : null)}
`;

const Block = styled.div<{ $on?: boolean }>`
  &:hover {
    ${(p) => {
      if (p.$on) {
        return outlined;
      }
      return null;
    }}
  }
`;

const Call = styled.div`
  ${() => getMixin()}
`;

const size = (big?: boolean) => (big ? local : null);

const Helper = styled.div<{ $big?: boolean }>`
  ${(p) => size(p.$big)};
`;

// allowed
const Wrapped = styled.div<{ $on?: boolean }>`
  ${(p) => p.$on && css`${outlined}`}
`;

const Local = styled.div<{ $on?: boolean }>`
  ${(p) => p.$on && local}
`;

const Atoms = styled.div<{ $on?: boolean }>`
  ${(p) => p.$on && atoms("shadow-md")}
`;

const PropertyValue = styled.div<{ $on?: boolean }>`
  color: ${(p) => (p.$on ? colors.primary : colors.secondary)};
  padding: ${(p) => p.$on && spacing}px;
`;

