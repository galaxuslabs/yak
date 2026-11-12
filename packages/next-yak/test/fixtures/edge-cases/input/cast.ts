import { css } from "next-yak";
const value = <number>input;
export const mixin = css`
  :global(.a) & {
    color: red;
  }
`;
