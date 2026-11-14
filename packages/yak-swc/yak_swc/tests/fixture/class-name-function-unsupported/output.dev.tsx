import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { mixin, calc } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
export const Rest = /*YAK EXPORTED STYLED:Rest:input_Rest_m7uBBu*//*YAK Extracted CSS:
.input_Rest__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Rest_m7uBBu", ({ $on, ...rest })=>$on && /*#__PURE__*/ css("input_Rest__$on_m7uBBu")), {
    "displayName": "Rest"
});
export const Default = /*YAK EXPORTED STYLED:Default:input_Default_m7uBBu*//*YAK Extracted CSS:
.input_Default__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Default_m7uBBu", ({ $on = true })=>$on && /*#__PURE__*/ css("input_Default__$on_m7uBBu")), {
    "displayName": "Default"
});
export const Computed = /*YAK EXPORTED STYLED:Computed:input_Computed_m7uBBu*//*YAK Extracted CSS:
.input_Computed___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Computed_m7uBBu", (p)=>p["$on"] && /*#__PURE__*/ css("input_Computed___m7uBBu")), {
    "displayName": "Computed"
});
export const Escaping = /*YAK EXPORTED STYLED:Escaping:input_Escaping_m7uBBu*//*YAK Extracted CSS:
.input_Escaping___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Escaping_m7uBBu", (p)=>calc(p) && /*#__PURE__*/ css("input_Escaping___m7uBBu")), {
    "displayName": "Escaping"
});
export const MultiStatement = /*YAK EXPORTED STYLED:MultiStatement:input_MultiStatement_m7uBBu*//*YAK Extracted CSS:
.input_MultiStatement__on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MultiStatement_m7uBBu", ({ $on })=>{
    const on = !!$on;
    return on && /*#__PURE__*/ css("input_MultiStatement__on_m7uBBu");
}), {
    "displayName": "MultiStatement"
});
export const FunctionExpression = /*YAK EXPORTED STYLED:FunctionExpression:input_FunctionExpression_m7uBBu*//*YAK Extracted CSS:
.input_FunctionExpression__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_FunctionExpression_m7uBBu", function({ $on }) {
    return $on && /*#__PURE__*/ css("input_FunctionExpression__$on_m7uBBu");
}), {
    "displayName": "FunctionExpression"
});
export const MixinReturn = /*YAK EXPORTED STYLED:MixinReturn:input_MixinReturn_m7uBBu*//*YAK Extracted CSS:

*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MixinReturn_m7uBBu", ({ $on })=>$on && mixin), {
    "displayName": "MixinReturn"
});
export const AtomsReturn = /*YAK EXPORTED STYLED:AtomsReturn:input_AtomsReturn_m7uBBu*//*YAK Extracted CSS:

*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_AtomsReturn_m7uBBu", ({ $on })=>$on && atoms("flex")), {
    "displayName": "AtomsReturn"
});
// the runtime evaluates a value inside a nested css once per render and
// calls the result with the props if it is a function
export const NestedHelperValue = /*YAK EXPORTED STYLED:NestedHelperValue:input_NestedHelperValue_m7uBBu*//*YAK Extracted CSS:
.input_NestedHelperValue__\$on_m7uBBu {
  color: var(--input_NestedHelperValue__color_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NestedHelperValue_m7uBBu", ({ $on })=>$on && /*#__PURE__*/ css("input_NestedHelperValue__$on_m7uBBu", {
        "style": {
            "--input_NestedHelperValue__color_m7uBBu": calc("primary")
        }
    })), {
    "displayName": "NestedHelperValue"
});
export const ValueReturnsFunction = /*YAK EXPORTED STYLED:ValueReturnsFunction:input_ValueReturnsFunction_m7uBBu*//*YAK Extracted CSS:
.input_ValueReturnsFunction_m7uBBu {
  left: var(--input_ValueReturnsFunction__left_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ValueReturnsFunction_m7uBBu", {
    "style": {
        "--input_ValueReturnsFunction__left_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $x })=>()=>$x, "px")
    }
}), {
    "displayName": "ValueReturnsFunction"
});
export const StyleReadInValue = /*YAK EXPORTED STYLED:StyleReadInValue:input_StyleReadInValue_m7uBBu*//*YAK Extracted CSS:
.input_StyleReadInValue_m7uBBu {
  left: var(--input_StyleReadInValue__left_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_StyleReadInValue_m7uBBu", {
    "style": {
        "--input_StyleReadInValue__left_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ style })=>style.left, "px")
    }
}), {
    "displayName": "StyleReadInValue"
});
export const NullishOperator = /*YAK EXPORTED STYLED:NullishOperator:input_NullishOperator_m7uBBu*//*YAK Extracted CSS:
.input_NullishOperator___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NullishOperator_m7uBBu", ({ $on })=>$on ?? /*#__PURE__*/ css("input_NullishOperator___m7uBBu")), {
    "displayName": "NullishOperator"
});
export const StyleRead = /*YAK EXPORTED STYLED:StyleRead:input_StyleRead_m7uBBu*//*YAK Extracted CSS:
.input_StyleRead__style_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_StyleRead_m7uBBu", ({ style })=>style && /*#__PURE__*/ css("input_StyleRead__style_m7uBBu")), {
    "displayName": "StyleRead"
});
export const MixinInterpolation = /*YAK EXPORTED STYLED:MixinInterpolation:input_MixinInterpolation_m7uBBu*//*YAK Extracted CSS:
.input_MixinInterpolation_m7uBBu {
  --yak-css-import: url("./helpers:mixin",mixin);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MixinInterpolation_m7uBBu"), {
    "displayName": "MixinInterpolation"
});
// a statement next to the `if` and `return` has no place in an expression
export const BlockWithLog = /*YAK EXPORTED STYLED:BlockWithLog:input_BlockWithLog_m7uBBu*//*YAK Extracted CSS:
.input_BlockWithLog___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_BlockWithLog_m7uBBu", ({ $on })=>{
    console.log($on);
    if ($on) {
        return /*#__PURE__*/ css("input_BlockWithLog___m7uBBu");
    }
}), {
    "displayName": "BlockWithLog"
});
export const BlockWithDebugger = /*YAK EXPORTED STYLED:BlockWithDebugger:input_BlockWithDebugger_m7uBBu*//*YAK Extracted CSS:
.input_BlockWithDebugger___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_BlockWithDebugger_m7uBBu", ({ $on })=>{
    if ($on) {
        debugger;
        return /*#__PURE__*/ css("input_BlockWithDebugger___m7uBBu");
    }
}), {
    "displayName": "BlockWithDebugger"
});
// the expression would hold the statements after the first `if` twice
export const IfWithoutReturnThenStatements = /*YAK EXPORTED STYLED:IfWithoutReturnThenStatements:input_IfWithoutReturnThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_IfWithoutReturnThenStatements___m7uBBu {
  color: red;
}
.input_IfWithoutReturnThenStatements___m7uBBu-01 {
  color: green;
}
.input_IfWithoutReturnThenStatements___m7uBBu-02 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_IfWithoutReturnThenStatements_m7uBBu", ({ $on, $big })=>{
    if ($on) {
        if ($big) return /*#__PURE__*/ css("input_IfWithoutReturnThenStatements___m7uBBu");
    }
    if ($big) return /*#__PURE__*/ css("input_IfWithoutReturnThenStatements___m7uBBu-01");
    return /*#__PURE__*/ css("input_IfWithoutReturnThenStatements___m7uBBu-02");
}), {
    "displayName": "IfWithoutReturnThenStatements"
});
// the expression would call the helper once per case
export const SwitchOnCall = /*YAK EXPORTED STYLED:SwitchOnCall:input_SwitchOnCall_m7uBBu*//*YAK Extracted CSS:
.input_SwitchOnCall___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SwitchOnCall_m7uBBu", ({ $on })=>{
    switch(String($on)){
        case "true":
            return /*#__PURE__*/ css("input_SwitchOnCall___m7uBBu");
    }
}), {
    "displayName": "SwitchOnCall"
});
export const SwitchWithBreak = /*YAK EXPORTED STYLED:SwitchWithBreak:input_SwitchWithBreak_m7uBBu*//*YAK Extracted CSS:
.input_SwitchWithBreak___m7uBBu {
  color: red;
}
.input_SwitchWithBreak___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SwitchWithBreak_m7uBBu", ({ $size })=>{
    switch($size){
        case "s":
            break;
        case "m":
            return /*#__PURE__*/ css("input_SwitchWithBreak___m7uBBu");
    }
    return /*#__PURE__*/ css("input_SwitchWithBreak___m7uBBu-01");
}), {
    "displayName": "SwitchWithBreak"
});
export const SwitchFallThrough = /*YAK EXPORTED STYLED:SwitchFallThrough:input_SwitchFallThrough_m7uBBu*//*YAK Extracted CSS:
.input_SwitchFallThrough___m7uBBu {
  color: red;
}
.input_SwitchFallThrough___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SwitchFallThrough_m7uBBu", ({ $size, $on })=>{
    switch($size){
        case "s":
            if ($on) return /*#__PURE__*/ css("input_SwitchFallThrough___m7uBBu");
        case "m":
            return /*#__PURE__*/ css("input_SwitchFallThrough___m7uBBu-01");
    }
}), {
    "displayName": "SwitchFallThrough"
});
export const SwitchDefaultFirst = /*YAK EXPORTED STYLED:SwitchDefaultFirst:input_SwitchDefaultFirst_m7uBBu*//*YAK Extracted CSS:
.input_SwitchDefaultFirst___m7uBBu {
  color: red;
}
.input_SwitchDefaultFirst___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SwitchDefaultFirst_m7uBBu", ({ $size })=>{
    switch($size){
        default:
            return /*#__PURE__*/ css("input_SwitchDefaultFirst___m7uBBu");
        case "m":
            return /*#__PURE__*/ css("input_SwitchDefaultFirst___m7uBBu-01");
    }
}), {
    "displayName": "SwitchDefaultFirst"
});
// a function declaration after a return still exists in the whole body
export const FunctionAfterReturn = /*YAK EXPORTED STYLED:FunctionAfterReturn:input_FunctionAfterReturn_m7uBBu*//*YAK Extracted CSS:
.input_FunctionAfterReturn___m7uBBu {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_FunctionAfterReturn_m7uBBu", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("input_FunctionAfterReturn___m7uBBu");
    return null;
    function isBig(size: number) {
        return size > 2;
    }
}), {
    "displayName": "FunctionAfterReturn"
});
export const FunctionAfterReturnedValue = /*YAK EXPORTED STYLED:FunctionAfterReturnedValue:input_FunctionAfterReturnedValue_m7uBBu*//*YAK Extracted CSS:
.input_FunctionAfterReturnedValue_m7uBBu {
  left: var(--input_FunctionAfterReturnedValue__left_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_FunctionAfterReturnedValue_m7uBBu", {
    "style": {
        "--input_FunctionAfterReturnedValue__left_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $x })=>{
            return toPx($x);
            function toPx(value: number) {
                return value * 2;
            }
        }, "px")
    }
}), {
    "displayName": "FunctionAfterReturnedValue"
});
export const FunctionAfterIfElse = /*YAK EXPORTED STYLED:FunctionAfterIfElse:input_FunctionAfterIfElse_m7uBBu*//*YAK Extracted CSS:
.input_FunctionAfterIfElse___m7uBBu {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_FunctionAfterIfElse_m7uBBu", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("input_FunctionAfterIfElse___m7uBBu");
    else return null;
    function isBig(size: number) {
        return size > 2;
    }
}), {
    "displayName": "FunctionAfterIfElse"
});
export const FunctionAfterSwitchDefault = /*YAK EXPORTED STYLED:FunctionAfterSwitchDefault:input_FunctionAfterSwitchDefault_m7uBBu*//*YAK Extracted CSS:
.input_FunctionAfterSwitchDefault___m7uBBu {
  padding: 8px;
}
.input_FunctionAfterSwitchDefault___m7uBBu-01 {
  padding: 16px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_FunctionAfterSwitchDefault_m7uBBu", ({ $size })=>{
    switch($size){
        case 1:
            return /*#__PURE__*/ css("input_FunctionAfterSwitchDefault___m7uBBu");
        default:
            return isBig($size) ? /*#__PURE__*/ css("input_FunctionAfterSwitchDefault___m7uBBu-01") : null;
    }
    function isBig(size: number) {
        return size > 2;
    }
}), {
    "displayName": "FunctionAfterSwitchDefault"
});
