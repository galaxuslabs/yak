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

const SOURCE = `import { styled } from "@yak/react";

const Title = styled.h1\`
  font-size: 1.5em;
  color: palevioletred;
  &:hover {
    color: red;
  }
\`;`;

// What the build output does, written as a plain React component: it only sets a class name.
// The real output (yak-swc, prod) uses the same class name and keeps the nesting in the CSS.
const COMPILED = `import "./Title.yak.css";

const Title = (props) => (
  <h1
    {...props}
    className="ym7uBBu"
  />
);`;

const RULE = `.ym7uBBu {
  font-size: 1.5em;
  color: palevioletred;
  &:hover {
    color: red;
  }
}`;

const W = 820;
const H = 548;
const M = 28;
const FS = 14;
const TOP = 132;
const BOTTOM = H - M;
const PINK = "#db7093";
const RED = "#ff0000";

// Panels: the code on the left, the CSS file and the browser on the right
const panelCode = rect(M, TOP, 376, BOTTOM - TOP);
const panelCss = rect(M + 376 + 16, TOP, W - 2 * M - 376 - 16, 232);
const panelBrowser = rect(panelCss.x, TOP + 232 + 16, panelCss.w, BOTTOM - TOP - 232 - 16);

const opts = (x: number, y: number) => ({ x, y, fontSize: FS, theme, fontFamily: MONO });
const src = code(highlight(SOURCE), opts(panelCode.x + 20, panelCode.y + HEAD));
const out = code(highlight(COMPILED), opts(panelCode.x + 20, panelCode.y + HEAD));
const rule = code(highlight(RULE), opts(panelCss.x + 20, panelCss.y + HEAD - 2));
const adv = src.metrics.advance;
// A highlight box around whole rule lines, a little wider than the text and a little shorter than
// the lines, so the boxes of neighbouring lines do not touch
const box = (r: Rect) => rect(r.x - 5, r.y + 2, r.w + 10, r.h - 3);

// Beats in seconds
// Step 1 is short, so the card moves within two seconds and the reader sees an animation
const DURATION = 14.3;
const WRITE: Span = { at: 0, over: 1.2 };
const BUILD: Span = { at: 1.2, over: 6.6 };
const RUN: Span = { at: 7.8, over: 5.5 };
const AGAIN: Span = { at: 13.3, over: 1 };
const EXTRACT = 1.7;
const FLY = 0.9;
const COMPILE = 3.6;
const LINK = 5;
const BROWSER = 8.1;
const HOVER: Span = { at: 9.9, over: 2.1 };
const RESET = 12.8;
const BACK = 13.1;

const STEPS: Step[] = [
  {
    label: "Your code",
    title: "Write styled-components syntax",
    sub: "Styles live next to the component.",
    spans: [WRITE, AGAIN],
  },
  {
    label: "At build time",
    title: "yak writes a plain CSS file",
    sub: "The component keeps only a class name.",
    spans: [BUILD],
  },
  {
    label: "In the browser",
    title: "The browser only runs CSS",
    sub: "Hover is plain CSS. No JavaScript runs.",
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

// The source lines that stay bright while the card lifts off: the styles inside the template
const FOCUS = [{ at: EXTRACT - 0.3, first: 4, last: 8 }];
const FOCUS_END = EXTRACT + 1.2;
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

// A thin line from the class name in the component to the rule it names. It stays until the reset
// and lights up during `applied`, the spans in which the title has that class.
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

const runtime: Span = { at: BROWSER, over: RESET - BROWSER };

// The rendered title: an h1 at 1.5em of a 16px page
const title = { x: panelBrowser.x + 20, y: panelBrowser.y + HEAD + 22, size: 24 };
const domY = title.y + 42;
// Where the pointer rests while it hovers the title, and where it comes from and goes to
const over = { x: title.x + 96, y: title.y - 8 };
const away = { x: 120, y: 34 };

const color = motion({ fill: PINK })
  .at(HOVER.at)
  .to({ fill: RED }, 0.12, ease.linear)
  .at(HOVER.at + HOVER.over)
  .to({ fill: PINK }, 0.12, ease.linear);
const pointer = motion({ x: away.x, y: away.y, opacity: 0 })
  .at(BROWSER + 0.3)
  .to({ opacity: 1 }, 0.4)
  .at(HOVER.at - 0.6)
  .to({ x: 0, y: 0 }, 0.6, ease.inOut)
  .at(HOVER.at + HOVER.over - 0.22)
  .to({ x: away.x, y: away.y }, 0.6, ease.inOut);

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
  semibold: STEPS.map((s) => s.label).join("") + "Hello World",
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
        title: "yak preview",
        desc: "A Title written with styled-components syntax. At build time, yak moves its styles, with the nested hover rule, into a plain CSS file, and the component keeps only a class name. In the browser, hover is plain CSS and no JavaScript runs.",
        css,
        reducedMotion: { at: 10.8 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(panelCode, "Title.tsx")}
        {codeLabel("source", [
          { at: 0, over: COMPILE + 0.6 },
          { at: BACK + 0.6, over: DURATION - BACK - 0.6 },
        ])}
        {codeLabel("works like", [{ at: COMPILE + 0.6, over: BACK - COMPILE }])}
        {panel(panelCss, "Title.yak.css", "build output")}
        {panel(panelBrowser, "localhost:3000", "browser")}
        {placeholder(panelCss, "/* empty until the build runs */", [
          { at: 0, over: EXTRACT + 0.1 },
          AGAIN,
        ])}
        {placeholder(panelBrowser, "/* not loaded yet */", [{ at: 0, over: BROWSER + 0.1 }, AGAIN])}

        {morph([src, out, src], { at: [COMPILE, BACK], over: 1 }).node}
        {dimLines()}

        {fly("color: palevioletred;", EXTRACT)}
        {link(out.find('"ym7uBBu"'), rule.find(".ym7uBBu"), LINK, [runtime])}

        <g animation={keep(BROWSER)}>
          <Marker color={ink.fg} stops={[{ at: runtime, rect: box(rule.lines(1, 3)) }]} />
          <g animation={visible([HOVER], 0.12)}>
            <Marker color={ink.fg} stops={[{ at: HOVER, rect: box(rule.lines(4, 6)) }]} />
          </g>
        </g>

        <g animation={keep(BROWSER)}>
          <text
            x={title.x}
            y={title.y}
            class="sans"
            fontSize={title.size}
            fontWeight={600}
            fill={PINK}
            animation={color}
          >
            Hello World
          </text>
          <g transform={`translate(${over.x} ${over.y})`}>
            <g animation={pointer}>
              <path
                d={POINTER}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={1.2}
                strokeLinejoin="round"
              />
            </g>
          </g>
          <g class="mono">
            <text x={title.x} y={domY} fontSize={FS} fill={theme.base04}>
              {'<h1 class="'}
            </text>
            <text x={title.x + 11 * adv} y={domY} fontSize={FS} fill={theme.base06}>
              ym7uBBu
            </text>
            <rect
              x={title.x + 11 * adv}
              y={domY + 5}
              width={7 * adv}
              height={1.5}
              fill={theme.base06}
            />
            <text x={title.x + 18 * adv} y={domY} fontSize={FS} fill={theme.base04}>
              {'">'}
            </text>
          </g>
        </g>
      </>,
    ),
  );
}
