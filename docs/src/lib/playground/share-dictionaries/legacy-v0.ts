import { decompressSync, strFromU8 } from "fflate";
import { toUint8Array } from "js-base64";

/**
 * Decoder for share links made before the preset dictionaries in `../compress.ts`.
 *
 * These links are base64 gzip, so they always start with `H4sI`. Inside the
 * gzip, each known string below is a 2-byte token: `\x00` plus a letter.
 * Decoding swaps every token back for its string:
 * `\x00e` -> `import { styled, css } from "next-yak";`
 *
 * This file is frozen: changing any string changes how existing links decode.
 */

const LEGACY_VERSION = "0";

const toToken = (n: number) => "\x00" + String.fromCharCode(97 + n);

const dictionary = [
  // Common Imports (next-yak and react)
  `import { styled, css } from "next-yak";`,
  `import { styled } from "next-yak";`,
  `import { css } from "next-yak";`,
  `} from "next-yak";`,
  " from 'react';",
  // Imports
  `import { `,
  `import `,
  ` } from "`,
  // Exports
  `export default `,
  `export const `,
  // Next-yak
  "css={css`",
  ` = styled.`,
  ` = styled(`,
  "div`\n",
  "button`\n",
  // CSS
  "background",
  "height:",
  "width:",
  "display: grid",
  "display: flex",
  "display: block",
  "display: inline-block",
  "display: none",
  "@supports (",
  "@media",
  "@container",
  "&::before {",
  'content: ""',
  "color",
  "transparent",
  "-webkit-",
  "linear-gradient(",
  "gradient(",
  "border:",
  "transform:",
  "translate",
  "padding",
  "text-align:",
  "font-size:",
  "font-weight:",
  "border-radius:",
  "position:",
  "transition:",
  "cursor: pointer",
  "animation:",
  // JS
  "function ",
  "\n  return ",
  "return ",
  "const ",
  " }) =>",
  // React
  "useEffect",
  "useState",
  "useRef",
  "useCallback",
  "useMemo",
  // Demo Constants
  "Component()",
  "different.yak",
  "other",
  "index",
  "/img/yak-jumping.png",
  // The default example as it was when this format was frozen
  `const Center = styled.div\`
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
`,
  `import { styled } from "next-yak";

export const theme = {
  dark: "html.dark &",
  light: "html.light &",
};

export const Title = styled.h1\`
  font-size: 5rem;
  font-weight: 400;
  text-align: center;
  text-box-trim: trim-both;
  text-box-edge: cap alphabetic;

  background: #000;
  background: radial-gradient(
    circle farthest-corner at top left,
    #000 0%,
    #333 100%
  );
  -webkit-text-fill-color: transparent;

  @supports (-webkit-text-stroke: red 1px) {
    transform: translateY(-4px);
    padding: 4px 0;
    \${theme.dark} {
      background: linear-gradient(45deg, #d1c170, #ed8080, #d1c170) -100%/ 200%;
      -webkit-background-clip: text;
      background-clip: text;
    }
    background: linear-gradient(45deg, #d1c170, #ed8080, #d1c170) -100%/ 200%;
    -webkit-text-fill-color: initial;
    -webkit-text-stroke: 4px transparent;
    -webkit-background-clip: text;
    background-clip: text;
    color: var(--color-fd-background);
    letter-spacing: 0.02em;
  }

  background-clip: text;
  -webkit-background-clip: text;
\`;`,
  `const green = "00ff00";
export const myColor = \`#\${ green }\`;`,
]
  // The token for a string is its index after this sort, longest first
  // The sort must stay the same or every token points to a different string
  .sort((a, b) => b.length - a.length);

// Token 0 separates the version, file names and file contents
const DELIMITER = toToken(0);
dictionary.unshift(DELIMITER);

/** Decodes a `H4sI…` link into its files, keyed by file name without extension */
export const decodeLegacyLink = (q: string): Record<string, string> => {
  let decompressed = strFromU8(decompressSync(toUint8Array(q)));
  dictionary.forEach((token, index) => {
    decompressed = decompressed.replaceAll(toToken(index), token);
  });
  const [version, ...parts] = decompressed.split(DELIMITER);
  if (version !== LEGACY_VERSION) {
    throw new Error(`Unsupported legacy link version: ${version}`);
  }
  const files: Record<string, string> = {};
  for (let i = 0; i < parts.length; i += 2) {
    files[parts[i]] = parts[i + 1];
  }
  return files;
};
