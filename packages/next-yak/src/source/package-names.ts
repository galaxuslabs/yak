import { renamePackage } from "../packages.ts";
import type { Ast, Context, Traverse } from "./context.ts";

/**
 * Renames every string that is an old package name, with or without a subpath. This covers
 * imports, `require()`, mocks, `declare module`, Storybook addons and package lists in
 * configs. Strings that only contain the name, such as `"next-yak-ish"`, stay.
 */
export function renamePackageNames(ast: Ast, traverse: Traverse, context: Context) {
  traverse(ast, {
    StringLiteral({ node }) {
      const renamed = renamePackage(node.value);
      // keep the quotes, replace only the text between them
      if (renamed !== null) context.edits.overwrite(node.start! + 1, node.end! - 1, renamed);
    },
  });
}
