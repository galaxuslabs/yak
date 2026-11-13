import { libs, writeBenchmarkSource, type Lib } from "../_shared.ts";

// One workload per render path of the styled runtime: each case renders 1000
// elements of a single component kind, so a change to one path shows up in
// its own row instead of being averaged over a mixed tree.
//
// The components are declared in one module and rendered from another, and
// the bases of the `styled(styled)` chains live in a third one. Within a single
// module the compiler folds static usages and chains into plain elements
// (`foldStatic`), which would skip the runtime under test. Across modules they
// stay runtime components, like design-system components imported into a page.
const count = 1000;

const cases: Array<{ name: string; definition: string; element: string }> = [
  {
    name: "Static",
    definition: "styled.div`display: block;`",
    element: `<Static id={"a" + i} data-index={i} role="listitem">x</Static>`,
  },
  {
    name: "StaticClassName",
    definition: "styled.div`display: block;`",
    element: `<StaticClassName className="external" id={"a" + i}>x</StaticClassName>`,
  },
  {
    name: "StaticAttrs",
    definition: "styled.img.attrs({ loading: 'lazy', decoding: 'async' })`display: block;`",
    element: `<StaticAttrs src={"/img/" + i + ".jpg"} alt="" />`,
  },
  {
    name: "StaticCustom",
    definition: "styled(Custom)`display: block;`",
    element: `<StaticCustom id={"a" + i}>x</StaticCustom>`,
  },
  {
    name: "StaticChain",
    definition: "styled(StaticBase)`gap: 4px;`",
    element: `<StaticChain id={"a" + i}>x</StaticChain>`,
  },
  {
    name: "ClassToggle",
    definition:
      "styled.span`color: black; ${(p) => p.$active && css`color: red;`} ${(p) => p.$variant === 'a' ? css`font-weight: bold;` : css`font-style: italic;`}`",
    element: `<ClassToggle $active={i % 2 === 0} $variant={i % 3 ? "a" : "b"} data-index={i}>x</ClassToggle>`,
  },
  {
    name: "CssVariable",
    definition: "styled.div`width: ${(p) => p.$size}px;`",
    element: `<CssVariable $size={i % 100} data-index={i} />`,
  },
  {
    name: "Theme",
    definition: "styled.div`color: black; ${({ theme }) => theme.dark && css`color: white;`}`",
    element: `<Theme id={"a" + i}>x</Theme>`,
  },
  {
    name: "AttrsFunction",
    definition:
      "styled.input.attrs((p) => ({ type: 'text', 'aria-label': 'Input ' + p.$index }))`display: block;`",
    element: `<AttrsFunction $index={i} name="q" />`,
  },
  {
    name: "DynamicChain",
    definition: "styled(DynamicBase)`padding: 4px;`",
    element: `<DynamicChain $active={i % 3 === 0} type="button">x</DynamicChain>`,
  },
];

const suffix = (lib: Lib) => (lib === "yak" ? "Yak" : "Styled");

const imports = (lib: Lib) =>
  lib === "yak"
    ? "import { styled, css, YakThemeProvider as ThemeProvider } from '@yak/react';"
    : "import { styled, css, ThemeProvider } from 'styled-components';";

for (const lib of libs) {
  writeBenchmarkSource(
    "RuntimePathsBase",
    lib,
    `
${imports(lib)}

export const StaticBase = styled.div\`
  display: flex;
\`;

export const DynamicBase = styled.button<{ $active?: boolean }>\`
  color: black;
  \${(p) => p.$active && css\`color: red;\`}
\`;
`,
  );

  writeBenchmarkSource(
    "RuntimePathsComponents",
    lib,
    `
// @ts-nocheck
import React, { type ReactNode } from 'react';
${imports(lib)}
import { StaticBase, DynamicBase } from './RuntimePathsBase.${lib}';

const Custom = (props: { className?: string; children?: ReactNode }) => (
  <section className={props.className}>{props.children}</section>
);

${cases.map(({ name, definition }) => `export const ${name} = ${definition};`).join("\n")}
`,
  );

  writeBenchmarkSource(
    "RuntimePaths",
    lib,
    `
"use client";
// @ts-nocheck
import React, { type FunctionComponent } from 'react';
${imports(lib)}
import { ${cases.map(({ name }) => name).join(", ")} } from './RuntimePathsComponents.${lib}';

const indices = Array.from({ length: ${count} }, (_, i) => i);
const theme = { dark: true };

${cases
  .map(
    ({
      name,
      element,
    }) => `export const RuntimePath${name}${suffix(lib)}: FunctionComponent = () => (
  <ThemeProvider theme={theme}>
    <div>{indices.map((i) => <React.Fragment key={i}>${element}</React.Fragment>)}</div>
  </ThemeProvider>
);`,
  )
  .join("\n\n")}

// every path at once, for the demo viewer
export const RuntimePaths${suffix(lib)}: FunctionComponent = () => (
  <>
    ${cases.map(({ name }) => `<RuntimePath${name}${suffix(lib)} />`).join("\n    ")}
  </>
);
`,
  );
}
