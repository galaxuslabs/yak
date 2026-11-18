// The compiler folds a styled component that is declared and rendered in one module
// into a plain element. These cases keep the runtime in the render path, so a change
// to the runtime shows up.
export const RUNTIME_PATHS: Array<[label: string, name: string]> = [
  ["Static", "Static"],
  ["Static with className", "StaticClassName"],
  ["Static .attrs({...})", "StaticAttrs"],
  ["Static styled(Custom)", "StaticCustom"],
  ["Static styled(styled)", "StaticChain"],
  ["Class toggles", "ClassToggle"],
  ["CSS variable", "CssVariable"],
  ["Theme function", "Theme"],
  [".attrs(fn)", "AttrsFunction"],
  ["Dynamic styled(styled)", "DynamicChain"],
];

// `source` is relative to the directory of this file
export const ROWS: Array<{ label: string; source: string; styled: string; yak: string }> = [
  {
    label: "Kanji letter",
    source: "kanji-letter/gen.ts",
    styled: "render KanjiLetterComponentStyled",
    yak: "render KanjiLetterComponentYak",
  },
  {
    label: "Pure component",
    source: "pure-components/gen.ts",
    styled: "render PureComponentsStyled",
    yak: "render PureComponentsYak",
  },
  {
    label: "Attrs",
    source: "attrs-components/gen.ts",
    styled: "render AttrsComponentsStyled",
    yak: "render AttrsComponentsYak",
  },
  {
    label: "CSS prop",
    source: "css-prop/gen.ts",
    styled: "render CssPropComponentsStyled",
    yak: "render CssPropComponentsYak",
  },
  {
    label: "Dynamic props",
    source: "dynamic-props/gen.ts",
    styled: "render DynamicPropsComponentsStyled",
    yak: "render DynamicPropsComponentsYak",
  },
  {
    label: "Dynamic props (idiomatic)",
    source: "idiomatic-dynamic-props/gen.ts",
    styled: "render IdiomaticDynamicPropsStyled",
    yak: "render IdiomaticDynamicPropsYak",
  },
  {
    label: "Nested components",
    source: "nested-components/gen.ts",
    styled: "render NestedComponentsStyled",
    yak: "render NestedComponentsYak",
  },
  { label: "Tree", source: "tree/gen.ts", styled: "render TreeStyled", yak: "render TreeYak" },
  {
    label: "Tree (idiomatic)",
    source: "idiomatic-tree/gen.ts",
    styled: "render IdiomaticTreeStyled",
    yak: "render IdiomaticTreeYak",
  },
  {
    label: "Tree deep",
    source: "tree-deep/gen.ts",
    styled: "render TreeDeepStyled",
    yak: "render TreeDeepYak",
  },
  {
    label: "Tree wide",
    source: "tree-wide/gen.ts",
    styled: "render TreeWideStyled",
    yak: "render TreeWideYak",
  },
  {
    label: "Sierpinski",
    source: "sierpinski/gen.ts",
    styled: "render SierpinskiStyled",
    yak: "render SierpinskiYak",
  },
  {
    label: "Cross request cache",
    source: "cross-request-cache/gen.ts",
    styled: "render CrossRequestCacheStyled",
    yak: "render CrossRequestCacheYak",
  },
  {
    label: "SSR extraction",
    source: "index.bench.tsx",
    styled: "render SsrExtractionStyled",
    yak: "render SsrExtractionYak",
  },
  ...RUNTIME_PATHS.map(([label, name]) => ({
    label: `Runtime path: ${label}`,
    source: "runtime-paths/gen.ts",
    styled: `render RuntimePath${name}Styled`,
    yak: `render RuntimePath${name}Yak`,
  })),
];
