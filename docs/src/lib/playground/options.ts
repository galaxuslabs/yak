import type { TransformOptions } from "./types";

export const defaultOptions: TransformOptions = {
  minify: false,
  showComments: true,
  foldStatic: true,
  deadCodeElimination: false,
};

/** The query parameter of each option in a share link */
const PARAMS: Record<keyof TransformOptions, string> = {
  minify: "minify",
  showComments: "comments",
  foldStatic: "fold",
  deadCodeElimination: "dce",
};

const optionKeys = Object.keys(PARAMS) as (keyof TransformOptions)[];

/**
 * The share link holds only the options that differ from the defaults, so a link without
 * them opens with the defaults: `{ minify: true, foldStatic: false }` gives `minify=1&fold=0`.
 */
export function optionsToParams(options: TransformOptions): Record<string, string> {
  return Object.fromEntries(
    optionKeys
      .filter((key) => options[key] !== defaultOptions[key])
      .map((key) => [PARAMS[key], options[key] ? "1" : "0"]),
  );
}

/** Reads the options of a share link. A missing or unknown value keeps the default. */
export function optionsFromParams(params: URLSearchParams): TransformOptions {
  const options = { ...defaultOptions };
  for (const key of optionKeys) {
    const value = params.get(PARAMS[key]);
    if (value === "1") options[key] = true;
    if (value === "0") options[key] = false;
  }
  return options;
}
