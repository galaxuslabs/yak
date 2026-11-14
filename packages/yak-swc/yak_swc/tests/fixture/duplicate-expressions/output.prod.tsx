import { styled, __yak_cssValue } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// Identical prop arrow used in two declarations
const TwiceSameArrow = /*YAK Extracted CSS:
.ym7uBBu {
  left: var(--ym7uBBu1);
  right: var(--ym7uBBu1);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu", 2, ({ $x: __yak_$x }, __yak_style)=>"ym7uBBu" + (__yak_style["--ym7uBBu1"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$x, "px")), ""));
// Identical logic, but one side carries a TS parameter annotation
const TypedVsUntyped = /*YAK Extracted CSS:
.ym7uBBu2 {
  top: var(--ym7uBBu3);
  bottom: var(--ym7uBBu3);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu2", 2, ({ $y: __yak_$y }, __yak_style)=>"ym7uBBu2" + (__yak_style["--ym7uBBu3"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$y, "px")), ""));
// Identical calculation including a Math.min call
const WithCalculation = /*YAK Extracted CSS:
.ym7uBBu4 {
  width: var(--ym7uBBu5);
  max-width: var(--ym7uBBu5);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu4", 2, ({ $ratio: __yak_$ratio }, __yak_style)=>"ym7uBBu4" + (__yak_style["--ym7uBBu5"] = String(/*#__PURE__*/ __yak_cssValue(Math.min(__yak_$ratio * 100, 100), "%")), ""));
// Same expression but different trailing units: must stay separate
const DifferentUnits = /*YAK Extracted CSS:
.ym7uBBu6 {
  width: var(--ym7uBBu7);
  height: var(--ym7uBBu8);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu6", 2, ({ $size: __yak_$size }, __yak_style)=>"ym7uBBu6" + (__yak_style["--ym7uBBu7"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$size, "px")), __yak_style["--ym7uBBu8"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$size, "rem")), ""));
// Parenthesized arrow vs plain arrow
const Parens = /*YAK Extracted CSS:
.ym7uBBu9 {
  margin-left: var(--ym7uBBuA);
  margin-right: var(--ym7uBBuA);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu9", 2, ({ $z: __yak_$z }, __yak_style)=>"ym7uBBu9" + (__yak_style["--ym7uBBuA"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$z, "px")), ""));
// Different props: must stay separate
const DifferentProps = /*YAK Extracted CSS:
.ym7uBBuB {
  padding-left: var(--ym7uBBuC);
  padding-right: var(--ym7uBBuD);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuB", 2, ({ $a: __yak_$a, $b: __yak_$b }, __yak_style)=>"ym7uBBuB" + (__yak_style["--ym7uBBuC"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$a, "px")), __yak_style["--ym7uBBuD"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$b, "px")), ""));
// Same bindings, different destructuring order in the parameter
const DestructureOrder = /*YAK Extracted CSS:
.ym7uBBuE {
  width: var(--ym7uBBuF);
  height: var(--ym7uBBuF);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuE", 2, ({ $a: __yak_$a, $b: __yak_$b }, __yak_style)=>"ym7uBBuE" + (__yak_style["--ym7uBBuF"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$a * __yak_$b, "px")), ""));
// A sibling-referencing default: reordering changes behavior
const DefaultReferencesSibling = /*YAK Extracted CSS:
.ym7uBBuG {
  min-width: var(--ym7uBBuH);
  min-height: var(--ym7uBBuI);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuG", {
    "style": {
        "--ym7uBBuH": /*#__PURE__*/ __yak_cssValue(({ $a, $b = $a })=>$a * $b, "px"),
        "--ym7uBBuI": /*#__PURE__*/ __yak_cssValue(({ $b = 1, $a })=>$a * $b, "px")
    }
});
// Repeated interpolations inside a single declaration value
const Dot = /*YAK Extracted CSS:
.ym7uBBuJ {
  animation-range: max(0%, calc((var(--ym7uBBuK) - 1) * 100% / (var(--ym7uBBuL) - 1)))
min(100%, calc((var(--ym7uBBuK) + 1) * 100% / (var(--ym7uBBuL) - 1)));
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuJ", 2, ({ $index: __yak_$index, $slideCount: __yak_$slideCount }, __yak_style)=>"ym7uBBuJ" + (__yak_style["--ym7uBBuK"] = String(__yak_$index), __yak_style["--ym7uBBuL"] = String(__yak_$slideCount), ""));
const Nested = /*YAK Extracted CSS:
.ym7uBBuM {
  left: var(--ym7uBBuN);
  right: var(--ym7uBBuO);
  @media (min-width: 768px) {
    left: 0;
    right: 0;
  }
  @media (min-width: 1025px) {
    transform: translate(var(--ym7uBBuN), var(--ym7uBBuO));
  }
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuM", 2, ({ $x: __yak_$x, $y: __yak_$y }, __yak_style)=>"ym7uBBuM" + (__yak_style["--ym7uBBuN"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$x, "px")), __yak_style["--ym7uBBuO"] = String(/*#__PURE__*/ __yak_cssValue(__yak_$y, "px")), ""));
