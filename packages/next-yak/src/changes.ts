/** the types of change in the summary of a run, in the order of the summary */
export const CHANGE = {
  packageName: "package names in imports, mocks and configs",
  dependency: "dependencies and catalogs",
  options: "options of withYak, viteYak, pluginYak and the yak-swc plugin",
  lint: "lint rules and lint plugin names",
  globalSelector: ":global() selectors in yak styles",
  textName: "package names in comments, prose and docs",
} as const;

export type Change = (typeof CHANGE)[keyof typeof CHANGE];
