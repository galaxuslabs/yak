import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { isLarge } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnUzIHsKICBwYWRkaW5nOiAwOwp9Ci55bTd1QkJ1NCB7CiAgcGFkZGluZzogNHB4Owp9LnltN3VCQnU2IHsKICBmb250LXNpemU6IDJlbTsKfS55bTd1QkJ1OCB7CiAgY29sb3I6IHdoaXRlOwp9Ci55bTd1QkJ1OSB7CiAgY29sb3I6IGJsYWNrOwp9LnltN3VCQnVCIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1QyB7CiAgbWFyZ2luOiAwOwp9LnltN3VCQnVHIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVJIHsKICBjb2xvcjogZ3JlZW47Cn0ueW03dUJCdUsgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVKIHsKICBsZWZ0OiB2YXIoLS15bTd1QkJ1TCk7Cn0ueW03dUJCdU0gewogIGNvbG9yOiB2YXIoLS15bTd1QkJ1Tik7Cn0ueW03dUJCdVAgewogIGxlZnQ6IHZhcigtLXltN3VCQnVRKTsKICB0b3A6IHZhcigtLXltN3VCQnVSKTsKfS55bTd1QkJ1VCB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1ViB7CiAgcGFkZGluZzogMDsKfS55bTd1QkJ1WCB7CiAgY29sb3I6IG9yYW5nZTsKfS55bTd1QkJ1WiB7CiAgY29sb3I6IGJsYWNrOwp9LnltN3VCQnVlIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1ZiB7CiAgZm9udC1zaXplOiAyZW07Cn0ueW03dUJCdWkgewogIHBhZGRpbmc6IDJweDsKfQoueW03dUJCdWogewogIHBhZGRpbmc6IDFweDsKfS55bTd1QkJ1bCB7CiAgdGV4dC1hbGlnbjogc3RhcnQ7Cn0KLnltN3VCQnVtIHsKICB0ZXh0LWFsaWduOiBlbmQ7Cn0KLnltN3VCQnVuIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1byB7CiAgY29sb3I6IGJsdWU7Cn0ueW03dUJCdXAgewogIGhlaWdodDogdmFyKC0teW03dUJCdXEpOwogIHdpZHRoOiB2YXIoLS15bTd1QkJ1cik7Cn0=";
// identifier props parameter read through members
export const Ident = /*YAK EXPORTED STYLED:Ident:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBu" + ($on ? " ym7uBBu1" : ""));
// block body with a single return and a renamed key
export const Block = /*YAK EXPORTED STYLED:Block:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu3 {
  padding: 0;
}
.ym7uBBu4 {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBu2" + ($size === "s" ? " ym7uBBu3" : " ym7uBBu4"));
// helper call in a condition and a shorthand object read
export const Helper = /*YAK EXPORTED STYLED:Helper:ym7uBBu5*//*YAK Extracted CSS:
.ym7uBBu6 {
  font-size: 2em;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size, $mode })=>"ym7uBBu5" + (isLarge({
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
*/ /*#__PURE__*/ __yak.__yak_div(1, ({ $on }, style, theme)=>"ym7uBBu7" + (theme.dark ? " ym7uBBu8" : "") + ($on && theme.dark ? " ym7uBBu9" : ""));
// falsy branches, nested ternaries and an empty css
export const Nested = /*YAK EXPORTED STYLED:Nested:ym7uBBuA*//*YAK Extracted CSS:
.ym7uBBuB {
  color: red;
}
.ym7uBBuC {
  margin: 0;
}
*/ /*#__PURE__*/ __yak.__yak_span(0, ({ $a, $b, $c })=>"ym7uBBuA" + ($a ? $b ? " ym7uBBuB" : "" : "") + ($c > 1 ? " ym7uBBuC" + ($a ? " ym7uBBuD" : "") : ""));
// a nested condition that reads a prop of the enclosing arrow
export const Outer = /*YAK EXPORTED STYLED:Outer:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuG {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_span(0, ({ $a, $b })=>"ym7uBBuE" + (" ym7uBBuF" + ($a && $b ? " ym7uBBuG" : "")));
// styled(Component) and attrs keep their target but fold their conditions
export const Wrapped = /*YAK EXPORTED STYLED:Wrapped:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuI {
  color: green;
}
*/ /*#__PURE__*/ ((styled(Ident)).attrs({
    role: "note"
}))(0, ({ $x })=>"ym7uBBuH" + ($x ? " ym7uBBuI" : ""));
// a dynamic value inside a property is a CSS variable, which the fold
// function writes into the style object
export const CssVariable = /*YAK EXPORTED STYLED:CssVariable:ym7uBBuJ*//*YAK Extracted CSS:
.ym7uBBuK {
  color: red;
}
.ym7uBBuJ {
  left: var(--ym7uBBuL);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $x }, style)=>"ym7uBBuJ" + ($x > 1 ? " ym7uBBuK" : "") + (style["--ym7uBBuL"] = /*#__PURE__*/ __yak_cssValue($x, "px"), ""));
export const ThemeVariable = /*YAK EXPORTED STYLED:ThemeVariable:ym7uBBuM*//*YAK Extracted CSS:
.ym7uBBuM {
  color: var(--ym7uBBuN);
}
*/ /*#__PURE__*/ __yak.__yak_div(3, ({}, style, theme)=>"ym7uBBuM" + (style["--ym7uBBuN"] = theme.color, ""));
// a variable in a nested css is written only when its branch runs
export const NestedVariable = /*YAK EXPORTED STYLED:NestedVariable:ym7uBBuO*//*YAK Extracted CSS:
.ym7uBBuP {
  left: var(--ym7uBBuQ);
  top: var(--ym7uBBuR);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $on, $x, $big }, style)=>"ym7uBBuO" + ($on ? " ym7uBBuP" + (style["--ym7uBBuQ"] = /*#__PURE__*/ __yak_cssValue($x * 2, "px"), style["--ym7uBBuR"] = /*#__PURE__*/ __yak_cssValue($big ? 8 : 4, "px"), "") : ""));
// a truthy left side of `||` adds nothing
export const OrProp = /*YAK EXPORTED STYLED:OrProp:ym7uBBuS*//*YAK Extracted CSS:
.ym7uBBuT {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $label })=>"ym7uBBuS" + ($label ? "" : " ym7uBBuT"));
export const OrComparison = /*YAK EXPORTED STYLED:OrComparison:ym7uBBuU*//*YAK Extracted CSS:
.ym7uBBuV {
  padding: 0;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBuU" + ($size !== "s" ? "" : " ym7uBBuV"));
export const OrChain = /*YAK EXPORTED STYLED:OrChain:ym7uBBuW*//*YAK Extracted CSS:
.ym7uBBuX {
  color: orange;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b })=>"ym7uBBuW" + (!$a || !$b ? "" : " ym7uBBuX"));
export const AtomsCondition = /*YAK EXPORTED STYLED:AtomsCondition:ym7uBBuY*//*YAK Extracted CSS:
.ym7uBBuZ {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBuY" + " flex gap-2" + ($on ? " shadow-md rounded" : "") + ($on ? " text-white" : " ym7uBBuZ"));
// conditions inside atoms(): any condition folds, the class name is a string
export const AtomsNestedCondition = /*YAK EXPORTED STYLED:AtomsNestedCondition:ym7uBBua*//*YAK Extracted CSS:

*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $off })=>"ym7uBBua" + ($on ? " shadow-md" + ($off ? " ring" : "") + " rounded p-2" + ($off ? " text-white" : " text-black") + ($off ? " border" : "") + (true === false ? " never" : "") + (isLarge ? " large" : "") : ""));
const paddingSmall = /*#__PURE__*/ css();
const paddingLarge = /*#__PURE__*/ css();
const SIZES = {
    small: 16
};
// a condition inside a nested css literal, without an arrow of its own
export const NestedCondition = /*YAK EXPORTED STYLED:NestedCondition:ym7uBBud*//*YAK Extracted CSS:
.ym7uBBue {
  color: red;
}
.ym7uBBuf {
  font-size: 2em;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $big })=>"ym7uBBud" + ($on ? " ym7uBBue" + ($big ? " ym7uBBuf" : "") : ""));
// a nested value that picks between two css constants
export const NestedConstants = /*YAK EXPORTED STYLED:NestedConstants:ym7uBBug*//*YAK Extracted CSS:
.ym7uBBui {
  padding: 2px;
}
.ym7uBBuj {
  padding: 1px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $big })=>"ym7uBBug" + (" ym7uBBuh" + ($big ? " ym7uBBui" : " ym7uBBuj")));
// default values in the destructuring
export const DefaultCondition = /*YAK EXPORTED STYLED:DefaultCondition:ym7uBBuk*//*YAK Extracted CSS:
.ym7uBBul {
  text-align: start;
}
.ym7uBBum {
  text-align: end;
}
.ym7uBBun {
  color: red;
}
.ym7uBBuo {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $align, $on })=>"ym7uBBuk" + (($align === void 0 ? "start" : $align) === "start" ? " ym7uBBul" : " ym7uBBum") + (($on === void 0 ? true : $on) ? " ym7uBBun" : "") + ($on ? " ym7uBBuo" : ""));
export const DefaultValue = /*YAK EXPORTED STYLED:DefaultValue:ym7uBBup*//*YAK Extracted CSS:
.ym7uBBup {
  height: var(--ym7uBBuq);
  width: var(--ym7uBBur);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $size, $width }, style)=>"ym7uBBup" + (style["--ym7uBBuq"] = /*#__PURE__*/ __yak_cssValue($size === void 0 ? 32 : $size, "px"), style["--ym7uBBur"] = /*#__PURE__*/ __yak_cssValue($width === void 0 ? $size === void 0 ? SIZES.small : $size : $width, "px"), ""));
