# benchmarks

Two suites live here:

1. **Runtime benchmarks** under `bench/`. Run on every PR via the [`benchmarks`](../.github/workflows/benchmarks.yml) workflow to catch render-time regressions in the `yak` runtime, and to compare against `styled-components` head-to-head on identical workloads. The workflow upserts a single PR comment with the latest results.
2. **Interactive Next.js demo viewer** under `app/`. The same generated benchmark components, rendered in a real Next.js dev server so you can inspect the DOM, classes, and CSS that each library actually produces.

## Running

```bash
# Browse benchmarks in dev mode (also runs all generators first):
pnpm dev          # http://localhost:3000
pnpm dev:turbo    # same, but Turbopack instead of Webpack

# Regenerate just the source files (parallelized):
pnpm generate

# Build + run the benchmark harness locally and print an HTML results table:
pnpm bench
```

`pnpm dev` automatically runs `pnpm generate` first, so the benchmark sources are always fresh.

`pnpm bench` writes the log of the run to `bench/runs/pr.1.log`. To measure one case, run `pnpm bench:run --case "render TreeYak"`. `pnpm bench:run --list` prints the names of all cases. To compare against an older build, move its `bench/dist` to `bench/dist-base` and run `pnpm bench:rounds`. `pnpm bench:report <dir>` builds the table from all `base.<n>.log` and `pr.<n>.log` files in a directory and uses the median of the runs of each side. The CI workflow posts this table as a PR comment.

## How a benchmark is wired

Every benchmark has the same three layers:

1. **`bench/<case>/gen.ts`** builds a TSX source string for both libraries and hands it to `writeBenchmarkSource()`. The helper writes the source verbatim and, for `yak`, also runs the source through the SWC plugin to produce a `.compiled.tsx` (mimicking what the `withYak` loader does at app build time, since the bench harness has no loader).

2. **`bench/index.bench.tsx`** imports the `.compiled.tsx` (yak) and `.tsx` (sc) outputs, registers each as a [tinybench](https://github.com/tinylibs/tinybench) task, and prints one line per case with its median ops/sec and one with the bytes it allocates per render. `bench/report.ts` reads these lines and pairs the styled-components and yak variants of each workload into the HTML results table.

3. **`app/bench/[slug]/page.tsx`** imports the _non-compiled_ `.tsx` outputs and renders them in the browser, so the real `withYak` webpack loader path is exercised. This is useful for checking that what the bench is measuring matches what would ship to a real Next.js app.

## Adding a new benchmark

1. Create `bench/<case>/gen.ts` (copy any existing one as a template; most boilerplate lives in `_shared.ts`).
2. Add a `generate:bench:<case>` script to `package.json` — `pnpm generate` picks it up automatically via the `^generate:bench:` regex.
3. Add the import + `.add("render <Name>Yak/Styled", () => …)` calls in `bench/index.bench.tsx`, and add a row to `ROWS` in `bench/rows.ts` so it shows up in the results.
4. Add an entry to `app/bench/manifest.ts` and the `components` map in `app/bench/[slug]/page.tsx` so the demo viewer can render it.

## Variance & fairness notes

- Each case runs for 5 seconds after 1 second of warm-up. The result is the median of all samples, so a single stalled sample does not change it.
- For each library we use _its_ idiomatic build-time-extracted form. Mixing them produces meaningless numbers. See `bench/css-prop/gen.ts` for the spelled-out reasoning.
- The `Idiomatic*` benchmarks (e.g. `IdiomaticTree`) pair with their CSS-variable counterparts (`Tree`) to isolate the cost of CSS-variable emission vs class-toggle composition.
- The `Runtime path` rows (`bench/runtime-paths`) render each component from another module than the one declaring it. Within one module `foldStatic` turns static usages into plain elements, so no other workload measures the static path, `styled(Custom)` or a `styled(Component)` chain. No other workload measures one render path alone either.
- The workflow builds the suite of the target branch and of the PR. Then `bench/rounds.ts` runs each case for main and PR in turns (main, PR, PR, main, main, PR), each time in a new Node process, and reports the median. Both sides of a case run seconds apart, so a change of the machine speed affects both the same way. The new process for each run keeps one case from changing the JIT state of the next.
- Allocated bytes per render depend on the code and not on the load of the machine, so they show small changes that the noise of the timings hides.
- The "Measurement quality" section of the PR comment shows the noise floor: styled-components runs the same code on both sides, so its change between main and PR is noise only. The results table marks a yak change as real (bold) only when it is larger than the largest styled-components change and the main and PR runs do not overlap. It marks every other change with ~.
