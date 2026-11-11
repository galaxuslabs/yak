import { withYak } from "next-yak/withYak";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withYak(
  {
    // keep this comment
    displayNames: true,
    experiments: {
      transpilationMode: "Css",
      suppressDeprecationWarnings: true,
      debug: { pattern: "component.tsx", types: ["css"] },
    },
  },
  nextConfig,
);
