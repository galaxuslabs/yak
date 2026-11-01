/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
import { ease, motion, render, type Color, type Span } from "svjeez";
import { readFileSync } from "node:fs";
import { code, Marker, morph, rect, visible, type Rect } from "svjeez/extras";
import {
  canvas,
  compact,
  GRAY,
  GREEN,
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

const ToggleButton = styled.button\`
  color: white;
  padding: 10px 20px;
  \${(props) =>
    props.$active
      ? css\`
          background-color: green;
        \`
      : css\`
          background-color: dimgray;
        \`};
\`;`;

// What the build output does, written as a plain React component: it only picks class names.
// The real output (yak-swc, prod) uses the same class names and rule order.
const COMPILED = `import "./ToggleButton.yak.css";

const ToggleButton = (props) => (
  <button
    {...props}
    className={"ym7uBBu " +
      (props.$active
        ? "ym7uBBu1"
        : "ym7uBBu2")}
  />
);`;

const RULE_ACTIVE = ".ym7uBBu1 { background-color: green; }";
const RULE_INACTIVE = ".ym7uBBu2 { background-color: dimgray; }";
const RULE_BASE = `.ym7uBBu {
  color: white;
  padding: 10px 20px;
}`;

const W = 820;
const H = 548;
const M = 28;
const FS = 14;
const TOP = 132;
const BOTTOM = H - M;

// Panels: the code on the left, the CSS file and the browser on the right
const panelCode = rect(M, TOP, 376, BOTTOM - TOP);
const panelCss = rect(M + 376 + 16, TOP, W - 2 * M - 376 - 16, 206);
const panelBrowser = rect(panelCss.x, TOP + 206 + 16, panelCss.w, BOTTOM - TOP - 206 - 16);

const opts = (x: number, y: number) => ({ x, y, fontSize: FS, theme, fontFamily: MONO });
const src = code(highlight(SOURCE), opts(panelCode.x + 20, panelCode.y + HEAD));
const out = code(highlight(COMPILED), opts(panelCode.x + 20, panelCode.y + HEAD));
const lineH = src.metrics.height;
const adv = src.metrics.advance;

// The base rule comes first, like its class in the component. A small gap between the rules
// keeps their highlight boxes apart.
const GAP = 5;
const ruleBase = code(highlight(RULE_BASE), opts(panelCss.x + 20, panelCss.y + HEAD - 2));
const ruleActive = code(
  highlight(RULE_ACTIVE),
  opts(panelCss.x + 20, panelCss.y + HEAD - 2 + 4 * lineH + GAP),
);
const ruleInactive = code(
  highlight(RULE_INACTIVE),
  opts(panelCss.x + 20, panelCss.y + HEAD - 2 + 5 * lineH + 2 * GAP),
);
// A highlight box around a rule, a little wider than the text but not taller, so neighbours do not touch
const box = (r: Rect) => rect(r.x - 5, r.y - 1, r.w + 10, r.h + 2);

// Beats in seconds
// Step 1 is short, so the first card moves within two seconds and the reader sees an animation
const DURATION = 17.2;
const WRITE: Span = { at: 0, over: 1.2 };
const BUILD: Span = { at: 1.2, over: 9.5 };
const RUN: Span = { at: 10.7, over: 5.5 };
const AGAIN: Span = { at: 16.2, over: 1 };
const EXTRACT = [1.7, 3, 4.3];
const FLY = 0.9;
const COMPILE = 5.9;
const LINK = 7.3;
const BROWSER = 11;
const CLICKS = [12.2, 13.7];
const RESET = 15.7;
const BACK = 16;

const STEPS: Step[] = [
  {
    label: "Your code",
    title: "Styles that depend on props",
    sub: "The same API as styled-components.",
    spans: [WRITE, AGAIN],
  },
  {
    label: "At build time",
    title: "yak builds every variant ahead of time",
    sub: "Each css branch becomes a class in a CSS file.",
    spans: [BUILD],
  },
  {
    label: "In the browser",
    title: "The prop only picks a class",
    sub: "No CSS is parsed or created in the browser.",
    spans: [RUN],
  },
];

// Which state the button is in, starting inactive
const states = [BROWSER, ...CLICKS].map((at, i, all) => ({
  active: i % 2 === 1,
  span: { at, over: (all[i + 1] ?? RESET) - at },
}));
const spansOf = (active: boolean) => states.filter((s) => s.active === active).map((s) => s.span);

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
  { at: EXTRACT[0] - 0.3, first: 4, last: 5 },
  { at: EXTRACT[1] - 0.3, first: 8, last: 10 },
  { at: EXTRACT[2] - 0.3, first: 11, last: 13 },
];
const FOCUS_END = EXTRACT[2] + 1.2;
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

const nameBase = out.find('"ym7uBBu "');
const nameActive = out.find('"ym7uBBu1"');
const nameInactive = out.find('"ym7uBBu2"');
const runtime: Span = { at: BROWSER, over: RESET - BROWSER };

const button = rect(panelBrowser.x + 20, panelBrowser.y + HEAD, 132, 40);
const domY = button.y + button.h + 34;
const tip = { x: button.x + button.w - 28, y: button.y + button.h - 14 };

let fill = motion({ fill: GRAY });
for (const [i, t] of CLICKS.entries())
  fill = fill.at(t).to({ fill: i % 2 === 0 ? GREEN : GRAY }, 0.12, ease.linear);

let press = motion({ scale: 1 });
for (const t of CLICKS)
  press = press
    .at(t - 0.15)
    .to({ scale: 0.8 }, 0.1)
    .to({ scale: 1 }, 0.15);

let ripple = motion({ opacity: 0, scale: 0.2 });
for (const t of CLICKS)
  ripple = ripple.at(t).set({ opacity: 0.7, scale: 0.2 }).to({ opacity: 0, scale: 1 }, 0.5);

const arrive = motion({ x: 60, y: 30, opacity: 0 })
  .at(BROWSER + 0.3)
  .to({ x: 0, y: 0, opacity: 1 }, 0.7, ease.inOut);

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
        title: "yak Dynamic Styles",
        desc: "A ToggleButton picks one of two css blocks from a prop. At build time, yak turns each block into a class in a CSS file, and the component works like a plain button that only switches its className. In the browser, a click only picks the other class.",
        css,
        reducedMotion: { at: 12.8 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(panelCode, "ToggleButton.tsx")}
        {codeLabel("source", [
          { at: 0, over: COMPILE + 0.6 },
          { at: BACK + 0.6, over: DURATION - BACK - 0.6 },
        ])}
        {codeLabel("works like", [{ at: COMPILE + 0.6, over: BACK - COMPILE }])}
        {panel(panelCss, "ToggleButton.yak.css", "build output")}
        {panel(panelBrowser, "localhost:3000", "browser")}
        {placeholder(panelCss, "/* empty until the build runs */", [
          { at: 0, over: EXTRACT[0] + 0.1 },
          AGAIN,
        ])}
        {placeholder(panelBrowser, "/* not loaded yet */", [{ at: 0, over: BROWSER + 0.1 }, AGAIN])}

        {morph([src, out, src], { at: [COMPILE, BACK], over: 1 }).node}
        {dimLines()}

        {fly(ruleBase, "color: white;", EXTRACT[0])}
        {fly(ruleActive, "background-color: green;", EXTRACT[1])}
        {fly(ruleInactive, "background-color: dimgray;", EXTRACT[2])}

        {link(nameBase, ruleBase.find(".ym7uBBu"), LINK, [runtime])}
        {link(nameActive, ruleActive.find(".ym7uBBu1"), LINK + 0.4, spansOf(true))}
        {link(nameInactive, ruleInactive.find(".ym7uBBu2"), LINK + 0.8, spansOf(false))}

        <g animation={keep(BROWSER)}>
          <Marker color={ink.fg} stops={[{ at: runtime, rect: box(ruleBase.bounds) }]} />
          <Marker
            color={ink.fg}
            stops={states.map((s) => ({
              at: s.span,
              rect: box((s.active ? ruleActive : ruleInactive).bounds),
            }))}
          />
        </g>

        <g animation={keep(BROWSER)}>
          <rect
            x={button.x}
            y={button.y}
            width={button.w}
            height={button.h}
            rx={6}
            fill={GRAY}
            animation={fill}
          />
          <text
            x={button.center.x}
            y={button.center.y + 5}
            textAnchor="middle"
            class="sans"
            fontSize={15}
            fontWeight={600}
            fill="#ffffff"
          >
            Click me
          </text>
          <circle
            cx={tip.x + 1}
            cy={tip.y + 1}
            r={16}
            fill="none"
            stroke="#ffffff"
            strokeWidth={2}
            animation={ripple}
          />
          <g transform={`translate(${tip.x} ${tip.y})`}>
            <g animation={arrive}>
              <path
                d={POINTER}
                fill="#ffffff"
                stroke="#000000"
                strokeWidth={1.2}
                strokeLinejoin="round"
                animation={press}
              />
            </g>
          </g>
          <g class="mono">
            <text x={button.x} y={domY} fontSize={FS} fill={theme.base04}>
              {'<button class="'}
            </text>
            <text x={button.x + 15 * adv} y={domY} fontSize={FS} fill={theme.base06}>
              ym7uBBu
            </text>
            <rect
              x={button.x + 15 * adv}
              y={domY + 5}
              width={7 * adv}
              height={1.5}
              fill={theme.base06}
            />
            {[false, true].map((active) => (
              <text
                x={button.x + 23 * adv}
                y={domY}
                fontSize={FS}
                fill={theme.base06}
                animation={visible(spansOf(active), 0.05)}
              >
                {active ? "ym7uBBu1" : "ym7uBBu2"}
              </text>
            ))}
            <text x={button.x + 31 * adv} y={domY} fontSize={FS} fill={theme.base04}>
              {'">'}
            </text>
            <rect
              x={button.x + 23 * adv}
              y={domY + 5}
              width={8 * adv}
              height={1.5}
              fill={theme.base06}
            />
          </g>
        </g>
      </>,
    ),
  );
}
