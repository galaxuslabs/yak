import { styled } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// The first value without a unit gets a wrapper before the second one stops
// the fold. The output keeps the unfolded runtime and imports no
// `__yak_cssValue`.
export const Box = /*YAK EXPORTED STYLED:Box:input_Box_m7uBBu*//*YAK Extracted CSS:
.input_Box_m7uBBu {
  color: var(--input_Box__color_m7uBBu);
  width: var(--input_Box__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Box_m7uBBu", {
    "--input_Box__color_m7uBBu": ({ $color })=>$color,
    "--input_Box__width_m7uBBu": ({ $w })=>{
        let w = $w;
        return w;
    }
}), {
    "displayName": "Box"
});
