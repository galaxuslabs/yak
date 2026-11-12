import { styled } from "@yak/react";

// @yak/react hoists nested media queries, see https://github.com/jantimon/next-yak/issues/1
export const message = "Use @yak/react components for styling.";
export const template = `import { styled } from "@yak/react";`;
export const Title = () => <h1>Styled with @yak/react and @yak/swc</h1>;
export const pattern = /node_modules\/(?!next-yak)/;
const branch = "experimental-next-yak-9.5.0-tgz";
