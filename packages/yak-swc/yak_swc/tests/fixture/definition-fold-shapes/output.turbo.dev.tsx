import { styled, css } from "@yak/react/internal";
import { isLarge } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X0lkZW50X19wX1wkb25fbTd1QkJ1IHsKICBjb2xvcjogcmVkOwp9LmlucHV0X0Jsb2NrX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAwOwp9Ci5pbnB1dF9CbG9ja19fX203dUJCdS0wMSB7CiAgcGFkZGluZzogNHB4Owp9LmlucHV0X0hlbHBlcl9fX203dUJCdSB7CiAgZm9udC1zaXplOiAyZW07Cn0uaW5wdXRfVGhlbWVkX190aGVtZV9kYXJrX203dUJCdSB7CiAgY29sb3I6IHdoaXRlOwp9Ci5pbnB1dF9UaGVtZWRfX19tN3VCQnUgewogIGNvbG9yOiBibGFjazsKfS5pbnB1dF9OZXN0ZWRfX1wkYS1hbmQtXCRiX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfTmVzdGVkX19fbTd1QkJ1IHsKICBtYXJnaW46IDA7Cn0uaW5wdXRfT3V0ZXJfX19tN3VCQnUtMDEgewogIGNvbG9yOiByZWQ7Cn0uaW5wdXRfV3JhcHBlZF9fXCR4X203dUJCdSB7CiAgY29sb3I6IGdyZWVuOwp9";
// identifier props parameter read through members
export const Ident = /*YAK EXPORTED STYLED:Ident:input_Ident_m7uBBu*//*YAK Extracted CSS:
.input_Ident__p_\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Ident_m7uBBu", 0, ({ $on: __yak_$on })=>"input_Ident_m7uBBu" + (__yak_$on ? " input_Ident__p_$on_m7uBBu" : "")), {
    "displayName": "Ident"
});
// block body with a single return and a renamed key
export const Block = /*YAK EXPORTED STYLED:Block:input_Block_m7uBBu*//*YAK Extracted CSS:
.input_Block___m7uBBu {
  padding: 0;
}
.input_Block___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Block_m7uBBu", 0, ({ $size: __yak_$size })=>"input_Block_m7uBBu" + (__yak_$size === "s" ? " input_Block___m7uBBu" : " input_Block___m7uBBu-01")), {
    "displayName": "Block"
});
// helper call in a condition and a shorthand object read
export const Helper = /*YAK EXPORTED STYLED:Helper:input_Helper_m7uBBu*//*YAK Extracted CSS:
.input_Helper___m7uBBu {
  font-size: 2em;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Helper_m7uBBu", 0, ({ $size: __yak_$size, $mode: __yak_$mode })=>"input_Helper_m7uBBu" + (isLarge({
        $size: __yak_$size
    }, __yak_$mode) ? " input_Helper___m7uBBu" : "")), {
    "displayName": "Helper"
});
// theme read through destructuring and through a member
export const Themed = /*YAK EXPORTED STYLED:Themed:input_Themed_m7uBBu*//*YAK Extracted CSS:
.input_Themed__theme_dark_m7uBBu {
  color: white;
}
.input_Themed___m7uBBu {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Themed_m7uBBu", 1, ({ $on: __yak_$on }, __yak_style, __yak_theme)=>"input_Themed_m7uBBu" + (__yak_theme.dark ? " input_Themed__theme_dark_m7uBBu" : "") + (__yak_$on && __yak_theme.dark ? " input_Themed___m7uBBu" : "")), {
    "displayName": "Themed"
});
// falsy branches, nested ternaries and an empty css
export const Nested = /*YAK EXPORTED STYLED:Nested:input_Nested_m7uBBu*//*YAK Extracted CSS:
.input_Nested__\$a-and-\$b_m7uBBu {
  color: red;
}
.input_Nested___m7uBBu {
  margin: 0;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_span("input_Nested_m7uBBu", 0, ({ $a: __yak_$a, $b: __yak_$b, $c: __yak_$c })=>"input_Nested_m7uBBu" + (__yak_$a ? __yak_$b ? " input_Nested__$a-and-$b_m7uBBu" : "" : "") + (__yak_$c > 1 ? " input_Nested___m7uBBu" + (__yak_$a ? " input_Nested__-and-$a_m7uBBu" : "") : "")), {
    "displayName": "Nested"
});
// a nested condition that reads a prop of the enclosing arrow
export const Outer = /*YAK EXPORTED STYLED:Outer:input_Outer_m7uBBu*//*YAK Extracted CSS:
.input_Outer___m7uBBu-01 {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_span("input_Outer_m7uBBu", 0, ({ $a: __yak_$a, $b: __yak_$b })=>"input_Outer_m7uBBu" + (" input_Outer___m7uBBu" + (__yak_$a && __yak_$b ? " input_Outer___m7uBBu-01" : ""))), {
    "displayName": "Outer"
});
// styled(Component) and attrs keep their target but fold their conditions
export const Wrapped = /*YAK EXPORTED STYLED:Wrapped:input_Wrapped_m7uBBu*//*YAK Extracted CSS:
.input_Wrapped__\$x_m7uBBu {
  color: green;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ ((styled(Ident)).attrs({
    role: "note"
}))("input_Wrapped_m7uBBu", 0, ({ $x: __yak_$x })=>"input_Wrapped_m7uBBu" + (__yak_$x ? " input_Wrapped__$x_m7uBBu" : "")), {
    "displayName": "Wrapped"
});
