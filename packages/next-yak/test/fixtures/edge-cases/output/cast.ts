import { css } from "@yak/react";
const value = <number>input;
export const mixin = css`
  .a & {
    color: red;
  }
`;
