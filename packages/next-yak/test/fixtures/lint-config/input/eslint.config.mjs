import yakPlugin from "eslint-plugin-yak";
import { defineConfig } from "eslint/config";

export default defineConfig([
  yakPlugin.configs.recommended,
  {
    plugins: { yak: yakPlugin },
    rules: {
      "yak/css-nesting-operator": "error",
      // the codemod removes this rule together with its comment
      "yak/css-global-deprecated": "warn",
      'yak/enforce-semicolon': "error",
      "yak/style-conditions": "warn",
      "other/rule": "off",
    },
  },
]);
