import { styled, css } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
const SIZES: Record<"sm" | "md", {
    width: string;
    height: string;
}> = {
    sm: {
        width: '24px',
        height: '24px'
    },
    md: {
        width: '32px',
        height: '32px'
    }
};
const StyledDiv = /*YAK Extracted CSS:
.input_StyledDiv_m7uBBu {
  width: var(--input_StyledDiv__width_m7uBBu);
  height: 24px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_StyledDiv_m7uBBu", 2, ({ $size: __yak_$size }, __yak_style)=>"input_StyledDiv_m7uBBu" + (__yak_style["--input_StyledDiv__width_m7uBBu"] = String(SIZES[__yak_$size].width), "")), {
    "displayName": "StyledDiv"
});
const StyledButton = /*YAK Extracted CSS:
.input_StyledButton__\$active_m7uBBu {
  width: var(--input_StyledButton__width_m7uBBu);
  height: 32px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_button("input_StyledButton_m7uBBu", 2, ({ $active: __yak_$active, $size: __yak_$size }, __yak_style)=>"input_StyledButton_m7uBBu" + (__yak_$active ? " input_StyledButton__$active_m7uBBu" + (__yak_style["--input_StyledButton__width_m7uBBu"] = String(SIZES[__yak_$size].width), "") : "")), {
    "displayName": "StyledButton"
});
