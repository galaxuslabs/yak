import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Exports that are also used inside their own module are a deliberate choice
  ignoreExportsUsedInFile: true,
  workspaces: {
    "packages/next-yak": {
      // Projects that the codemod migrates in the tests
      ignore: ["test/fixtures/**", "test/bundle-check/**"],
    },
  },
};

export default config;
