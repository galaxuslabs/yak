import { existsSync, readdirSync, readFileSync } from "node:fs";
import { cpus, release, totalmem } from "node:os";
import { join } from "node:path";
import { ROWS } from "./rows.ts";

// `spread` is the ±MAD of the median, in percent
type Measurement = { hz: number; spread: number; bytes?: number };
type Summary = {
  hz: number;
  spread: number;
  bytes?: number;
  range?: number;
  runs: number;
  // For the overlap check of a change
  hzRuns: number[];
  bytesRuns: number[];
};

const dir = process.argv[2];
const raw = process.argv.includes("--raw");
if (!dir || !existsSync(dir)) {
  console.error("Usage: node bench/report.ts <dir with the run logs> [--raw]");
  process.exit(1);
}

const TIME_LINE = /^(.+) x ([\d.]+) ops\/sec \(median\) ±([\d.]+)% MAD \(\d+ samples\)/;
const ALLOCATION_LINE = /^(.+) allocates (\d+) bytes\/op/;

function parseLog(text: string): Map<string, Measurement> {
  const result = new Map<string, Measurement>();
  for (const line of text.split("\n")) {
    const time = line.match(TIME_LINE);
    if (time) {
      result.set(time[1], {
        ...result.get(time[1]),
        hz: Number(time[2]),
        spread: Number(time[3]),
      });
    }
    const allocation = line.match(ALLOCATION_LINE);
    if (allocation && result.has(allocation[1])) {
      result.get(allocation[1])!.bytes = Number(allocation[2]);
    }
  }
  return result;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function summarize(side: string): Map<string, Summary> {
  const runs = readdirSync(dir)
    .filter((file) => new RegExp(`^${side}\\.\\d+\\.log$`).test(file))
    .map((file) => parseLog(readFileSync(join(dir, file), "utf8")));
  const names = new Set(runs.flatMap((run) => [...run.keys()]));
  const result = new Map<string, Summary>();
  for (const name of names) {
    const measurements = runs.flatMap((run) => run.get(name) ?? []);
    const hz = measurements.map((m) => m.hz);
    const bytes = measurements.flatMap((m) => m.bytes ?? []);
    const hzMedian = median(hz);
    result.set(name, {
      hz: hzMedian,
      spread: median(measurements.map((m) => m.spread)),
      bytes: bytes.length > 0 ? median(bytes) : undefined,
      range: hz.length > 1 ? ((Math.max(...hz) - Math.min(...hz)) / hzMedian) * 100 : undefined,
      runs: hz.length,
      hzRuns: hz,
      bytesRuns: bytes,
    });
  }
  return result;
}

// /proc/stat fields: user nice system idle iowait irq softirq steal
function cpuUsage() {
  const read = (file: string) => {
    const path = join(dir, file);
    if (!existsSync(path)) return undefined;
    const [time, cpu] = readFileSync(path, "utf8").trim().split("\n");
    if (!cpu?.startsWith("cpu ")) return undefined;
    return { time: Number(time), fields: cpu.trim().split(/\s+/).slice(1, 9).map(Number) };
  };
  const start = read("cpu.stat-start");
  const end = read("cpu.stat-end");
  if (!start || !end) return undefined;
  const delta = end.fields.map((v, i) => v - start.fields[i]);
  const total = delta.reduce((a, b) => a + b, 0);
  if (total <= 0) return undefined;
  const pct = (v: number) => (v / total) * 100;
  return {
    seconds: end.time - start.time,
    busy: pct(total - delta[3] - delta[4]),
    iowait: pct(delta[4]),
    steal: pct(delta[7]),
  };
}

const fmt = (v: number) => v.toFixed(2);
const change = (from: number, to: number) => ((to - from) / from) * 100;
const signed = (v: number) => `${v >= 0 ? "+" : ""}${fmt(v)}%`;
const kb = (bytes: number | undefined) =>
  bytes === undefined ? "n/a" : `${(bytes / 1024).toFixed(1)} KB`;

// "x% faster" or "x% slower", relative to the slower of the two
function speed(from: number, to: number): string {
  return to >= from ? `${fmt(change(from, to))}% faster` : `${fmt(change(to, from))}% slower`;
}

const base = summarize("base");
const pr = summarize("pr");
const hasBase = base.size > 0;
const lines: string[] = [];

// Noise floor: styled-components runs the same code for main and PR, so its change is noise only
const styledNames = [...pr.keys()].filter((name) => name.endsWith("Styled") && base.has(name));
const timeDrift = styledNames.map((name) => Math.abs(change(base.get(name)!.hz, pr.get(name)!.hz)));
const allocationDrift = styledNames.flatMap((name) => {
  const from = base.get(name)!.bytes;
  const to = pr.get(name)!.bytes;
  return from && to !== undefined ? [Math.abs(change(from, to))] : [];
});
const timeFloor = timeDrift.length > 0 ? Math.max(...timeDrift) : undefined;
const allocationFloor = allocationDrift.length > 0 ? Math.max(...allocationDrift) : undefined;

// A change is real when it is larger than the largest styled-components change
// and no run of one side is in the range of the runs of the other side.
// On an A/A run (main against main) this rule marked no change as real.
function isReal(from: number[], to: number[], floor: number | undefined): boolean {
  if (floor === undefined || from.length === 0 || to.length === 0) return false;
  const delta = Math.abs(change(median(from), median(to)));
  const apart = Math.max(...from) < Math.min(...to) || Math.max(...to) < Math.min(...from);
  return delta > floor && apart;
}

const mark = (text: string, real: boolean) => (real ? text : `~${text}`);

const prRuns = Math.max(0, ...[...pr.values()].map((s) => s.runs));
const baseRuns = Math.max(0, ...[...base.values()].map((s) => s.runs));
if (prRuns > 1 || baseRuns > 1) {
  lines.push(
    `<p>Median of ${prRuns} PR runs${hasBase ? ` and ${baseRuns} main runs, run in turns` : ""}.</p>`,
    "",
  );
}

const repository = process.env.GITHUB_REPOSITORY;
const commit = process.env.COMMIT_SHA ?? process.env.GITHUB_SHA;
function link(row: (typeof ROWS)[number]): string {
  if (!repository || !commit) return row.label;
  let anchor = "";
  if (!row.source.endsWith("gen.ts")) {
    const sourcePath = join(import.meta.dirname, row.source);
    const index = existsSync(sourcePath)
      ? readFileSync(sourcePath, "utf8")
          .split("\n")
          .findIndex((line) => line.includes(`"${row.yak}"`))
      : -1;
    if (index >= 0) anchor = `#L${index + 1}`;
  }
  const url = `https://github.com/${repository}/blob/${commit}/benchmarks/bench/${row.source}${anchor}`;
  return `<a href="${url}">${row.label}</a>`;
}

type Result = { cells: string[]; real: boolean };
function result(row: (typeof ROWS)[number]): Result {
  const yak = pr.get(row.yak);
  const baseYak = base.get(row.yak);
  if (!hasBase) {
    return { cells: [yak ? `${Math.round(yak.hz)}` : "n/a", kb(yak?.bytes)], real: false };
  }
  if (!yak) return { cells: ["removed", "—"], real: true };
  if (!baseYak) return { cells: ["new", "—"], real: true };
  const timeReal = isReal(baseYak.hzRuns, yak.hzRuns, timeFloor);
  const time = mark(speed(baseYak.hz, yak.hz), timeReal);
  const bytesReal =
    yak.bytes !== undefined && !!baseYak.bytes
      ? isReal(baseYak.bytesRuns, yak.bytesRuns, allocationFloor)
      : false;
  const allocated =
    yak.bytes !== undefined && baseYak.bytes
      ? mark(signed(change(baseYak.bytes, yak.bytes)), bytesReal)
      : "—";
  return { cells: [time, allocated], real: timeReal || bytesReal };
}

function table(rows: Array<{ row: (typeof ROWS)[number]; result: Result }>) {
  lines.push("<table>", "<tr>", " <td>Benchmark");
  if (hasBase) lines.push(" <td>yak ops/sec vs main", " <td>yak allocates vs main");
  else lines.push(" <td>yak ops/sec", " <td>yak allocates");
  for (const { row, result } of rows) {
    lines.push("<tr>", ` <td>${link(row)}`, ...result.cells.map((cell) => ` <td>${cell}`));
  }
  lines.push("</table>", "");
}

const results = ROWS.map((row) => ({ row, result: result(row) }));
if (!hasBase) {
  table(results);
} else {
  const changed = results.filter(({ result }) => result.real);
  const unchanged = results.filter(({ result }) => !result.real);
  if (changed.length > 0) table(changed);
  else lines.push("<p>No real change against main.</p>", "");
  if (unchanged.length > 0) {
    lines.push(
      "<details>",
      `<summary>${unchanged.length} benchmarks without a real change</summary>`,
      "",
    );
    table(unchanged);
    lines.push("</details>", "");
  }
}

const all = [...base.values(), ...pr.values()];
const ranges = all.flatMap((s) => (s.range === undefined ? [] : [s.range]));
const spreads = all.map((s) => s.spread);
const stats = (values: number[]) =>
  `median ${fmt(median(values))}%, max ${fmt(Math.max(...values))}%`;

lines.push("<details>", "<summary>Measurement quality</summary>", "");
const cpuList = cpus();
lines.push(
  `<p>Machine: ${cpuList[0]?.model ?? "unknown CPU"}, ${cpuList.length} vCPUs, ` +
    `${Math.round(totalmem() / 2 ** 30)} GB RAM, kernel ${release()}</p>`,
  "<ul>",
);
if (timeFloor !== undefined || allocationFloor !== undefined) {
  lines.push(
    "<li>A real change is larger than the noise floor, and the main and PR runs do not overlap. " +
      "~ marks a change inside the noise.</li>",
  );
}
if (timeDrift.length > 0) {
  lines.push(
    `<li>Noise floor of ops/sec: styled-components changes by ${stats(timeDrift)} between main and PR. ` +
      `Its code is the same on both sides, so a smaller yak change is likely noise.</li>`,
  );
}
if (allocationDrift.length > 0) {
  lines.push(`<li>Noise floor of allocations: ${stats(allocationDrift)}</li>`);
}
if (ranges.length > 0) {
  lines.push(`<li>Range of ops/sec between runs of one side: ${stats(ranges)}</li>`);
}
if (spreads.length > 0) {
  lines.push(`<li>Spread inside a run (±MAD): ${stats(spreads)}</li>`);
}
const usage = cpuUsage();
if (usage) {
  lines.push(
    `<li>CPU during all runs (${usage.seconds} s): busy ${fmt(usage.busy)}%, ` +
      `steal ${fmt(usage.steal)}%, iowait ${fmt(usage.iowait)}%</li>`,
  );
}
lines.push("</ul>", "");

if (!raw) {
  lines.push("<p>The job summary of the workflow run has the raw values of each case.</p>", "");
  lines.push("</details>");
  console.log(lines.join("\n"));
  process.exit(0);
}

lines.push(
  "<table>",
  "<tr>",
  " <td>Benchmark",
  " <td>main (ops/sec)",
  " <td>PR (ops/sec)",
  " <td>Change",
  " <td>main allocates",
  " <td>PR allocates",
  " <td>Change",
);
const cell = (s: Summary | undefined) =>
  s
    ? `${Math.round(s.hz)} ±${fmt(s.spread)}%${s.range === undefined ? "" : `, range ${fmt(s.range)}%`}`
    : "n/a";
for (const name of new Set([...pr.keys(), ...base.keys()])) {
  const b = base.get(name);
  const p = pr.get(name);
  lines.push(
    "<tr>",
    ` <td>${name}`,
    ` <td>${cell(b)}`,
    ` <td>${cell(p)}`,
    ` <td>${b && p ? signed(change(b.hz, p.hz)) : "n/a"}`,
    ` <td>${kb(b?.bytes)}`,
    ` <td>${kb(p?.bytes)}`,
    ` <td>${b?.bytes && p?.bytes !== undefined ? signed(change(b.bytes, p.bytes)) : "n/a"}`,
  );
}
lines.push("</table>", "", "</details>");

console.log(lines.join("\n"));
