// @ts-nocheck
// The compiled shapes below are written by hand: this test does not run the
// SWC plugin. Each case renders the unfolded shape, which the compiler emits
// when it cannot fold, next to the folded shape and expects the same HTML.
//
// unfolded: styled("button")("yB", ({ $on }) => $on && css("yB1"))
// folded:   styled("button")("yB", 0, ({ $on: __yak_$on }) => "yB" + (__yak_$on ? " yB1" : ""))
import React from "react";
import { render, cleanup } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { YakThemeProvider } from "../context";
import { css } from "../cssLiteral";
import { styled } from "../styled";
import { cssValue } from "../internals/cssValue";

const html = (element: React.ReactElement) => {
  const result = render(element).container.innerHTML;
  cleanup();
  return result;
};

describe("definition fold", () => {
  it("passes the context theme and lets a theme prop win", () => {
    const unfolded = styled("div")("yT", ({ theme }) => theme.dark && css("yT1"));
    const folded = styled("div")("yT", 1, (_, __, theme) => "yT" + (theme.dark ? " yT1" : ""));
    for (const Component of [unfolded, folded]) {
      expect(
        html(
          React.createElement(
            YakThemeProvider,
            { theme: { dark: true } },
            React.createElement(Component),
          ),
        ),
      ).toBe('<div class="yT yT1"></div>');
      expect(
        html(
          React.createElement(
            YakThemeProvider,
            { theme: { dark: true } },
            React.createElement(Component, { theme: { dark: false } }),
          ),
        ),
      ).toBe(html(React.createElement(unfolded, { theme: { dark: false } })));
    }
  });

  it("writes CSS variables into a copy of the style prop", () => {
    const unfolded = styled("div")(
      "yV",
      ({ $on }) => $on && css("yV1", { style: { "--n": cssValue(2 * 3, "px") } }),
      { style: { "--x": cssValue(({ $x }) => $x, "px"), "--y": ({ $y }) => $y } },
    );
    const folded = styled("div")(
      "yV",
      2,
      ({ $on, $x, $y }, style) =>
        "yV" +
        ($on ? " yV1" + ((style["--n"] = String(cssValue(2 * 3, "px"))), "") : "") +
        ((style["--x"] = String(cssValue($x, "px"))), (style["--y"] = String($y)), ""),
    );
    const userStyle = { color: "red" };
    for (const $on of [false, true]) {
      const props = { $on, $x: 4, $y: "a", style: userStyle, className: "u" };
      expect(html(React.createElement(folded, props))).toBe(
        html(React.createElement(unfolded, props)),
      );
    }
    expect(userStyle).toEqual({ color: "red" });
    expect(html(React.createElement(folded, { $on: true, $x: 4, $y: "a" }))).toBe(
      '<div class="yV yV1" style="--n: 6px; --x: 4px; --y: a;"></div>',
    );
  });
});
