import { viteYak } from "@yak/react/vite";
import { defineConfig } from "vite";
export default defineConfig(() => ({
  plugins: [viteYak({ debug: { pattern: "button" } })],
}));
