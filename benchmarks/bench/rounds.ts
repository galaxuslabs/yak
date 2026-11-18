// Runs the benchmark bundles of main and the PR in turns and writes one log per side and round.
//
// Usage: node bench/rounds.ts [--rounds <n>] [--no-base]
//
// Reads  bench/dist-base/index.bench.mjs  the bundle of main (left out when it is missing or with --no-base)
//        bench/dist/index.bench.mjs       the bundle of the PR
// Writes bench/runs/<side>.<round>.log    for side "base" or "pr", in the input format of report.ts
//        bench/runs/cpu.stat-start/-end   `date +%s` and the first line of /proc/stat, on Linux only
//
// Each case runs for main and PR in turns, in a new Node process each time: main, PR, PR, main,
// main, PR. Both sides of a case run seconds apart, so a change of the machine speed affects both
// the same way, and no case changes the JIT state of another case.
//
// A failing main run removes main from the results. A failing PR run stops the script with an error.

import { spawn, spawnSync } from "node:child_process";
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { parseArgs } from "node:util";

type Side = "base" | "pr";

const BUNDLES: Record<Side, string> = {
  base: "bench/dist-base/index.bench.mjs",
  pr: "bench/dist/index.bench.mjs",
};
const LABELS: Record<Side, string> = { base: "main", pr: "PR" };
const OUT_DIR = "bench/runs";

const { values } = parseArgs({
  options: {
    rounds: { type: "string", default: "3" },
    "no-base": { type: "boolean", default: false },
  },
});
const rounds = Number(values.rounds);
if (!Number.isInteger(rounds) || rounds < 1) {
  throw new Error(`--rounds must be a positive integer, got ${values.rounds}`);
}

let hasBase = !values["no-base"] && existsSync(BUNDLES.base);
const inGitHubActions = process.env.GITHUB_ACTIONS === "true";

// Main, PR in odd rounds and PR, main in even rounds
function roundOrder(round: number): Side[] {
  const order: Side[] = round % 2 === 1 ? ["base", "pr"] : ["pr", "base"];
  return order.filter((side) => side === "pr" || hasBase);
}

// Collapses the output of a block in the GitHub Actions log
function group<T>(title: string, block: () => Promise<T>): Promise<T> {
  if (inGitHubActions) console.log(`::group::${title}`);
  return block().finally(() => {
    if (inGitHubActions) console.log("::endgroup::");
  });
}

// Runs one bundle, prints its output and adds the output to the log of its side and round
function run(side: Side, round: number, args: string[]): Promise<void> {
  const log = `${OUT_DIR}/${side}.${round}.log`;
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--enable-source-maps", BUNDLES[side], ...args], {
      env: { ...process.env, NODE_ENV: "production" },
      stdio: ["ignore", "pipe", "pipe"],
    });
    const write = (chunk: Buffer) => {
      process.stdout.write(chunk);
      appendFileSync(log, chunk);
    };
    child.stdout.on("data", write);
    child.stderr.on("data", write);
    child.on("error", reject);
    child.on("close", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`The ${LABELS[side]} run ${round} ended with exit code ${code}`));
    });
  });
}

async function runSide(side: Side, round: number, args: string[] = []) {
  if (side === "base" && !hasBase) return;
  try {
    await run(side, round, args);
  } catch (error) {
    if (side === "pr") throw error;
    console.warn(`${(error as Error).message}. The results leave out main.`);
    hasBase = false;
    for (let r = 1; r <= rounds; r++) rmSync(`${OUT_DIR}/base.${r}.log`, { force: true });
  }
}

function writeCpuStat(file: string) {
  if (!existsSync("/proc/stat")) return;
  const cpu = readFileSync("/proc/stat", "utf8").split("\n")[0];
  writeFileSync(`${OUT_DIR}/${file}`, `${Math.round(Date.now() / 1000)}\n${cpu}\n`);
}

function listCases(): string[] {
  const result = spawnSync(process.execPath, [BUNDLES.pr, "--list"], { encoding: "utf8" });
  if (result.status !== 0)
    throw new Error(`The PR bundle failed to list its cases:\n${result.stderr}`);
  const names = result.stdout.split("\n").filter(Boolean);
  if (names.length === 0) throw new Error("The PR bundle lists no cases");
  return names;
}

rmSync(OUT_DIR, { recursive: true, force: true });
mkdirSync(OUT_DIR);
writeCpuStat("cpu.stat-start");

for (const name of listCases()) {
  await group(name, async () => {
    for (let round = 1; round <= rounds; round++) {
      for (const side of roundOrder(round)) await runSide(side, round, ["--case", name]);
    }
  });
}

writeCpuStat("cpu.stat-end");
