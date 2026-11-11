import yakPlugin from "@yak/eslint-plugin";
import { defineConfig } from "eslint/config";

export default defineConfig([
  yakPlugin.configs.recommended,
  {
    plugins: { "@yak": yakPlugin },
    rules: {
      "@yak/css-nesting-operator": "error",
      '@yak/enforce-semicolon': "error",
      "@yak/style-conditions": "warn",
      "other/rule": "off",
    },
  },
]);
