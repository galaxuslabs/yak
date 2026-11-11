import { CHANGE, type Change } from "./changes.ts";
import { JSON_FILE, migrateJson } from "./config/json.ts";
import { isTextFile, migrateText } from "./config/text.ts";
import { migrateYaml, YAML_FILE } from "./config/yaml.ts";
import { migrateSource, SOURCE_FILE } from "./source/index.ts";
import { WARNING, type Warning, type WarningType } from "./warnings.ts";

export interface Options {
  /** also rename the old package names in comments, prose strings, Markdown and CSS */
  text: boolean;
}

export interface Result {
  code: string;
  warnings: Warning[];
  /** the types of change in this file, each one time */
  changes: Change[];
}

/** true for the files that the codemod looks at */
export const isMigratable = (file: string, options: Options) =>
  SOURCE_FILE.test(file) ||
  JSON_FILE.test(file) ||
  YAML_FILE.test(file) ||
  (options.text && isTextFile(file));

/** migrates one file from next-yak 9 to @yak/react 10 */
export function migrateFile(file: string, code: string, options: Options): Result {
  const warnings: Warning[] = [];
  const warn = (line: number | undefined, type: WarningType, detail?: string) =>
    warnings.push({ type, location: line === undefined ? file : `${file}:${line}`, detail });
  const changes = new Set<Change>();
  const change = (type: Change) => changes.add(type);
  const result = (migrated: string) => ({
    code: migrated,
    warnings,
    changes: Object.values(CHANGE).filter((type) => changes.has(type)),
  });
  try {
    if (JSON_FILE.test(file)) return result(migrateJson(file, code, warn, change, options.text));
    if (YAML_FILE.test(file)) {
      const migrated = migrateYaml(code);
      if (migrated !== code) change(CHANGE.dependency);
      return result(options.text ? migrateTextFile(migrated, change) : migrated);
    }
    if (SOURCE_FILE.test(file))
      return result(migrateSource(file, code, warn, change, options.text));
    if (options.text && isTextFile(file)) return result(migrateTextFile(code, change));
  } catch (error) {
    warn(undefined, WARNING.unreadableFile, (error as Error).message);
    changes.clear();
  }
  return result(code);
}

function migrateTextFile(code: string, change: (type: Change) => void) {
  const migrated = migrateText(code);
  if (migrated !== code) change(CHANGE.textName);
  return migrated;
}
