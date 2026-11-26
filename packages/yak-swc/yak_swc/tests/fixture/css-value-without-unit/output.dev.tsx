import { styled, __yak_cssValue } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// A value with a unit always goes through `__yak_cssValue`, which throws for
// `undefined` in development. A value without a unit goes through it in
// development only: production assigns the value as it is.
// folded: `style["--x"] = ...` inside the folded function
export const WithUnit = /*YAK EXPORTED STYLED:WithUnit:input_WithUnit_m7uBBu*//*YAK Extracted CSS:
.input_WithUnit_m7uBBu {
  width: var(--input_WithUnit__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $w }, style)=>"input_WithUnit_m7uBBu" + (style["--input_WithUnit__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($w, "px"), "")), {
    "displayName": "WithUnit"
});
export const WithoutUnit = /*YAK EXPORTED STYLED:WithoutUnit:input_WithoutUnit_m7uBBu*//*YAK Extracted CSS:
.input_WithoutUnit_m7uBBu {
  width: var(--input_WithoutUnit__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $w }, style)=>"input_WithoutUnit_m7uBBu" + (style["--input_WithoutUnit__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($w, ""), "")), {
    "displayName": "WithoutUnit"
});
export const WithoutUnitBlockBody = /*YAK EXPORTED STYLED:WithoutUnitBlockBody:input_WithoutUnitBlockBody_m7uBBu*//*YAK Extracted CSS:
.input_WithoutUnitBlockBody_m7uBBu {
  z-index: var(--input_WithoutUnitBlockBody__z-index_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on }, style)=>"input_WithoutUnitBlockBody_m7uBBu" + (style["--input_WithoutUnitBlockBody__z-index_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($on ? 2 : undefined, ""), "")), {
    "displayName": "WithoutUnitBlockBody"
});
// unfolded: the function stays in the style object, because a `let`
// keeps the folder from turning the block body into one expression
export const UnfoldedWithUnit = /*YAK EXPORTED STYLED:UnfoldedWithUnit:input_UnfoldedWithUnit_m7uBBu*//*YAK Extracted CSS:
.input_UnfoldedWithUnit_m7uBBu {
  width: var(--input_UnfoldedWithUnit__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_UnfoldedWithUnit_m7uBBu", {
    "--input_UnfoldedWithUnit__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $w })=>{
        let w = $w;
        return w;
    }, "px")
}), {
    "displayName": "UnfoldedWithUnit"
});
export const UnfoldedWithoutUnit = /*YAK EXPORTED STYLED:UnfoldedWithoutUnit:input_UnfoldedWithoutUnit_m7uBBu*//*YAK Extracted CSS:
.input_UnfoldedWithoutUnit_m7uBBu {
  width: var(--input_UnfoldedWithoutUnit__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_UnfoldedWithoutUnit_m7uBBu", {
    "--input_UnfoldedWithoutUnit__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $w })=>{
        let w = $w;
        return w;
    }, "")
}), {
    "displayName": "UnfoldedWithoutUnit"
});
