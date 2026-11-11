import { styled } from "next-yak";
const A = styled.div`
  :global(.${lockClass}) & {
    overflow: hidden;
  }
  html:has(&):global(::view-transition-old(${name})) {
    animation: none;
  }
`;
