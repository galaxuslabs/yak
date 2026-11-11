import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    swc.vite({
      jsc: {
        experimental: {
          plugins: [
            [
              "@yak/swc",
              {
                prefix: "app",
              },
            ],
          ],
        },
      },
    }),
  ],
  resolve: {
    alias: [{ find: /.+yak\.module\.css$/, replacement: "vitest/identity-obj-proxy" }],
  },
  test: { exclude: ["**/*.yak.module.css"] },
});
