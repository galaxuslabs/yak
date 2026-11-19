import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { mixin, calc } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
export const Rest = /*YAK EXPORTED STYLED:Rest:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu", ({ $on, ...rest })=>$on && /*#__PURE__*/ css("ym7uBBu1"));
export const Default = /*YAK EXPORTED STYLED:Default:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu3 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu2", ({ $on = true })=>$on && /*#__PURE__*/ css("ym7uBBu3"));
export const Computed = /*YAK EXPORTED STYLED:Computed:ym7uBBu4*//*YAK Extracted CSS:
.ym7uBBu5 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu4", (p)=>p["$on"] && /*#__PURE__*/ css("ym7uBBu5"));
export const Escaping = /*YAK EXPORTED STYLED:Escaping:ym7uBBu6*//*YAK Extracted CSS:
.ym7uBBu7 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu6", (p)=>calc(p) && /*#__PURE__*/ css("ym7uBBu7"));
export const MultiStatement = /*YAK EXPORTED STYLED:MultiStatement:ym7uBBu8*//*YAK Extracted CSS:
.ym7uBBu9 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu8", ({ $on })=>{
    const on = !!$on;
    return on && /*#__PURE__*/ css("ym7uBBu9");
});
export const FunctionExpression = /*YAK EXPORTED STYLED:FunctionExpression:ym7uBBuA*//*YAK Extracted CSS:
.ym7uBBuB {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuA", function({ $on }) {
    return $on && /*#__PURE__*/ css("ym7uBBuB");
});
export const MixinReturn = /*YAK EXPORTED STYLED:MixinReturn:ym7uBBuC*//*YAK Extracted CSS:

*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuC", ({ $on })=>$on && mixin);
export const AtomsReturn = /*YAK EXPORTED STYLED:AtomsReturn:ym7uBBuD*//*YAK Extracted CSS:

*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuD", ({ $on })=>$on && atoms("flex"));
export const StyleReadInValue = /*YAK EXPORTED STYLED:StyleReadInValue:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuE {
  left: var(--ym7uBBuF);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuE", {
    "style": {
        "--ym7uBBuF": /*#__PURE__*/ __yak_cssValue(({ style })=>style.left, "px")
    }
});
export const OrOperator = /*YAK EXPORTED STYLED:OrOperator:ym7uBBuG*//*YAK Extracted CSS:
.ym7uBBuH {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuG", ({ $on })=>!$on || /*#__PURE__*/ css("ym7uBBuH"));
export const StyleRead = /*YAK EXPORTED STYLED:StyleRead:ym7uBBuI*//*YAK Extracted CSS:
.ym7uBBuJ {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuI", ({ style })=>style && /*#__PURE__*/ css("ym7uBBuJ"));
export const MixinInterpolation = /*YAK EXPORTED STYLED:MixinInterpolation:ym7uBBuK*//*YAK Extracted CSS:
.ym7uBBuK {
  --yak-css-import: url("./helpers:mixin",mixin);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuK");
// a statement next to the `if` and `return` has no place in an expression
export const BlockWithLog = /*YAK EXPORTED STYLED:BlockWithLog:ym7uBBuL*//*YAK Extracted CSS:
.ym7uBBuM {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuL", ({ $on })=>{
    console.log($on);
    if ($on) {
        return /*#__PURE__*/ css("ym7uBBuM");
    }
});
export const BlockWithDebugger = /*YAK EXPORTED STYLED:BlockWithDebugger:ym7uBBuN*//*YAK Extracted CSS:
.ym7uBBuO {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuN", ({ $on })=>{
    if ($on) {
        debugger;
        return /*#__PURE__*/ css("ym7uBBuO");
    }
});
// the expression would hold the statements after the first `if` twice
export const IfWithoutReturnThenStatements = /*YAK EXPORTED STYLED:IfWithoutReturnThenStatements:ym7uBBuP*//*YAK Extracted CSS:
.ym7uBBuQ {
  color: red;
}
.ym7uBBuR {
  color: green;
}
.ym7uBBuS {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuP", ({ $on, $big })=>{
    if ($on) {
        if ($big) return /*#__PURE__*/ css("ym7uBBuQ");
    }
    if ($big) return /*#__PURE__*/ css("ym7uBBuR");
    return /*#__PURE__*/ css("ym7uBBuS");
});
// the expression would call the helper once per case
export const SwitchOnCall = /*YAK EXPORTED STYLED:SwitchOnCall:ym7uBBuT*//*YAK Extracted CSS:
.ym7uBBuU {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuT", ({ $on })=>{
    switch(String($on)){
        case "true":
            return /*#__PURE__*/ css("ym7uBBuU");
    }
});
export const SwitchWithBreak = /*YAK EXPORTED STYLED:SwitchWithBreak:ym7uBBuV*//*YAK Extracted CSS:
.ym7uBBuW {
  color: red;
}
.ym7uBBuX {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuV", ({ $size })=>{
    switch($size){
        case "s":
            break;
        case "m":
            return /*#__PURE__*/ css("ym7uBBuW");
    }
    return /*#__PURE__*/ css("ym7uBBuX");
});
export const SwitchFallThrough = /*YAK EXPORTED STYLED:SwitchFallThrough:ym7uBBuY*//*YAK Extracted CSS:
.ym7uBBuZ {
  color: red;
}
.ym7uBBua {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuY", ({ $size, $on })=>{
    switch($size){
        case "s":
            if ($on) return /*#__PURE__*/ css("ym7uBBuZ");
        case "m":
            return /*#__PURE__*/ css("ym7uBBua");
    }
});
export const SwitchDefaultFirst = /*YAK EXPORTED STYLED:SwitchDefaultFirst:ym7uBBub*//*YAK Extracted CSS:
.ym7uBBuc {
  color: red;
}
.ym7uBBud {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBub", ({ $size })=>{
    switch($size){
        default:
            return /*#__PURE__*/ css("ym7uBBuc");
        case "m":
            return /*#__PURE__*/ css("ym7uBBud");
    }
});
// a function declaration after a return still exists in the whole body
export const FunctionAfterReturn = /*YAK EXPORTED STYLED:FunctionAfterReturn:ym7uBBue*//*YAK Extracted CSS:
.ym7uBBuf {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBue", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("ym7uBBuf");
    return null;
    function isBig(size: number) {
        return size > 2;
    }
});
export const FunctionAfterReturnedValue = /*YAK EXPORTED STYLED:FunctionAfterReturnedValue:ym7uBBug*//*YAK Extracted CSS:
.ym7uBBug {
  left: var(--ym7uBBuh);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBug", {
    "style": {
        "--ym7uBBuh": /*#__PURE__*/ __yak_cssValue(({ $x })=>{
            return toPx($x);
            function toPx(value: number) {
                return value * 2;
            }
        }, "px")
    }
});
export const FunctionAfterIfElse = /*YAK EXPORTED STYLED:FunctionAfterIfElse:ym7uBBui*//*YAK Extracted CSS:
.ym7uBBuj {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBui", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("ym7uBBuj");
    else return null;
    function isBig(size: number) {
        return size > 2;
    }
});
export const FunctionAfterSwitchDefault = /*YAK EXPORTED STYLED:FunctionAfterSwitchDefault:ym7uBBuk*//*YAK Extracted CSS:
.ym7uBBul {
  padding: 8px;
}
.ym7uBBum {
  padding: 16px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuk", ({ $size })=>{
    switch($size){
        case 1:
            return /*#__PURE__*/ css("ym7uBBul");
        default:
            return isBig($size) ? /*#__PURE__*/ css("ym7uBBum") : null;
    }
    function isBig(size: number) {
        return size > 2;
    }
});
