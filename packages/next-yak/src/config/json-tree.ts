import { parseExpression } from "@babel/parser";
import type { Comment, Expression } from "@babel/types";

/** a node of a JSON document, with the position of its source text */
export interface JsonNode {
  type: "object" | "array" | "property" | "string" | "number" | "boolean" | "null";
  /** the start and the end of the source text, a string includes its quotes */
  start: number;
  end: number;
  /** the value of a string, number or boolean */
  value?: string | number | boolean;
  /** the properties of an object, the items of an array, or the key and the value of a property */
  children: JsonNode[];
  parent?: JsonNode;
}

export interface JsonDocument {
  root: JsonNode;
  comments: Comment[];
}

/**
 * Parses JSON with comments and trailing commas. Returns null when the code is not JSON, for
 * example with single quotes, keys without quotes or other JavaScript expressions.
 */
export function parseJson(code: string): JsonDocument | null {
  let expression: ReturnType<typeof parseExpression>;
  try {
    expression = parseExpression(code);
  } catch {
    return null;
  }
  const root = toNode(code, expression);
  return root && { root, comments: expression.comments ?? [] };
}

function toNode(code: string, expression: Expression, parent?: JsonNode): JsonNode | null {
  const node: JsonNode = {
    type: "null",
    start: expression.start!,
    end: expression.end!,
    children: [],
    parent,
  };
  switch (expression.type) {
    case "StringLiteral":
      // JSON strings have double quotes
      if (code[expression.start!] !== '"') return null;
      return Object.assign(node, { type: "string", value: expression.value });
    case "NumericLiteral":
      return Object.assign(node, { type: "number", value: expression.value });
    case "UnaryExpression":
      if (expression.operator !== "-" || expression.argument.type !== "NumericLiteral") return null;
      return Object.assign(node, { type: "number", value: -expression.argument.value });
    case "BooleanLiteral":
      return Object.assign(node, { type: "boolean", value: expression.value });
    case "NullLiteral":
      return node;
    case "ArrayExpression":
      node.type = "array";
      for (const element of expression.elements) {
        if (!element || element.type === "SpreadElement") return null;
        const child = toNode(code, element, node);
        if (!child) return null;
        node.children.push(child);
      }
      return node;
    case "ObjectExpression":
      node.type = "object";
      for (const property of expression.properties) {
        if (property.type !== "ObjectProperty" || property.computed || property.shorthand)
          return null;
        const entry: JsonNode = {
          type: "property",
          start: property.start!,
          end: property.end!,
          children: [],
          parent: node,
        };
        const key = toNode(code, property.key as Expression, entry);
        const value = toNode(code, property.value as Expression, entry);
        if (key?.type !== "string" || !value) return null;
        entry.children.push(key, value);
        node.children.push(entry);
      }
      return node;
    default:
      return null;
  }
}

/** the value at a path of keys, or undefined when a key is missing */
export function findNode(root: JsonNode, path: string[]): JsonNode | undefined {
  let node: JsonNode | undefined = root;
  for (const key of path) {
    if (node?.type !== "object") return undefined;
    node = node.children.find((property) => property.children[0].value === key)?.children[1];
  }
  return node;
}
