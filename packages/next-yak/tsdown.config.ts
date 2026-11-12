import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { defineConfig } from "tsdown";

export default defineConfig({
  entry: { cli: "src/cli.ts" },
  format: "esm",
  platform: "node",
  // next-yak projects run on Node.js 20 or later
  target: "node20",
  dts: false,
  minify: "dce-only",
  treeshake: true,
  // the published package has no dependencies, everything is in the bundle
  noExternal: [/.*/],
  outExtensions: () => ({ js: ".js" }),
  plugins: [
    {
      // the licenses of the bundled packages require that each copy keeps their notices
      name: "third-party-licenses",
      generateBundle(_, bundle) {
        const licenses = new Map<string, string>();
        for (const output of Object.values(bundle)) {
          if (output.type !== "chunk") continue;
          for (const id of output.moduleIds) {
            const folder = packageFolder(id);
            if (!folder) continue;
            const pkg = JSON.parse(readFileSync(join(folder, "package.json"), "utf8"));
            const file = readdirSync(folder).find((entry) => /^licen[cs]e(\.\w+)?$/i.test(entry));
            licenses.set(
              `${pkg.name}@${pkg.version}`,
              file ? readFileSync(join(folder, file), "utf8").trim() : `License: ${pkg.license}`,
            );
          }
        }
        const text = [...licenses]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([id, license]) => `## ${id}\n\n${license}`)
          .join("\n\n");
        this.emitFile({
          type: "asset",
          fileName: "THIRD_PARTY_LICENSES.md",
          source: `# Licenses of the bundled packages\n\n${text}\n`,
        });
      },
    },
  ],
});

/** the folder of the package in node_modules that contains the module, or null */
function packageFolder(id: string): string | null {
  if (!id.includes("/node_modules/")) return null;
  // a package can have a package.json without a name in a subfolder, for example for `type`
  for (let dir = dirname(id); dir.includes("/node_modules/"); dir = dirname(dir)) {
    const manifest = join(dir, "package.json");
    if (existsSync(manifest) && JSON.parse(readFileSync(manifest, "utf8")).name) return dir;
  }
  return null;
}
