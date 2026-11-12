import { parse } from "@babel/parser";
import traverseModule from "@babel/traverse";
import MagicString from "magic-string";
import { CHANGE, type Change } from "../changes.ts";
import type { WarningType } from "../warnings.ts";
import { migrateComments } from "./comments.ts";
import type { Context } from "./context.ts";
import { unwrapGlobalSelectors } from "./global-selector.ts";
import { migrateLintConfig } from "./lint-config.ts";
import { findManualChanges } from "./notices.ts";
import { renamePackageNames } from "./package-names.ts";
import { migratePluginOptions } from "./plugin-options.ts";
import { migrateSwcOptions } from "./swc-options.ts";

// the bundle sees the CommonJS default export, the TypeScript types see the ESM one
const traverse = ((traverseModule as any).default ?? traverseModule) as typeof traverseModule;

export const SOURCE_FILE = /\.[cm]?[jt]sx?$/;

/** migrates a JavaScript or TypeScript file */
export function migrateSource(
  file: string,
  code: string,
  warn: (line: number | undefined, type: WarningType, detail?: string) => void,
  change: (type: Change) => void,
  text: boolean,
) {
  if (!code.includes("yak") && !code.includes("next/jest")) return code;
  // `<T>value` casts in .ts files clash with JSX
  const jsx = !/\.[cm]?ts$/.test(file);
  const ast = parse(code, {
    sourceType: "unambiguous",
    plugins: jsx ? ["typescript", "jsx"] : ["typescript"],
  });
  const context: Context = {
    file,
    code,
    edits: new MagicString(code),
    text,
    importsYak: /(\bfrom|\bimport|\brequire\s*\()\s*["']next-yak["'/]/.test(code),
    warn: (node, type, detail) => warn(node.loc?.start.line, type, detail),
    change,
  };
  // each step records its type of change when it edits the file
  const steps: [Change, () => void][] = [
    [CHANGE.options, () => migratePluginOptions(ast, traverse, context)],
    [CHANGE.options, () => migrateSwcOptions(ast, traverse, context)],
    [CHANGE.lint, () => migrateLintConfig(ast, traverse, context)],
    [CHANGE.globalSelector, () => unwrapGlobalSelectors(ast, traverse, context)],
    [CHANGE.packageName, () => renamePackageNames(ast, traverse, context)],
  ];
  for (const [type, step] of steps) {
    const before = context.edits.toString();
    step();
    if (context.edits.toString() !== before) change(type);
  }
  migrateComments(ast, context);
  findManualChanges(ast, traverse, context);
  return context.edits.toString();
}
