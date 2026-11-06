/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
import { ease, motion, render, type Color, type Span } from "svjeez";
import { readFileSync } from "node:fs";
import { code, morph, rect, visible, type Rect } from "svjeez/extras";
import {
  canvas,
  compact,
  HEAD,
  header,
  highlight,
  ink,
  MONO,
  panel,
  shown,
  styles,
  theme,
  type Step,
} from "../slide.tsx";

const SOURCE = `import { styled } from "@yak/react";

const ProgressBar = styled.div\`
  width: \${(props) =>
    \`\${props.$percent}%\`};
  height: 20px;
  background-color: #3498db;
  transition: width 0.3s ease-in-out;
\`;`;

// What the build output does, written as a plain React component: it sets one class name and
// one CSS variable. The real output (yak-swc, prod) uses the same class and variable names.
const COMPILED = `import "./ProgressBar.yak.css";

const ProgressBar = (props) => (
  <div
    className="ym7uBBu"
    style={{
      "--ym7uBBu1":
        \`\${props.$percent}%\`,
    }}
  />
);`;

const RULE = `.ym7uBBu {
  width: var(--ym7uBBu1);
  height: 20px;
  background-color: #3498db;
  transition: width 0.3s ease-in-out;
}`;

const W = 820;
const H = 548;
const M = 28;
const FS = 14;
const TOP = 132;
const BOTTOM = H - M;
const BLUE = "#3498db";

// Panels: the code on the left, the CSS file and the browser on the right
const panelCode = rect(M, TOP, 376, BOTTOM - TOP);
const panelCss = rect(M + 376 + 16, TOP, W - 2 * M - 376 - 16, 200);
const panelBrowser = rect(panelCss.x, TOP + 200 + 16, panelCss.w, BOTTOM - TOP - 200 - 16);

const opts = (x: number, y: number) => ({ x, y, fontSize: FS, theme, fontFamily: MONO });
const src = code(highlight(SOURCE), opts(panelCode.x + 20, panelCode.y + HEAD));
const out = code(highlight(COMPILED), opts(panelCode.x + 20, panelCode.y + HEAD));
const adv = src.metrics.advance;

const rule = code(highlight(RULE), opts(panelCss.x + 20, panelCss.y + HEAD - 2));
// The line of the rule that reads the CSS variable
const varLine = rule.lines(2);
// A highlight box around a line, a little wider than the text but not taller
const box = (r: Rect) => rect(r.x - 5, r.y + 2, r.w + 10, r.h);

// Beats in seconds
// Step 1 is short, so the card moves within two seconds and the reader sees an animation
const DURATION = 15.9;
const WRITE: Span = { at: 0, over: 1.2 };
const BUILD: Span = { at: 1.2, over: 8.3 };
const RUN: Span = { at: 9.5, over: 5.4 };
const AGAIN: Span = { at: 14.9, over: 1 };
const EXTRACT = 1.7;
const FLY = 0.9;
const VAR = 3.2;
const COMPILE = 5.2;
const LINK = 6.6;
const BROWSER = 9.8;
const RESET = 14.4;
const BACK = 14.7;

// The percent the bar shows, from the first frame in the browser until the reset
const PERCENTS = [
  { at: BROWSER, value: 30 },
  { at: 11.2, value: 75 },
  { at: 12.7, value: 50 },
];
// The last value stays until the browser panel has faded out
const percentSpans = PERCENTS.map((p, i) => ({
  at: p.at,
  over: (PERCENTS[i + 1]?.at ?? RESET + 0.6) - p.at,
}));

const STEPS: Step[] = [
  {
    label: "Your code",
    title: "Styles that use prop values",
    sub: "The same API as styled-components.",
    spans: [WRITE, AGAIN],
  },
  {
    label: "At build time",
    title: "yak turns the value into a CSS variable",
    sub: "The rule goes to a CSS file. Only the value stays dynamic.",
    spans: [BUILD],
  },
  {
    label: "In the browser",
    title: "The prop only sets a CSS variable",
    sub: "The CSS stays the same. Only the style attribute changes.",
    spans: [RUN],
  },
];

const keep = (at: number, over = 0.4) =>
  motion({ opacity: 0 }).at(at).to({ opacity: 1 }, over).at(RESET).to({ opacity: 0 }, 0.5, ease.in);

const placeholder = (r: Rect, text: string, spans: Span[]) => (
  <text
    x={r.x + 20}
    y={r.y + HEAD + 14}
    class="mono"
    fontSize={FS}
    fill={theme.base03}
    animation={shown(spans, 0.3, DURATION)}
  >
    {text}
  </text>
);

const card = (r: Rect) => ({ x: r.x, y: r.y, width: r.w, height: r.h });

// The source lines that stay bright: first all declarations while the card lifts off, then the
// dynamic width while the CSS file shows its variable
const FOCUS = [
  { at: EXTRACT - 0.3, first: 4, last: 8 },
  { at: VAR - 0.3, first: 4, last: 5 },
];
const FOCUS_END = COMPILE - 0.2;
const DIM = 0.7;
const FADE = 0.3;

// Dims every source line outside the current highlight. Each line has its own rectangle in the
// panel color with one timeline, so a change of highlight never dims a line twice. A mask would do
// the same, but the browser draws a mask again on every frame.
const dimLines = () =>
  Array.from({ length: src.lineCount }, (_, i) => {
    const line = i + 1;
    let m = motion({ opacity: 0 });
    let level = 0;
    for (const f of FOCUS) {
      const next = line >= f.first && line <= f.last ? 0 : DIM;
      if (next !== level) m = m.at(f.at).to({ opacity: next }, FADE);
      level = next;
    }
    if (level !== 0) m = m.at(FOCUS_END - FADE).to({ opacity: 0 }, FADE);
    const r = src.lines(line);
    return (
      <rect
        x={panelCode.x + 1}
        y={r.y + 3}
        width={panelCode.w - 2}
        height={r.h}
        fill={ink.card}
        animation={m}
      />
    );
  });

// The rule lifts off its declarations in the source as a card, then moves into the CSS file
const fly = (declaration: string, at: number) => {
  const from = src.find(declaration);
  const to = rule.find(declaration);
  return (
    <g animation={keep(at, 0.25)}>
      <g
        animation={motion({ x: from.x - to.x, y: from.y - to.y })
          .at(at + 0.25)
          .to({ x: 0, y: 0 }, FLY, ease.inOut)}
      >
        <rect
          {...card(rule.bounds.pad(5))}
          rx={6}
          fill={theme.base00}
          stroke={ink.underline}
          animation={motion({ opacity: 1 })
            .at(at + 0.25 + FLY)
            .to({ opacity: 0 }, 0.4)}
        />
        {rule.node}
      </g>
    </g>
  );
};

// A thin line from a name in the compiled code to the line of the rule that uses it. It stays
// until the reset and lights up in the browser, where the div always has the class and the variable.
const link = (fromLine: number, to: Rect, at: number) => {
  const line = out.lines(fromLine);
  const a = { x: line.x + line.w + 8, y: line.center.y };
  const b = { x: to.x - 8, y: to.center.y };
  const mid = (a.x + b.x) / 2;
  const wire = (color: Color, width: number, dash?: string) => (
    <>
      <path
        d={`M${a.x} ${a.y}C${mid} ${a.y} ${mid} ${b.y} ${b.x} ${b.y}`}
        fill="none"
        stroke={color}
        strokeWidth={width}
        strokeDasharray={dash}
      />
      <circle cx={a.x} cy={a.y} r={2.5} fill={color} />
      <circle cx={b.x} cy={b.y} r={2.5} fill={color} />
    </>
  );
  return (
    <g animation={keep(at, 0.3)}>
      {wire(theme.base04, 1.2, "3 3")}
      <g animation={visible([runtime], 0.12)}>{wire(ink.fg, 1.8)}</g>
    </g>
  );
};

const runtime: Span = { at: BROWSER, over: RESET - BROWSER };

// The progress bar in the browser: a track with a border and the blue fill
const track = rect(panelBrowser.x + 20, panelBrowser.y + HEAD, panelBrowser.w - 40, 20);
const widthOf = (percent: number) => (track.w * percent) / 100;
let grow = motion({ width: widthOf(PERCENTS[0].value) });
// The same 0.3s ease-in-out as the transition in the CSS
for (const p of PERCENTS.slice(1))
  grow = grow.at(p.at).to({ width: widthOf(p.value) }, 0.3, ease.inOut);
grow = grow.at(RESET + 0.6).set({ width: widthOf(PERCENTS[0].value) });

const domY = track.y + track.h + 36;
const domH = src.metrics.height;
// The second line is indented by 5 columns (SVG drops leading spaces, so it moves by x instead).
// The value starts 19 columns after that, in `style="--ym7uBBu1: 30%">`.
const INDENT = 5;
const VALUE_COL = INDENT + 19;

// The code panel says which version it shows
const codeLabel = (text: string, spans: Span[]) => (
  <text
    x={panelCode.x + panelCode.w - 18}
    y={panelCode.y + 24}
    class="mono"
    fontSize={12}
    textAnchor="end"
    fill={ink.prompt}
    animation={shown(spans, 0.3, DURATION)}
  >
    {text}
  </text>
);

// Each face only holds the characters it sets. Code and window text use the mono face, so it takes
// every character of this file, which is more than it needs but never misses one.
const css = await styles({
  regular: STEPS.map((s) => s.sub).join(""),
  semibold: STEPS.map((s) => s.label).join(""),
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
        title: "yak Dynamic Props",
        desc: "A ProgressBar takes its width from a prop. At build time, yak writes the rule to a CSS file and replaces the dynamic width with a CSS variable. The component works like a plain div that sets that variable in its style attribute. In the browser, a new percent only changes the variable.",
        css,
        reducedMotion: { at: 12.2 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(panelCode, "ProgressBar.tsx")}
        {codeLabel("source", [
          { at: 0, over: COMPILE + 0.6 },
          { at: BACK + 0.6, over: DURATION - BACK - 0.6 },
        ])}
        {codeLabel("works like", [{ at: COMPILE + 0.6, over: BACK - COMPILE }])}
        {panel(panelCss, "ProgressBar.yak.css", "build output")}
        {panel(panelBrowser, "localhost:3000", "browser")}
        {placeholder(panelCss, "/* empty until the build runs */", [
          { at: 0, over: EXTRACT + 0.1 },
          AGAIN,
        ])}
        {placeholder(panelBrowser, "/* not loaded yet */", [{ at: 0, over: BROWSER + 0.1 }, AGAIN])}

        {morph([src, out, src], { at: [COMPILE, BACK], over: 1 }).node}
        {dimLines()}

        {fly("height: 20px;", EXTRACT)}

        {/* The dynamic width became a variable: boxed while the source shows the dynamic value, and again in the browser */}
        <rect
          {...card(box(varLine))}
          rx={4}
          fill="rgba(255,253,248,0.08)"
          stroke={ink.fg}
          strokeWidth={1.2}
          animation={visible([{ at: VAR, over: FOCUS_END - VAR }, runtime], 0.25)}
        />

        {link(5, rule.lines(1), LINK)}
        {link(7, varLine, LINK + 0.4)}

        <g animation={keep(BROWSER)}>
          <rect {...card(track)} rx={4} fill="rgba(255,253,248,0.06)" stroke="#cccccc" />
          <rect
            x={track.x}
            y={track.y}
            width={widthOf(PERCENTS[0].value)}
            height={track.h}
            rx={4}
            fill={BLUE}
            animation={grow}
          />
          <g class="mono">
            <text x={track.x} y={domY} fontSize={FS} fill={theme.base04}>
              {'<div class="ym7uBBu"'}
            </text>
            <text x={track.x + INDENT * adv} y={domY + domH} fontSize={FS} fill={theme.base04}>
              {'style="--ym7uBBu1: '}
            </text>
            {PERCENTS.map((p, i) => (
              <text
                x={track.x + VALUE_COL * adv}
                y={domY + domH}
                fontSize={FS}
                fill={theme.base06}
                animation={visible([percentSpans[i]], 0.05)}
              >
                {`${p.value}%`}
              </text>
            ))}
            <text
              x={track.x + (VALUE_COL + 3) * adv}
              y={domY + domH}
              fontSize={FS}
              fill={theme.base04}
            >
              {'">'}
            </text>
            <rect
              x={track.x + VALUE_COL * adv}
              y={domY + domH + 5}
              width={3 * adv}
              height={1.5}
              fill={theme.base06}
            />
          </g>
        </g>
      </>,
    ),
  );
}
