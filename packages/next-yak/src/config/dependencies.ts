import { migrateVersion, RENAMES } from "../packages.ts";

export interface Entry {
  key: string;
  /** the entry as written in the file, without a trailing comma */
  text: string;
}

const COMPARATORS = [
  (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0),
  (a: string, b: string) => a.localeCompare(b, "en"),
];

/** the comparator that the keys are sorted by, or null when they are not sorted */
export function sortOrder(keys: string[]) {
  return (
    COMPARATORS.find((compare) =>
      keys.every((key, i) => i === 0 || compare(keys[i - 1], key) <= 0),
    ) ?? null
  );
}

/**
 * Renames the old yak packages in a list of dependency entries. Returns the new entries, in
 * sorted order when the old ones were sorted, or null when nothing changed. An old entry goes
 * away when the new package is in the list already.
 */
export function migrateEntries<T extends Entry>(
  entries: T[],
  value: (entry: T) => string,
  print: (key: string, version: string) => string,
): Entry[] | null {
  if (!entries.some((entry) => entry.key in RENAMES)) return null;
  const keys = new Set(entries.map((entry) => entry.key));
  const migrated: Entry[] = [];
  for (const entry of entries) {
    const newKey = RENAMES[entry.key];
    if (!newKey) migrated.push(entry);
    else if (!keys.has(newKey))
      migrated.push({ key: newKey, text: print(newKey, migrateVersion(value(entry), newKey)) });
  }
  const compare = sortOrder(entries.map((entry) => entry.key));
  if (compare) migrated.sort((a, b) => compare(a.key, b.key));
  return migrated;
}
