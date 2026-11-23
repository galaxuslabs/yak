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

function roundOrder(round: number): Side[] {
  const order: Side[] = round % 2 === 1 ? ["base", "pr"] : ["pr", "base"];
  return order.filter((side) => side === "pr" || hasBase);
}

function group<T>(title: string, block: () => Promise<T>): Promise<T> {
  if (inGitHubActions) console.log(`::group::${title}`);
  return block().finally(() => {
    if (inGitHubActions) console.log("::endgroup::");
  });
}

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

// Both sides of a case run seconds apart, so a change of the machine speed affects both
// the same way. A new process for each run keeps the JIT state of one case out of the others.
for (const name of listCases()) {
  await group(name, async () => {
    for (let round = 1; round <= rounds; round++) {
      for (const side of roundOrder(round)) await runSide(side, round, ["--case", name]);
    }
  });
}

writeCpuStat("cpu.stat-end");
