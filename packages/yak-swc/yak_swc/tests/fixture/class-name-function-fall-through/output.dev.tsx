import { styled, css } from "@yak/react/internal";
import { log } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
type Size = "s" | "m" | "l";
type Layout = {
    large?: {
        size: Size;
    };
};
// a path that leaves a guard block goes on with the next statement
export const GuardBlocks = /*YAK EXPORTED STYLED:GuardBlocks:input_GuardBlocks_m7uBBu*//*YAK Extracted CSS:
.input_GuardBlocks___m7uBBu {
  padding: 1px;
}
.input_GuardBlocks___m7uBBu-01 {
  padding: 12px;
}
.input_GuardBlocks___m7uBBu-02 {
  padding: 6px;
}
.input_GuardBlocks___m7uBBu-03 {
  padding: 9px;
}
.input_GuardBlocks___m7uBBu-04 {
  padding: 0;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $layout, $n })=>"input_GuardBlocks_m7uBBu" + ($layout.large?.size === "s" ? " input_GuardBlocks___m7uBBu" : ($layout.large?.size === "l" ? $n >= 12 ? " input_GuardBlocks___m7uBBu-01" : $n >= 6 ? " input_GuardBlocks___m7uBBu-02" : void 0 : void 0) ?? ($layout.large?.size === "m" ? $n >= 9 ? " input_GuardBlocks___m7uBBu-03" : " input_GuardBlocks___m7uBBu-04" : " input_GuardBlocks___m7uBBu-04"))), {
    "displayName": "GuardBlocks"
});
// `return;` and `return null;` end the function and add nothing
export const ReturnNothingInGuard = /*YAK EXPORTED STYLED:ReturnNothingInGuard:input_ReturnNothingInGuard_m7uBBu*//*YAK Extracted CSS:
.input_ReturnNothingInGuard___m7uBBu {
  color: red;
}
.input_ReturnNothingInGuard___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on, $big, $wide })=>"input_ReturnNothingInGuard_m7uBBu" + (($on ? $big ? "" : $wide ? "" : void 0 : void 0) ?? ($big ? " input_ReturnNothingInGuard___m7uBBu" : " input_ReturnNothingInGuard___m7uBBu-01"))), {
    "displayName": "ReturnNothingInGuard"
});
export const IfElseWithOpenBranch = /*YAK EXPORTED STYLED:IfElseWithOpenBranch:input_IfElseWithOpenBranch_m7uBBu*//*YAK Extracted CSS:
.input_IfElseWithOpenBranch___m7uBBu {
  color: red;
}
.input_IfElseWithOpenBranch___m7uBBu-01 {
  color: green;
}
.input_IfElseWithOpenBranch___m7uBBu-02 {
  color: blue;
}
.input_IfElseWithOpenBranch___m7uBBu-03 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b, $c })=>"input_IfElseWithOpenBranch_m7uBBu" + (($a ? $b ? " input_IfElseWithOpenBranch___m7uBBu" : void 0 : " input_IfElseWithOpenBranch___m7uBBu-01") ?? ($c ? " input_IfElseWithOpenBranch___m7uBBu-02" : " input_IfElseWithOpenBranch___m7uBBu-03"))), {
    "displayName": "IfElseWithOpenBranch"
});
export const PlainBlock = /*YAK EXPORTED STYLED:PlainBlock:input_PlainBlock_m7uBBu*//*YAK Extracted CSS:
.input_PlainBlock___m7uBBu {
  color: red;
}
.input_PlainBlock___m7uBBu-01 {
  color: blue;
}
.input_PlainBlock___m7uBBu-02 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b })=>"input_PlainBlock_m7uBBu" + (($a ? " input_PlainBlock___m7uBBu" : void 0) ?? ($b ? " input_PlainBlock___m7uBBu-01" : " input_PlainBlock___m7uBBu-02"))), {
    "displayName": "PlainBlock"
});
export const SwitchDefaultThenStatements = /*YAK EXPORTED STYLED:SwitchDefaultThenStatements:input_SwitchDefaultThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_SwitchDefaultThenStatements___m7uBBu {
  padding: 2px;
}
.input_SwitchDefaultThenStatements___m7uBBu-01 {
  padding: 4px;
}
.input_SwitchDefaultThenStatements___m7uBBu-02 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size, $on })=>"input_SwitchDefaultThenStatements_m7uBBu" + (($size === "s" ? " input_SwitchDefaultThenStatements___m7uBBu" : (log($size), void 0)) ?? ($on ? " input_SwitchDefaultThenStatements___m7uBBu-01" : " input_SwitchDefaultThenStatements___m7uBBu-02"))), {
    "displayName": "SwitchDefaultThenStatements"
});
export const SwitchLastCaseThenStatements = /*YAK EXPORTED STYLED:SwitchLastCaseThenStatements:input_SwitchLastCaseThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_SwitchLastCaseThenStatements___m7uBBu {
  padding: 2px;
}
.input_SwitchLastCaseThenStatements___m7uBBu-01 {
  padding: 4px;
}
.input_SwitchLastCaseThenStatements___m7uBBu-02 {
  padding: 6px;
}
.input_SwitchLastCaseThenStatements___m7uBBu-03 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size, $on })=>"input_SwitchLastCaseThenStatements_m7uBBu" + (($size === "s" ? " input_SwitchLastCaseThenStatements___m7uBBu" : $size === "m" ? $on ? " input_SwitchLastCaseThenStatements___m7uBBu-01" : void 0 : void 0) ?? ($on ? " input_SwitchLastCaseThenStatements___m7uBBu-02" : " input_SwitchLastCaseThenStatements___m7uBBu-03"))), {
    "displayName": "SwitchLastCaseThenStatements"
});
export const ThreeLevels = /*YAK EXPORTED STYLED:ThreeLevels:input_ThreeLevels_m7uBBu*//*YAK Extracted CSS:
.input_ThreeLevels___m7uBBu {
  color: red;
}
.input_ThreeLevels___m7uBBu-01 {
  color: green;
}
.input_ThreeLevels___m7uBBu-02 {
  color: blue;
}
.input_ThreeLevels___m7uBBu-03 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b, $c, $d })=>"input_ThreeLevels_m7uBBu" + (($a ? ($b ? $c ? " input_ThreeLevels___m7uBBu" : (log($c), void 0) : void 0) ?? ($d ? " input_ThreeLevels___m7uBBu-01" : void 0) : void 0) ?? ($c ? " input_ThreeLevels___m7uBBu-02" : " input_ThreeLevels___m7uBBu-03"))), {
    "displayName": "ThreeLevels"
});
export const CallInGuard = /*YAK EXPORTED STYLED:CallInGuard:input_CallInGuard_m7uBBu*//*YAK Extracted CSS:
.input_CallInGuard___m7uBBu {
  color: red;
}
.input_CallInGuard___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on, $a, $b })=>"input_CallInGuard_m7uBBu" + (($on ? (log($a), void 0) : void 0) ?? ($b ? " input_CallInGuard___m7uBBu" : " input_CallInGuard___m7uBBu-01"))), {
    "displayName": "CallInGuard"
});
export const ConstInGuard = /*YAK EXPORTED STYLED:ConstInGuard:input_ConstInGuard_m7uBBu*//*YAK Extracted CSS:
.input_ConstInGuard___m7uBBu {
  padding: 2px;
}
.input_ConstInGuard___m7uBBu-01 {
  padding: 4px;
}
.input_ConstInGuard___m7uBBu-02 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on, $layout })=>"input_ConstInGuard_m7uBBu" + (($on ? $layout.large?.size === "s" ? " input_ConstInGuard___m7uBBu" : void 0 : void 0) ?? (!$on ? " input_ConstInGuard___m7uBBu-01" : " input_ConstInGuard___m7uBBu-02"))), {
    "displayName": "ConstInGuard"
});
// the conditions of the returned values keep their parens next to `??`
export const ConditionalValues = /*YAK EXPORTED STYLED:ConditionalValues:input_ConditionalValues_m7uBBu*//*YAK Extracted CSS:
.input_ConditionalValues__\$c_m7uBBu {
  color: red;
}
.input_ConditionalValues__\$b_m7uBBu {
  color: green;
}
.input_ConditionalValues__not_\$c_m7uBBu {
  color: blue;
}
.input_ConditionalValues___m7uBBu {
  color: black;
}
.input_ConditionalValues___m7uBBu-01 {
  font-weight: bold;
}
.input_ConditionalValues___m7uBBu-02 {
  margin: 0;
}
.input_ConditionalValues___m7uBBu-03 {
  margin: 2px;
}
.input_ConditionalValues___m7uBBu-04 {
  margin: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b, $c })=>"input_ConditionalValues_m7uBBu" + (($a ? $b ? $c ? " input_ConditionalValues__$c_m7uBBu" : "" : $c ? $b ? " input_ConditionalValues__$b_m7uBBu" : "" : void 0 : void 0) ?? ($b ? $c ? "" : " input_ConditionalValues__not_$c_m7uBBu" : " input_ConditionalValues___m7uBBu" + ($c ? " input_ConditionalValues___m7uBBu-01" : ""))) + (($a ? $b ? " input_ConditionalValues___m7uBBu-02" : void 0 : void 0) ?? ($b ? " input_ConditionalValues___m7uBBu-03" : " input_ConditionalValues___m7uBBu-04"))), {
    "displayName": "ConditionalValues"
});
// a nested function has fall through markers of its own
export const NestedFunction = /*YAK EXPORTED STYLED:NestedFunction:input_NestedFunction_m7uBBu*//*YAK Extracted CSS:
.input_NestedFunction___m7uBBu {
  color: red;
}
.input_NestedFunction___m7uBBu-01 {
  padding: 4px;
}
.input_NestedFunction___m7uBBu-02 {
  padding: 1px;
}
.input_NestedFunction___m7uBBu-03 {
  padding: 0;
}
.input_NestedFunction___m7uBBu-04 {
  color: blue;
}
.input_NestedFunction___m7uBBu-05 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on, $size, $n })=>"input_NestedFunction_m7uBBu" + (($on ? $size === "s" ? " input_NestedFunction___m7uBBu" + (($n > 2 ? $n > 4 ? " input_NestedFunction___m7uBBu-01" : void 0 : void 0) ?? ($n > 1 ? " input_NestedFunction___m7uBBu-02" : " input_NestedFunction___m7uBBu-03")) : void 0 : void 0) ?? ($size === "m" ? " input_NestedFunction___m7uBBu-04" : " input_NestedFunction___m7uBBu-05"))), {
    "displayName": "NestedFunction"
});
// a guard block at the end of the function adds nothing when no `return` runs
export const GuardBlockAtTheEnd = /*YAK EXPORTED STYLED:GuardBlockAtTheEnd:input_GuardBlockAtTheEnd_m7uBBu*//*YAK Extracted CSS:
.input_GuardBlockAtTheEnd___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on, $big })=>"input_GuardBlockAtTheEnd_m7uBBu" + ($on ? $big ? " input_GuardBlockAtTheEnd___m7uBBu" : "" : "")), {
    "displayName": "GuardBlockAtTheEnd"
});
// stays unfolded: `return void 0;` is no value the fold knows
export const ReturnVoidZeroInGuard = /*YAK EXPORTED STYLED:ReturnVoidZeroInGuard:input_ReturnVoidZeroInGuard_m7uBBu*//*YAK Extracted CSS:
.input_ReturnVoidZeroInGuard___m7uBBu {
  color: red;
}
.input_ReturnVoidZeroInGuard___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReturnVoidZeroInGuard_m7uBBu", ({ $on, $big })=>{
    if ($on) {
        if ($big) return void 0;
    }
    if ($big) return /*#__PURE__*/ css("input_ReturnVoidZeroInGuard___m7uBBu");
    return /*#__PURE__*/ css("input_ReturnVoidZeroInGuard___m7uBBu-01");
}), {
    "displayName": "ReturnVoidZeroInGuard"
});
// stays unfolded: a `??` that the user writes
export const UserNullish = /*YAK EXPORTED STYLED:UserNullish:input_UserNullish_m7uBBu*//*YAK Extracted CSS:
.input_UserNullish___m7uBBu {
  color: red;
}
.input_UserNullish___m7uBBu-01 {
  color: blue;
}
.input_UserNullish___m7uBBu-02 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_UserNullish_m7uBBu", ({ $on })=>{
    if ($on) return /*#__PURE__*/ css("input_UserNullish___m7uBBu") ?? /*#__PURE__*/ css("input_UserNullish___m7uBBu-01");
    return /*#__PURE__*/ css("input_UserNullish___m7uBBu-02");
}), {
    "displayName": "UserNullish"
});
// stays unfolded: a `break` inside an `if` of the last case
export const BreakInsideIf = /*YAK EXPORTED STYLED:BreakInsideIf:input_BreakInsideIf_m7uBBu*//*YAK Extracted CSS:
.input_BreakInsideIf___m7uBBu {
  padding: 2px;
}
.input_BreakInsideIf___m7uBBu-01 {
  padding: 4px;
}
.input_BreakInsideIf___m7uBBu-02 {
  padding: 6px;
}
.input_BreakInsideIf___m7uBBu-03 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_BreakInsideIf_m7uBBu", ({ $size, $on })=>{
    switch($size){
        case "s":
            return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu");
        default:
            if ($on) break;
            return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu-01");
    }
    if ($on) return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu-02");
    return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu-03");
}), {
    "displayName": "BreakInsideIf"
});
