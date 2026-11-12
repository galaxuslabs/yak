import { execFileSync } from "node:child_process";
import { chmodSync, cpSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

// Runs the built bundle in a folder without node_modules, so that it must contain every package.
// `pnpm test:integration` builds the bundle first.
const dist = join(import.meta.dirname, "../dist");
const folder = mkdtempSync(join(tmpdir(), "next-yak-bundle-"));
const project = join(folder, "project");

describe("bundle", () => {
  let output = "";

  beforeAll(() => {
    cpSync(dist, join(folder, "dist"), { recursive: true });
    cpSync(join(import.meta.dirname, "bundle-check"), project, { recursive: true });
    // run the file as npm runs a bin, so that a missing `#!/usr/bin/env node` line fails
    const cli = join(folder, "dist/cli.js");
    chmodSync(cli, 0o755);
    output = execFileSync(cli, ["migrate", project], { encoding: "utf8" });
  });

  afterAll(() => rmSync(folder, { recursive: true, force: true }));

  it.each(["package.json", "tsconfig.json", "pnpm-workspace.yaml", "component.tsx"])(
    "migrates %s",
    (file) => {
      const code = readFileSync(join(project, file), "utf8");
      expect(code, output).not.toContain("next-yak");
      expect(code).toContain("@yak/react");
    },
  );

  it("contains the licenses of the bundled packages", () => {
    const licenses = readFileSync(join(dist, "THIRD_PARTY_LICENSES.md"), "utf8");
    for (const name of ["@babel/parser", "@babel/traverse", "magic-string"])
      expect(licenses).toContain(`## ${name}@`);
  });
});
