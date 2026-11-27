import { afterEach, expect, it, vi } from "vitest";
import { cssValue } from "../internals/cssValue";

// `left: ${fn}px` -> cssValue(fn, "px") and `left: -${fn}px` -> cssValue(fn, "px", true)
// A folded value without a unit, `color: ${fn};`, compiles to cssValue($color, "")
// without the plugin option `minify`
it.each([
  [32, "px", false, "32px"],
  [32, "px", true, "-32px"],
  [-32, "px", true, "32px"],
  ["2rem", "", true, "-2rem"],
  ["-2rem", "", true, "2rem"],
  [undefined, "px", true, "undefined"],
  [undefined, "", false, "undefined"],
])("cssValue(%j, %j, %j) is %j", (arg, unit, negate, expected) => {
  expect(cssValue(arg, unit, negate)).toBe(expected);
});

it("calls a function with the props", () => {
  const value = cssValue(({ $x }: { $x: number }) => $x, "px", true);
  expect((value as (props: unknown) => unknown)({ $x: 8 })).toBe("-8px");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

it.each([undefined, null, false])("throws for %j in development", (arg) => {
  vi.stubEnv("NODE_ENV", "development");
  expect(() => cssValue(arg, "")).toThrow("Dynamic CSS values must be a string or number");
});
