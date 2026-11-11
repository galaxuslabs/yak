import { styled } from "@yak/react";
const A = styled.div`
  .${lockClass} & {
    overflow: hidden;
  }
  html:has(&)::view-transition-old(${name}) {
    animation: none;
  }
`;
