/**
 * Preset dictionary 1 for playground share links (`?q=1…`).
 *
 * Deflate can copy any run of bytes from a preset dictionary, so a link
 * only has to store what differs from this text. `../compress.test.ts` checks
 * that the unchanged default example encodes to fewer than 50 chars.
 *
 * This file is frozen: changing a single byte breaks every `?q=1…` link,
 * and `dict-1.fixtures.json` holds links that the tests decode to catch it.
 * When the playground examples change, copy this file to the next id,
 * update `exampleFiles`, register it in `../compress.ts` and point
 * `CURRENT_ID` there at the new id.
 *
 * Image paths in `exampleFiles` have no base path: `asset("/img/x.png")`
 * in examples.ts is `/img/x.png` on yak.js.org and `/yak/img/x.png` on a
 * github.io preview, where links come out a few chars longer.
 */

/**
 * Strings that show up in most playground code.
 * They come first because deflate stores near matches with fewer bits
 * than far ones, and the example files below are the most likely matches.
 */
const snippets = [
  `import { styled, css } from "@yak/react";`,
  `import { styled } from "@yak/react";`,
  `import { css } from "@yak/react";`,
  `import { styled, css } from "@yak/solid";`,
  `import { styled } from "@yak/solid";`,
  `import { createSignal } from "solid-js";`,
  `import { useState } from "react";`,
  ` from "react";`,
  `export default function App() {`,
  `export default `,
  `export const `,
  "css={css`",
  " = styled.",
  " = styled(",
  "div`\n",
  "button`\n",
  "display: grid;",
  "display: flex;",
  "display: block;",
  "display: inline-block;",
  "display: none;",
  "@supports (",
  "@media (",
  "@container (",
  "&:hover {",
  "&::before {",
  'content: "";',
  "background-color: ",
  "background: ",
  "color: ",
  "transparent",
  "-webkit-",
  "linear-gradient(",
  "border: 1px solid ",
  "transform: ",
  "translate",
  "padding: ",
  "margin: ",
  "text-align: center;",
  "font-size: ",
  "font-weight: ",
  "border-radius: ",
  "position: absolute;",
  "position: relative;",
  "transition: ",
  "cursor: pointer;",
  "animation: ",
  "const ",
  "\n  return ",
  " }) =>",
  "useEffect",
  "useState",
  "useRef",
  "useCallback",
  "useMemo",
];

/**
 * The files of the playground example in each framework that `?q=1…` links
 * compress against, keyed by file name without extension.
 * The default framework comes last.
 */
export const exampleFiles: Record<string, string>[] = [
  // solid
  {
    index: `import { styled, css } from "@yak/solid";
import { createSignal } from "solid-js";
import { Title } from "./title";
import { yakWidth } from "./sizes.yak";

export default function App() {
  const [small, setSmall] = createSignal(false);

  return (
    <Center>
      <Yak
        $small={small()}
        onClick={() => setSmall(!small())}
        src="/img/yak-jumping.png"
        alt="The yak mascot. Click it!"
      />
      <Title>yak</Title>
    </Center>
  );
}

const Center = styled.div\`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 32px;
  min-height: 100%;
\`;

const Yak = styled.img<{ $small?: boolean }>\`
  width: \${yakWidth.big};
  cursor: pointer;
  transition: width 0.3s, transform 0.2s;

  &:hover {
    transform: translateY(-8px) rotate(-4deg);
  }

  \${(props) =>
    props.$small &&
    css\`
      width: \${yakWidth.small};
    \`}
\`;
`,
    title: `import { styled } from "@yak/solid";

export const Title = styled.h1\`
  margin: 0;
  font: 800 4.5rem/1.15 system-ui, sans-serif;
  background: linear-gradient(45deg, #d1c170, #ed8080);
  background-clip: text;
  color: transparent;
\`;
`,
    "sizes.yak": `const base = 230;

export const yakWidth = {
  big: \`\${base}px\`,
  small: \`\${Math.round(base * 0.65)}px\`,
};
`,
  },
  // react
  {
    index: `import { styled, css } from "@yak/react";
import { useState } from "react";
import { Title } from "./title";
import { yakWidth } from "./sizes.yak";

export default function App() {
  const [small, setSmall] = useState(false);

  return (
    <Center>
      <Yak
        $small={small}
        onClick={() => setSmall(!small)}
        src="/img/yak-jumping.png"
        alt="The yak mascot. Click it!"
      />
      <Title>yak</Title>
    </Center>
  );
}

const Center = styled.div\`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 32px;
  min-height: 100%;
\`;

const Yak = styled.img<{ $small?: boolean }>\`
  width: \${yakWidth.big};
  cursor: pointer;
  transition: width 0.3s, transform 0.2s;

  &:hover {
    transform: translateY(-8px) rotate(-4deg);
  }

  \${({ $small }) =>
    $small &&
    css\`
      width: \${yakWidth.small};
    \`}
\`;
`,
    title: `import { styled } from "@yak/react";

export const Title = styled.h1\`
  margin: 0;
  font: 800 4.5rem/1.15 system-ui, sans-serif;
  background: linear-gradient(45deg, #d1c170, #ed8080);
  background-clip: text;
  color: transparent;
\`;
`,
    "sizes.yak": `const base = 230;

export const yakWidth = {
  big: \`\${base}px\`,
  small: \`\${Math.round(base * 0.65)}px\`,
};
`,
  },
];

/**
 * The dictionary text: the snippets, then each file as `name\0content`.
 * `\0` is the same separator that the link payload uses.
 */
export const dictionary = [
  ...snippets,
  ...exampleFiles.flatMap((files) => Object.entries(files).flat()),
].join("\0");
