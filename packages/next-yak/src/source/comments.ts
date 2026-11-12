import { migrateDisableComment } from "../lint-rules.ts";
import { renameInText } from "../packages.ts";
import type { Node } from "@babel/types";
import type { Ast, Context } from "./context.ts";
import { unwrapGlobalInText } from "./global-selector.ts";
import { WARNING } from "../warnings.ts";
import { CHANGE } from "../changes.ts";

/**
 * Migrates the `@jsxImportSource` pragma and the lint rules in `eslint-disable` comments.
 * In text mode, the old package names in all other comments change too, and in a file that
 * imports next-yak, `:global()` in a comment goes away like in the styles. Without text mode,
 * such a `:global()` gives a warning.
 */
export function migrateComments(ast: Ast, context: Context) {
  for (const comment of ast.comments ?? []) {
    let text = migrateDisableComment(comment.value);
    if (text !== comment.value) context.change(CHANGE.lint);
    const pragma = text.replace(/(@jsxImportSource\s+)next-yak\b/, "$1@yak/react");
    if (pragma !== text) context.change(CHANGE.packageName);
    text = pragma;
    if (context.text) {
      const renamed = renameInText(text);
      if (renamed !== text) context.change(CHANGE.textName);
      text = renamed;
    }
    if (context.importsYak && /:global\b/.test(text)) {
      if (context.text) {
        text = unwrapGlobalInText(text);
        context.change(CHANGE.textName);
      } else context.warn(comment as unknown as Node, WARNING.globalInComment);
    }
    // comment.value starts after `/*` or `//`
    const start = comment.start! + 2;
    if (text !== comment.value) context.edits.overwrite(start, start + comment.value.length, text);
  }
}
