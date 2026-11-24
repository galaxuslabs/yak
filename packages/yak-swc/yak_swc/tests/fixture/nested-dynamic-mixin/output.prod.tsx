import { styled, css, __yak_cssValue } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// example taken from https://github.com/galaxuslabs/yak/issues/208 
const spacing = "20px";
const ContainerFluid = /*YAK Extracted CSS:
.ym7uBBu {
  position: relative;
  margin: 0 auto;
  padding-top: 20px;
  max-width: 100%;
}
.ym7uBBu1 {
  margin-top: unset;
}
.ym7uBBu2 {
  margin-top: px;
}
.ym7uBBu {
  margin-top: var(--ym7uBBu3);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $isApp, $pageHeaderHeight }, style)=>"ym7uBBu" + ($isApp ? " ym7uBBu1" : " ym7uBBu2") + (style["--ym7uBBu3"] = /*#__PURE__*/ __yak_cssValue($pageHeaderHeight, "px"), ""));
