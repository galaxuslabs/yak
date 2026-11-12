import { withYak } from "next-yak/withYak";

const yakOptions = {
  experiments: {
    suppressDeprecationWarnings: true,
    debug: true,
  },
};

const nextConfig = {};

export default withYak(yakOptions, nextConfig);
