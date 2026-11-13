import { styled, css } from "@yak/react/internal";
import { isLarge } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnUzIHsKICBwYWRkaW5nOiAwOwp9Ci55bTd1QkJ1NCB7CiAgcGFkZGluZzogNHB4Owp9LnltN3VCQnU2IHsKICBmb250LXNpemU6IDJlbTsKfS55bTd1QkJ1OCB7CiAgY29sb3I6IHdoaXRlOwp9Ci55bTd1QkJ1OSB7CiAgY29sb3I6IGJsYWNrOwp9LnltN3VCQnVCIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1QyB7CiAgbWFyZ2luOiAwOwp9LnltN3VCQnVHIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVJIHsKICBjb2xvcjogZ3JlZW47Cn0=";
// identifier props parameter read through members
export const Ident = /*YAK EXPORTED STYLED:Ident:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu", 0, ({ $on })=>"ym7uBBu" + ($on ? " ym7uBBu1" : ""));
// block body with a single return and a renamed key
export const Block = /*YAK EXPORTED STYLED:Block:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu3 {
  padding: 0;
}
.ym7uBBu4 {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu2", 0, ({ $size })=>"ym7uBBu2" + ($size === "s" ? " ym7uBBu3" : " ym7uBBu4"));
// helper call in a condition and a shorthand object read
export const Helper = /*YAK EXPORTED STYLED:Helper:ym7uBBu5*//*YAK Extracted CSS:
.ym7uBBu6 {
  font-size: 2em;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu5", 0, ({ $size, $mode })=>"ym7uBBu5" + (isLarge({
        $size: $size
    }, $mode) ? " ym7uBBu6" : ""));
// theme read through destructuring and through a member
export const Themed = /*YAK EXPORTED STYLED:Themed:ym7uBBu7*//*YAK Extracted CSS:
.ym7uBBu8 {
  color: white;
}
.ym7uBBu9 {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu7", 1, ({ $on }, style, theme)=>"ym7uBBu7" + (theme.dark ? " ym7uBBu8" : "") + ($on && theme.dark ? " ym7uBBu9" : ""));
// falsy branches, nested ternaries and an empty css
export const Nested = /*YAK EXPORTED STYLED:Nested:ym7uBBuA*//*YAK Extracted CSS:
.ym7uBBuB {
  color: red;
}
.ym7uBBuC {
  margin: 0;
}
*/ /*#__PURE__*/ __yak.__yak_span("ym7uBBuA", 0, ({ $a, $b, $c })=>"ym7uBBuA" + ($a ? $b ? " ym7uBBuB" : "" : "") + ($c > 1 ? " ym7uBBuC" + ($a ? " ym7uBBuD" : "") : ""));
// a nested condition that reads a prop of the enclosing arrow
export const Outer = /*YAK EXPORTED STYLED:Outer:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuG {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_span("ym7uBBuE", 0, ({ $a, $b })=>"ym7uBBuE" + (" ym7uBBuF" + ($a && $b ? " ym7uBBuG" : "")));
// styled(Component) and attrs keep their target but fold their conditions
export const Wrapped = /*YAK EXPORTED STYLED:Wrapped:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuI {
  color: green;
}
*/ /*#__PURE__*/ ((styled(Ident)).attrs({
    role: "note"
}))("ym7uBBuH", 0, ({ $x })=>"ym7uBBuH" + ($x ? " ym7uBBuI" : ""));
