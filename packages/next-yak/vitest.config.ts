import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "unit",
          include: ["test/**/*.test.ts"],
          exclude: ["test/**/*.integration.test.ts"],
        },
      },
      // runs the built bundle, `pnpm test:integration` builds it first
      { test: { name: "integration", include: ["test/**/*.integration.test.ts"] } },
    ],
  },
});
