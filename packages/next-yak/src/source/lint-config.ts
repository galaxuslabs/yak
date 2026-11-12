import type { Node, ObjectExpression, ObjectProperty } from "@babel/types";
import { migrateRuleId, REMOVED_RULE } from "../lint-rules.ts";
import { keyName, type Ast, type Context, type Traverse } from "./context.ts";
import { removeItems } from "../remove-items.ts";
import { WARNING } from "../warnings.ts";
import { removeProperties } from "./plugin-options.ts";

/**
 * The lint rules move from the `yak/` prefix to `@yak/`, and `css-global-deprecated` is gone.
 * A plugin registered as `yak` (`plugins: { yak }` in ESLint, `{ name: "yak", specifier }` in
 * Oxlint) moves to `@yak` too, so the rule ids and the plugin name match.
 */
export function migrateLintConfig(ast: Ast, traverse: Traverse, context: Context) {
  traverse(ast, {
    ObjectExpression({ node, parent }) {
      const removed: Node[] = [];
      for (const property of node.properties) {
        const key = keyName(property);
        if (key === null || property.type !== "ObjectProperty") continue;
        const rule = migrateRuleId(key);
        if (rule === "removed") removed.push(property);
        // keep the quotes, replace only the text between them
        else if (rule !== null)
          context.edits.overwrite(property.key.start! + 1, property.key.end! - 1, rule);
        else if (key === "yak" && isPluginsObject(parent)) {
          context.edits.overwrite(property.key.start!, property.key.end!, '"@yak"');
          if (property.shorthand)
            context.edits.appendLeft(
              property.value.end!,
              `: ${context.code.slice(property.value.start!, property.value.end!)}`,
            );
        }
      }
      if (removed.length) removeProperties(node, removed, context);
      renameOxlintPluginAlias(node, context);
    },
    ArrayExpression({ node }) {
      const removed = node.elements.filter(
        (element) => element?.type === "StringLiteral" && isRemovedRule(element.value),
      );
      if (removed.length === 0 || node.elements.some((element) => element === null)) return;
      const items = new Map(
        node.elements.map((element) => [element, { start: element!.start!, end: element!.end! }]),
      );
      removeItems(
        context.edits,
        [...items.values()],
        removed.map((element) => items.get(element)!),
        node.start! + 1,
        node.end! - 1,
      );
    },
    StringLiteral({ node, parent }) {
      // a removed rule key and an element of a list are handled above
      if (parent.type === "ObjectProperty" && parent.key === node) return;
      if (parent.type === "ArrayExpression" && !parent.elements.includes(null)) return;
      if (isRemovedRule(node.value)) {
        context.warn(node, WARNING.removedRule);
      }
    },
  });
}

const isRemovedRule = (value: string) =>
  value === REMOVED_RULE || value.endsWith(`/${REMOVED_RULE}`);

function isPluginsObject(parent: Node) {
  return parent.type === "ObjectProperty" && keyName(parent) === "plugins";
}

/** `{ name: "yak", specifier: "eslint-plugin-yak" }` in an Oxlint `jsPlugins` list */
function renameOxlintPluginAlias(object: ObjectExpression, context: Context) {
  const name = object.properties.find((property) => keyName(property) === "name") as
    | ObjectProperty
    | undefined;
  const hasSpecifier = object.properties.some((property) => keyName(property) === "specifier");
  if (hasSpecifier && name?.value.type === "StringLiteral" && name.value.value === "yak") {
    context.edits.overwrite(name.value.start! + 1, name.value.end! - 1, "@yak");
  }
}
