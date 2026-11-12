import react from "@vitejs/plugin-react-swc";
import { viteYak } from "@yak/react/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [viteYak({ debug: true }), react()],
});
