import pkg from "./package.json" with { type: "json" };
import { eslintCompatPlugin } from "@oxlint/plugins";
import { cssNestingOperator } from "./rules/cssNestingOperator.js";
import { enforceSemicolons } from "./rules/enforceSemicolon.js";
import { styleConditions } from "./rules/styleConditions.js";
import { styledArrowFunctionReturns } from "./rules/styledArrowFunctionReturns.js";
import { styledArrowFunctionStatements } from "./rules/styledArrowFunctionStatements.js";

const compatPlugin = eslintCompatPlugin({
  meta: {
    name: pkg.name,
  },
  rules: {
    "css-nesting-operator": cssNestingOperator,
    "enforce-semicolon": enforceSemicolons,
    "style-conditions": styleConditions,
    "styled-arrow-function-returns": styledArrowFunctionReturns,
    "styled-arrow-function-statements": styledArrowFunctionStatements,
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
      [`${prefix}/styled-arrow-function-statements`]: "error",
    },
  },
};

export default Object.assign(plugin, {
  configs,
});
