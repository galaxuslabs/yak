import MagicString from "magic-string";
import { migrateRuleId } from "../lint-rules.ts";
import {
  mentionsOldName,
  migrateVersion,
  renameInText,
  renamePackage,
  RENAMES,
} from "../packages.ts";
import { removeItems } from "../remove-items.ts";
import { migrateEntries } from "./dependencies.ts";
import { findNode, type JsonNode as Node, parseJson } from "./json-tree.ts";
import { WARNING, type WarningType } from "../warnings.ts";
import { CHANGE, type Change } from "../changes.ts";

export const JSON_FILE =
  /(^|\/)(package\.json|[jt]sconfig[^/]*\.json|\.oxlintrc\.json|\.eslintrc(\.json)?|\.swcrc|biome\.jsonc?|renovate\.json|\.renovaterc(\.json)?|turbo\.json|knip\.jsonc?|deno\.jsonc?)$/;

const DEPENDENCY_PATHS = [
  ["dependencies"],
  ["devDependencies"],
  ["peerDependencies"],
  ["optionalDependencies"],
  ["overrides"],
  ["resolutions"],
  ["pnpm", "overrides"],
  ["pnpm", "peerDependencyRules", "allowedVersions"],
  ["catalog"],
  ["workspaces", "catalog"],
];
const CATALOGS_PATHS = [["catalogs"], ["workspaces", "catalogs"]];
/** objects with a package name as the key and settings as the value */
const META_PATHS = [["peerDependenciesMeta"], ["dependenciesMeta"]];
const REMOVED_SWC_OPTIONS = new Set(["suppressDeprecationWarnings", "transpilationMode"]);

/**
 * Migrates `package.json` dependencies and catalogs, package names in any string value
 * (tsconfig `jsxImportSource`, Oxlint `jsPlugins`), the lint rule ids and the options of a
 * direct `yak-swc` plugin entry.
 */
export function migrateJson(
  file: string,
  code: string,
  warn: (line: number | undefined, type: WarningType, detail?: string) => void,
  change: (type: Change) => void,
  text: boolean,
) {
  if (!code.includes("yak")) return code;
  const document = parseJson(code);
  if (!document) {
    warn(undefined, WARNING.invalidJson);
    return code;
  }
  const { root, comments } = document;
  const edits = new MagicString(code);
  const skip = new Set<Node>();

  if (/(^|\/)package\.json$/.test(file)) {
    const name = findNode(root, ["name"]);
    if (name) skip.add(name);
    const objects = DEPENDENCY_PATHS.map((path) => findNode(root, path));
    for (const path of CATALOGS_PATHS)
      objects.push(...(findNode(root, path)?.children ?? []).map((p) => p.children[1]));
    for (const path of META_PATHS) {
      for (const property of findNode(root, path)?.children ?? []) {
        const key = property.children[0];
        // `next-yak` or `next-yak@9.10.3` in `dependenciesMeta`
        const [, name, version] = /^(@?[^@]+)(@.*)?$/.exec(key.value as string) ?? [];
        if (name in RENAMES) {
          const newName = RENAMES[name];
          const renamed = version
            ? `${newName}@${migrateVersion(version.slice(1), newName)}`
            : newName;
          edits.overwrite(key.start + 1, key.end - 1, renamed);
          change(CHANGE.dependency);
        }
        skip.add(key);
      }
    }
    for (const object of objects) {
      if (object?.type !== "object") continue;
      if (migrateDependencies(code, edits, object)) change(CHANGE.dependency);
      for (const property of object.children) skip.add(property.children[1]);
    }
  }

  // JSONC comments, in text mode only
  if (text) {
    for (const { start, end } of comments) {
      const comment = code.slice(start!, end!);
      if (mentionsOldName(comment)) {
        edits.overwrite(start!, end!, renameInText(comment));
        change(CHANGE.textName);
      }
    }
  }

  visit(root, (node) => {
    if (node.type === "string" && !skip.has(node) && !isKey(node)) {
      const renamed = renamePackage(node.value as string) ?? legacyEslintName(node);
      // the source text without the quotes, it can contain escapes
      const [start, end] = [node.start + 1, node.end - 1];
      if (renamed !== null) {
        edits.overwrite(start, end, renamed);
        change(CHANGE.packageName);
      } else if (mentionsOldName(code.slice(start, end))) {
        if (text) {
          edits.overwrite(start, end, renameInText(code.slice(start, end)));
          change(CHANGE.textName);
        } else warn(lineOf(code, node.start), WARNING.oldNameInText);
      }
    }
    if (node.type === "object" && migrateObject(edits, node)) change(CHANGE.lint);
    if (node.type === "array" && migrateSwcEntry(edits, node)) change(CHANGE.options);
  });
  return edits.toString();
}

function visit(node: Node, callback: (node: Node) => void) {
  callback(node);
  for (const child of node.children) visit(child, callback);
}

const lineOf = (code: string, offset: number) => code.slice(0, offset).split("\n").length;
const isKey = (node: Node) => node.parent?.type === "property" && node.parent.children[0] === node;
const keyOf = (property: Node) => property.children[0].value as string;
const itemOf = (node: Node) => ({ start: node.start, end: node.end });

/** `"plugins": ["yak"]` and `"plugin:yak/recommended"` in a legacy `.eslintrc` */
function legacyEslintName(node: Node): string | null {
  const value = node.value as string;
  if (value.startsWith("plugin:yak/")) return `plugin:@yak/${value.slice("plugin:yak/".length)}`;
  const property = node.parent?.parent;
  if (
    value === "yak" &&
    node.parent?.type === "array" &&
    property?.type === "property" &&
    keyOf(property) === "plugins"
  ) {
    return "@yak";
  }
  return null;
}

/**
 * lint rule ids and the Oxlint `{ "name": "yak", "specifier": … }` plugin alias, returns true
 * when it changed something
 */
function migrateObject(edits: MagicString, object: Node) {
  const properties = object.children;
  const removed: Node[] = [];
  let changed = false;
  for (const property of properties) {
    const key = property.children[0];
    const rule = migrateRuleId(key.value as string);
    if (rule === "removed") removed.push(property);
    else if (rule !== null) {
      edits.overwrite(key.start + 1, key.end - 1, rule);
      changed = true;
    }
  }
  removeProperties(edits, object, removed);

  const name = properties.find((property) => keyOf(property) === "name")?.children[1];
  const hasSpecifier = properties.some((property) => keyOf(property) === "specifier");
  if (hasSpecifier && name?.value === "yak") {
    edits.overwrite(name.start + 1, name.end - 1, "@yak");
    changed = true;
  }
  return changed || removed.length > 0;
}

/**
 * `["yak-swc", { … }]` in `.swcrc` loses the options that @yak/swc rejects, returns true when
 * it removed one
 */
function migrateSwcEntry(edits: MagicString, array: Node) {
  const [name, options] = array.children;
  if (name?.value !== "yak-swc" || options?.type !== "object") return false;
  const removed = options.children.filter((property) => REMOVED_SWC_OPTIONS.has(keyOf(property)));
  removeProperties(edits, options, removed);
  return removed.length > 0;
}

function removeProperties(edits: MagicString, object: Node, removed: Node[]) {
  if (!removed.length) return;
  const items = new Map(object.children.map((property) => [property, itemOf(property)]));
  removeItems(
    edits,
    [...items.values()],
    removed.map((property) => items.get(property)!),
    object.start + 1,
    object.end - 1,
  );
}

/**
 * Renames the old packages in a dependency object. When every entry is on its own line, the
 * lines are written again so that a sorted object stays sorted. Otherwise only the renamed
 * keys and versions change in place. Returns true when the object contains an old package.
 */
function migrateDependencies(code: string, edits: MagicString, object: Node) {
  const properties = object.children;
  const entries = properties.map((property) => ({
    key: keyOf(property),
    text: code.slice(property.start, property.end),
    version: property.children[1].type === "string" ? (property.children[1].value as string) : "",
    property,
  }));
  const print = (key: string, version: string) =>
    `${JSON.stringify(key)}: ${JSON.stringify(version)}`;
  const migrated = migrateEntries(entries, (entry) => entry.version, print);
  if (!migrated) return false;

  const first = properties[0];
  const last = properties[properties.length - 1];
  const indentation = code.slice(code.lastIndexOf("\n", first.start - 1) + 1, first.start);
  const separator = `,${code.includes("\r\n") ? "\r\n" : "\n"}${indentation}`;
  const region = code.slice(first.start, last.end);
  if (/^\s*$/.test(indentation) && region === entries.map((entry) => entry.text).join(separator)) {
    edits.overwrite(first.start, last.end, migrated.map((entry) => entry.text).join(separator));
    return true;
  }

  // keys and versions in place, an old entry goes away when the new package is there already
  const keys = new Set(entries.map((entry) => entry.key));
  const removed: Node[] = [];
  for (const entry of entries) {
    const newKey = RENAMES[entry.key];
    if (!newKey) continue;
    if (keys.has(newKey)) removed.push(entry.property);
    else
      edits.overwrite(
        entry.property.start,
        entry.property.end,
        print(newKey, migrateVersion(entry.version, newKey)),
      );
  }
  removeProperties(edits, object, removed);
  return true;
}
