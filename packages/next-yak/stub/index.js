// The names that next-yak 9 exported from its entry points. Node links an ES module before it
// runs it, so an import of a name that is not here fails with "does not provide an export named"
// and the error below does not show.
export let atoms,
  buildYakPluginOptions,
  CauseError,
  CircularDependencyError,
  createEvaluator,
  css,
  Fragment,
  getYakThemeContext,
  globalStyle,
  jsx,
  jsxDEV,
  jsxs,
  keyframes,
  mixin,
  parseExports,
  parseModule,
  pluginYak,
  ResolveError,
  resolveCrossFileConstant,
  resolveYakContext,
  styled,
  uncachedParseModule,
  uncachedResolveCrossFileConstant,
  UnsupportedExportError,
  useTheme,
  viteYak,
  withYak,
  YakThemeProvider;
export default undefined;

throw new Error(
  "next-yak is now @yak/react. Run `npx next-yak@10 migrate` to move your project. Guide: https://yak.style/docs/migration-from-next-yak",
);
