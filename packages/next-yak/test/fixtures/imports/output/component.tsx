/** @jsxImportSource @yak/react */
import { styled, css } from "@yak/react";
import type { YakTheme } from '@yak/react';
import { getYakThemeContext } from "@yak/react/context/baseContext";
export { keyframes } from "@yak/react";
export * from "@yak/react/internal";
import styledComponents from "styled-components";

const lazy = () => import("@yak/react/context");
const withYak = require("@yak/react/withYak");
jest.mock("@yak/react");
vi.mock("@yak/react/context", () => ({}));

// package names in plain strings change too, other text stays
const packageName = "@yak/react";
const other = "next-yak-ish";

declare module "@yak/react" {
  export interface YakTheme {
    color: string;
  }
}

export const Button = styled.button`
  color: red;
`;
