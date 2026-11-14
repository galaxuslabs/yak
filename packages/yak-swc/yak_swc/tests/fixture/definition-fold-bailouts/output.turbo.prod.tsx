import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { mixin, calc } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnUzIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU1IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU3IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnU5IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVCIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVGIHsKICBjb2xvcjogdmFyKC0teW03dUJCdUcpOwp9LnltN3VCQnVIIHsKICBsZWZ0OiB2YXIoLS15bTd1QkJ1SSk7Cn0ueW03dUJCdUogewogIGxlZnQ6IHZhcigtLXltN3VCQnVLKTsKfS55bTd1QkJ1TSB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1TyB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1USB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1UyB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1VSB7CiAgY29sb3I6IHJlZDsKfS55bTd1QkJ1ViB7CiAgLS15YWstY3NzLWltcG9ydDogdXJsKCIuL2hlbHBlcnM6bWl4aW4iLG1peGluKTsKfQ==";
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
export const OrOperator = /*YAK EXPORTED STYLED:OrOperator:ym7uBBuL*//*YAK Extracted CSS:
.ym7uBBuM {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuL", 0, ({ $on: __yak_$on })=>"ym7uBBuL" + (!__yak_$on ? "" : " ym7uBBuM"));
// `OrOperator` above folds because `!$on` is a boolean; here the left side
// could be an object, whose class name the runtime would add
export const OrUnprovable = /*YAK EXPORTED STYLED:OrUnprovable:ym7uBBuN*//*YAK Extracted CSS:
.ym7uBBuO {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuN", ({ $on })=>$on || /*#__PURE__*/ css("ym7uBBuO"));
export const OrChainUnprovable = /*YAK EXPORTED STYLED:OrChainUnprovable:ym7uBBuP*//*YAK Extracted CSS:
.ym7uBBuQ {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuP", ({ $a, $b })=>!$a || $b || /*#__PURE__*/ css("ym7uBBuQ"));
export const NullishOperator = /*YAK EXPORTED STYLED:NullishOperator:ym7uBBuR*//*YAK Extracted CSS:
.ym7uBBuS {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuR", ({ $on })=>$on ?? /*#__PURE__*/ css("ym7uBBuS"));
export const StyleRead = /*YAK EXPORTED STYLED:StyleRead:ym7uBBuT*//*YAK Extracted CSS:
.ym7uBBuU {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuT", ({ style })=>style && /*#__PURE__*/ css("ym7uBBuU"));
export const MixinInterpolation = /*YAK EXPORTED STYLED:MixinInterpolation:ym7uBBuV*//*YAK Extracted CSS:
.ym7uBBuV {
  --yak-css-import: url("./helpers:mixin",mixin);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuV");
