import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { log } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBwYWRkaW5nOiAxcHg7Cn0KLnltN3VCQnUyIHsKICBwYWRkaW5nOiAxMnB4Owp9Ci55bTd1QkJ1MyB7CiAgcGFkZGluZzogNnB4Owp9Ci55bTd1QkJ1NCB7CiAgcGFkZGluZzogOXB4Owp9Ci55bTd1QkJ1NSB7CiAgcGFkZGluZzogMDsKfS55bTd1QkJ1NyB7CiAgY29sb3I6IHJlZDsKfQoueW03dUJCdTggewogIGNvbG9yOiBibHVlOwp9LnltN3VCQnVBIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1QiB7CiAgY29sb3I6IGdyZWVuOwp9Ci55bTd1QkJ1QyB7CiAgY29sb3I6IGJsdWU7Cn0KLnltN3VCQnVEIHsKICBjb2xvcjogYmxhY2s7Cn0ueW03dUJCdUYgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVHIHsKICBjb2xvcjogYmx1ZTsKfQoueW03dUJCdUggewogIGNvbG9yOiBibGFjazsKfS55bTd1QkJ1SiB7CiAgcGFkZGluZzogMnB4Owp9Ci55bTd1QkJ1SyB7CiAgcGFkZGluZzogNHB4Owp9Ci55bTd1QkJ1TCB7CiAgcGFkZGluZzogOHB4Owp9LnltN3VCQnVOIHsKICBwYWRkaW5nOiAycHg7Cn0KLnltN3VCQnVPIHsKICBwYWRkaW5nOiA0cHg7Cn0KLnltN3VCQnVQIHsKICBwYWRkaW5nOiA2cHg7Cn0KLnltN3VCQnVRIHsKICBwYWRkaW5nOiA4cHg7Cn0ueW03dUJCdVMgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVUIHsKICBjb2xvcjogZ3JlZW47Cn0KLnltN3VCQnVVIHsKICBjb2xvcjogYmx1ZTsKfQoueW03dUJCdVYgewogIGNvbG9yOiBibGFjazsKfS55bTd1QkJ1WCB7CiAgY29sb3I6IHJlZDsKfQoueW03dUJCdVkgewogIGNvbG9yOiBibHVlOwp9LnltN3VCQnVhIHsKICBwYWRkaW5nOiAycHg7Cn0KLnltN3VCQnViIHsKICBwYWRkaW5nOiA0cHg7Cn0KLnltN3VCQnVjIHsKICBwYWRkaW5nOiA4cHg7Cn0ueW03dUJCdWUgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVmIHsKICBjb2xvcjogZ3JlZW47Cn0KLnltN3VCQnVnIHsKICBjb2xvcjogYmx1ZTsKfQoueW03dUJCdWggewogIGNvbG9yOiBibGFjazsKfQoueW03dUJCdWkgewogIGZvbnQtd2VpZ2h0OiBib2xkOwp9Ci55bTd1QkJ1aiB7CiAgbWFyZ2luOiAwOwp9Ci55bTd1QkJ1ayB7CiAgbWFyZ2luOiAycHg7Cn0KLnltN3VCQnVsIHsKICBtYXJnaW46IDRweDsKfS55bTd1QkJ1biB7CiAgY29sb3I6IHJlZDsKfQoueW03dUJCdW8gewogIHBhZGRpbmc6IDRweDsKfQoueW03dUJCdXAgewogIHBhZGRpbmc6IDFweDsKfQoueW03dUJCdXEgewogIHBhZGRpbmc6IDA7Cn0KLnltN3VCQnVyIHsKICBjb2xvcjogYmx1ZTsKfQoueW03dUJCdXMgewogIGNvbG9yOiBibGFjazsKfS55bTd1QkJ1dSB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1diB7CiAgd2lkdGg6IHZhcigtLXltN3VCQnV3KTsKfS55bTd1QkJ1eSB7CiAgY29sb3I6IHJlZDsKfQoueW03dUJCdXogewogIGNvbG9yOiBibHVlOwp9LnltN3VCQnVfIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1MTAgewogIGNvbG9yOiBibHVlOwp9Ci55bTd1QkJ1MTEgewogIGNvbG9yOiBibGFjazsKfS55bTd1QkJ1MTMgewogIHBhZGRpbmc6IDJweDsKfQoueW03dUJCdTE0IHsKICBwYWRkaW5nOiA0cHg7Cn0KLnltN3VCQnUxNSB7CiAgcGFkZGluZzogNnB4Owp9Ci55bTd1QkJ1MTYgewogIHBhZGRpbmc6IDhweDsKfQ==";
type Size = "s" | "m" | "l";
type Layout = {
    large?: {
        size: Size;
    };
};
// a path that leaves a guard block goes on with the next statement
export const GuardBlocks = /*YAK EXPORTED STYLED:GuardBlocks:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  padding: 1px;
}
.ym7uBBu2 {
  padding: 12px;
}
.ym7uBBu3 {
  padding: 6px;
}
.ym7uBBu4 {
  padding: 9px;
}
.ym7uBBu5 {
  padding: 0;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $layout, $n })=>"ym7uBBu" + ($layout.large?.size === "s" ? " ym7uBBu1" : ($layout.large?.size === "l" ? $n >= 12 ? " ym7uBBu2" : $n >= 6 ? " ym7uBBu3" : void 0 : void 0) ?? ($layout.large?.size === "m" ? $n >= 9 ? " ym7uBBu4" : " ym7uBBu5" : " ym7uBBu5")));
// `return;` and `return null;` end the function and add nothing
export const ReturnNothingInGuard = /*YAK EXPORTED STYLED:ReturnNothingInGuard:ym7uBBu6*//*YAK Extracted CSS:
.ym7uBBu7 {
  color: red;
}
.ym7uBBu8 {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $big, $wide })=>"ym7uBBu6" + (($on ? $big ? "" : $wide ? "" : void 0 : void 0) ?? ($big ? " ym7uBBu7" : " ym7uBBu8")));
export const IfElseWithOpenBranch = /*YAK EXPORTED STYLED:IfElseWithOpenBranch:ym7uBBu9*//*YAK Extracted CSS:
.ym7uBBuA {
  color: red;
}
.ym7uBBuB {
  color: green;
}
.ym7uBBuC {
  color: blue;
}
.ym7uBBuD {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b, $c })=>"ym7uBBu9" + (($a ? $b ? " ym7uBBuA" : void 0 : " ym7uBBuB") ?? ($c ? " ym7uBBuC" : " ym7uBBuD")));
export const PlainBlock = /*YAK EXPORTED STYLED:PlainBlock:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuF {
  color: red;
}
.ym7uBBuG {
  color: blue;
}
.ym7uBBuH {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b })=>"ym7uBBuE" + (($a ? " ym7uBBuF" : void 0) ?? ($b ? " ym7uBBuG" : " ym7uBBuH")));
export const SwitchDefaultThenStatements = /*YAK EXPORTED STYLED:SwitchDefaultThenStatements:ym7uBBuI*//*YAK Extracted CSS:
.ym7uBBuJ {
  padding: 2px;
}
.ym7uBBuK {
  padding: 4px;
}
.ym7uBBuL {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size, $on })=>"ym7uBBuI" + (($size === "s" ? " ym7uBBuJ" : (log($size), void 0)) ?? ($on ? " ym7uBBuK" : " ym7uBBuL")));
export const SwitchLastCaseThenStatements = /*YAK EXPORTED STYLED:SwitchLastCaseThenStatements:ym7uBBuM*//*YAK Extracted CSS:
.ym7uBBuN {
  padding: 2px;
}
.ym7uBBuO {
  padding: 4px;
}
.ym7uBBuP {
  padding: 6px;
}
.ym7uBBuQ {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size, $on })=>"ym7uBBuM" + (($size === "s" ? " ym7uBBuN" : $size === "m" ? $on ? " ym7uBBuO" : void 0 : void 0) ?? ($on ? " ym7uBBuP" : " ym7uBBuQ")));
export const ThreeLevels = /*YAK EXPORTED STYLED:ThreeLevels:ym7uBBuR*//*YAK Extracted CSS:
.ym7uBBuS {
  color: red;
}
.ym7uBBuT {
  color: green;
}
.ym7uBBuU {
  color: blue;
}
.ym7uBBuV {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b, $c, $d })=>"ym7uBBuR" + (($a ? ($b ? $c ? " ym7uBBuS" : (log($c), void 0) : void 0) ?? ($d ? " ym7uBBuT" : void 0) : void 0) ?? ($c ? " ym7uBBuU" : " ym7uBBuV")));
export const CallInGuard = /*YAK EXPORTED STYLED:CallInGuard:ym7uBBuW*//*YAK Extracted CSS:
.ym7uBBuX {
  color: red;
}
.ym7uBBuY {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $a, $b })=>"ym7uBBuW" + (($on ? (log($a), void 0) : void 0) ?? ($b ? " ym7uBBuX" : " ym7uBBuY")));
export const ConstInGuard = /*YAK EXPORTED STYLED:ConstInGuard:ym7uBBuZ*//*YAK Extracted CSS:
.ym7uBBua {
  padding: 2px;
}
.ym7uBBub {
  padding: 4px;
}
.ym7uBBuc {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $layout })=>"ym7uBBuZ" + (($on ? $layout.large?.size === "s" ? " ym7uBBua" : void 0 : void 0) ?? (!$on ? " ym7uBBub" : " ym7uBBuc")));
// the conditions of the returned values keep their parens next to `??`
export const ConditionalValues = /*YAK EXPORTED STYLED:ConditionalValues:ym7uBBud*//*YAK Extracted CSS:
.ym7uBBue {
  color: red;
}
.ym7uBBuf {
  color: green;
}
.ym7uBBug {
  color: blue;
}
.ym7uBBuh {
  color: black;
}
.ym7uBBui {
  font-weight: bold;
}
.ym7uBBuj {
  margin: 0;
}
.ym7uBBuk {
  margin: 2px;
}
.ym7uBBul {
  margin: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b, $c })=>"ym7uBBud" + (($a ? $b ? $c ? " ym7uBBue" : "" : $c ? $b ? " ym7uBBuf" : "" : void 0 : void 0) ?? ($b ? $c ? "" : " ym7uBBug" : " ym7uBBuh" + ($c ? " ym7uBBui" : ""))) + (($a ? $b ? " ym7uBBuj" : void 0 : void 0) ?? ($b ? " ym7uBBuk" : " ym7uBBul")));
// a nested function has fall through markers of its own
export const NestedFunction = /*YAK EXPORTED STYLED:NestedFunction:ym7uBBum*//*YAK Extracted CSS:
.ym7uBBun {
  color: red;
}
.ym7uBBuo {
  padding: 4px;
}
.ym7uBBup {
  padding: 1px;
}
.ym7uBBuq {
  padding: 0;
}
.ym7uBBur {
  color: blue;
}
.ym7uBBus {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $size, $n })=>"ym7uBBum" + (($on ? $size === "s" ? " ym7uBBun" + (($n > 2 ? $n > 4 ? " ym7uBBuo" : void 0 : void 0) ?? ($n > 1 ? " ym7uBBup" : " ym7uBBuq")) : void 0 : void 0) ?? ($size === "m" ? " ym7uBBur" : " ym7uBBus")));
// a guard block at the end of the function adds nothing when no `return` runs
export const GuardBlockAtTheEnd = /*YAK EXPORTED STYLED:GuardBlockAtTheEnd:ym7uBBut*//*YAK Extracted CSS:
.ym7uBBuu {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $big })=>"ym7uBBut" + ($on ? $big ? " ym7uBBuu" : "" : ""));
// at a CSS value position, every `return` in the guard block has to return a
// value that is never `null` or `undefined`, see css-value-function-fall-through
export const CssValuePosition = /*YAK EXPORTED STYLED:CssValuePosition:ym7uBBuv*//*YAK Extracted CSS:
.ym7uBBuv {
  width: var(--ym7uBBuw);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $a, $b }, style)=>"ym7uBBuv" + (style["--ym7uBBuw"] = /*#__PURE__*/ __yak_cssValue(($a ? $b ? 2 : void 0 : void 0) ?? ($b ? 4 : 8), "px"), ""));
// stays unfolded: `return void 0;` is no value the fold knows
export const ReturnVoidZeroInGuard = /*YAK EXPORTED STYLED:ReturnVoidZeroInGuard:ym7uBBux*//*YAK Extracted CSS:
.ym7uBBuy {
  color: red;
}
.ym7uBBuz {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBux", ({ $on, $big })=>{
    if ($on) {
        if ($big) return void 0;
    }
    if ($big) return /*#__PURE__*/ css("ym7uBBuy");
    return /*#__PURE__*/ css("ym7uBBuz");
});
// stays unfolded: a `??` that the user writes
export const UserNullish = /*YAK EXPORTED STYLED:UserNullish:ym7uBBu-*//*YAK Extracted CSS:
.ym7uBBu_ {
  color: red;
}
.ym7uBBu10 {
  color: blue;
}
.ym7uBBu11 {
  color: black;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu-", ({ $on })=>{
    if ($on) return /*#__PURE__*/ css("ym7uBBu_") ?? /*#__PURE__*/ css("ym7uBBu10");
    return /*#__PURE__*/ css("ym7uBBu11");
});
// stays unfolded: a `break` inside an `if` of the last case
export const BreakInsideIf = /*YAK EXPORTED STYLED:BreakInsideIf:ym7uBBu12*//*YAK Extracted CSS:
.ym7uBBu13 {
  padding: 2px;
}
.ym7uBBu14 {
  padding: 4px;
}
.ym7uBBu15 {
  padding: 6px;
}
.ym7uBBu16 {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu12", ({ $size, $on })=>{
    switch($size){
        case "s":
            return /*#__PURE__*/ css("ym7uBBu13");
        default:
            if ($on) break;
            return /*#__PURE__*/ css("ym7uBBu14");
    }
    if ($on) return /*#__PURE__*/ css("ym7uBBu15");
    return /*#__PURE__*/ css("ym7uBBu16");
});
