import { styled, css, __yak_cssValue } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X1dpdGhvdXRVbml0X203dUJCdSB7CiAgY29sb3I6IHZhcigtLWlucHV0X1dpdGhvdXRVbml0X19jb2xvcl9tN3VCQnUpOwp9LmlucHV0X1dpdGhvdXRVbml0QmxvY2tCb2R5X203dUJCdSB7CiAgei1pbmRleDogdmFyKC0taW5wdXRfV2l0aG91dFVuaXRCbG9ja0JvZHlfX3otaW5kZXhfbTd1QkJ1KTsKfS5pbnB1dF9OZXN0ZWRXaXRob3V0VW5pdF9fXCRvbl9tN3VCQnUgewogIGNvbG9yOiB2YXIoLS1pbnB1dF9OZXN0ZWRXaXRob3V0VW5pdF9fY29sb3JfbTd1QkJ1KTsKfS5pbnB1dF9XaXRoVW5pdF9tN3VCQnUgewogIHdpZHRoOiB2YXIoLS1pbnB1dF9XaXRoVW5pdF9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9NaW51c1dpdGhvdXRVbml0X203dUJCdSB7CiAgei1pbmRleDogdmFyKC0taW5wdXRfTWludXNXaXRob3V0VW5pdF9fei1pbmRleF9tN3VCQnUpOwp9LmlucHV0X1VuZm9sZGVkX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X1VuZm9sZGVkX193aWR0aF9tN3VCQnUpOwp9";
// The folded function turns a value without a unit into text like the
// unfolded runtime does: `` `${$color}` `` with `minify` and
// `__yak_cssValue($color, "")` without it. A value with a unit or a minus
// keeps the `__yak_cssValue` call it has.
export const WithoutUnit = /*YAK EXPORTED STYLED:WithoutUnit:input_WithoutUnit_m7uBBu*//*YAK Extracted CSS:
.input_WithoutUnit_m7uBBu {
  color: var(--input_WithoutUnit__color_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $color }, style)=>"input_WithoutUnit_m7uBBu" + (style["--input_WithoutUnit__color_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($color, ""), "")), {
    "displayName": "WithoutUnit"
});
export const WithoutUnitBlockBody = /*YAK EXPORTED STYLED:WithoutUnitBlockBody:input_WithoutUnitBlockBody_m7uBBu*//*YAK Extracted CSS:
.input_WithoutUnitBlockBody_m7uBBu {
  z-index: var(--input_WithoutUnitBlockBody__z-index_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on }, style)=>"input_WithoutUnitBlockBody_m7uBBu" + (style["--input_WithoutUnitBlockBody__z-index_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($on ? 2 : undefined, ""), "")), {
    "displayName": "WithoutUnitBlockBody"
});
// a value in a nested `css` literal
export const NestedWithoutUnit = /*YAK EXPORTED STYLED:NestedWithoutUnit:input_NestedWithoutUnit_m7uBBu*//*YAK Extracted CSS:
.input_NestedWithoutUnit__\$on_m7uBBu {
  color: var(--input_NestedWithoutUnit__color_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $color }, style)=>"input_NestedWithoutUnit_m7uBBu" + ($on ? " input_NestedWithoutUnit__$on_m7uBBu" + (style["--input_NestedWithoutUnit__color_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($color, ""), "") : "")), {
    "displayName": "NestedWithoutUnit"
});
export const WithUnit = /*YAK EXPORTED STYLED:WithUnit:input_WithUnit_m7uBBu*//*YAK Extracted CSS:
.input_WithUnit_m7uBBu {
  width: var(--input_WithUnit__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $w }, style)=>"input_WithUnit_m7uBBu" + (style["--input_WithUnit__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($w, "px"), "")), {
    "displayName": "WithUnit"
});
export const MinusWithoutUnit = /*YAK EXPORTED STYLED:MinusWithoutUnit:input_MinusWithoutUnit_m7uBBu*//*YAK Extracted CSS:
.input_MinusWithoutUnit_m7uBBu {
  z-index: var(--input_MinusWithoutUnit__z-index_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $z }, style)=>"input_MinusWithoutUnit_m7uBBu" + (style["--input_MinusWithoutUnit__z-index_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($z, "", true), "")), {
    "displayName": "MinusWithoutUnit"
});
// stays unfolded: a `let` keeps the folder from turning the block body into
// one expression, so the runtime writes `String(value)`
export const Unfolded = /*YAK EXPORTED STYLED:Unfolded:input_Unfolded_m7uBBu*//*YAK Extracted CSS:
.input_Unfolded_m7uBBu {
  width: var(--input_Unfolded__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Unfolded_m7uBBu", {
    "--input_Unfolded__width_m7uBBu": ({ $w })=>{
        let w = $w;
        return w;
    }
}), {
    "displayName": "Unfolded"
});
