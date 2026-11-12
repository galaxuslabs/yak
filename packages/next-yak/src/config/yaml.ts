import { migrateVersion, RENAMES } from "../packages.ts";
import { migrateEntries, type Entry } from "./dependencies.ts";

export const YAML_FILE = /(^|\/)(pnpm-workspace\.yaml|\.yarnrc\.yml)$/;

/** `  "next-yak": ^9.10.0` with the key and the value in groups 2 and 3 */
const ENTRY = /^(\s+)(?:"([^"]+)"|'([^']+)'|([\w@./-]+)):\s*(.*?)\s*$/;

interface Line extends Entry {
  index: number;
  indentation: string;
  value: string;
}

/**
 * Migrates the catalogs in `pnpm-workspace.yaml` and `.yarnrc.yml`. The files are edited
 * line by line to keep their comments and layout. A sorted block of entries stays sorted.
 */
export function migrateYaml(code: string) {
  if (!code.includes("yak")) return code;
  const eol = code.includes("\r\n") ? "\r\n" : "\n";
  const lines = code.split(/\r?\n/);
  const parsed = lines.map((text, index): Line | null => {
    const match = ENTRY.exec(text);
    if (!match) return null;
    return {
      index,
      indentation: match[1],
      key: match[2] ?? match[3] ?? match[4],
      value: match[5],
      text,
    };
  });

  // a block is a run of entries next to each other with the same indentation
  for (let start = 0; start < lines.length;) {
    const first = parsed[start];
    let end = start + 1;
    while (first && parsed[end] && parsed[end]!.indentation === first.indentation) end++;
    if (
      first &&
      parsed.slice(start, end).some((line) => line!.key in RENAMES && line!.value !== "")
    ) {
      const block = parsed.slice(start, end) as Line[];
      const print = (key: string, version: string) => `${first.indentation}"${key}": ${version}`;
      // not null, the block contains an old package
      const migrated = migrateEntries(block, (line) => unquote(line.value), print)!;
      // the block can be shorter now
      lines.splice(start, block.length, ...migrated.map((entry) => entry.text));
      parsed.splice(start, block.length, ...migrated.map(() => null));
      start += migrated.length;
    } else {
      start = end;
    }
  }
  return lines.map(migrateListItem).join(eol);
}

/** `  - next-yak` or `  - next-yak@9.10.0` in a list such as `minimumReleaseAgeExclude` */
const LIST_ITEM = /^(\s*-\s+)(["']?)([^"'\s#@]+)(?:@([^"'\s#]+))?\2(\s*(?:#.*)?)$/;

function migrateListItem(line: string) {
  const match = LIST_ITEM.exec(line);
  if (!match || !(match[3] in RENAMES)) return line;
  const [, prefix, , name, version, rest] = match;
  const newName = RENAMES[name];
  return `${prefix}"${newName}${version ? `@${migrateVersion(version, newName)}` : ""}"${rest}`;
}

const unquote = (value: string) => value.replace(/^(["'])(.*)\1$/, "$2");
