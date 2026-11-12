import { styled } from "@yak/react";

// next-yak hoists nested media queries, see https://github.com/jantimon/next-yak/issues/1
export const message = "Use next-yak components for styling.";
export const template = `import { styled } from "next-yak";`;
export const Title = () => <h1>Styled with next-yak and yak-swc</h1>;
export const pattern = /node_modules\/(?!next-yak)/;
const branch = "experimental-next-yak-9.5.0-tgz";
