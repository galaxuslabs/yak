import { styled, css } from "@yak/react/internal";
import { isLarge } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// identifier props parameter read through members
export const Ident = /*YAK EXPORTED STYLED:Ident:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu", 0, ({ $on: __yak_$on })=>"ym7uBBu" + (__yak_$on ? " ym7uBBu1" : ""));
// block body with a single return and a renamed key
export const Block = /*YAK EXPORTED STYLED:Block:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu3 {
  padding: 0;
}
.ym7uBBu4 {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu2", 0, ({ $size: __yak_$size })=>"ym7uBBu2" + (__yak_$size === "s" ? " ym7uBBu3" : " ym7uBBu4"));
// helper call in a condition and a shorthand object read
export const Helper = /*YAK EXPORTED STYLED:Helper:ym7uBBu5*//*YAK Extracted CSS:
.ym7uBBu6 {
  font-size: 2em;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu5", 0, ({ $size: __yak_$size, $mode: __yak_$mode })=>"ym7uBBu5" + (isLarge({
        $size: __yak_$size
    }, __yak_$mode) ? " ym7uBBu6" : ""));
// theme read through destructuring and through a member
export const Themed = /*YAK EXPORTED STYLED:Themed:ym7uBBu7*//*YAK Extracted CSS:
.ym7uBBu8 {
  color: white;
}
.ym7uBBu9 {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu7", 1, ({ $on: __yak_$on }, __yak_style, __yak_theme)=>"ym7uBBu7" + (__yak_theme.dark ? " ym7uBBu8" : "") + (__yak_$on && __yak_theme.dark ? " ym7uBBu9" : ""));
// falsy branches, nested ternaries and an empty css
export const Nested = /*YAK EXPORTED STYLED:Nested:ym7uBBuA*//*YAK Extracted CSS:
.ym7uBBuB {
  color: red;
}
.ym7uBBuC {
  margin: 0;
}
*/ /*#__PURE__*/ __yak.__yak_span("ym7uBBuA", 0, ({ $a: __yak_$a, $b: __yak_$b, $c: __yak_$c })=>"ym7uBBuA" + (__yak_$a ? __yak_$b ? " ym7uBBuB" : "" : "") + (__yak_$c > 1 ? " ym7uBBuC" + (__yak_$a ? " ym7uBBuD" : "") : ""));
// a nested condition that reads a prop of the enclosing arrow
export const Outer = /*YAK EXPORTED STYLED:Outer:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuG {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_span("ym7uBBuE", 0, ({ $a: __yak_$a, $b: __yak_$b })=>"ym7uBBuE" + (" ym7uBBuF" + (__yak_$a && __yak_$b ? " ym7uBBuG" : "")));
// styled(Component) and attrs keep their target but fold their conditions
export const Wrapped = /*YAK EXPORTED STYLED:Wrapped:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuI {
  color: green;
}
*/ /*#__PURE__*/ ((styled(Ident)).attrs({
    role: "note"
}))("ym7uBBuH", 0, ({ $x: __yak_$x })=>"ym7uBBuH" + (__yak_$x ? " ym7uBBuI" : ""));
