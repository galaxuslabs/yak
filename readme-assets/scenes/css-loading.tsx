/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
import { readFileSync } from "node:fs";
import { draw, ease, motion, render, type Color, type Span } from "svjeez";
import { rect } from "svjeez/extras";
import { canvas, compact, header, ink, panel, styles, theme, type Step } from "../slide.tsx";

const W = 820;
const H = 368;
const M = 28;
const TOP = 132;
const FS = 13;
// JetBrains Mono is 0.6em wide per character
const ADV = FS * 0.6;

// One page load on one timeline. It first shows runtime CSS-in-JS, then the same load with yak.
const lane = rect(M, TOP, W - 2 * M, H - TOP - M);
const x0 = lane.x + 24;
const x1 = lane.x + lane.w - 24;
const axisY = lane.y + 112;
const at = (f: number) => x0 + f * (x1 - x0);

// Beats in seconds
const DURATION = 16;
const RUNTIME: Span = { at: 0, over: 7.6 };
const YAK: Span = { at: 7.6, over: 7.6 };
const AGAIN: Span = { at: 15.2, over: 0.8 };
const RUN = 0.6;
const TRAVEL = 4.2;
const STRIKE = 7.9;
const DROP = 9.2;
const HINTS = 9.6;
const MOVE = 10.2;
const SLIDE = 1.2;
const OUT = 14.6;

const STEPS: Step[] = [
  {
    label: "Runtime CSS-in-JS",
    title: "The browser builds the CSS again",
    sub: "The server renders the CSS, then the runtime regenerates it in the browser.",
    spans: [RUNTIME, AGAIN],
  },
  {
    label: "yak",
    title: "The page is styled earlier",
    sub: "103 Early Hints sends the stylesheet first, and the CSS steps go away.",
    spans: [YAK],
  },
];

// A step on the timeline: where it sits (0 to 1 along the axis) and its two label lines. With yak,
// the `struck` lines do not happen: they get a line through them and fade out.
interface Mark {
  readonly at: number;
  readonly lines: readonly [string, string];
  readonly struck: readonly [boolean, boolean];
}
const MARKS: readonly Mark[] = [
  { at: 0.16, lines: ["Renders HTML", "and CSS"], struck: [false, true] },
  { at: 0.34, lines: ["Sends HTML", "with inline CSS"], struck: [false, true] },
  { at: 0.52, lines: ["Loads JS", "with CSS inside"], struck: [false, true] },
  { at: 0.7, lines: ["Runtime rebuilds", "and injects CSS"], struck: [true, true] },
];

// Where the page has its styles: at the end with runtime CSS-in-JS, right after the HTML with yak
const STYLED = { runtime: 0.88, yak: 0.42 };

// The time the dot passes a point of the axis
const when = (f: number) => RUN + (f / STYLED.runtime) * TRAVEL;

// Shows from `from` until `until`, then fades out
const life = (from: number, until = OUT, over = 0.3) =>
  motion({ opacity: 0 })
    .at(from)
    .to({ opacity: 1 }, over)
    .at(until)
    .to({ opacity: 0 }, 0.4, ease.in);

const label = (x: number, y: number, text: string, fill: Color, weight?: number) => (
  <text x={x} y={y} class="mono" fontSize={FS} fontWeight={weight} fill={fill}>
    {text}
  </text>
);

// The arrow of time with the request at its start
const timeline = (
  <>
    <line x1={x0} y1={axisY} x2={x1} y2={axisY} stroke={theme.base03} strokeWidth={1.5} />
    <path
      d={`M${x1 - 7} ${axisY - 5}L${x1} ${axisY}L${x1 - 7} ${axisY + 5}`}
      fill="none"
      stroke={theme.base03}
      strokeWidth={1.5}
    />
    <line x1={x0} y1={axisY - 8} x2={x0} y2={axisY + 8} stroke={ink.fg} strokeWidth={2} />
    {label(x0, axisY + 26, "user requests", ink.prompt)}
    {label(x0, axisY + 45, "the page", ink.prompt)}
  </>
);

// A dot that runs along the axis to where the page has its styles
const dot = (
  <circle
    cx={x0}
    cy={axisY}
    r={4}
    fill={ink.fg}
    animation={[
      motion({ opacity: 0 })
        .at(RUN)
        .to({ opacity: 1 }, 0.2)
        .at(RUN + TRAVEL - 0.2)
        .to({ opacity: 0 }, 0.2),
      motion({ x: 0 })
        .at(RUN)
        .to({ x: at(STYLED.runtime) - x0 }, TRAVEL, ease.linear),
    ]}
  />
);

// A struck line gets its strike first, then fades out with it
const strikeLine = (x: number, y: number, text: string, i: number) => (
  <line
    x1={x - 2}
    y1={y - 4.5}
    x2={x + text.length * ADV + 2}
    y2={y - 4.5}
    stroke={ink.dotRed}
    strokeWidth={1.8}
    animation={draw({ at: STRIKE + i * 0.2, over: 0.35 })}
  />
);

const mark = (m: Mark, i: number) => {
  const x = at(m.at);
  const appear = when(m.at);
  // The runtime step goes away completely, the other steps only lose their CSS part
  const gone = m.struck[0];
  return (
    <g animation={life(appear, gone ? DROP : OUT)}>
      <line x1={x} y1={axisY - 6} x2={x} y2={axisY + 6} stroke={ink.fg} strokeWidth={2} />
      {m.lines.map((text, line) => {
        const y = axisY + 26 + line * 19;
        const struck = m.struck[line];
        const color = line === 0 ? ink.fg : ink.fgMuted;
        return (
          <g animation={struck && !gone ? life(appear, DROP) : undefined}>
            {label(x, y, text, color)}
            {struck && strikeLine(x, y, text, i)}
          </g>
        );
      })}
    </g>
  );
};

// A small flag above the axis: a pole and a pennant, with its text next to it
const flagShape = (x: number, color: Color, dashed = false) => (
  <>
    <line
      x1={x}
      y1={axisY}
      x2={x}
      y2={axisY - 34}
      stroke={color}
      strokeWidth={2}
      strokeDasharray={dashed ? "3 3" : undefined}
    />
    <path
      d={`M${x} ${axisY - 34}L${x + 14} ${axisY - 29}L${x} ${axisY - 24}Z`}
      fill={dashed ? "none" : color}
      stroke={color}
      strokeWidth={dashed ? 1.2 : 0}
    />
  </>
);

// The page has its styles: the flag sets where the dot stops, then moves left with yak. A faint
// flag stays at the old place, and a bracket between the two says how much earlier it is.
const styled = () => {
  const from = at(STYLED.runtime);
  const to = at(STYLED.yak);
  const bracketY = axisY - 58;
  return (
    <>
      <g animation={life(MOVE, OUT)}>{flagShape(from, ink.prompt, true)}</g>
      <g animation={life(when(STYLED.runtime))}>
        <g
          animation={motion({ x: 0 })
            .at(MOVE)
            .to({ x: to - from }, SLIDE, ease.inOut)}
        >
          {flagShape(from, ink.dotGreen)}
          {label(from + 20, axisY - 26, "Page styled", ink.fg, 700)}
        </g>
      </g>
      <g animation={life(MOVE + SLIDE, OUT)}>
        <line
          x1={to}
          y1={bracketY}
          x2={from}
          y2={bracketY}
          stroke={ink.dotGreen}
          strokeWidth={1.5}
        />
        <line
          x1={to}
          y1={bracketY - 5}
          x2={to}
          y2={bracketY + 5}
          stroke={ink.dotGreen}
          strokeWidth={1.5}
        />
        <line
          x1={from}
          y1={bracketY - 5}
          x2={from}
          y2={bracketY + 5}
          stroke={ink.dotGreen}
          strokeWidth={1.5}
        />
        {label((to + from) / 2 - 3.5 * ADV, bracketY - 8, "earlier", ink.dotGreen, 700)}
      </g>
    </>
  );
};

// The 103 Early Hints response leaves right at the request, above the axis
const hints = (
  <g animation={life(HINTS)}>
    <circle cx={x0} cy={axisY} r={6} fill="none" stroke={ink.dotGreen} strokeWidth={2} />
    <line
      x1={x0 + 6}
      y1={axisY - 8}
      x2={x0 + 22}
      y2={axisY - 40}
      stroke={ink.dotGreen}
      strokeWidth={1.5}
    />
    {label(x0 + 28, axisY - 44, "103 Early Hints", ink.dotGreen, 700)}
    {label(x0 + 28, axisY - 26, "sends the CSS", ink.fg)}
  </g>
);

// Each face only holds the characters it sets. Window and timeline text use the mono face, so it
// takes every character of this file, which is more than it needs but never misses one.
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
        title: "yak CSS loading",
        desc: "One page load on a timeline. With runtime CSS-in-JS, the server renders HTML and CSS, sends inline CSS, the browser loads JS with CSS inside, and the runtime rebuilds and injects the CSS before the page has its styles. With yak, 103 Early Hints sends the stylesheet first, the CSS steps go away, and the page has its styles right after the HTML.",
        css,
        reducedMotion: { at: 13 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(lane, "Page load", "not to scale")}
        {timeline}
        {dot}
        {MARKS.map((m, i) => mark(m, i))}
        {hints}
        {styled()}
      </>,
    ),
  );
}
