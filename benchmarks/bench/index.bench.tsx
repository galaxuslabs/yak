import { GCProfiler, getHeapStatistics } from "node:v8";
import { renderToString } from "react-dom/server";
import { Bench } from "tinybench";
import { ServerStyleSheet } from "styled-components";
import { KanjiLetterComponentYak } from "./generated/KanjiLetterComponent.yak.compiled";
import React from "react";
import { KanjiLetterComponentStyled } from "./generated/KanjiLetterComponent.styled-components";

// Pure Components
import { PureComponentsYak } from "./generated/PureComponents.yak.compiled";
import { PureComponentsStyled } from "./generated/PureComponents.styled-components";

// Attrs Components
import { AttrsComponentsYak } from "./generated/AttrsComponents.yak.compiled";
import { AttrsComponentsStyled } from "./generated/AttrsComponents.styled-components";

// CSS Prop Components
import { CssPropComponentsYak } from "./generated/CssPropComponents.yak.compiled";
import { CssPropComponentsStyled } from "./generated/CssPropComponents.styled-components";

// Dynamic Props Components
import { DynamicPropsComponentsYak } from "./generated/DynamicPropsComponents.yak.compiled";
import { DynamicPropsComponentsStyled } from "./generated/DynamicPropsComponents.styled-components";

// Nested Components
import { NestedComponentsYak } from "./generated/NestedComponents.yak.compiled";
import { NestedComponentsStyled } from "./generated/NestedComponents.styled-components";

// Industry-standard benchmarks (ported from styled-components):
//   https://github.com/styled-components/styled-components/tree/main/packages/benchmarks/src/cases
import { TreeYak } from "./generated/Tree.yak.compiled";
import { TreeStyled } from "./generated/Tree.styled-components";
import { SierpinskiYak } from "./generated/Sierpinski.yak.compiled";
import { SierpinskiStyled } from "./generated/Sierpinski.styled-components";
import {
  CrossRequestCacheYak,
  RENDER_COUNT as CROSS_REQUEST_CACHE_COUNT,
} from "./generated/CrossRequestCache.yak.compiled";
import { CrossRequestCacheStyled } from "./generated/CrossRequestCache.styled-components";

// Tree shape extremes
import { TreeDeepYak } from "./generated/TreeDeep.yak.compiled";
import { TreeDeepStyled } from "./generated/TreeDeep.styled-components";
import { TreeWideYak } from "./generated/TreeWide.yak.compiled";
import { TreeWideStyled } from "./generated/TreeWide.styled-components";

// Idiomatic-yak rewrites
import { IdiomaticTreeYak } from "./generated/IdiomaticTree.yak.compiled";
import { IdiomaticTreeStyled } from "./generated/IdiomaticTree.styled-components";
import { IdiomaticDynamicPropsComponentsYak } from "./generated/IdiomaticDynamicProps.yak.compiled";
import { IdiomaticDynamicPropsComponentsStyled } from "./generated/IdiomaticDynamicProps.styled-components";
import * as RuntimePathsYak from "./generated/RuntimePaths.yak.compiled";
import * as RuntimePathsStyled from "./generated/RuntimePaths.styled-components";
import { RUNTIME_PATHS } from "./rows.ts";

// Usage:
//   node index.bench.mjs                 measures all cases
//   node index.bench.mjs --list          prints the name of each case, one per line
//   node index.bench.mjs --case <name>   measures only this case
//
// For each case it prints one "<name> x <ops> ops/sec (median) ±<mad>% MAD (<n> samples)" line
// and one "<name> allocates <bytes> bytes/op (<n> ops)" line.

// Time budget of each case. The median of the samples ignores single stalled samples
const BENCH_TIME_MS = 5000;
const BENCH_WARMUP_TIME_MS = 1000;

(async () => {
  const cases = new Map<string, () => void>();
  const bench = {
    add(name: string, fn: () => void) {
      cases.set(name, fn);
      return bench;
    },
  };

  bench
    // Original Kanji Letter Components
    .add("render KanjiLetterComponentStyled", () => {
      renderToString(<KanjiLetterComponentStyled />).length;
    })
    .add("render KanjiLetterComponentYak", () => {
      renderToString(<KanjiLetterComponentYak />).length;
    })

    // Pure Components (1000 basic styled components)
    .add("render PureComponentsStyled", () => {
      renderToString(<PureComponentsStyled />).length;
    })
    .add("render PureComponentsYak", () => {
      renderToString(<PureComponentsYak />).length;
    })

    // Attrs Components (1000 components with .attrs())
    .add("render AttrsComponentsStyled", () => {
      renderToString(<AttrsComponentsStyled />).length;
    })
    .add("render AttrsComponentsYak", () => {
      renderToString(<AttrsComponentsYak />).length;
    })

    // CSS Prop Components (1000 css prop usage)
    .add("render CssPropComponentsStyled", () => {
      renderToString(<CssPropComponentsStyled />).length;
    })
    .add("render CssPropComponentsYak", () => {
      renderToString(<CssPropComponentsYak />).length;
    })

    // Dynamic Props Components (1000 components with dynamic styling)
    .add("render DynamicPropsComponentsStyled", () => {
      renderToString(<DynamicPropsComponentsStyled />).length;
    })
    .add("render DynamicPropsComponentsYak", () => {
      renderToString(<DynamicPropsComponentsYak />).length;
    })

    // Nested Components (200 components with 5 levels of inheritance)
    .add("render NestedComponentsStyled", () => {
      renderToString(<NestedComponentsStyled />).length;
    })
    .add("render NestedComponentsYak", () => {
      renderToString(<NestedComponentsYak />).length;
    })

    // Tree mount (industry-standard)
    .add("render TreeStyled", () => {
      renderToString(<TreeStyled />).length;
    })
    .add("render TreeYak", () => {
      renderToString(<TreeYak />).length;
    })

    // Sierpinski Triangle (industry-standard, dynamic per-instance styles)
    .add("render SierpinskiStyled", () => {
      renderToString(<SierpinskiStyled />).length;
    })
    .add("render SierpinskiYak", () => {
      renderToString(<SierpinskiYak />).length;
    })

    // Cross-request cache: six sequential SSR mounts with stable child props.
    .add("render CrossRequestCacheStyled", () => {
      for (let i = 0; i < CROSS_REQUEST_CACHE_COUNT; i++) {
        renderToString(<CrossRequestCacheStyled count={i} />).length;
      }
    })
    .add("render CrossRequestCacheYak", () => {
      for (let i = 0; i < CROSS_REQUEST_CACHE_COUNT; i++) {
        renderToString(<CrossRequestCacheYak count={i} />).length;
      }
    })

    // Tree shape extremes: deep recursion vs wide sibling fan-out.
    // Both shapes are ~1.5k boxes; the difference is React render depth.
    .add("render TreeDeepStyled", () => {
      renderToString(<TreeDeepStyled />).length;
    })
    .add("render TreeDeepYak", () => {
      renderToString(<TreeDeepYak />).length;
    })
    .add("render TreeWideStyled", () => {
      renderToString(<TreeWideStyled />).length;
    })
    .add("render TreeWideYak", () => {
      renderToString(<TreeWideYak />).length;
    })

    // Idiomatic-yak Tree: same workload as Tree, finite-enum props as class toggles.
    .add("render IdiomaticTreeStyled", () => {
      renderToString(<IdiomaticTreeStyled />).length;
    })
    .add("render IdiomaticTreeYak", () => {
      renderToString(<IdiomaticTreeYak />).length;
    })

    // Idiomatic-yak DynamicProps: same workload as DynamicPropsComponents,
    // every $primary/$size/$variant/$disabled branch is a class toggle.
    .add("render IdiomaticDynamicPropsStyled", () => {
      renderToString(<IdiomaticDynamicPropsComponentsStyled />).length;
    })
    .add("render IdiomaticDynamicPropsYak", () => {
      renderToString(<IdiomaticDynamicPropsComponentsYak />).length;
    })

    // SSR with critical-CSS extraction. Each iteration produces what the
    // browser actually needs to paint: HTML *and* the CSS payload.
    .add("render SsrExtractionStyled", () => {
      const sheet = new ServerStyleSheet();
      try {
        renderToString(sheet.collectStyles(<PureComponentsStyled />)).length;
        sheet.getStyleTags().length;
      } finally {
        sheet.seal();
      }
    })
    .add("render SsrExtractionYak", () => {
      renderToString(<PureComponentsYak />).length;
    });

  // Runtime paths: one styled-components and one yak case per path
  for (const [, name] of RUNTIME_PATHS) {
    const Styled = RuntimePathsStyled[
      `RuntimePath${name}Styled` as keyof typeof RuntimePathsStyled
    ] as React.FunctionComponent;
    const Yak = RuntimePathsYak[
      `RuntimePath${name}Yak` as keyof typeof RuntimePathsYak
    ] as React.FunctionComponent;
    bench
      .add(`render RuntimePath${name}Styled`, () => {
        renderToString(<Styled />).length;
      })
      .add(`render RuntimePath${name}Yak`, () => {
        renderToString(<Yak />).length;
      });
  }

  const args = process.argv.slice(2);
  if (args[0] === "--list") {
    console.log([...cases.keys()].join("\n"));
    return;
  }
  const selected = args[0] === "--case" ? [args[1]] : [...cases.keys()];
  for (const name of selected) {
    if (!cases.has(name)) throw new Error(`Unknown benchmark case: ${name}`);
  }

  const runner = new Bench({ time: BENCH_TIME_MS, warmupTime: BENCH_WARMUP_TIME_MS, throws: true });
  for (const name of selected) runner.add(name, cases.get(name)!);
  for (const task of runner.runSync()) {
    const { result } = task;
    if (result.state !== "completed") throw new Error(`${task.name} ended as ${result.state}`);
    const { p50, mad } = result.throughput;
    console.log(
      `${task.name} x ${p50.toFixed(2)} ops/sec (median) ±${((mad / p50) * 100).toFixed(2)}% MAD ` +
        `(${result.latency.samplesCount} samples)`,
    );
  }

  // The bytes a case allocates depend on the code and not on the load of the machine,
  // so they show a change that the noise of the timings hides
  for (const name of selected) {
    const { bytes, ops } = measureAllocations(cases.get(name)!);
    console.log(`${name} allocates ${Math.round(bytes)} bytes/op (${ops} ops)`);
  }
})();

// Runs `fn` for about ALLOCATION_TIME_MS and returns the bytes it allocates per call.
// The heap only grows by allocation and only shrinks by garbage collection, so the
// allocated bytes are the growth of the used heap plus the bytes that each GC frees.
// The used heap grows in allocation buffers and not per object, so one measurement can
// be off by one buffer. More calls make this error smaller per call, so a fast machine
// gets a more exact average. The bytes per call do not depend on the machine speed.
const ALLOCATION_TIME_MS = 250;
const ALLOCATION_MIN_OPS = 5;

function measureAllocations(fn: () => void): { bytes: number; ops: number } {
  // Warm up again, the optimized code of this case can be gone after the other cases
  const warmupEnd = performance.now() + 50;
  while (performance.now() < warmupEnd) fn();

  const profiler = new GCProfiler();
  profiler.start();
  const usedBefore = getHeapStatistics().used_heap_size;
  const end = performance.now() + ALLOCATION_TIME_MS;
  let ops = 0;
  while (ops < ALLOCATION_MIN_OPS || performance.now() < end) {
    fn();
    ops++;
  }
  const usedAfter = getHeapStatistics().used_heap_size;
  const freed = (profiler.stop()?.statistics ?? []).reduce(
    (sum, gc) =>
      sum + gc.beforeGC.heapStatistics.usedHeapSize - gc.afterGC.heapStatistics.usedHeapSize,
    0,
  );
  return { bytes: (usedAfter - usedBefore + freed) / ops, ops };
}
