import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { assertNever, log, getLogger } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
type Size = "s" | "m";
export const SwitchAssertNever = /*YAK EXPORTED STYLED:SwitchAssertNever:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  padding: 2px;
}
.ym7uBBu2 {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBu" + ($size === "s" ? " ym7uBBu1" : $size === "m" ? " ym7uBBu2" : (assertNever($size), "")));
export const SwitchAssertNeverBreak = /*YAK EXPORTED STYLED:SwitchAssertNeverBreak:ym7uBBu3*//*YAK Extracted CSS:
.ym7uBBu4 {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBu3" + ($size === "s" ? " ym7uBBu4" : (assertNever($size), "")));
export const SwitchSatisfiesNever = /*YAK EXPORTED STYLED:SwitchSatisfiesNever:ym7uBBu5*//*YAK Extracted CSS:
.ym7uBBu6 {
  padding: 2px;
}
.ym7uBBu7 {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBu5" + ($size === "s" ? " ym7uBBu6" : $size === "m" ? " ym7uBBu7" : ($size, "")));
export const SwitchRenamedDefault = /*YAK EXPORTED STYLED:SwitchRenamedDefault:ym7uBBu8*//*YAK Extracted CSS:
.ym7uBBu9 {
  padding: 2px;
}
.ym7uBBuA {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBu8" + (($size === void 0 ? "m" : $size) === "s" ? " ym7uBBu9" : ($size === void 0 ? "m" : $size) === "m" ? " ym7uBBuA" : (assertNever($size === void 0 ? "m" : $size), "")));
export const SwitchMemberRead = /*YAK EXPORTED STYLED:SwitchMemberRead:ym7uBBuB*//*YAK Extracted CSS:
.ym7uBBuC {
  padding: 2px;
}
.ym7uBBuD {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBuB" + ($size === "s" ? " ym7uBBuC" : $size === "m" ? " ym7uBBuD" : (console.log($size), "")));
export const CaseLogBeforeReturn = /*YAK EXPORTED STYLED:CaseLogBeforeReturn:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuF {
  padding: 2px;
}
.ym7uBBuG {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBuE" + ($size === "s" ? (log($size), " ym7uBBuF") : " ym7uBBuG"));
// the last case runs out of the `switch` into the `return` after it
export const LastCaseWithoutReturn = /*YAK EXPORTED STYLED:LastCaseWithoutReturn:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuI {
  padding: 2px;
}
.ym7uBBuJ {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBuH" + ($size === "s" ? " ym7uBBuI" : $size === "m" ? (log($size), " ym7uBBuJ") : " ym7uBBuJ"));
export const DefaultWithoutReturnThenReturn = /*YAK EXPORTED STYLED:DefaultWithoutReturnThenReturn:ym7uBBuK*//*YAK Extracted CSS:
.ym7uBBuL {
  padding: 2px;
}
.ym7uBBuM {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBuK" + ($size === "s" ? " ym7uBBuL" : (log($size), " ym7uBBuM")));
export const LogBeforeIf = /*YAK EXPORTED STYLED:LogBeforeIf:ym7uBBuN*//*YAK Extracted CSS:
.ym7uBBuO {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBuN" + (console.log($on), $on ? " ym7uBBuO" : ""));
export const StatementsBeforeReturn = /*YAK EXPORTED STYLED:StatementsBeforeReturn:ym7uBBuP*//*YAK Extracted CSS:
.ym7uBBuQ {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $a, $b })=>"ym7uBBuP" + ($on ? (log($a), log($b), " ym7uBBuQ") : ""));
export const IfWithoutReturn = /*YAK EXPORTED STYLED:IfWithoutReturn:ym7uBBuR*//*YAK Extracted CSS:
.ym7uBBuS {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBuR" + ($on ? (log($on), " ym7uBBuS") : " ym7uBBuS"));
export const StatementAtEnd = /*YAK EXPORTED STYLED:StatementAtEnd:ym7uBBuT*//*YAK Extracted CSS:
.ym7uBBuU {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBuT" + ($on ? " ym7uBBuU" : (log($on), "")));
export const CssVariable = /*YAK EXPORTED STYLED:CssVariable:ym7uBBuV*//*YAK Extracted CSS:
.ym7uBBuV {
  width: var(--ym7uBBuW);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $width }, style)=>"ym7uBBuV" + (style["--ym7uBBuW"] = /*#__PURE__*/ __yak_cssValue((log($width), $width), "px"), ""));
// stays unfolded: a returned call can return a css literal
export const ReturnAssertNever = /*YAK EXPORTED STYLED:ReturnAssertNever:ym7uBBuX*//*YAK Extracted CSS:
.ym7uBBuY {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuX", ({ $size })=>{
    switch($size){
        case "s":
            return /*#__PURE__*/ css("ym7uBBuY");
        default:
            return assertNever($size);
    }
});
// stays unfolded: the first case runs into the next one
export const FallThroughAfterStatement = /*YAK EXPORTED STYLED:FallThroughAfterStatement:ym7uBBuZ*//*YAK Extracted CSS:
.ym7uBBua {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuZ", ({ $size })=>{
    switch($size){
        case "s":
            log($size);
        case "m":
            return /*#__PURE__*/ css("ym7uBBua");
    }
});
// stays unfolded: a `break` before the last case
export const BreakBeforeLastCase = /*YAK EXPORTED STYLED:BreakBeforeLastCase:ym7uBBub*//*YAK Extracted CSS:
.ym7uBBuc {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBub", ({ $size })=>{
    switch($size){
        case "s":
            log($size);
            break;
        case "m":
            return /*#__PURE__*/ css("ym7uBBuc");
    }
});
// stays unfolded: at a CSS value position the expression would hold the
// statements after the `switch` twice, so the whole component stays unfolded
export const LastCaseThenStatements = /*YAK EXPORTED STYLED:LastCaseThenStatements:ym7uBBud*//*YAK Extracted CSS:
.ym7uBBue {
  padding: 2px;
}
.ym7uBBud {
  width: var(--ym7uBBuf);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBud", ({ $size })=>$size === "s" && /*#__PURE__*/ css("ym7uBBue"), {
    "--ym7uBBuf": /*#__PURE__*/ __yak_cssValue(({ $size })=>{
        switch($size){
            case "s":
                return 2;
            default:
                log($size);
        }
        log($size);
        return 8;
    }, "px")
});
// stays unfolded: at a CSS value position the expression would hold the
// statements after the `if` twice
export const IfWithoutReturnThenStatements = /*YAK EXPORTED STYLED:IfWithoutReturnThenStatements:ym7uBBug*//*YAK Extracted CSS:
.ym7uBBug {
  width: var(--ym7uBBuh);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBug", {
    "--ym7uBBuh": /*#__PURE__*/ __yak_cssValue(({ $on })=>{
        if ($on) {
            log($on);
        }
        log($on);
        return 8;
    }, "px")
});
// stays unfolded: a statement after a `return`
export const StatementAfterReturn = /*YAK EXPORTED STYLED:StatementAfterReturn:ym7uBBui*//*YAK Extracted CSS:
.ym7uBBuj {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBui", ({ $on })=>{
    return $on && /*#__PURE__*/ css("ym7uBBuj");
    log($on);
});
// stays unfolded: a write to a prop
export const AssignProp = /*YAK EXPORTED STYLED:AssignProp:ym7uBBuk*//*YAK Extracted CSS:
.ym7uBBul {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuk", ({ $size })=>{
    $size = $size ?? "m";
    return $size === "s" && /*#__PURE__*/ css("ym7uBBul");
});
// stays unfolded: a write to a prop
export const UpdateProp = /*YAK EXPORTED STYLED:UpdateProp:ym7uBBum*//*YAK Extracted CSS:
.ym7uBBun {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBum", ({ $count })=>{
    $count++;
    return $count > 2 && /*#__PURE__*/ css("ym7uBBun");
});
// stays unfolded: a write to a prop inside an argument
export const AssignInArgument = /*YAK EXPORTED STYLED:AssignInArgument:ym7uBBuo*//*YAK Extracted CSS:
.ym7uBBup {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuo", ({ $size })=>{
    log($size = "m");
    return $size === "s" && /*#__PURE__*/ css("ym7uBBup");
});
// stays unfolded: `onRender` runs with the props as `this`
export const MethodOnProps = /*YAK EXPORTED STYLED:MethodOnProps:ym7uBBuq*//*YAK Extracted CSS:
.ym7uBBur {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuq", (p)=>{
    p.onRender();
    return p.$on && /*#__PURE__*/ css("ym7uBBur");
});
// stays unfolded: the callee is a call, not a plain read
export const CallOnCall = /*YAK EXPORTED STYLED:CallOnCall:ym7uBBus*//*YAK Extracted CSS:
.ym7uBBut {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBus", ({ $on })=>{
    getLogger().log($on);
    return $on && /*#__PURE__*/ css("ym7uBBut");
});
