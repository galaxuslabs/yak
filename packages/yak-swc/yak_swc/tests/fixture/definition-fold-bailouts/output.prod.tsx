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
export const CssVariable = /*YAK EXPORTED STYLED:CssVariable:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuF {
  color: red;
}
.ym7uBBuE {
  left: var(--ym7uBBuG);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuE", ({ $x })=>$x > 1 && /*#__PURE__*/ css("ym7uBBuF"), {
    "style": {
        "--ym7uBBuG": /*#__PURE__*/ __yak_cssValue(({ $x })=>$x, "px")
    }
});
export const OrOperator = /*YAK EXPORTED STYLED:OrOperator:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuI {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuH", ({ $on })=>!$on || /*#__PURE__*/ css("ym7uBBuI"));
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
