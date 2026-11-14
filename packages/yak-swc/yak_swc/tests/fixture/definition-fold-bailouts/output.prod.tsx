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
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuG", 0, ({ $on: __yak_$on })=>"ym7uBBuG" + (!__yak_$on ? "" : " ym7uBBuH"));
// `OrOperator` above folds because `!$on` is a boolean; here the left side
// could be an object, whose class name the runtime would add
export const OrUnprovable = /*YAK EXPORTED STYLED:OrUnprovable:ym7uBBuI*//*YAK Extracted CSS:
.ym7uBBuJ {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuI", ({ $on })=>$on || /*#__PURE__*/ css("ym7uBBuJ"));
export const OrChainUnprovable = /*YAK EXPORTED STYLED:OrChainUnprovable:ym7uBBuK*//*YAK Extracted CSS:
.ym7uBBuL {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuK", ({ $a, $b })=>!$a || $b || /*#__PURE__*/ css("ym7uBBuL"));
export const NullishOperator = /*YAK EXPORTED STYLED:NullishOperator:ym7uBBuM*//*YAK Extracted CSS:
.ym7uBBuN {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuM", ({ $on })=>$on ?? /*#__PURE__*/ css("ym7uBBuN"));
export const StyleRead = /*YAK EXPORTED STYLED:StyleRead:ym7uBBuO*//*YAK Extracted CSS:
.ym7uBBuP {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuO", ({ style })=>style && /*#__PURE__*/ css("ym7uBBuP"));
export const MixinInterpolation = /*YAK EXPORTED STYLED:MixinInterpolation:ym7uBBuQ*//*YAK Extracted CSS:
.ym7uBBuQ {
  --yak-css-import: url("./helpers:mixin",mixin);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuQ");
