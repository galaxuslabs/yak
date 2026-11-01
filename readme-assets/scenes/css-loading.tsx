/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
import { readFileSync } from "node:fs";
import { draw, ease, motion, render, type Color, type Span } from "svjeez";
import { rect, type Rect } from "svjeez/extras";
import { canvas, compact, header, ink, panel, styles, theme, type Step } from "../slide.tsx";

const W = 820;
const H = 492;
const M = 28;
const TOP = 132;
const LANE_H = 156;
const GAP = 16;
const FS = 13;
// JetBrains Mono is 0.6em wide per character
const ADV = FS * 0.6;

// One panel per page load: the same request with runtime CSS-in-JS and with yak
const laneRuntime = rect(M, TOP, W - 2 * M, LANE_H);
const laneYak = rect(M, TOP + LANE_H + GAP, W - 2 * M, LANE_H);

// Beats in seconds
const DURATION = 16;
const RUNTIME: Span = { at: 0, over: 7.5 };
const YAK: Span = { at: 7.5, over: 7.5 };
const AGAIN: Span = { at: 15, over: 1 };
const TRAVEL = 4.6;
const START = [0.6, 8.6];
const HINTS = 8;
const STRIKE = 0.5;
const OUT = 14.4;

const STEPS: Step[] = [
  {
    label: "Runtime CSS-in-JS",
    title: "The browser builds the CSS again",
    sub: "The server renders the CSS, then the runtime regenerates it in the browser.",
    spans: [RUNTIME, AGAIN],
  },
  {
    label: "yak",
    title: "The CSS arrives before the HTML",
    sub: "yak sends the stylesheet with 103 Early Hints and skips the runtime CSS work.",
    spans: [YAK],
  },
];

// A step on the timeline: where it sits (0 to 1 along the axis) and its two label lines. On the
// yak lane, `struck` lines do not happen and get a line through them.
interface Mark {
  readonly at: number;
  readonly lines: readonly [string, string];
  readonly struck: readonly boolean[];
}
const MARKS: readonly Mark[] = [
  { at: 0.22, lines: ["Renders HTML", "and CSS"], struck: [false, true] },
  { at: 0.41, lines: ["Sends HTML", "with inline CSS"], struck: [false, true] },
  { at: 0.6, lines: ["Loads JS", "with CSS inside"], struck: [false, true] },
  { at: 0.79, lines: ["Runtime rebuilds", "and injects CSS"], struck: [true, true] },
];

const axis = (lane: Rect) => ({
  x0: lane.x + 24,
  x1: lane.x + lane.w - 24,
  y: lane.y + 86,
});

// Everything on a lane fades in at `at` and fades out together before the loop restarts
const keep = (at: number, over = 0.3) =>
  motion({ opacity: 0 }).at(at).to({ opacity: 1 }, over).at(OUT).to({ opacity: 0 }, 0.5, ease.in);

const label = (x: number, y: number, text: string, fill: Color, weight?: number) => (
  <text x={x} y={y} class="mono" fontSize={FS} fontWeight={weight} fill={fill}>
    {text}
  </text>
);

// The arrow of time with the request at its start
const timeline = (lane: Rect) => {
  const a = axis(lane);
  return (
    <>
      <line x1={a.x0} y1={a.y} x2={a.x1} y2={a.y} stroke={theme.base03} strokeWidth={1.5} />
      <path
        d={`M${a.x1 - 7} ${a.y - 5}L${a.x1} ${a.y}L${a.x1 - 7} ${a.y + 5}`}
        fill="none"
        stroke={theme.base03}
        strokeWidth={1.5}
      />
      <line x1={a.x0} y1={a.y - 8} x2={a.x0} y2={a.y + 8} stroke={ink.fg} strokeWidth={2} />
      {label(a.x0, a.y + 26, "user requests", ink.prompt)}
      {label(a.x0, a.y + 45, "the page", ink.prompt)}
    </>
  );
};

// A dot that runs along the axis, and the time each mark appears as it passes
const travel = (lane: Rect, start: number) => {
  const a = axis(lane);
  const when = (f: number) => start + f * TRAVEL;
  const dot = (
    <circle
      cx={a.x0}
      cy={a.y}
      r={4}
      fill={ink.fg}
      animation={[
        motion({ opacity: 0 })
          .at(start)
          .to({ opacity: 1 }, 0.2)
          .at(start + TRAVEL - 0.2)
          .to({ opacity: 0 }, 0.2),
        motion({ x: 0 })
          .at(start)
          .to({ x: a.x1 - a.x0 - 10 }, TRAVEL, ease.linear),
      ]}
    />
  );
  return { dot, when };
};

const mark = (lane: Rect, m: Mark, at: number, yak: boolean) => {
  const a = axis(lane);
  const x = a.x0 + m.at * (a.x1 - a.x0);
  return (
    <g animation={keep(at)}>
      <line x1={x} y1={a.y - 6} x2={x} y2={a.y + 6} stroke={ink.fg} strokeWidth={2} />
      {m.lines.map((text, i) => {
        const y = a.y + 26 + i * 19;
        const struck = yak && m.struck[i];
        return (
          <>
            {label(x, y, text, struck ? ink.prompt : i === 0 ? ink.fg : ink.fgMuted)}
            {struck && (
              <line
                x1={x - 2}
                y1={y - 4.5}
                x2={x + text.length * ADV + 2}
                y2={y - 4.5}
                stroke={ink.dotRed}
                strokeWidth={1.8}
                animation={draw({ at: at + STRIKE, over: 0.35 })}
              />
            )}
          </>
        );
      })}
    </g>
  );
};

const runtimeRun = travel(laneRuntime, START[0]);
const yakRun = travel(laneYak, START[1]);

// The 103 Early Hints response leaves right at the request, above the axis
const hints = () => {
  const a = axis(laneYak);
  const x = a.x0 + 0.02 * (a.x1 - a.x0);
  return (
    <g animation={keep(HINTS)}>
      <circle cx={a.x0} cy={a.y} r={6} fill="none" stroke={ink.dotGreen} strokeWidth={2} />
      <line x1={x} y1={a.y - 8} x2={x + 22} y2={a.y - 30} stroke={ink.dotGreen} strokeWidth={1.5} />
      {label(x + 28, a.y - 30, "103 Early Hints", ink.dotGreen, 700)}
      {label(x + 28 + 16 * ADV, a.y - 30, "sends the CSS", ink.fg)}
    </g>
  );
};

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
        desc: "Two page loads on a timeline. With runtime CSS-in-JS, the server renders HTML and CSS, sends inline CSS, the browser loads JS with CSS inside, and the runtime rebuilds and injects the CSS. With yak, a 103 Early Hints response sends the stylesheet right at the request, and the CSS steps fall away.",
        css,
        reducedMotion: { at: 14 },
      },
      <>
        {canvas(W, H)}
        {header(STEPS, { width: W, duration: DURATION })}

        {panel(laneRuntime, "Runtime CSS-in-JS", "not to scale")}
        {panel(laneYak, "yak", "not to scale")}
        {timeline(laneRuntime)}
        {timeline(laneYak)}

        {runtimeRun.dot}
        {MARKS.map((m) => mark(laneRuntime, m, runtimeRun.when(m.at), false))}

        {hints()}
        {yakRun.dot}
        {MARKS.map((m) => mark(laneYak, m, yakRun.when(m.at), true))}
      </>,
    ),
  );
}
