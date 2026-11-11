import { viteYak } from "next-yak/vite";
import { defineConfig } from "vite";
export default defineConfig(() => ({
  plugins: [viteYak({ experiments: { debug: { pattern: "button" } } })],
}));
