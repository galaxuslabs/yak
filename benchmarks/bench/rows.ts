// One row per render path of the yak styled runtime (see bench/runtime-paths).
// The other workloads mostly declare and render their components in one
// module, where the compiler folds them into plain elements, so without these
// rows a change to the runtime would barely show up
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

// Each row pairs the styled-components and yak variants of one workload.
// Order here is the order rendered in the output table.
export const ROWS: Array<{ label: string; styled: string; yak: string }> = [
  {
    label: "Kanji letter",
    styled: "render KanjiLetterComponentStyled",
    yak: "render KanjiLetterComponentYak",
  },
  {
    label: "Pure component",
    styled: "render PureComponentsStyled",
    yak: "render PureComponentsYak",
  },
  {
    label: "Attrs",
    styled: "render AttrsComponentsStyled",
    yak: "render AttrsComponentsYak",
  },
  {
    label: "CSS prop",
    styled: "render CssPropComponentsStyled",
    yak: "render CssPropComponentsYak",
  },
  {
    label: "Dynamic props",
    styled: "render DynamicPropsComponentsStyled",
    yak: "render DynamicPropsComponentsYak",
  },
  {
    label: "Dynamic props (idiomatic)",
    styled: "render IdiomaticDynamicPropsStyled",
    yak: "render IdiomaticDynamicPropsYak",
  },
  {
    label: "Nested components",
    styled: "render NestedComponentsStyled",
    yak: "render NestedComponentsYak",
  },
  { label: "Tree", styled: "render TreeStyled", yak: "render TreeYak" },
  {
    label: "Tree (idiomatic)",
    styled: "render IdiomaticTreeStyled",
    yak: "render IdiomaticTreeYak",
  },
  {
    label: "Tree deep",
    styled: "render TreeDeepStyled",
    yak: "render TreeDeepYak",
  },
  {
    label: "Tree wide",
    styled: "render TreeWideStyled",
    yak: "render TreeWideYak",
  },
  {
    label: "Sierpinski",
    styled: "render SierpinskiStyled",
    yak: "render SierpinskiYak",
  },
  {
    label: "Cross request cache",
    styled: "render CrossRequestCacheStyled",
    yak: "render CrossRequestCacheYak",
  },
  {
    label: "SSR extraction",
    styled: "render SsrExtractionStyled",
    yak: "render SsrExtractionYak",
  },
  ...RUNTIME_PATHS.map(([label, name]) => ({
    label: `Runtime path: ${label}`,
    styled: `render RuntimePath${name}Styled`,
    yak: `render RuntimePath${name}Yak`,
  })),
];
