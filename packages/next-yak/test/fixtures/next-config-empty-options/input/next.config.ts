import type { NextConfig } from "next";
import { withYak } from "next-yak/withYak";

const nextConfig: NextConfig = {};

export default withYak(
  { experiments: { suppressDeprecationWarnings: true } },
  nextConfig,
);
