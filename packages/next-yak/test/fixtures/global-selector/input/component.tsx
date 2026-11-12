import { styled, css as yakCss } from "next-yak";
import otherStyled from "styled-components";

export const Wrapper = styled.div`
  :global(.external-class) {
    color: red;
  }
  &:hover :global(.icon:not(.disabled)) {
    opacity: 0.5;
  }
  ${({ $active }) =>
    $active &&
    yakCss`
      :global(body.dark) & {
        color: white;
      }
    `}
`;

export const Extended = styled(Wrapper)`
  :global(#root) & {
    margin: 0;
  }
`;

export const WithAttrs = styled.input.attrs({ type: "text" })`
  :global(.form) & {
    width: 100%;
  }
`;

export const Inline = () => (
  <div
    css={yakCss`
      :global(.portal) & {
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
  html:has(&):global {
    --duration: 1s;
  }
  html:has(&):global(
      ::view-transition-group(root)
    ) {
    animation: none;
  }
  :global(.${lockClass}) &,
  :global(
      html:not(.safari:not(.ios))
    )
    & {
    overflow: hidden;
  }
`;
