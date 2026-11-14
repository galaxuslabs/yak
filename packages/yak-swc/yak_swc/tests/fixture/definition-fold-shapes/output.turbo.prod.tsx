import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { isLarge } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnUzIHsKICBwYWRkaW5nOiAwOwp9Ci55bTd1QkJ1NCB7CiAgcGFkZGluZzogNHB4Owp9LnltN3VCQnU2IHsKICBmb250LXNpemU6IDJlbTsKfS55bTd1QkJ1OCB7CiAgY29sb3I6IHdoaXRlOwp9Ci55bTd1QkJ1OSB7CiAgY29sb3I6IGJsYWNrOwp9LnltN3VCQnVCIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1QyB7CiAgbWFyZ2luOiAwOwp9LnltN3VCQnVHIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVJIHsKICBjb2xvcjogZ3JlZW47Cn0ueW03dUJCdUsgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVKIHsKICBsZWZ0OiB2YXIoLS15bTd1QkJ1TCk7Cn0ueW03dUJCdU0gewogIGNvbG9yOiB2YXIoLS15bTd1QkJ1Tik7Cn0ueW03dUJCdVAgewogIGxlZnQ6IHZhcigtLXltN3VCQnVRKTsKICB0b3A6IHZhcigtLXltN3VCQnVSKTsKfQ==";
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
// a dynamic value inside a property is a CSS variable, which the fold
// function writes into the style object
export const CssVariable = /*YAK EXPORTED STYLED:CssVariable:ym7uBBuJ*//*YAK Extracted CSS:
.ym7uBBuK {
  color: red;
}
.ym7uBBuJ {
  left: var(--ym7uBBuL);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuJ", 2, ({ $x: __yak_$x }, __yak_style)=>"ym7uBBuJ" + (__yak_$x > 1 ? " ym7uBBuK" : "") + (__yak_style["--ym7uBBuL"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$x, "px")), ""));
export const ThemeVariable = /*YAK EXPORTED STYLED:ThemeVariable:ym7uBBuM*//*YAK Extracted CSS:
.ym7uBBuM {
  color: var(--ym7uBBuN);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuM", 3, ({}, __yak_style, __yak_theme)=>"ym7uBBuM" + (__yak_style["--ym7uBBuN"] = String(__yak_theme.color), ""));
// a variable in a nested css is written only when its branch runs
export const NestedVariable = /*YAK EXPORTED STYLED:NestedVariable:ym7uBBuO*//*YAK Extracted CSS:
.ym7uBBuP {
  left: var(--ym7uBBuQ);
  top: var(--ym7uBBuR);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuO", 2, ({ $on: __yak_$on, $x: __yak_$x, $big: __yak_$big }, __yak_style)=>"ym7uBBuO" + (__yak_$on ? " ym7uBBuP" + (__yak_style["--ym7uBBuQ"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$x * 2, "px")), __yak_style["--ym7uBBuR"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$big ? 8 : 4, "px")), "") : ""));
