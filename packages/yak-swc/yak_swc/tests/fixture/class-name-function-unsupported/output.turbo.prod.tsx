import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { mixin, calc } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnUzIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU1IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU3IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU5IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVCIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVGIHsKICBsZWZ0OiB2YXIoLS15bTd1QkJ1Ryk7Cn0ueW03dUJCdUkgewogIGNvbG9yOiByZWQ7Cn0ueW03dUJCdUsgewogIGNvbG9yOiByZWQ7Cn0ueW03dUJCdUwgewogIC0teWFrLWNzcy1pbXBvcnQ6IHVybCgiLi9oZWxwZXJzOm1peGluIixtaXhpbik7Cn0ueW03dUJCdU4gewogIGNvbG9yOiByZWQ7Cn0ueW03dUJCdVAgewogIGNvbG9yOiByZWQ7Cn0ueW03dUJCdVIgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVTIHsKICBjb2xvcjogZ3JlZW47Cn0KLnltN3VCQnVUIHsKICBjb2xvcjogYmx1ZTsKfS55bTd1QkJ1ViB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1WCB7CiAgY29sb3I6IHJlZDsKfQoueW03dUJCdVkgewogIGNvbG9yOiBibHVlOwp9LnltN3VCQnVhIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1YiB7CiAgY29sb3I6IGJsdWU7Cn0ueW03dUJCdWQgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVlIHsKICBjb2xvcjogYmx1ZTsKfS55bTd1QkJ1ZyB7CiAgcGFkZGluZzogOHB4Owp9LnltN3VCQnVoIHsKICBsZWZ0OiB2YXIoLS15bTd1QkJ1aSk7Cn0ueW03dUJCdWsgewogIHBhZGRpbmc6IDhweDsKfS55bTd1QkJ1bSB7CiAgcGFkZGluZzogOHB4Owp9Ci55bTd1QkJ1biB7CiAgcGFkZGluZzogMTZweDsKfS55bTd1QkJ1ciB7CiAgY29sb3I6IHJlZDsKfQ==";
export const Rest = /*YAK EXPORTED STYLED:Rest:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu", ({ $on, ...rest })=>$on && /*#__PURE__*/ css("ym7uBBu1"));
// a call as default value would run once per read of the prop
export const DefaultCall = /*YAK EXPORTED STYLED:DefaultCall:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu3 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu2", ({ $on = calc(1) })=>$on && /*#__PURE__*/ css("ym7uBBu3"));
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
// the function runs with the class names of the render
export const AtomsFunction = /*YAK EXPORTED STYLED:AtomsFunction:ym7uBBuD*//*YAK Extracted CSS:

*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuD", ({ $on })=>$on && atoms("flex", (_, classNames)=>classNames.delete("flex")));
// no condition: the runtime joins these class names once at definition
export const AtomsOnly = /*YAK EXPORTED STYLED:AtomsOnly:ym7uBBuE*//*YAK Extracted CSS:

*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuE", atoms("flex", "gap-2"));
export const StyleReadInValue = /*YAK EXPORTED STYLED:StyleReadInValue:ym7uBBuF*//*YAK Extracted CSS:
.ym7uBBuF {
  left: var(--ym7uBBuG);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuF", {
    "--ym7uBBuG": /*#__PURE__*/ __yak_cssValue(({ style })=>style.left, "px")
});
export const NullishOperator = /*YAK EXPORTED STYLED:NullishOperator:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuI {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuH", ({ $on })=>$on ?? /*#__PURE__*/ css("ym7uBBuI"));
export const StyleRead = /*YAK EXPORTED STYLED:StyleRead:ym7uBBuJ*//*YAK Extracted CSS:
.ym7uBBuK {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuJ", ({ style })=>style && /*#__PURE__*/ css("ym7uBBuK"));
export const MixinInterpolation = /*YAK EXPORTED STYLED:MixinInterpolation:ym7uBBuL*//*YAK Extracted CSS:
.ym7uBBuL {
  --yak-css-import: url("./helpers:mixin",mixin);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuL");
// a statement next to the `if` and `return` has no place in an expression
export const BlockWithLog = /*YAK EXPORTED STYLED:BlockWithLog:ym7uBBuM*//*YAK Extracted CSS:
.ym7uBBuN {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuM", ({ $on })=>{
    console.log($on);
    if ($on) {
        return /*#__PURE__*/ css("ym7uBBuN");
    }
});
export const BlockWithDebugger = /*YAK EXPORTED STYLED:BlockWithDebugger:ym7uBBuO*//*YAK Extracted CSS:
.ym7uBBuP {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuO", ({ $on })=>{
    if ($on) {
        debugger;
        return /*#__PURE__*/ css("ym7uBBuP");
    }
});
// the expression would hold the statements after the first `if` twice
export const IfWithoutReturnThenStatements = /*YAK EXPORTED STYLED:IfWithoutReturnThenStatements:ym7uBBuQ*//*YAK Extracted CSS:
.ym7uBBuR {
  color: red;
}
.ym7uBBuS {
  color: green;
}
.ym7uBBuT {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuQ", ({ $on, $big })=>{
    if ($on) {
        if ($big) return /*#__PURE__*/ css("ym7uBBuR");
    }
    if ($big) return /*#__PURE__*/ css("ym7uBBuS");
    return /*#__PURE__*/ css("ym7uBBuT");
});
// the expression would call the helper once per case
export const SwitchOnCall = /*YAK EXPORTED STYLED:SwitchOnCall:ym7uBBuU*//*YAK Extracted CSS:
.ym7uBBuV {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuU", ({ $on })=>{
    switch(String($on)){
        case "true":
            return /*#__PURE__*/ css("ym7uBBuV");
    }
});
export const SwitchWithBreak = /*YAK EXPORTED STYLED:SwitchWithBreak:ym7uBBuW*//*YAK Extracted CSS:
.ym7uBBuX {
  color: red;
}
.ym7uBBuY {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuW", ({ $size })=>{
    switch($size){
        case "s":
            break;
        case "m":
            return /*#__PURE__*/ css("ym7uBBuX");
    }
    return /*#__PURE__*/ css("ym7uBBuY");
});
export const SwitchFallThrough = /*YAK EXPORTED STYLED:SwitchFallThrough:ym7uBBuZ*//*YAK Extracted CSS:
.ym7uBBua {
  color: red;
}
.ym7uBBub {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuZ", ({ $size, $on })=>{
    switch($size){
        case "s":
            if ($on) return /*#__PURE__*/ css("ym7uBBua");
        case "m":
            return /*#__PURE__*/ css("ym7uBBub");
    }
});
export const SwitchDefaultFirst = /*YAK EXPORTED STYLED:SwitchDefaultFirst:ym7uBBuc*//*YAK Extracted CSS:
.ym7uBBud {
  color: red;
}
.ym7uBBue {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuc", ({ $size })=>{
    switch($size){
        default:
            return /*#__PURE__*/ css("ym7uBBud");
        case "m":
            return /*#__PURE__*/ css("ym7uBBue");
    }
});
// a function declaration after a return still exists in the whole body
export const FunctionAfterReturn = /*YAK EXPORTED STYLED:FunctionAfterReturn:ym7uBBuf*//*YAK Extracted CSS:
.ym7uBBug {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuf", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("ym7uBBug");
    return null;
    function isBig(size: number) {
        return size > 2;
    }
});
export const FunctionAfterReturnedValue = /*YAK EXPORTED STYLED:FunctionAfterReturnedValue:ym7uBBuh*//*YAK Extracted CSS:
.ym7uBBuh {
  left: var(--ym7uBBui);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuh", {
    "--ym7uBBui": /*#__PURE__*/ __yak_cssValue(({ $x })=>{
        return toPx($x);
        function toPx(value: number) {
            return value * 2;
        }
    }, "px")
});
export const FunctionAfterIfElse = /*YAK EXPORTED STYLED:FunctionAfterIfElse:ym7uBBuj*//*YAK Extracted CSS:
.ym7uBBuk {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuj", ({ $size })=>{
    if (isBig($size)) return /*#__PURE__*/ css("ym7uBBuk");
    else return null;
    function isBig(size: number) {
        return size > 2;
    }
});
export const FunctionAfterSwitchDefault = /*YAK EXPORTED STYLED:FunctionAfterSwitchDefault:ym7uBBul*//*YAK Extracted CSS:
.ym7uBBum {
  padding: 8px;
}
.ym7uBBun {
  padding: 16px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBul", ({ $size })=>{
    switch($size){
        case 1:
            return /*#__PURE__*/ css("ym7uBBum");
        default:
            return isBig($size) ? /*#__PURE__*/ css("ym7uBBun") : null;
    }
    function isBig(size: number) {
        return size > 2;
    }
});
// the argument can hold a function
export const AtomsValue = /*YAK EXPORTED STYLED:AtomsValue:ym7uBBuo*//*YAK Extracted CSS:

*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuo", ({ $on, $extra })=>$on && atoms("flex", $extra));
// a truthy left side can be a function
export const AtomsOr = /*YAK EXPORTED STYLED:AtomsOr:ym7uBBup*//*YAK Extracted CSS:

*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBup", ({ $on, $extra })=>$on && atoms($extra || "flex"));
// a call as case value can change the switched value
export const SwitchCaseCall = /*YAK EXPORTED STYLED:SwitchCaseCall:ym7uBBuq*//*YAK Extracted CSS:
.ym7uBBur {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuq", ({ $size })=>{
    switch($size){
        case String(1):
            return /*#__PURE__*/ css("ym7uBBur");
    }
});
