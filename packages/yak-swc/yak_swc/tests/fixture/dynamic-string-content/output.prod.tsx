import { styled } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// Dynamic value wrapped in quotes should produce `var(--xxx)` (unquoted),
// because `var()` references inside string literals are treated as literal
// text by the CSS engine and never get substituted.
const Input = /*YAK Extracted CSS:
.ym7uBBu {
  &::before {
    content: var(--ym7uBBu1);
  }
  &::after {
    content: var(--ym7uBBu2);
  }
}
*/ /*#__PURE__*/ __yak.__yak_input("ym7uBBu", 2, ({ $placeholder: __yak_$placeholder, $marker: __yak_$marker }, __yak_style)=>"ym7uBBu" + (__yak_style["--ym7uBBu1"] = String(__yak_$placeholder), __yak_style["--ym7uBBu2"] = String(__yak_$marker), ""));
// var() inside url() works because url() evaluates the var, so
// `url("${...}")` is also stripped to `url(var(--xxx))`.
const Bg = /*YAK Extracted CSS:
.ym7uBBu3 {
  background: url(var(--ym7uBBu4));
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu3", 2, ({ $url: __yak_$url }, __yak_style)=>"ym7uBBu3" + (__yak_style["--ym7uBBu4"] = String(__yak_$url), ""));
// Partial interpolation is intentionally NOT rewritten — the surrounding
// static text means the user must restructure their CSS (e.g. split into
// multiple values) for var() to actually substitute.
const Partial = /*YAK Extracted CSS:
.ym7uBBu5 {
  &::before {
    content: "Hello var(--ym7uBBu6)";
  }
}
*/ /*#__PURE__*/ __yak.__yak_span("ym7uBBu5", 2, ({ $name: __yak_$name }, __yak_style)=>"ym7uBBu5" + (__yak_style["--ym7uBBu6"] = String(__yak_$name), ""));
