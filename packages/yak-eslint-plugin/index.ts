import pkg from "./package.json" with { type: "json" };
import { eslintCompatPlugin } from "@oxlint/plugins";
import { cssNestingOperator } from "./rules/cssNestingOperator.js";
import { enforceSemicolons } from "./rules/enforceSemicolon.js";
import { styleConditions } from "./rules/styleConditions.js";
import { styledFunctionFastPath } from "./rules/styledFunctionFastPath.js";
import { styledFunctionReturns } from "./rules/styledFunctionReturns.js";

const compatPlugin = eslintCompatPlugin({
  meta: {
    name: pkg.name,
  },
  rules: {
    "css-nesting-operator": cssNestingOperator,
    "enforce-semicolon": enforceSemicolons,
    "style-conditions": styleConditions,
    "styled-function-fast-path": styledFunctionFastPath,
    "styled-function-returns": styledFunctionReturns,
  },
});

const plugin = {
  ...compatPlugin,
  meta: {
    name: pkg.name,
    version: pkg.version,
  },
};

// ESLint's prefix for a scoped plugin (@yak/eslint-plugin -> @yak).
// Oxlint derives the same prefix from `meta.name`
const prefix = "@yak";

const configs = {
  recommended: {
    plugins: {
      [prefix]: plugin,
    },
    rules: {
      [`${prefix}/css-nesting-operator`]: "error",
      [`${prefix}/enforce-semicolon`]: "error",
      [`${prefix}/style-conditions`]: "warn",
      [`${prefix}/styled-function-fast-path`]: "error",
      [`${prefix}/styled-function-returns`]: "error",
    },
  },
};

export default Object.assign(plugin, {
  configs,
});
