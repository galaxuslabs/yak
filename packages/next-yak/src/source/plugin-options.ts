import type { NodePath } from "@babel/traverse";
import type { CallExpression, Node, ObjectExpression, ObjectProperty } from "@babel/types";
import { removeItems, type Item } from "../remove-items.ts";
import { WARNING } from "../warnings.ts";
import { importedYakName, keyName, type Ast, type Context, type Traverse } from "./context.ts";

const PLUGINS = new Set(["withYak", "viteYak", "pluginYak"]);
const REMOVED = new Set(["transpilationMode", "suppressDeprecationWarnings"]);

/**
 * `experiments.transpilationMode` and `experiments.suppressDeprecationWarnings` are gone,
 * `experiments.debug` moves to the top level.
 */
export function migratePluginOptions(ast: Ast, traverse: Traverse, context: Context) {
  const done = new Set<Node>();
  traverse(ast, {
    CallExpression(path) {
      const { callee } = path.node;
      if (callee.type !== "Identifier") return;
      const name = importedYakName(path.scope.getBinding(callee.name));
      if (name === null || !PLUGINS.has(name)) return;
      // withYak(nextConfig) has no yak options
      if (name === "withYak" && path.node.arguments.length < 2) return;
      const options = path.node.arguments[0];
      if (!options) return;
      for (const object of resolveObjects(path, options, context)) {
        if (done.has(object)) continue;
        done.add(object);
        const empty = migrateObject(object, context);
        // withYak({}, nextConfig) is withYak(nextConfig), viteYak({}) is viteYak()
        if (empty && object === options) {
          const next = path.node.arguments[1];
          context.edits.remove(options.start!, next ? next.start! : path.node.end! - 1);
        }
      }
    },
  });
}

/**
 * Finds the object literals that a call can receive: inline, a same-file const and both
 * branches of a conditional. Gives a warning for anything else.
 */
function resolveObjects(
  path: NodePath<CallExpression>,
  node: Node,
  context: Context,
): ObjectExpression[] {
  switch (node.type) {
    case "ObjectExpression":
      return [node];
    case "TSAsExpression":
    case "TSSatisfiesExpression":
    case "ParenthesizedExpression":
      return resolveObjects(path, node.expression, context);
    case "ConditionalExpression":
      return [
        ...resolveObjects(path, node.consequent, context),
        ...resolveObjects(path, node.alternate, context),
      ];
    case "Identifier": {
      const binding = path.scope.getBinding(node.name);
      const declarator = binding?.path.node;
      if (binding?.constant && declarator?.type === "VariableDeclarator" && declarator.init) {
        return resolveObjects(path, declarator.init, context);
      }
    }
  }
  context.warn(node, WARNING.unreadableOptions);
  return [];
}

/** returns true when the object has no properties left */
function migrateObject(object: ObjectExpression, context: Context): boolean {
  const experiments = object.properties.find((property) => keyName(property) === "experiments") as
    | ObjectProperty
    | undefined;
  if (!experiments) return false;
  if (experiments.value.type !== "ObjectExpression") {
    context.warn(experiments, WARNING.unreadableOptions, "experiments");
    return false;
  }
  const inner = experiments.value.properties;
  if (inner.some((property) => keyName(property) === null)) {
    context.warn(experiments, WARNING.unreadableOptions, "experiments");
    return false;
  }
  const debug = inner.find((property) => keyName(property) === "debug") as
    | ObjectProperty
    | undefined;
  const debugText = debug && `debug: ${context.code.slice(debug.value.start!, debug.value.end!)}`;
  const unknown = inner.filter(
    (property) => !REMOVED.has(keyName(property)!) && property !== debug,
  );

  if (unknown.length === 0) {
    // experiments has nothing left, debug takes its place
    if (debugText) {
      context.edits.overwrite(experiments.start!, experiments.end!, debugText);
      return false;
    }
    removeProperties(object, [experiments], context);
    return object.properties.length === 1;
  }

  // keep the unknown keys in experiments and put debug in front of it
  removeProperties(
    experiments.value,
    inner.filter((property) => !unknown.includes(property)),
    context,
  );
  if (debugText) {
    const lineStart = context.code.lastIndexOf("\n", experiments.start! - 1) + 1;
    const indentation = context.code.slice(lineStart, experiments.start!);
    const separator = /^\s*$/.test(indentation) ? `\n${indentation}` : " ";
    context.edits.appendLeft(experiments.start!, `${debugText},${separator}`);
  }
  for (const property of unknown) {
    context.warn(property, WARNING.unknownOption, `experiments.${keyName(property)}`);
  }
  return false;
}

export function removeProperties(object: ObjectExpression, remove: Node[], context: Context) {
  const items = new Map<Node, Item>(
    object.properties.map((property) => [
      property,
      {
        start: property.start!,
        end: property.end!,
        leadingStart: property.leadingComments?.[0]?.start ?? undefined,
      },
    ]),
  );
  removeItems(
    context.edits,
    [...items.values()],
    remove.map((node) => items.get(node)!),
    object.start! + 1,
    object.end! - 1,
  );
}
