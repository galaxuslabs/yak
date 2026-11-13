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
