/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
import { ease, motion, render, type Color, type Span } from "svjeez";
import { readFileSync } from "node:fs";
import { code, Marker, morph, rect, visible, type Rect } from "svjeez/extras";
import {
  canvas,
  compact,
  HEAD,
  header,
  highlight,
  ink,
  MONO,
  panel,
  POINTER,
  shown,
  styles,
  theme,
  type Step,
} from "../slide.tsx";

const SOURCE = `import { styled, css } from "@yak/react";

const Button = styled.button\`
  font-size: 1rem;
  @media screen and (max-width: 992px) {
    font-size: 1.5rem;
    \${(props) =>
      props.$primary &&
      css\`
        font-size: 2rem;
      \`}
  }
\`;`;

// What the build output does, written as a plain React component: it only picks class names.
// The real output (yak-swc, prod) uses the same class names and rules.
const COMPILED = `import "./Button.yak.css";
import clsx from "clsx";

const Button = (props) => (
  <button
    {...props}
    className={clsx(
      "ym7uBBu",
      props.$primary && "ym7uBBu1",
    )}
  />
);`;

// yak keeps the nesting: the @media block stays inside each rule
const RULE_BASE = `.ym7uBBu {
  font-size: 1rem;
  @media screen and (max-width: 992px) {
    font-size: 1.5rem;
  }
}`;
const RULE_PRIMARY = `.ym7uBBu1 {
  @media screen and (max-width: 992px) {
    font-size: 2rem;
  }
}`;

const W = 820;
const M = 28;
const FS = 14;
const TOP = 132;
const ROW = 356;
const BROWSER_H = 140;
const H = TOP + ROW + 16 + BROWSER_H + M;

// Panels: the code and the CSS file side by side, the browser below them across the full width
const panelCode = rect(M, TOP, 376, ROW);
const panelCss = rect(M + 376 + 16, TOP, W - 2 * M - 376 - 16, ROW);
const panelBrowser = rect(M, TOP + ROW + 16, W - 2 * M, BROWSER_H);

const opts = (x: number, y: number) => ({ x, y, fontSize: FS, theme, fontFamily: MONO });
const src = code(highlight(SOURCE), opts(panelCode.x + 20, panelCode.y + HEAD));
const out = code(highlight(COMPILED), opts(panelCode.x + 20, panelCode.y + HEAD));
const lineH = src.metrics.height;

// A small gap between the rules keeps their highlight boxes apart
const GAP = 5;
const ruleBase = code(highlight(RULE_BASE), opts(panelCss.x + 20, panelCss.y + HEAD - 2));
const rulePrimary = code(
  highlight(RULE_PRIMARY),
  opts(panelCss.x + 20, panelCss.y + HEAD - 2 + 6 * lineH + GAP),
);
// A highlight box around rule lines, a little wider than the text but not taller, so neighbours do not touch
const box = (r: Rect) => rect(r.x - 5, r.y - 1, r.w + 10, r.h + 2);

// Beats in seconds
// Step 1 is short, so the first card moves within two seconds and the reader sees an animation
const DURATION = 17.2;
const WRITE: Span = { at: 0, over: 1.2 };
const BUILD: Span = { at: 1.2, over: 9.5 };
const RUN: Span = { at: 10.7, over: 5.5 };
const AGAIN: Span = { at: 16.2, over: 1 };
const EXTRACT = [1.7, 3.3];
const FLY = 0.9;
const COMPILE = 5.9;
const LINK = 7.3;
const BROWSER = 11;
const NARROW = 12.2;
const WIDE = 14.2;
const RESIZE = 0.8;
const RESET = 15.7;
const BACK = 16;

const STEPS: Step[] = [
  {
    label: "Your code",
    title: "Nest media queries and props",
    sub: "Write CSS nesting like in a stylesheet.",
    spans: [WRITE, AGAIN],
  },
  {
    label: "At build time",
    title: "yak keeps the nesting in the CSS file",
    sub: "The prop branch becomes a class with its own @media block.",
    spans: [BUILD],
  },
  {
    label: "In the browser",
    title: "The browser applies the media query",
    sub: "The classes stay the same. Only the window width changes.",
    spans: [RUN],
  },
];

// The window is wide, then narrow, then wide again. Each state switches in the middle of the resize.
const wide: Span[] = [
  { at: BROWSER, over: NARROW + RESIZE / 2 - BROWSER },
  { at: WIDE + RESIZE / 2, over: RESET - WIDE - RESIZE / 2 },
];
const narrow: Span[] = [{ at: NARROW + RESIZE / 2, over: WIDE - NARROW }];

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

// The source lines that stay bright while each card lifts off, one highlight after the other
const FOCUS = [
  {
    at: EXTRACT[0] - 0.3,
    ranges: [
      [4, 6],
      [12, 12],
    ],
  },
  { at: EXTRACT[1] - 0.3, ranges: [[7, 11]] },
];
const FOCUS_END = EXTRACT[1] + 1.2;
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
      const next = f.ranges.some(([first, last]) => line >= first && line <= last) ? 0 : DIM;
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

// A rule lifts off its declaration in the source as a card, then moves into the CSS file
const fly = (rule: ReturnType<typeof code>, declaration: string, at: number) => {
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

// A thin line from a class name in the compiled code to the rule it names. It stays until the
// reset and lights up during `applied`, the spans in which the button has that class.
const link = (from: Rect, to: Rect, at: number, applied: Span[]) => {
  const line = out.lines(out.words.find((w) => w.x === from.x && w.y === from.y)!.line);
  const a = { x: line.x + line.w + 8, y: from.center.y };
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
      <g animation={visible(applied, 0.12)}>{wire(ink.fg, 1.8)}</g>
    </g>
  );
};

const nameBase = out.find('"ym7uBBu"');
const namePrimary = out.find('"ym7uBBu1"');
const runtime: Span = { at: BROWSER, over: RESET - BROWSER };

// The page inside the browser window. Its width follows the window: 1200px wide, then 800px.
const page = rect(
  panelBrowser.x + 20,
  panelBrowser.y + 50,
  panelBrowser.w - 40,
  panelBrowser.h - 64,
);
const narrowWidth = Math.round((page.w * 800) / 1200);
const shrink = page.w - narrowWidth;
const resize = (from: number, to: number) =>
  motion({ x: from })
    .at(NARROW)
    .to({ x: to }, RESIZE, ease.inOut)
    .at(WIDE)
    .to({ x: from }, RESIZE, ease.inOut);
let pageWidth = motion({ width: page.w });
pageWidth = pageWidth
  .at(NARROW)
  .to({ width: narrowWidth }, RESIZE, ease.inOut)
  .at(WIDE)
  .to({ width: page.w }, RESIZE, ease.inOut);

// The primary button at 1rem in the wide window and at 2rem in the narrow one
const RED = "#d82911";
const button = (fontSize: number, spans: Span[]) => {
  const w = Math.round(fontSize * 4.2 + 28);
  const h = Math.round(fontSize * 1.2 + 14);
  const r = rect(page.x + 20, page.center.y - h / 2, w, h);
  return (
    <g animation={visible(spans, 0.15)}>
      <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={6} fill={RED} />
      <text
        x={r.center.x}
        y={r.center.y + fontSize * 0.34}
        textAnchor="middle"
        class="sans"
        fontSize={fontSize}
        fontWeight={600}
        fill="#ffffff"
      >
        Click me
      </text>
    </g>
  );
};

// The window width, shown where the browser tag would be
const widthLabel = (text: string, spans: Span[]) => (
  <text
    x={panelBrowser.x + panelBrowser.w - 18}
    y={panelBrowser.y + 24}
    class="mono"
    fontSize={12}
    textAnchor="end"
    fill={ink.prompt}
    animation={visible(spans, 0.15)}
  >
    {text}
  </text>
);

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
  semibold: STEPS.map((s) => s.label).join("") + "Click me",
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
        title: "yak Nesting",
        desc: "A Button nests a media query and a prop branch. At build time, yak keeps the nesting in the CSS file, and the prop branch becomes its own class with its own media query. In the browser, the classes stay the same and only the window width switches the font size.",
        css,
        reducedMotion: { at: 13.3 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(panelCode, "Button.tsx")}
        {codeLabel("source", [
          { at: 0, over: COMPILE + 0.6 },
          { at: BACK + 0.6, over: DURATION - BACK - 0.6 },
        ])}
        {codeLabel("works like", [{ at: COMPILE + 0.6, over: BACK - COMPILE }])}
        {panel(panelCss, "Button.yak.css", "build output")}
        {panel(panelBrowser, "localhost:3000")}
        {placeholder(panelCss, "/* empty until the build runs */", [
          { at: 0, over: EXTRACT[0] + 0.1 },
          AGAIN,
        ])}
        {placeholder(panelBrowser, "/* not loaded yet */", [{ at: 0, over: BROWSER + 0.1 }, AGAIN])}

        {morph([src, out, src], { at: [COMPILE, BACK], over: 1 }).node}
        {dimLines()}

        {fly(ruleBase, "font-size: 1rem;", EXTRACT[0])}
        {fly(rulePrimary, "font-size: 2rem;", EXTRACT[1])}

        {link(nameBase, ruleBase.find(".ym7uBBu"), LINK, [runtime])}
        {link(namePrimary, rulePrimary.find(".ym7uBBu1"), LINK + 0.4, [runtime])}

        {/* The declarations that apply: 1rem in the wide window, the @media blocks in the narrow one */}
        <g animation={keep(BROWSER)}>
          <Marker
            color={ink.fg}
            stops={[
              { at: wide[0], rect: box(ruleBase.lines(2)) },
              { at: narrow[0], rect: box(ruleBase.lines(3, 5)) },
              { at: wide[1], rect: box(ruleBase.lines(2)) },
            ]}
          />
          <g animation={visible(narrow, 0.15)}>
            <Marker
              color={ink.fg}
              stops={[{ at: narrow[0], rect: box(rulePrimary.lines(2, 4)) }]}
            />
          </g>
        </g>

        <g animation={keep(BROWSER)}>
          {widthLabel("1200px wide", wide)}
          {widthLabel("800px wide", narrow)}
          <rect
            x={page.x}
            y={page.y}
            width={page.w}
            height={page.h}
            rx={6}
            fill="rgba(255,253,248,0.06)"
            stroke={ink.border}
            animation={pageWidth}
          />
          {button(15, wide)}
          {button(30, narrow)}
          {/* A grip on the right edge of the page, dragged by the pointer */}
          <g animation={resize(0, -shrink)}>
            <rect
              x={page.x + page.w - 2}
              y={page.center.y - 12}
              width={4}
              height={24}
              rx={2}
              fill={ink.underline}
            />
            <g transform={`translate(${page.x + page.w + 6} ${page.center.y + 4})`}>
              <path
                d={POINTER}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={1.2}
                strokeLinejoin="round"
              />
            </g>
          </g>
        </g>
      </>,
    ),
  );
}
