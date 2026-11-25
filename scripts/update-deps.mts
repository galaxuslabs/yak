#!/usr/bin/env node

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

type PackageRule = { enabled?: boolean; matchPackageNames?: string[] };

const { core }: { core: Record<string, string> } = JSON.parse(
  execFileSync("pnpm", ["config", "get", "catalogs", "--json"], { encoding: "utf8" }),
);
const { packageRules }: { packageRules: PackageRule[] } = JSON.parse(
  readFileSync(new URL("../renovate.json", import.meta.url), "utf8"),
);
const held = packageRules
  .filter((rule) => rule.enabled === false)
  .flatMap((rule) => rule.matchPackageNames ?? []);
const skip = [...Object.keys(core), ...held].map((name) => `!${name}`);

execFileSync("pnpm", ["update", "-r", "--latest", ...skip], { stdio: "inherit" });
