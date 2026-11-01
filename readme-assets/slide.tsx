/** @jsxImportSource svjeez */
/** @jsxRuntime automatic */
// Shared style for the README scenes, taken from yak.js.org (docs/src/theme/palette.yak.ts
// and docs/src/lib/yak-theme.ts): beige or navy page, violet editor windows, the yak-night syntax colors
import { readFileSync } from "node:fs";
import subsetFont from "subset-font";
import { def, ease, motion, type Span } from "svjeez";
import { base16, type Piece, type Rect, type Role, type Tokens } from "svjeez/extras";

// The editor surface is dark in both page themes, like on the site
const CREAM = "#fffdf8" as const;
export const ink = {
  card: "#231442",
  fg: CREAM,
  fgMuted: "rgba(255,253,248,0.7)",
  border: "rgba(255,253,248,0.13)",
  underline: "rgba(255,253,248,0.4)",
  prompt: "#8a7cbe",
  dotRed: "#f2462f",
  dotYellow: "#ffce4b",
  dotGreen: "#5fd37f",
} as const;

// yak-night: the code colors of the site
export const theme = base16(
  ink.card, // base00 editor background
  "#130230", // base01
  ink.border, // base02 border
  "#8a7daf", // base03 comment
  "#a99fc4", // base04 punctuation
  "#ece3d2", // base05 text
  CREAM, // base06
  CREAM, // base07
  "#8bbcf0", // base08 css property, html attribute
  "#c9a2ff", // base09 number, unit
  "#7fdcc5", // base0A type, selector, component
  "#f5a973", // base0B string, css value
  "#7fdcc5", // base0C
  "#ece27c", // base0D function, tagged template
  "#f178b6", // base0E keyword
  "#a99fc4", // base0F
);

// Page colors follow the reader's color scheme: beige paper in light mode, navy in dark mode
export const page = {
  canvas: "var(--page-canvas)",
  edge: "var(--page-edge)",
  heading: "var(--page-heading)",
  body: "var(--page-body)",
  accent: "var(--page-accent)",
} as const;
const pageVars = (canvas: string, edge: string, heading: string, body: string, accent: string) =>
  `--page-canvas:${canvas};--page-edge:${edge};--page-heading:${heading};--page-body:${body};--page-accent:${accent}`;

// The button colors from the CSS in the example
export const GREEN = "#008000";
export const GRAY = "#696969";

// Hanken Grotesk and JetBrains Mono (SIL OFL), embedded so the SVG matches the site. Each face is
// cut down to the characters it sets, which keeps the file small.
const face = async (family: string, weight: number, file: URL, text: string, variable = false) => {
  // A variable font is pinned to the one weight the scene uses
  const variationAxes = variable ? { wght: weight } : undefined;
  const font = await subsetFont(readFileSync(file), text, { targetFormat: "woff2", variationAxes });
  return `@font-face{font-family:"${family}";font-weight:${weight};src:url(data:font/woff2;base64,${font.toString("base64")}) format("woff2")}`;
};
// The same files the docs site uses: Hanken Grotesk from Fontsource, the docs' own JetBrains Mono cut
const hanken = (weight: number) =>
  new URL(
    `./node_modules/@fontsource/hanken-grotesk/files/hanken-grotesk-latin-${weight}-normal.woff2`,
    import.meta.url,
  );
const MONO_FILE = new URL("../docs/src/fonts/jetbrains-mono-code.woff2", import.meta.url);
export const SANS = `"Hanken Grotesk",system-ui,-apple-system,sans-serif`;
export const MONO = `"JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace`;

/** The text each face sets. A character that is missing falls back to the next font in the stack. */
export interface FontText {
  readonly regular: string;
  readonly semibold: string;
  readonly black: string;
  readonly mono: string;
}

/** The page CSS: the fonts, cut down to `text`, and the light and dark page colors. */
export const styles = async (text: FontText) =>
  [
    await face("Hanken Grotesk", 400, hanken(400), text.regular),
    await face("Hanken Grotesk", 600, hanken(600), text.semibold),
    await face("Hanken Grotesk", 900, hanken(900), text.black),
    await face("JetBrains Mono", 400, MONO_FILE, text.mono, true),
    `svg{${pageVars("#f9f5f0", "#d9d4ce", "#22084c", "#564b7c", "#d82911")}}`,
    `@media (prefers-color-scheme:dark){svg{${pageVars("#2b273b", "#4b4564", "#efedf8", "#a6a1bf", "#ff5d46")}}}`,
    `text{font-family:${MONO}}`,
    `.sans,.sans text{font-family:${SANS}}`,
    `.mono,.mono text{font-family:${MONO}}`,
  ].join("\n");

// A small highlighter for JS, CSS and HTML, mapped to theme roles
const RULES: [RegExp, Role | ((rest: string) => Role)][] = [
  [/^(\/\/.*|\/\*.*?\*\/)/, "comment"],
  [/^"[^"]*"/, "string"],
  [/^\d+(px|ms)?/, "number"],
  [/^(import|from|const|return|true|false)\b/, "keyword"],
  [/^\.[A-Za-z0-9-]+(?=\s*\{)/, "type"],
  [/^[a-zA-Z-]+(?==)/, "variable"],
  [/^[a-z-]+(?=:)/, "variable"],
  [/^[A-Z]\w*/, "type"],
  [/^[\w$]+/, (rest) => (/^\s*[(`]/.test(rest) ? "fn" : "plain")],
  [/^[{}()[\];,.=`?:<>/*]/, "punct"],
  [/^\s+/, "plain"],
  [/^./, "plain"],
];

export const highlight = (src: string): Tokens =>
  src.split("\n").map((line) => {
    const pieces: Piece[] = [];
    let rest = line;
    // After a css property and its colon, words are values until the semicolon
    let value = false;
    while (rest) {
      // An html tag: the bracket as punctuation, the name as a keyword
      const tag = /^(<\/?)([a-z]+)/.exec(rest);
      if (tag) {
        pieces.push(["punct", tag[1]], ["type", tag[2]]);
        rest = rest.slice(tag[0].length);
        continue;
      }
      for (const [re, role] of RULES) {
        const m = re.exec(rest);
        if (!m) continue;
        const text = m[0];
        rest = rest.slice(text.length);
        let r = typeof role === "function" ? role(rest) : role;
        if (value && r === "plain" && /\w/.test(text)) r = "string";
        const prev = pieces[pieces.length - 1];
        if (text === ":" && Array.isArray(prev) && prev[0] === "variable") value = true;
        if (text === ";" || text === "}") value = false;
        pieces.push(r === "plain" ? text : [r, text]);
        break;
      }
    }
    return pieces;
  });

/** Like visible(), but a span at either end of the loop stays shown across the seam, so nothing blinks. */
export const shown = (spans: Span[], fade: number, duration: number) => {
  let m = motion({ opacity: spans[0].at === 0 ? 1 : 0 });
  for (const { at, over } of spans) {
    if (at > 0) m = m.at(at).to({ opacity: 1 }, fade);
    if (at + over < duration) m = m.at(at + over - fade).to({ opacity: 0 }, fade);
  }
  return m;
};

const ROLL = 0.5;

/**
 * For text that one step replaces with another, inside a clipped band `dy` high: the old text rolls
 * up and fades out of the band while the new text rolls in from below, so the two never overlap and
 * the band never goes blank.
 */
const roll = (spans: Span[], duration: number, dy: number) => {
  const on = spans[0].at === 0;
  let m = motion({ y: on ? 0 : dy, opacity: on ? 1 : 0 });
  for (const { at, over } of spans) {
    if (at > 0)
      m = m
        .at(at - ROLL / 2)
        .set({ y: dy })
        .to({ y: 0, opacity: 1 }, ROLL, ease.inOut);
    if (at + over < duration)
      m = m.at(at + over - ROLL / 2).to({ y: -dy, opacity: 0 }, ROLL, ease.inOut);
  }
  return m;
};

/** On during each span, crossfading with its neighbours at the span edges. */
const cross = (spans: Span[], duration: number) => {
  let m = motion({ opacity: spans[0].at === 0 ? 1 : 0 });
  for (const { at, over } of spans) {
    if (at > 0) m = m.at(at - ROLL / 2).to({ opacity: 1 }, ROLL);
    if (at + over < duration) m = m.at(at + over - ROLL / 2).to({ opacity: 0 }, ROLL);
  }
  return m;
};

export interface Step {
  readonly label: string;
  readonly title: string;
  readonly sub: string;
  readonly spans: Span[];
}

/**
 * The section header: a short label, a black-weight headline and a subtitle per step, plus one bar
 * per step at the top right. Each step's spans must meet the next step's, or the band shows empty.
 */
export const header = (
  steps: readonly Step[],
  { width, margin = 28, duration }: { width: number; margin?: number; duration: number },
) => {
  // One clipped band for the whole text block, so the label, title and subtitle roll together
  const top = 26;
  const h = 88;
  const clip = def.clipPath({}, <rect x={0} y={top} width={width} height={h} />);
  return (
    <>
      <g clipPath={clip}>
        {steps.map((step) => (
          <g animation={roll(step.spans, duration, h)}>
            <text x={margin} y={45} class="sans" fontSize={15} fontWeight={600} fill={page.accent}>
              {step.label}
            </text>
            <text
              x={margin}
              y={80}
              class="sans"
              fontSize={30}
              fontWeight={900}
              letterSpacing={-0.75}
              fill={page.heading}
            >
              {step.title}
            </text>
            <text x={margin} y={104} class="sans" fontSize={16} fill={page.body}>
              {step.sub}
            </text>
          </g>
        ))}
      </g>
      {steps.length > 1 &&
        steps.map((step, i) => {
          const x = width - margin - (steps.length - i) * 30 + 6;
          return (
            <>
              <rect x={x} y={38} width={24} height={4} rx={2} fill={page.edge} />
              <rect
                x={x}
                y={38}
                width={24}
                height={4}
                rx={2}
                fill={page.accent}
                animation={cross(step.spans, duration)}
              />
            </>
          );
        })}
    </>
  );
};

/**
 * Makes the rendered SVG smaller: the mono font comes from one CSS rule instead of an attribute on
 * every code word, and the whitespace between tags goes away.
 */
export const compact = (svg: string) =>
  svg.replaceAll(` font-family="${MONO.replaceAll('"', "&quot;")}"`, "").replace(/>\s+</g, "><");

/** The page: beige or navy, with rounded corners and a thin edge. */
export const canvas = (width: number, height: number) => (
  <rect
    x={0.5}
    y={0.5}
    width={width - 1}
    height={height - 1}
    rx={14}
    fill={page.canvas}
    stroke={page.edge}
  />
);

/** Height of a window's title bar plus padding; content starts about this far below the window top. */
export const HEAD = 56;

/** An editor window like the ones on the site: violet, traffic-light dots, a file name and an optional tag. */
export const panel = (r: Rect, label: string, tag?: string) => (
  <>
    <rect x={r.x} y={r.y} width={r.w} height={r.h} rx={14} fill={ink.card} />
    <rect
      x={r.x + 0.5}
      y={r.y + 0.5}
      width={r.w - 1}
      height={r.h - 1}
      rx={13.5}
      fill="none"
      stroke={ink.border}
    />
    <line x1={r.x} y1={r.y + 38} x2={r.x + r.w} y2={r.y + 38} stroke={ink.border} />
    {[ink.dotRed, ink.dotYellow, ink.dotGreen].map((color, i) => (
      <circle cx={r.x + 20 + i * 18} cy={r.y + 19} r={5.5} fill={color} />
    ))}
    <text x={r.x + 84} y={r.y + 24} class="mono" fontSize={13} fill={ink.fgMuted}>
      {label}
    </text>
    {tag && (
      <text
        x={r.x + r.w - 18}
        y={r.y + 24}
        class="mono"
        fontSize={12}
        textAnchor="end"
        fill={ink.prompt}
      >
        {tag}
      </text>
    )}
  </>
);

/** A mouse pointer with its tip at 0,0. */
export const POINTER = "M0 0 L0 17 L4.5 13 L7.5 20 L10 19 L7 12 L13 12 Z";
