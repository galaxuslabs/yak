import { mentionsOldName, renameInText, renamePackage } from "../packages.ts";
import { CHANGE } from "../changes.ts";
import { WARNING } from "../warnings.ts";
import type { Ast, Context, Traverse } from "./context.ts";

/**
 * Text that still contains an old package name changes in text mode, and gives a warning
 * otherwise. Code that the codemod cannot migrate safely gives a warning too.
 */
export function findManualChanges(ast: Ast, traverse: Traverse, context: Context) {
  traverse(ast, {
    "StringLiteral|TemplateElement|JSXText|RegExpLiteral"({ node }) {
      // the source text of the node, without the quotes of a string
      const [start, end] =
        node.type === "StringLiteral" ? [node.start! + 1, node.end! - 1] : [node.start!, node.end!];
      const text = context.code.slice(start, end);
      if (node.type === "StringLiteral" && node.value === "next/jest") {
        context.warn(node, WARNING.nextJest);
      }
      if (/yak\\?\.module\\?\.css/.test(text)) {
        context.warn(
          node,
          node.type === "RegExpLiteral" ? WARNING.yakModuleInRegex : WARNING.yakModuleInString,
        );
      }
      // package names on their own change in every mode
      if (
        !mentionsOldName(text) ||
        (node.type === "StringLiteral" && renamePackage(node.value) !== null)
      )
        return;
      if (node.type === "RegExpLiteral") context.warn(node, WARNING.oldNameInRegex);
      else if (context.text) {
        context.edits.overwrite(start, end, renameInText(text));
        context.change(CHANGE.textName);
      } else context.warn(node, WARNING.oldNameInText);
    },
  });
}
