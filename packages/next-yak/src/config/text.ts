import { renameInText } from "../packages.ts";

/**
 * Docs, style sheets, HTML, YAML and `.gitignore` files, changed only in text mode. A
 * changelog keeps its history.
 */
export const TEXT_FILE =
  /(\.(md|mdx|markdown|css|scss|sass|less|html?|txt|ya?ml)|(^|\/)\.gitignore)$/;
const CHANGELOG = /(^|\/)changelog[^/]*$/i;

export const isTextFile = (file: string) => TEXT_FILE.test(file) && !CHANGELOG.test(file);

export function migrateText(code: string) {
  return renameInText(code);
}
