import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { mixin, calc } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnUzIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU1IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU3IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU5IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVCIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVGIHsKICBjb2xvcjogdmFyKC0teW03dUJCdUcpOwp9LnltN3VCQnVIIHsKICBsZWZ0OiB2YXIoLS15bTd1QkJ1SSk7Cn0ueW03dUJCdUogewogIGxlZnQ6IHZhcigtLXltN3VCQnVLKTsKfS55bTd1QkJ1TSB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1TyB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1UCB7CiAgLS15YWstY3NzLWltcG9ydDogdXJsKCIuL2hlbHBlcnM6bWl4aW4iLG1peGluKTsKfS55bTd1QkJ1UiB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1VCB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1ViB7CiAgY29sb3I6IHJlZDsKfQoueW03dUJCdVcgewogIGNvbG9yOiBncmVlbjsKfQoueW03dUJCdVggewogIGNvbG9yOiBibHVlOwp9LnltN3VCQnVaIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnViIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1YyB7CiAgY29sb3I6IGJsdWU7Cn0ueW03dUJCdWUgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVmIHsKICBjb2xvcjogYmx1ZTsKfS55bTd1QkJ1aCB7CiAgY29sb3I6IHJlZDsKfQoueW03dUJCdWkgewogIGNvbG9yOiBibHVlOwp9LnltN3VCQnVrIHsKICBwYWRkaW5nOiA4cHg7Cn0ueW03dUJCdWwgewogIGxlZnQ6IHZhcigtLXltN3VCQnVtKTsKfS55bTd1QkJ1byB7CiAgcGFkZGluZzogOHB4Owp9LnltN3VCQnVxIHsKICBwYWRkaW5nOiA4cHg7Cn0KLnltN3VCQnVyIHsKICBwYWRkaW5nOiAxNnB4Owp9";
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
// the runtime evaluates a value inside a nested css once per render and
// calls the result with the props if it is a function
export const NestedHelperValue = /*YAK EXPORTED STYLED:NestedHelperValue:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuF {
  color: var(--ym7uBBuG);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuE", ({ $on })=>$on && /*#__PURE__*/ css("ym7uBBuF", {
        "style": {
            "--ym7uBBuG": calc("primary")
        }
    }));
export const ValueReturnsFunction = /*YAK EXPORTED STYLED:ValueReturnsFunction:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuH {
  left: var(--ym7uBBuI);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuH", {
    "style": {
        "--ym7uBBuI": /*#__PURE__*/ __yak_cssValue(({ $x })=>()=>$x, "px")
    }
});
export const StyleReadInValue = /*YAK EXPORTED STYLED:StyleReadInValue:ym7uBBuJ*//*YAK Extracted CSS:
.ym7uBBuJ {
  left: var(--ym7uBBuK);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuJ", {
    "style": {
        "--ym7uBBuK": /*#__PURE__*/ __yak_cssValue(({ style })=>style.left, "px")
    }
});
export const NullishOperator = /*YAK EXPORTED STYLED:NullishOperator:ym7uBBuL*//*YAK Extracted CSS:
.ym7uBBuM {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuL", ({ $on })=>$on ?? /*#__PURE__*/ css("ym7uBBuM"));
export const StyleRead = /*YAK EXPORTED STYLED:StyleRead:ym7uBBuN*//*YAK Extracted CSS:
.ym7uBBuO {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuN", ({ style })=>style && /*#__PURE__*/ css("ym7uBBuO"));
export const MixinInterpolation = /*YAK EXPORTED STYLED:MixinInterpolation:ym7uBBuP*//*YAK Extracted CSS:
.ym7uBBuP {
  --yak-css-import: url("./helpers:mixin",mixin);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuP");
// a statement next to the `if` and `return` has no place in an expression
export const BlockWithLog = /*YAK EXPORTED STYLED:BlockWithLog:ym7uBBuQ*//*YAK Extracted CSS:
.ym7uBBuR {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuQ", ({ $on })=>{
    console.log($on);
    if ($on) {
        return /*#__PURE__*/ css("ym7uBBuR");
    }
});
export const BlockWithDebugger = /*YAK EXPORTED STYLED:BlockWithDebugger:ym7uBBuS*//*YAK Extracted CSS:
.ym7uBBuT {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuS", ({ $on })=>{
    if ($on) {
        debugger;
        return /*#__PURE__*/ css("ym7uBBuT");
    }
});
// the expression would hold the statements after the first `if` twice
export const IfWithoutReturnThenStatements = /*YAK EXPORTED STYLED:IfWithoutReturnThenStatements:ym7uBBuU*//*YAK Extracted CSS:
.ym7uBBuV {
  color: red;
}
.ym7uBBuW {
  color: green;
}
.ym7uBBuX {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuU", ({ $on, $big })=>{
    if ($on) {
        if ($big) return /*#__PURE__*/ css("ym7uBBuV");
    }
    if ($big) return /*#__PURE__*/ css("ym7uBBuW");
    return /*#__PURE__*/ css("ym7uBBuX");
});
// the expression would call the helper once per case
export const SwitchOnCall = /*YAK EXPORTED STYLED:SwitchOnCall:ym7uBBuY*//*YAK Extracted CSS:
.ym7uBBuZ {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuY", ({ $on })=>{
    switch(String($on)){
        case "true":
            return /*#__PURE__*/ css("ym7uBBuZ");
    }
});
export const SwitchWithBreak = /*YAK EXPORTED STYLED:SwitchWithBreak:ym7uBBua*//*YAK Extracted CSS:
.ym7uBBub {
  color: red;
}
.ym7uBBuc {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBua", ({ $size })=>{
    switch($size){
        case "s":
            break;
        case "m":
            return /*#__PURE__*/ css("ym7uBBub");
    }
    return /*#__PURE__*/ css("ym7uBBuc");
});
export const SwitchFallThrough = /*YAK EXPORTED STYLED:SwitchFallThrough:ym7uBBud*//*YAK Extracted CSS:
.ym7uBBue {
  color: red;
}
.ym7uBBuf {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBud", ({ $size, $on })=>{
    switch($size){
        case "s":
            if ($on) return /*#__PURE__*/ css("ym7uBBue");
        case "m":
            return /*#__PURE__*/ css("ym7uBBuf");
    }
});
export const SwitchDefaultFirst = /*YAK EXPORTED STYLED:SwitchDefaultFirst:ym7uBBug*//*YAK Extracted CSS:
.ym7uBBuh {
  color: red;
}
.ym7uBBui {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBug", ({ $size })=>{
    switch($size){
        default:
            return /*#__PURE__*/ css("ym7uBBuh");
        case "m":
            return /*#__PURE__*/ css("ym7uBBui");
    }
});
// a function declaration after a return still exists in the whole body
export const FunctionAfterReturn = /*YAK EXPORTED STYLED:FunctionAfterReturn:ym7uBBuj*//*YAK Extracted CSS:
.ym7uBBuk {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuj", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("ym7uBBuk");
    return null;
    function isBig(size: number) {
        return size > 2;
    }
});
export const FunctionAfterReturnedValue = /*YAK EXPORTED STYLED:FunctionAfterReturnedValue:ym7uBBul*//*YAK Extracted CSS:
.ym7uBBul {
  left: var(--ym7uBBum);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBul", {
    "style": {
        "--ym7uBBum": /*#__PURE__*/ __yak_cssValue(({ $x })=>{
            return toPx($x);
            function toPx(value: number) {
                return value * 2;
            }
        }, "px")
    }
});
export const FunctionAfterIfElse = /*YAK EXPORTED STYLED:FunctionAfterIfElse:ym7uBBun*//*YAK Extracted CSS:
.ym7uBBuo {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBun", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("ym7uBBuo");
    else return null;
    function isBig(size: number) {
        return size > 2;
    }
});
export const FunctionAfterSwitchDefault = /*YAK EXPORTED STYLED:FunctionAfterSwitchDefault:ym7uBBup*//*YAK Extracted CSS:
.ym7uBBuq {
  padding: 8px;
}
.ym7uBBur {
  padding: 16px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBup", ({ $size })=>{
    switch($size){
        case 1:
            return /*#__PURE__*/ css("ym7uBBuq");
        default:
            return isBig($size) ? /*#__PURE__*/ css("ym7uBBur") : null;
    }
    function isBig(size: number) {
        return size > 2;
    }
});
