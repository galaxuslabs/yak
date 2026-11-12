import type { Node } from "@babel/types";
import { keyName, type Ast, type Context, type Traverse } from "./context.ts";
import { removeProperties } from "./plugin-options.ts";

const REMOVED = new Set(["suppressDeprecationWarnings", "transpilationMode"]);

/**
 * A direct SWC plugin entry `["yak-swc", { … }]` loses the options that @yak/swc rejects.
 * The package name itself changes with the other package names.
 */
export function migrateSwcOptions(ast: Ast, traverse: Traverse, context: Context) {
  traverse(ast, {
    ArrayExpression({ node }) {
      const [name, options] = node.elements;
      if (name?.type !== "StringLiteral" || name.value !== "yak-swc") return;
      if (options?.type !== "ObjectExpression") return;
      const removed: Node[] = options.properties.filter((property) =>
        REMOVED.has(keyName(property) ?? ""),
      );
      if (removed.length) removeProperties(options, removed, context);
    },
  });
}
