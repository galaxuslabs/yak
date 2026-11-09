import { styled, css, __yak_mergeCssProp, __yak_cssValue } from "@yak/solid/internal";
import * as __yak from "@yak/solid/internal";
import "./input.yak.css!=!./input?./input.yak.css";
export const Button = /*YAK EXPORTED STYLED:Button:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu {
  color: red;
}
*/ /* @refresh component */ /*#__PURE__*/ __yak.__yak_button("ym7uBBu");
export const FlexContainer = /*YAK EXPORTED STYLED:FlexContainer:ym7uBBu1*//*YAK Extracted CSS:
.ym7uBBu1 {
  display: flex;
  align-items: var(--ym7uBBu2);
  margin-bottom: var(--ym7uBBu3);
}
*/ /* @refresh component */ /*#__PURE__*/ __yak.__yak_div("ym7uBBu1", {
    "style": {
        "--ym7uBBu2": ({ $align })=>$align || "stretch",
        "--ym7uBBu3": /*#__PURE__*/ __yak_cssValue(({ $spacing })=>$spacing * 8, "px")
    }
});
export const Elem = ()=><div {...__yak_mergeCssProp(/*YAK Extracted CSS:
.ym7uBBu4 {
  color: blue;
}
*/ /*#__PURE__*/ css("ym7uBBu4"), {
        class: "test-class",
        style: {
            padding: "5px"
        }
    })}/>;
