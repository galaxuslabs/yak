import { describe, expect, it } from "vitest";
import { defaultOptions, optionsFromParams, optionsToParams } from "./options";

const roundTrip = (options: typeof defaultOptions) =>
  optionsFromParams(new URLSearchParams(optionsToParams(options)));

describe("share link options", () => {
  it("leaves the defaults out of the link", () => {
    expect(optionsToParams(defaultOptions)).toEqual({});
  });

  it("reads every option back from the link", () => {
    const flipped = {
      minify: !defaultOptions.minify,
      showComments: !defaultOptions.showComments,
      foldStatic: !defaultOptions.foldStatic,
      deadCodeElimination: !defaultOptions.deadCodeElimination,
    };
    expect(new URLSearchParams(optionsToParams(flipped)).toString()).toBe(
      "minify=1&comments=0&fold=0&dce=1",
    );
    expect(roundTrip(flipped)).toEqual(flipped);
  });

  it("opens a link without options with the defaults", () => {
    expect(optionsFromParams(new URLSearchParams("q=abc&output=js"))).toEqual(defaultOptions);
  });

  it("keeps the default for a malformed value", () => {
    expect(optionsFromParams(new URLSearchParams("minify=yes&fold=&dce=2&comments=0"))).toEqual({
      ...defaultOptions,
      showComments: false,
    });
  });
});
