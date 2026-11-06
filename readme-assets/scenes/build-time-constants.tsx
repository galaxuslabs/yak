/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
import { ease, motion, render, type Color, type Span } from "svjeez";
import { readFileSync } from "node:fs";
import {
  code,
  Marker,
  morph,
  rect,
  visible,
  type Piece,
  type Rect,
  type Tokens,
} from "svjeez/extras";
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
import {
  breakpoints,
  spacings,
} from "./constants.yak";

const Container = styled.div\`
  padding: \${spacings.md};
  \${breakpoints.md} {
    padding: \${spacings.lg};
  }
\`;`;

// The constants are calculated, so the build has to run the file to know the values
const CONSTANTS = `const unit = 8;
const tablet = unit * 96;
export const spacings = {
  md: \`\${unit * 2}px\`,
  lg: \`\${unit * 4}px\`,
};
export const breakpoints = {
  md: \`@media (min-width: \${tablet}px)\`,
};`;

// The exports after the build ran the file
const EVALUATED = `const unit = 8;
const tablet = unit * 96;
export const spacings = {
  md: "16px",
  lg: "32px",
};
export const breakpoints = {
  md: "@media (min-width: 768px)",
};`;

// What the build output does, written as a plain React component. The constants import is gone.
// The class name is the real yak-swc output, and the values are what the cross-file resolver writes.
const COMPILED = `import "./Container.yak.css";

const Container = (props) => (
  <div {...props} className="ym7uBBu" />
);`;

const CSS = `.ym7uBBu {
  padding: 16px;
  @media (min-width: 768px) {
    padding: 32px;
  }
}`;

// The values that come from constants.yak.ts, in the order they move into the CSS
const VALUES = ["16px", "@media (min-width: 768px)", "32px"];

// The shared highlighter does not know `export`
const hl = (src: string): Tokens =>
  highlight(src).map((line) => line.map((p): Piece => (p === "export" ? ["keyword", p] : p)));

// The CSS without the values, so each value can land in its own gap
const SKELETON = VALUES.reduce((text, value) => text.replace(value, " ".repeat(value.length)), CSS);

const W = 820;
const H = 640;
const M = 28;
const FS = 14;
const TOP = 132;
const BOTTOM = H - M;

// Panels: the code on the left, the CSS file on the right, and below it the constants file. In the
// browser step the constants panel becomes the browser.
const panelCode = rect(M, TOP, 376, BOTTOM - TOP);
const panelCss = rect(M + 376 + 16, TOP, W - 2 * M - 376 - 16, 196);
const panelLower = rect(panelCss.x, TOP + 196 + 16, panelCss.w, BOTTOM - TOP - 196 - 16);

const opts = (x: number, y: number) => ({ x, y, fontSize: FS, theme, fontFamily: MONO });
const src = code(hl(SOURCE), opts(panelCode.x + 20, panelCode.y + HEAD));
const out = code(hl(COMPILED), opts(panelCode.x + 20, panelCode.y + HEAD));
const consts = code(hl(CONSTANTS), opts(panelLower.x + 20, panelLower.y + HEAD));
const evaluated = code(hl(EVALUATED), opts(panelLower.x + 20, panelLower.y + HEAD));
const cssFull = code(hl(CSS), opts(panelCss.x + 20, panelCss.y + HEAD - 2));
const skeleton = code(hl(SKELETON), opts(panelCss.x + 20, panelCss.y + HEAD - 2));
// A highlight box around code lines, a little wider than the text but not taller
const box = (r: Rect) => rect(r.x - 5, r.y - 1, r.w + 10, r.h + 2);

// Beats in seconds
// Step 1 is short, so the first value moves within two seconds and the reader sees an animation
const DURATION = 17.2;
const WRITE: Span = { at: 0, over: 1.2 };
const BUILD: Span = { at: 1.2, over: 9.5 };
const RUN: Span = { at: 10.7, over: 5.5 };
const AGAIN: Span = { at: 16.2, over: 1 };
const SHELL = 1.5;
// The build runs constants.yak.ts first: the calculated exports turn into their values
const EVAL = 1.6;
const EXTRACT = [2.8, 4.1, 5.4];
const FLY = 0.9;
const COMPILE = 6.8;
const LINK = 8.2;
const SWAP = 10.4;
const BROWSER = 11;
const WIDE = 12.2;
const NARROW = 14.2;
const RESIZE = 0.6;
const RESET = 15.7;
const BACK = 16;
// The constants file is hidden in the browser step, so it turns back into the source there
const UNEVAL = 14;

const STEPS: Step[] = [
  {
    label: "Your code",
    title: "Share constants across files",
    sub: "Import values from a .yak.ts file.",
    spans: [WRITE, AGAIN],
  },
  {
    label: "At build time",
    title: "yak writes the values into the CSS",
    sub: "The build runs constants.yak.ts and writes the results.",
    spans: [BUILD],
  },
  {
    label: "In the browser",
    title: "No constants ship to the browser",
    sub: "The media query switches the padding. No JavaScript runs.",
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

// The lines that stay bright while each value moves: where the source uses it and where the
// constants file defines it
const FOCUS = [
  { at: EXTRACT[0] - 0.3, source: 8, constant: 4 },
  { at: EXTRACT[1] - 0.3, source: 9, constant: 8 },
  { at: EXTRACT[2] - 0.3, source: 10, constant: 5 },
];
const FOCUS_END = EXTRACT[2] + 1.2;
const DIM = 0.7;
const FADE = 0.3;

// Dims every line of `block` outside the current highlight. Each line has its own rectangle in the
// panel color with one timeline, so a change of highlight never dims a line twice. A mask would do
// the same, but the browser draws a mask again on every frame.
const dimLines = (
  block: ReturnType<typeof code>,
  area: Rect,
  lit: (f: (typeof FOCUS)[number]) => number,
) =>
  Array.from({ length: block.lineCount }, (_, i) => {
    const line = i + 1;
    let m = motion({ opacity: 0 });
    let level = 0;
    for (const f of FOCUS) {
      const next = line === lit(f) ? 0 : DIM;
      if (next !== level) m = m.at(f.at).to({ opacity: next }, FADE);
      level = next;
    }
    if (level !== 0) m = m.at(FOCUS_END - FADE).to({ opacity: 0 }, FADE);
    const r = block.lines(line);
    return (
      <rect
        x={area.x + 1}
        y={r.y + 3}
        width={area.w - 2}
        height={r.h}
        fill={ink.card}
        animation={m}
      />
    );
  });

// A value lifts off its evaluated export as a card, then moves into its gap in the CSS
const fly = (value: string, at: number) => {
  const from = evaluated.find(value);
  const to = cssFull.find(value);
  const piece = code(hl(value), opts(to.x, to.y));
  return (
    <g animation={keep(at, 0.25)}>
      <g
        animation={motion({ x: from.x - to.x, y: from.y - to.y })
          .at(at + 0.25)
          .to({ x: 0, y: 0 }, FLY, ease.inOut)}
      >
        <rect
          {...card(piece.bounds.pad(5))}
          rx={6}
          fill={theme.base00}
          stroke={ink.underline}
          animation={motion({ opacity: 1 })
            .at(at + 0.25 + FLY)
            .to({ opacity: 0 }, 0.4)}
        />
        {piece.node}
      </g>
    </g>
  );
};

// A thin line from the class name in the component to the rule it names. It stays until the reset
// and lights up in the browser step, where the box always has that class.
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
const narrow: Span[] = [
  { at: BROWSER, over: WIDE - BROWSER },
  { at: NARROW, over: RESET - NARROW },
];
const wide: Span[] = [{ at: WIDE, over: NARROW - WIDE }];

// The lower panel shows the constants file until the browser step, then the browser
const lowerLabel = (text: string, spans: Span[]) => (
  <text
    x={panelLower.x + 84}
    y={panelLower.y + 24}
    class="mono"
    fontSize={13}
    fill={ink.fgMuted}
    animation={shown(spans, 0.3, DURATION)}
  >
    {text}
  </text>
);
const lowerTag = (tag: string, spans: Span[]) => (
  <text
    x={panelLower.x + panelLower.w - 18}
    y={panelLower.y + 24}
    class="mono"
    fontSize={12}
    textAnchor="end"
    fill={ink.prompt}
    animation={shown(spans, 0.3, DURATION)}
  >
    {tag}
  </text>
);
const constantsShown: Span[] = [{ at: 0, over: SWAP + 0.3 }, AGAIN];
const browserShown: Span[] = [{ at: SWAP + 0.3, over: AGAIN.at - SWAP - 0.3 }];

// The browser: a viewport that gets wider and narrower again, and inside it the container. Its
// padding (the tinted frame) doubles while the viewport is wide.
const view = {
  x: panelLower.x + 20,
  y: panelLower.y + 52,
  narrow: 220,
  wide: panelLower.w - 40,
  h: 112,
};
const PAD = { narrow: 10, wide: 20 };
const boxTop = view.y + 28;
const boxH = view.h - 38;

// Motions that follow the viewport: one value while narrow, another while wide
const resizeWidth = (narrowWidth: number, wideWidth: number) =>
  motion({ width: narrowWidth })
    .at(WIDE)
    .to({ width: wideWidth }, RESIZE, ease.inOut)
    .at(NARROW)
    .to({ width: narrowWidth }, RESIZE, ease.inOut);
const resizeBox = (n: { width: number; height: number }, w: { width: number; height: number }) =>
  motion(n).at(WIDE).to(w, RESIZE, ease.inOut).at(NARROW).to(n, RESIZE, ease.inOut);
const shift = (dx: number, dy: number) =>
  motion({ x: 0, y: 0 })
    .at(WIDE)
    .to({ x: dx, y: dy }, RESIZE, ease.inOut)
    .at(NARROW)
    .to({ x: 0, y: 0 }, RESIZE, ease.inOut);

const widthLabel = (text: string, spans: Span[]) => (
  <text
    x={view.x + 10}
    y={view.y + 18}
    class="mono"
    fontSize={12}
    fill={ink.prompt}
    animation={visible(spans, 0.2)}
  >
    {text}
  </text>
);
const paddingText = (value: string, spans: Span[]) => (
  <text
    x={view.x + 9 * 8.4}
    y={view.y + view.h + 26}
    class="mono"
    fontSize={FS}
    fill={theme.base06}
    animation={visible(spans, 0.2)}
  >
    {value}
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
        title: "yak build time constants",
        desc: "A Container takes its padding and a media query from constants.yak.ts. At build time, yak runs that file, calculates the values and writes them into the CSS, and the component works like a plain div with a class name. In the browser, the media query switches the padding without any JavaScript.",
        css,
        reducedMotion: { at: 13.4 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(panelCode, "Container.tsx")}
        {codeLabel("source", [
          { at: 0, over: COMPILE + 0.6 },
          { at: BACK + 0.6, over: DURATION - BACK - 0.6 },
        ])}
        {codeLabel("works like", [{ at: COMPILE + 0.6, over: BACK - COMPILE }])}
        {panel(panelCss, "Container.yak.css", "build output")}
        {panel(panelLower, "")}
        {lowerLabel("constants.yak.ts", constantsShown)}
        {lowerTag("imported", [{ at: 0, over: EVAL }, AGAIN])}
        {lowerTag("evaluated", [{ at: EVAL, over: SWAP + 0.3 - EVAL }])}
        {lowerLabel("localhost:3000", browserShown)}
        {lowerTag("browser", browserShown)}
        {placeholder(panelCss, "/* empty until the build runs */", [{ at: 0, over: SHELL }, AGAIN])}

        {morph([src, out, src], { at: [COMPILE, BACK], over: 1 }).node}
        {dimLines(src, panelCode, (f) => f.source)}

        <g animation={shown(constantsShown, 0.3, DURATION)}>
          {morph([consts, evaluated, consts], { at: [EVAL, UNEVAL], over: 0.8 }).node}
          {dimLines(consts, panelLower, (f) => f.constant)}
        </g>

        <g animation={keep(SHELL)}>{skeleton.node}</g>
        {VALUES.map((value, i) => fly(value, EXTRACT[i]))}

        {link(out.find('"ym7uBBu"'), cssFull.find(".ym7uBBu"), LINK, [runtime])}

        <g animation={keep(BROWSER)}>
          <Marker
            color={ink.fg}
            stops={[
              { at: narrow[0], rect: box(cssFull.lines(2)) },
              { at: wide[0], rect: box(cssFull.lines(3, 5)) },
              { at: narrow[1], rect: box(cssFull.lines(2)) },
            ]}
          />
        </g>

        <g animation={keep(BROWSER)}>
          <rect
            x={view.x}
            y={view.y}
            width={view.narrow}
            height={view.h}
            rx={6}
            fill="none"
            stroke={ink.underline}
            animation={resizeWidth(view.narrow, view.wide)}
          />
          {widthLabel("600px wide", narrow)}
          {widthLabel("1024px wide", wide)}
          <rect
            x={view.x + 10}
            y={boxTop}
            width={view.narrow - 20}
            height={boxH}
            rx={4}
            fill={theme.base0A}
            opacity={0.35}
            animation={resizeWidth(view.narrow - 20, view.wide - 20)}
          />
          <g animation={shift(PAD.wide - PAD.narrow, PAD.wide - PAD.narrow)}>
            <rect
              x={view.x + 10 + PAD.narrow}
              y={boxTop + PAD.narrow}
              width={view.narrow - 20 - 2 * PAD.narrow}
              height={boxH - 2 * PAD.narrow}
              rx={2}
              fill={ink.card}
              animation={resizeBox(
                { width: view.narrow - 20 - 2 * PAD.narrow, height: boxH - 2 * PAD.narrow },
                { width: view.wide - 20 - 2 * PAD.wide, height: boxH - 2 * PAD.wide },
              )}
            />
          </g>
          <g animation={shift(view.wide - view.narrow, 0)}>
            <rect
              x={view.x + view.narrow - 2}
              y={view.y + view.h / 2 - 12}
              width={4}
              height={24}
              rx={2}
              fill={ink.fg}
            />
            <g transform={`translate(${view.x + view.narrow + 4} ${view.y + view.h / 2 + 4})`}>
              <path
                d={POINTER}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={1.2}
                strokeLinejoin="round"
              />
            </g>
          </g>
          <text x={view.x} y={view.y + view.h + 26} class="mono" fontSize={FS} fill={theme.base04}>
            {"padding:"}
          </text>
          {paddingText("16px", narrow)}
          {paddingText("32px", wide)}
        </g>
      </>,
    ),
  );
}
