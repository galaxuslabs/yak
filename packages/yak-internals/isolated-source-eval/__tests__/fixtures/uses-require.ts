import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

export const size = require("./require-tokens.cjs").size;
