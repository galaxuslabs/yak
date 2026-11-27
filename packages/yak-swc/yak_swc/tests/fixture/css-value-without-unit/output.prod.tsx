import { styled, css, __yak_cssValue } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// The folded function turns a value without a unit into text like the
// unfolded runtime does: `` `${$color}` `` with `minify` and
// `__yak_cssValue($color, "")` without it. A value with a unit or a minus
// keeps the `__yak_cssValue` call it has.
export const WithoutUnit = /*YAK EXPORTED STYLED:WithoutUnit:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu {
  color: var(--ym7uBBu1);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $color }, style)=>"ym7uBBu" + (style["--ym7uBBu1"] = `${$color}`, ""));
export const WithoutUnitBlockBody = /*YAK EXPORTED STYLED:WithoutUnitBlockBody:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu2 {
  z-index: var(--ym7uBBu3);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $on }, style)=>"ym7uBBu2" + (style["--ym7uBBu3"] = `${$on ? 2 : undefined}`, ""));
// a value in a nested `css` literal
export const NestedWithoutUnit = /*YAK EXPORTED STYLED:NestedWithoutUnit:ym7uBBu4*//*YAK Extracted CSS:
.ym7uBBu5 {
  color: var(--ym7uBBu6);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $on, $color }, style)=>"ym7uBBu4" + ($on ? " ym7uBBu5" + (style["--ym7uBBu6"] = `${$color}`, "") : ""));
export const WithUnit = /*YAK EXPORTED STYLED:WithUnit:ym7uBBu7*//*YAK Extracted CSS:
.ym7uBBu7 {
  width: var(--ym7uBBu8);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $w }, style)=>"ym7uBBu7" + (style["--ym7uBBu8"] = /*#__PURE__*/ __yak_cssValue($w, "px"), ""));
export const MinusWithoutUnit = /*YAK EXPORTED STYLED:MinusWithoutUnit:ym7uBBu9*//*YAK Extracted CSS:
.ym7uBBu9 {
  z-index: var(--ym7uBBuA);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $z }, style)=>"ym7uBBu9" + (style["--ym7uBBuA"] = /*#__PURE__*/ __yak_cssValue($z, "", true), ""));
// stays unfolded: a `let` keeps the folder from turning the block body into
// one expression, so the runtime writes `String(value)`
export const Unfolded = /*YAK EXPORTED STYLED:Unfolded:ym7uBBuB*//*YAK Extracted CSS:
.ym7uBBuB {
  width: var(--ym7uBBuC);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuB", {
    "--ym7uBBuC": ({ $w })=>{
        let w = $w;
        return w;
    }
});
