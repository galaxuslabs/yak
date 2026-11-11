import { styled, css as yakCss } from "@yak/react";
import otherStyled from "styled-components";

export const Wrapper = styled.div`
  .external-class {
    color: red;
  }
  &:hover .icon:not(.disabled) {
    opacity: 0.5;
  }
  ${({ $active }) =>
    $active &&
    yakCss`
      body.dark & {
        color: white;
      }
    `}
`;

export const Extended = styled(Wrapper)`
  #root & {
    margin: 0;
  }
`;

export const WithAttrs = styled.input.attrs({ type: "text" })`
  .form & {
    width: 100%;
  }
`;

export const Inline = () => (
  <div
    css={yakCss`
      .portal & {
        z-index: 10;
      }
    `}
  />
);

// templates from other libraries stay as they are
export const Other = otherStyled.div`
  :global(.keep-me) {
    color: blue;
  }
`;
const query = sql`SELECT ':global(x)'`;

export const Transition = styled.main`
  html:has(&) {
    --duration: 1s;
  }
  html:has(&)::view-transition-group(root) {
    animation: none;
  }
  .${lockClass} &,
  html:not(.safari:not(.ios))
    & {
    overflow: hidden;
  }
`;
