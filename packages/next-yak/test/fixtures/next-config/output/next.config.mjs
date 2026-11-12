import { withYak } from "@yak/react/withYak";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

export default withYak(
  {
    // keep this comment
    displayNames: true,
    debug: { pattern: "component.tsx", types: ["css"] },
  },
  nextConfig,
);
