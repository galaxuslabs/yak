import type traverse from "@babel/traverse";
import type { Binding } from "@babel/traverse";
import type { File, Node } from "@babel/types";
import type MagicString from "magic-string";
import type { Change } from "../changes.ts";
import type { WarningType } from "../warnings.ts";

export type Traverse = typeof traverse;
export type Ast = File;

export interface Context {
  file: string;
  code: string;
  edits: MagicString;
  /** true when the old package names change in comments and prose too */
  text: boolean;
  /** true when the file imports or requires next-yak */
  importsYak: boolean;
  warn(node: Node, type: WarningType, detail?: string): void;
  /** records the type of a change for the summary of the run */
  change(type: Change): void;
}

const isYakSource = (source: string) => source === "next-yak" || source.startsWith("next-yak/");

/**
 * Returns the name that a binding imports from next-yak, or null when the binding comes from
 * somewhere else. Handles `import { a as b } from "next-yak"` and
 * `const { a: b } = require("next-yak")`.
 */
export function importedYakName(binding: Binding | undefined): string | null {
  if (!binding || binding.kind === "param" || binding.kind === "local") return null;
  const { node, parent } = binding.path;
  if (
    node.type === "ImportSpecifier" &&
    parent.type === "ImportDeclaration" &&
    isYakSource(parent.source.value)
  ) {
    return node.imported.type === "Identifier" ? node.imported.name : node.imported.value;
  }
  if (
    node.type === "VariableDeclarator" &&
    node.id.type === "ObjectPattern" &&
    node.init?.type === "CallExpression" &&
    node.init.callee.type === "Identifier" &&
    node.init.callee.name === "require" &&
    node.init.arguments[0]?.type === "StringLiteral" &&
    isYakSource(node.init.arguments[0].value)
  ) {
    for (const property of node.id.properties) {
      if (
        property.type === "ObjectProperty" &&
        property.key.type === "Identifier" &&
        property.value.type === "Identifier" &&
        property.value.name === binding.identifier.name
      ) {
        return property.key.name;
      }
    }
  }
  return null;
}

/** the name of a non-computed object key, or null for spreads and computed keys */
export function keyName(property: Node): string | null {
  if (property.type !== "ObjectProperty" && property.type !== "ObjectMethod") return null;
  if (property.computed) return null;
  if (property.key.type === "Identifier") return property.key.name;
  if (property.key.type === "StringLiteral") return property.key.value;
  return null;
}
