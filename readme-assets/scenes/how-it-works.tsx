/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
import { draw, ease, motion, render, type Color, type Span } from "svjeez";
import { readFileSync } from "node:fs";
import { code, rect, travel, visible, type Point, type Rect } from "svjeez/extras";
import {
  canvas,
  compact,
  HEAD,
  header,
  highlight,
  ink,
  MONO,
  page,
  panel,
  shown,
  styles,
  theme,
  type Step,
} from "../slide.tsx";

const SOURCE = `import { styled } from "@yak/react";
const Button = styled.button\`
  font-size: 1.5em;
  color: palevioletred;
  &:hover {
    color: red;
  }
\`;`;

// What the JS output does, written as a plain React component: it only sets the class name
const COMPILED = `import "./Button.yak.css";
const Button = (props) => (
  <button {...props}
    className="ym7uBBu" />
);`;

// The real yak-swc output. The bundler keeps the rule as it is and adds it to the app stylesheet.
const CSS = `.ym7uBBu {
  font-size: 1.5em;
  color: palevioletred;
  &:hover {
    color: red;
  }
}`;

const W = 820;
const H = 648;
const M = 28;
const FS = 14;
const TOP = 132;

// A 2 x 2 grid of windows: the source and the JS output on the left, the yak CSS file and the
// app stylesheet on the right. The two tools sit on one rail between the rows: the plugin in the
// lane between the columns, the bundler in the gap of the right column.
const LEFT_W = 340;
const RIGHT_W = 280;
const panelSource = rect(M, TOP, LEFT_W, 244);
const panelJs = rect(M, TOP + 244 + 16, LEFT_W, 228);
const panelCss = rect(W - M - RIGHT_W, TOP, RIGHT_W, 220);
const panelApp = rect(panelCss.x, TOP + 220 + 48, RIGHT_W, 220);
const RAIL = TOP + 220 + 24;

const opts = (x: number, y: number) => ({ x, y, fontSize: FS, theme, fontFamily: MONO });
const src = code(highlight(SOURCE), opts(panelSource.x + 20, panelSource.y + HEAD));
const js = code(highlight(COMPILED), opts(panelJs.x + 20, panelJs.y + HEAD));
const yakCss = code(highlight(CSS), opts(panelCss.x + 20, panelCss.y + HEAD));
const appCss = code(highlight(CSS), opts(panelApp.x + 20, panelApp.y + HEAD));

// Beats in seconds
// Step 1 is short, so the first dot moves within two seconds and the reader sees an animation
const DURATION = 15.2;
const WRITE: Span = { at: 0, over: 1.2 };
const BUILD: Span = { at: 1.2, over: 7.5 };
const BUNDLE: Span = { at: 8.7, over: 5.5 };
const AGAIN: Span = { at: 14.2, over: 1 };
const IN = 1.6;
const SPLIT = 2.5;
const OUTPUT = 3.3;
const THROUGH = 9.2;
const BUNDLED = 10.2;
const RESET = 13.9;

const STEPS: Step[] = [
  {
    label: "Your code",
    title: "Write a styled component",
    sub: "A tagged template in a .tsx file.",
    spans: [WRITE, AGAIN],
  },
  {
    label: "At build time",
    title: "The yak SWC plugin splits JS and CSS",
    sub: "A Rust plugin in your bundler writes the styles to their own CSS file.",
    spans: [BUILD],
  },
  {
    label: "In your bundler",
    title: "Your bundler handles the CSS",
    sub: "PostCSS for webpack and Vite, Lightning CSS for Turbopack and Rsbuild.",
    spans: [BUNDLE],
  },
];

// Shows from `at` until the reset, without a fade in
const stay = (at: number) =>
  motion({ opacity: 0 }).at(at).set({ opacity: 1 }).at(RESET).to({ opacity: 0 }, 0.5, ease.in);
// Fades in from `at` with a small rise and stays until the reset
const arrive = (at: number) =>
  motion({ opacity: 0, y: 6 })
    .at(at)
    .to({ opacity: 1, y: 0 }, 0.5)
    .at(RESET)
    .to({ opacity: 0 }, 0.5, ease.in);

const placeholder = (r: Rect, text: string, until: number) => (
  <text
    x={r.x + 20}
    y={r.y + HEAD + 14}
    class="mono"
    fontSize={FS}
    fill={theme.base03}
    animation={shown([{ at: 0, over: until }, AGAIN], 0.3, DURATION)}
  >
    {text}
  </text>
);

// A tool on the rail: an outlined pill that fills while the tool works
const pill = (cx: number, label: string, lit: Span[]) => {
  const w = label.length * 7.4 + 32;
  const h = 32;
  const x = cx - w / 2;
  const y = RAIL - h / 2;
  const text = (fill: Color) => (
    <text
      x={cx}
      y={RAIL + 5}
      textAnchor="middle"
      class="sans"
      fontSize={14}
      fontWeight={600}
      fill={fill}
    >
      {label}
    </text>
  );
  return (
    <>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={h / 2}
        fill={page.canvas}
        stroke={page.edge}
        strokeWidth={1.5}
      />
      {text(page.body)}
      <g animation={visible(lit, 0.25)}>
        <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={ink.card} />
        {text(ink.fg)}
      </g>
    </>
  );
};

// A cubic curve as a path and as points for a dot to follow
const curve = (a: Point, c1: Point, c2: Point, b: Point) => {
  const at = (t: number) => {
    const u = 1 - t;
    return {
      x: u * u * u * a.x + 3 * u * u * t * c1.x + 3 * u * t * t * c2.x + t * t * t * b.x,
      y: u * u * u * a.y + 3 * u * u * t * c1.y + 3 * u * t * t * c2.y + t * t * t * b.y,
    };
  };
  return {
    d: `M${a.x} ${a.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${b.x} ${b.y}`,
    points: Array.from({ length: 25 }, (_, i) => at(i / 24)),
  };
};

// A wire draws itself while a dot runs along it, then stays until the reset
const wire = (c: ReturnType<typeof curve>, at: number, over: number) => (
  <>
    <g animation={stay(at)}>
      <path
        d={c.d}
        fill="none"
        stroke={page.body}
        strokeOpacity={0.5}
        strokeWidth={1.5}
        animation={draw({ at, over }, ease.inOut)}
      />
    </g>
    <circle cx={0} cy={0} r={4} fill={page.accent} animation={travel(c.points, { at, over })} />
  </>
);

const PLUGIN_X = (panelSource.x + LEFT_W + panelCss.x) / 2;
const bundlerX = panelCss.x + RIGHT_W / 2;

// The source goes into the plugin, the plugin sends CSS up to the yak file and JS down to the
// output. The wires in and out run side by side in the lane above the plugin.
const right = panelSource.x + LEFT_W;
const toPlugin = curve(
  { x: right, y: panelSource.y + 118 },
  { x: PLUGIN_X - 20, y: panelSource.y + 118 },
  { x: PLUGIN_X - 20, y: RAIL - 60 },
  { x: PLUGIN_X - 20, y: RAIL - 16 },
);
const toCss = curve(
  { x: PLUGIN_X + 20, y: RAIL - 16 },
  { x: PLUGIN_X + 20, y: RAIL - 70 },
  { x: PLUGIN_X + 30, y: panelCss.y + 106 },
  { x: panelCss.x, y: panelCss.y + 106 },
);
const toJs = curve(
  { x: PLUGIN_X, y: RAIL + 16 },
  { x: PLUGIN_X, y: RAIL + 60 },
  { x: PLUGIN_X - 10, y: panelJs.y + 88 },
  { x: right, y: panelJs.y + 88 },
);
// The CSS file goes down through the bundler into the app stylesheet
const toApp = curve(
  { x: bundlerX, y: panelCss.y + panelCss.h },
  { x: bundlerX, y: RAIL },
  { x: bundlerX, y: RAIL },
  { x: bundlerX, y: panelApp.y },
);

// Each face only holds the characters it sets. Code and window text use the mono face, so it takes
// every character of this file, which is more than it needs but never misses one.
const css = await styles({
  regular: STEPS.map((s) => s.sub).join(""),
  semibold: STEPS.map((s) => s.label).join("") + "yak SWC plugin" + "bundler CSS pipeline",
  black: STEPS.map((s) => s.title).join(""),
  mono: readFileSync(new URL(import.meta.url), "utf8"),
});

export default function build(): string {
  return compact(
    render(
      {
        width: W,
        height: H,
        duration: DURATION,
        title: "How yak works",
        desc: "A styled Button goes into the yak SWC plugin at build time. The plugin writes the styles to Button.yak.css and leaves a component that only sets the class name. The bundler then runs the CSS file through its CSS pipeline, PostCSS or Lightning CSS, into the app stylesheet.",
        css,
        reducedMotion: { at: 11.5 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(panelSource, "Button.tsx", "source")}
        {panel(panelJs, "Button.tsx", "works like")}
        {panel(panelCss, "Button.yak.css", "from yak")}
        {panel(panelApp, "app.css", "bundled")}
        {src.node}
        {placeholder(panelJs, "/* written by yak */", OUTPUT + 0.1)}
        {placeholder(panelCss, "/* written by yak */", OUTPUT + 0.1)}
        {placeholder(panelApp, "/* written by your bundler */", BUNDLED + 0.1)}

        {wire(toPlugin, IN, 0.7)}
        {wire(toCss, SPLIT, 0.8)}
        {wire(toJs, SPLIT, 0.8)}
        {wire(toApp, THROUGH, 1)}

        {pill(PLUGIN_X, "yak SWC plugin", [{ at: IN + 0.6, over: OUTPUT + 0.8 - IN }])}
        {pill(bundlerX, "bundler CSS pipeline", [{ at: THROUGH + 0.3, over: 1.4 }])}

        <g animation={arrive(OUTPUT)}>{yakCss.node}</g>
        <g animation={arrive(OUTPUT)}>{js.node}</g>
        <g animation={arrive(BUNDLED)}>{appCss.node}</g>
      </>,
    ),
  );
}
