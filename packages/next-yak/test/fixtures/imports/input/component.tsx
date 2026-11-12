/** @jsxImportSource next-yak */
import { styled, css } from "next-yak";
import type { YakTheme } from 'next-yak';
import { getYakThemeContext } from "next-yak/context/baseContext";
export { keyframes } from "next-yak";
export * from "next-yak/internal";
import styledComponents from "styled-components";

const lazy = () => import("next-yak/context");
const withYak = require("next-yak/withYak");
jest.mock("next-yak");
vi.mock("next-yak/context", () => ({}));

// package names in plain strings change too, other text stays
const packageName = "next-yak";
const other = "next-yak-ish";

declare module "next-yak" {
  export interface YakTheme {
    color: string;
  }
}

export const Button = styled.button`
  color: red;
`;
