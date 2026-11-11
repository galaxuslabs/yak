import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";
import { migrateFile } from "../src/migrate.ts";

// Each fixture has an `input` folder, an `output` folder with the expected files, an optional
// `warnings.txt` and an optional `changes.txt` with the types of change in each file. A file
// without an output stays unchanged. A `.fixture` suffix keeps a file such as `.oxlintrc.json`
// from being a real config of this repository. An optional `options.json` sets the options of
// the codemod.
const root = join(import.meta.dirname, "fixtures");

function files(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true, recursive: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(dir, join(entry.parentPath, entry.name)))
    .sort();
}

describe.each(readdirSync(root))("%s", (fixture) => {
  const warnings: string[] = [];
  const changes: string[] = [];
  const optionsFile = join(root, fixture, "options.json");
  const options = existsSync(optionsFile)
    ? JSON.parse(readFileSync(optionsFile, "utf8"))
    : { text: false };
  it.each(files(join(root, fixture, "input")))("%s", async (file) => {
    const code = readFileSync(join(root, fixture, "input", file), "utf8");
    const result = migrateFile(file.replace(/\.fixture$/, ""), code, options);
    warnings.push(
      ...result.warnings.map(
        ({ type, location, detail }) =>
          `${location} ${type.one}: ${type.reason}${detail ? ` (${detail})` : ""}`,
      ),
    );
    if (result.changes.length) changes.push(`${file}: ${result.changes.join(", ")}`);
    const output = join(root, fixture, "output", file);
    if (existsSync(output) || result.code !== code)
      await expect(result.code).toMatchFileSnapshot(output);
  });
  it("changes", async () => {
    const file = join(root, fixture, "changes.txt");
    if (changes.length || existsSync(file))
      await expect(`${changes.join("\n")}\n`).toMatchFileSnapshot(file);
  });
  it("warnings", async () => {
    const file = join(root, fixture, "warnings.txt");
    if (warnings.length || existsSync(file))
      await expect(`${warnings.join("\n")}\n`).toMatchFileSnapshot(file);
  });
});

// Windows projects often have `\r\n` line endings. The result must be the same as with `\n`.
describe.each(readdirSync(root))("%s with CRLF", (fixture) => {
  const optionsFile = join(root, fixture, "options.json");
  const options = existsSync(optionsFile)
    ? JSON.parse(readFileSync(optionsFile, "utf8"))
    : { text: false };
  const crlf = (text: string) => text.replaceAll("\n", "\r\n");
  it.each(files(join(root, fixture, "input")))("%s", (file) => {
    const code = readFileSync(join(root, fixture, "input", file), "utf8");
    const name = file.replace(/\.fixture$/, "");
    const lf = migrateFile(name, code, options);
    const result = migrateFile(name, crlf(code), options);
    expect(result.code).toBe(crlf(lf.code));
    expect(result.warnings).toEqual(lf.warnings);
    expect(result.changes).toEqual(lf.changes);
  });
});
