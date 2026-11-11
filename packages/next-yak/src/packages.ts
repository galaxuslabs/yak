/** old package name → new package name, without a prototype so that `RENAMES["constructor"]` is undefined */
export const RENAMES: Record<string, string> = Object.assign(Object.create(null), {
  "next-yak": "@yak/react",
  "eslint-plugin-yak": "@yak/eslint-plugin",
  "storybook-addon-yak": "@yak/storybook",
  "yak-swc": "@yak/swc",
});

export const OLD_NAMES = Object.keys(RENAMES);

/** the versions that a migrated project gets */
const VERSIONS: Record<string, string> = {
  "@yak/react": "10.0.0",
  "@yak/eslint-plugin": "2.0.0",
  "@yak/storybook": "10.0.0",
  "@yak/swc": "10.0.0",
};

export function versionOf(name: string): string {
  return VERSIONS[name];
}

/**
 * Returns the new name for `next-yak`, `next-yak/withYak` and the other old package names
 * with an optional subpath, or null for any other text.
 */
export function renamePackage(specifier: string): string | null {
  for (const name of OLD_NAMES) {
    if (specifier === name || specifier.startsWith(`${name}/`)) {
      return RENAMES[name] + specifier.slice(name.length);
    }
  }
  return null;
}

// an old name that is not part of a URL path, a scope or a longer name such as `next-yak-ish`
const NAME_IN_TEXT = new RegExp(`(?<![\\w@/.-])(${OLD_NAMES.join("|")})(?![\\w-])`, "g");

/** true when prose or other text contains an old package name */
export const mentionsOldName = (text: string) => new RegExp(NAME_IN_TEXT.source).test(text);

/** renames the old package names in prose or other text, `next-yak/withYak` included */
export function renameInText(text: string): string {
  return text.replace(NAME_IN_TEXT, (name) => RENAMES[name]);
}

/**
 * Returns the version for a renamed dependency. Protocols such as `catalog:` and
 * `workspace:` stay, exact versions stay exact and ranges keep their `^` or `~`.
 */
export function migrateVersion(oldVersion: string, newName: string): string {
  if (/^[a-z]+:/.test(oldVersion) && !oldVersion.startsWith("npm:")) return oldVersion;
  const version = versionOf(newName);
  const prefix = /^\s*([\^~]|>=)/.exec(oldVersion)?.[1];
  if (prefix) return `${prefix}${version}`;
  if (/^\d/.test(oldVersion.trim())) return version;
  return `^${version}`;
}
