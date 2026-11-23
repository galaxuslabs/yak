import { styled, css, __yak_cssValue } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
export const IfReturn = /*YAK EXPORTED STYLED:IfReturn:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu", 0, ({ $on })=>"ym7uBBu" + ($on ? " ym7uBBu1" : ""));
export const IfElse = /*YAK EXPORTED STYLED:IfElse:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu3 {
  color: red;
}
.ym7uBBu4 {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu2", 0, ({ $on })=>"ym7uBBu2" + ($on ? " ym7uBBu3" : " ym7uBBu4"));
export const EarlyReturns = /*YAK EXPORTED STYLED:EarlyReturns:ym7uBBu5*//*YAK Extracted CSS:
.ym7uBBu6 {
  padding: 1px;
}
.ym7uBBu7 {
  padding: 2px;
}
.ym7uBBu8 {
  padding: 3px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu5", 0, ({ $size })=>"ym7uBBu5" + ($size === "s" ? " ym7uBBu6" : $size === "m" ? " ym7uBBu7" : " ym7uBBu8"));
export const NestedIf = /*YAK EXPORTED STYLED:NestedIf:ym7uBBu9*//*YAK Extracted CSS:
.ym7uBBuA {
  color: red;
}
.ym7uBBuB {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu9", 0, ({ $on, $big })=>"ym7uBBu9" + ($on ? $big ? " ym7uBBuA" : " ym7uBBuB" : ""));
export const Switch = /*YAK EXPORTED STYLED:Switch:ym7uBBuC*//*YAK Extracted CSS:
.ym7uBBuD {
  color: blue;
}
.ym7uBBuE {
  color: red;
}
.ym7uBBuF {
  color: gray;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuC", 0, ({ $variant })=>"ym7uBBuC" + ($variant === "primary" ? " ym7uBBuD" : $variant === "danger" ? " ym7uBBuE" : " ym7uBBuF"));
export const SwitchGroupedLabels = /*YAK EXPORTED STYLED:SwitchGroupedLabels:ym7uBBuG*//*YAK Extracted CSS:
.ym7uBBuH {
  padding: 1px;
}
.ym7uBBuI {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuG", 0, ({ $size })=>"ym7uBBuG" + ($size === "s" || $size === "m" ? " ym7uBBuH" : $size === "l" ? " ym7uBBuI" : ""));
export const SwitchThenReturn = /*YAK EXPORTED STYLED:SwitchThenReturn:ym7uBBuJ*//*YAK Extracted CSS:
.ym7uBBuK {
  opacity: 0.5;
}
.ym7uBBuL {
  opacity: 1;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuJ", 0, ({ $level })=>"ym7uBBuJ" + ($level === 1 ? " ym7uBBuK" : " ym7uBBuL"));
export const ValueWithIf = /*YAK EXPORTED STYLED:ValueWithIf:ym7uBBuM*//*YAK Extracted CSS:
.ym7uBBuM {
  left: var(--ym7uBBuN);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuM", 2, ({ $x }, style)=>"ym7uBBuM" + (style["--ym7uBBuN"] = /*#__PURE__*/ __yak_cssValue($x === undefined ? 0 : $x, "px"), ""));
export const NestedCssWithIf = /*YAK EXPORTED STYLED:NestedCssWithIf:ym7uBBuO*//*YAK Extracted CSS:
.ym7uBBuP {
  color: var(--ym7uBBuQ);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuO", 2, ({ $on, $color }, style)=>"ym7uBBuO" + ($on ? " ym7uBBuP" + (style["--ym7uBBuQ"] = $color ? $color : "red", "") : ""));
// the path with `$on` and without `$big` continues with the last `return`
export const IfWithoutReturnThenReturn = /*YAK EXPORTED STYLED:IfWithoutReturnThenReturn:ym7uBBuR*//*YAK Extracted CSS:
.ym7uBBuS {
  color: red;
}
.ym7uBBuT {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuR", 0, ({ $on, $big })=>"ym7uBBuR" + ($on ? $big ? " ym7uBBuS" : " ym7uBBuT" : " ym7uBBuT"));
export const IfElseWithoutReturnThenReturn = /*YAK EXPORTED STYLED:IfElseWithoutReturnThenReturn:ym7uBBuU*//*YAK Extracted CSS:
.ym7uBBuV {
  color: red;
}
.ym7uBBuW {
  color: green;
}
.ym7uBBuX {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuU", 0, ({ $on, $big })=>"ym7uBBuU" + ($on ? $big ? " ym7uBBuV" : " ym7uBBuX" : " ym7uBBuW"));
enum Animation {
    In = "in",
    Out = "out",
    None = "none"
}
const LARGE = "l";
// enum members and constants as case values
export const SwitchEnum = /*YAK EXPORTED STYLED:SwitchEnum:ym7uBBuY*//*YAK Extracted CSS:
.ym7uBBuZ {
  opacity: 1;
}
.ym7uBBua {
  opacity: 0;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuY", 0, ({ $animation })=>"ym7uBBuY" + ($animation === Animation.In ? " ym7uBBuZ" : $animation === Animation.Out ? " ym7uBBua" : ""));
export const SwitchConstant = /*YAK EXPORTED STYLED:SwitchConstant:ym7uBBub*//*YAK Extracted CSS:
.ym7uBBuc {
  padding: 8px;
}
.ym7uBBud {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBub", 0, ({ $size, $other })=>"ym7uBBub" + ($size === LARGE ? " ym7uBBuc" : $size === $other ? " ym7uBBud" : ""));
