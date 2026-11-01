// Writes one SVG per scene into dist/: `pnpm --filter=readme-assets build`
import { mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { basename } from "node:path";

const out = new URL("./dist/", import.meta.url);
mkdirSync(out, { recursive: true });

const scenes = readdirSync(new URL("./scenes/", import.meta.url)).filter((file) =>
  file.endsWith(".tsx"),
);
for (const file of scenes) {
  const scene: { default: () => string } = await import(`./scenes/${file}`);
  const name = `${basename(file, ".tsx")}.svg`;
  const svg = scene.default();
  writeFileSync(new URL(name, out), svg);
  console.log(`${name}: ${(svg.length / 1024).toFixed(1)} kB`);
}
