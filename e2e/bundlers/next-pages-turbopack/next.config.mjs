import { withYak } from "@yak/react/withYak";

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["e2e-installed-tokens-excluded"],
};

// Two-mode e2e: opt out of static folding only when YAK_E2E_FOLD_STATIC is
// "false". Otherwise pass no foldStatic key so the config stays inert.
const yakOptions = process.env.YAK_E2E_FOLD_STATIC === "false" ? { foldStatic: false } : {};

export default withYak(yakOptions, nextConfig);
