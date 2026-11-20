import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { isLarge } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
// identifier props parameter read through members
export const Ident = /*YAK EXPORTED STYLED:Ident:input_Ident_m7uBBu*//*YAK Extracted CSS:
.input_Ident__p_\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Ident_m7uBBu", 0, ({ $on })=>"input_Ident_m7uBBu" + ($on ? " input_Ident__p_$on_m7uBBu" : "")), {
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
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Block_m7uBBu", 0, ({ $size })=>"input_Block_m7uBBu" + ($size === "s" ? " input_Block___m7uBBu" : " input_Block___m7uBBu-01")), {
    "displayName": "Block"
});
// helper call in a condition and a shorthand object read
export const Helper = /*YAK EXPORTED STYLED:Helper:input_Helper_m7uBBu*//*YAK Extracted CSS:
.input_Helper___m7uBBu {
  font-size: 2em;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Helper_m7uBBu", 0, ({ $size, $mode })=>"input_Helper_m7uBBu" + (isLarge({
        $size: $size
    }, $mode) ? " input_Helper___m7uBBu" : "")), {
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
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Themed_m7uBBu", 1, ({ $on }, style, theme)=>"input_Themed_m7uBBu" + (theme.dark ? " input_Themed__theme_dark_m7uBBu" : "") + ($on && theme.dark ? " input_Themed___m7uBBu" : "")), {
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
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_span("input_Nested_m7uBBu", 0, ({ $a, $b, $c })=>"input_Nested_m7uBBu" + ($a ? $b ? " input_Nested__$a-and-$b_m7uBBu" : "" : "") + ($c > 1 ? " input_Nested___m7uBBu" + ($a ? " input_Nested__-and-$a_m7uBBu" : "") : "")), {
    "displayName": "Nested"
});
// a nested condition that reads a prop of the enclosing arrow
export const Outer = /*YAK EXPORTED STYLED:Outer:input_Outer_m7uBBu*//*YAK Extracted CSS:
.input_Outer___m7uBBu-01 {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_span("input_Outer_m7uBBu", 0, ({ $a, $b })=>"input_Outer_m7uBBu" + (" input_Outer___m7uBBu" + ($a && $b ? " input_Outer___m7uBBu-01" : ""))), {
    "displayName": "Outer"
});
// styled(Component) and attrs keep their target but fold their conditions
export const Wrapped = /*YAK EXPORTED STYLED:Wrapped:input_Wrapped_m7uBBu*//*YAK Extracted CSS:
.input_Wrapped__\$x_m7uBBu {
  color: green;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ ((styled(Ident)).attrs({
    role: "note"
}))("input_Wrapped_m7uBBu", 0, ({ $x })=>"input_Wrapped_m7uBBu" + ($x ? " input_Wrapped__$x_m7uBBu" : "")), {
    "displayName": "Wrapped"
});
// a dynamic value inside a property is a CSS variable, which the fold
// function writes into the style object
export const CssVariable = /*YAK EXPORTED STYLED:CssVariable:input_CssVariable_m7uBBu*//*YAK Extracted CSS:
.input_CssVariable___m7uBBu {
  color: red;
}
.input_CssVariable_m7uBBu {
  left: var(--input_CssVariable__left_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CssVariable_m7uBBu", 2, ({ $x }, style)=>"input_CssVariable_m7uBBu" + ($x > 1 ? " input_CssVariable___m7uBBu" : "") + (style["--input_CssVariable__left_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($x, "px"), "")), {
    "displayName": "CssVariable"
});
export const ThemeVariable = /*YAK EXPORTED STYLED:ThemeVariable:input_ThemeVariable_m7uBBu*//*YAK Extracted CSS:
.input_ThemeVariable_m7uBBu {
  color: var(--input_ThemeVariable__color_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ThemeVariable_m7uBBu", 3, ({}, style, theme)=>"input_ThemeVariable_m7uBBu" + (style["--input_ThemeVariable__color_m7uBBu"] = theme.color, "")), {
    "displayName": "ThemeVariable"
});
// a variable in a nested css is written only when its branch runs
export const NestedVariable = /*YAK EXPORTED STYLED:NestedVariable:input_NestedVariable_m7uBBu*//*YAK Extracted CSS:
.input_NestedVariable__\$on_m7uBBu {
  left: var(--input_NestedVariable__left_m7uBBu);
  top: var(--input_NestedVariable__top_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NestedVariable_m7uBBu", 2, ({ $on, $x, $big }, style)=>"input_NestedVariable_m7uBBu" + ($on ? " input_NestedVariable__$on_m7uBBu" + (style["--input_NestedVariable__left_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($x * 2, "px"), style["--input_NestedVariable__top_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($big ? 8 : 4, "px"), "") : "")), {
    "displayName": "NestedVariable"
});
// a truthy left side of `||` adds nothing
export const OrProp = /*YAK EXPORTED STYLED:OrProp:input_OrProp_m7uBBu*//*YAK Extracted CSS:
.input_OrProp__not_\$label_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_OrProp_m7uBBu", 0, ({ $label })=>"input_OrProp_m7uBBu" + ($label ? "" : " input_OrProp__not_$label_m7uBBu")), {
    "displayName": "OrProp"
});
export const OrComparison = /*YAK EXPORTED STYLED:OrComparison:input_OrComparison_m7uBBu*//*YAK Extracted CSS:
.input_OrComparison___m7uBBu {
  padding: 0;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_OrComparison_m7uBBu", 0, ({ $size })=>"input_OrComparison_m7uBBu" + ($size !== "s" ? "" : " input_OrComparison___m7uBBu")), {
    "displayName": "OrComparison"
});
export const OrChain = /*YAK EXPORTED STYLED:OrChain:input_OrChain_m7uBBu*//*YAK Extracted CSS:
.input_OrChain___m7uBBu {
  color: orange;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_OrChain_m7uBBu", 0, ({ $a, $b })=>"input_OrChain_m7uBBu" + (!$a || !$b ? "" : " input_OrChain___m7uBBu")), {
    "displayName": "OrChain"
});
export const AtomsCondition = /*YAK EXPORTED STYLED:AtomsCondition:input_AtomsCondition_m7uBBu*//*YAK Extracted CSS:
.input_AtomsCondition__not_\$on_m7uBBu {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_AtomsCondition_m7uBBu", 0, ({ $on })=>"input_AtomsCondition_m7uBBu" + " flex gap-2" + ($on ? " shadow-md rounded" : "") + ($on ? " text-white" : " input_AtomsCondition__not_$on_m7uBBu")), {
    "displayName": "AtomsCondition"
});
// conditions inside atoms(): any condition folds, the class name is a string
export const AtomsNestedCondition = /*YAK EXPORTED STYLED:AtomsNestedCondition:input_AtomsNestedCondition_m7uBBu*//*YAK Extracted CSS:

*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_AtomsNestedCondition_m7uBBu", 0, ({ $on, $off })=>"input_AtomsNestedCondition_m7uBBu" + ($on ? " shadow-md" + ($off ? " ring" : "") + " rounded p-2" + ($off ? " text-white" : " text-black") + ($off ? " border" : "") + (true === false ? " never" : "") + (isLarge ? " large" : "") : "")), {
    "displayName": "AtomsNestedCondition"
});
const paddingSmall = /*#__PURE__*/ css();
const paddingLarge = /*#__PURE__*/ css();
const SIZES = {
    small: 16
};
// a condition inside a nested css literal, without an arrow of its own
export const NestedCondition = /*YAK EXPORTED STYLED:NestedCondition:input_NestedCondition_m7uBBu*//*YAK Extracted CSS:
.input_NestedCondition__\$on_m7uBBu {
  color: red;
}
.input_NestedCondition__\$on_m7uBBu-01 {
  font-size: 2em;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NestedCondition_m7uBBu", 0, ({ $on, $big })=>"input_NestedCondition_m7uBBu" + ($on ? " input_NestedCondition__$on_m7uBBu" + ($big ? " input_NestedCondition__$on_m7uBBu-01" : "") : "")), {
    "displayName": "NestedCondition"
});
// a nested value that picks between two css constants
export const NestedConstants = /*YAK EXPORTED STYLED:NestedConstants:input_NestedConstants_m7uBBu*//*YAK Extracted CSS:
.input_NestedConstants___m7uBBu-01 {
  padding: 2px;
}
.input_NestedConstants___m7uBBu-02 {
  padding: 1px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NestedConstants_m7uBBu", 0, ({ $big })=>"input_NestedConstants_m7uBBu" + (" input_NestedConstants___m7uBBu" + ($big ? " input_NestedConstants___m7uBBu-01" : " input_NestedConstants___m7uBBu-02"))), {
    "displayName": "NestedConstants"
});
// default values in the destructuring
export const DefaultCondition = /*YAK EXPORTED STYLED:DefaultCondition:input_DefaultCondition_m7uBBu*//*YAK Extracted CSS:
.input_DefaultCondition___m7uBBu {
  text-align: start;
}
.input_DefaultCondition___m7uBBu-01 {
  text-align: end;
}
.input_DefaultCondition__on_m7uBBu {
  color: red;
}
.input_DefaultCondition__\$on_m7uBBu {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_DefaultCondition_m7uBBu", 0, ({ $align, $on })=>"input_DefaultCondition_m7uBBu" + (($align === void 0 ? "start" : $align) === "start" ? " input_DefaultCondition___m7uBBu" : " input_DefaultCondition___m7uBBu-01") + (($on === void 0 ? true : $on) ? " input_DefaultCondition__on_m7uBBu" : "") + ($on ? " input_DefaultCondition__$on_m7uBBu" : "")), {
    "displayName": "DefaultCondition"
});
export const DefaultValue = /*YAK EXPORTED STYLED:DefaultValue:input_DefaultValue_m7uBBu*//*YAK Extracted CSS:
.input_DefaultValue_m7uBBu {
  height: var(--input_DefaultValue__height_m7uBBu);
  width: var(--input_DefaultValue__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_DefaultValue_m7uBBu", 2, ({ $size, $width }, style)=>"input_DefaultValue_m7uBBu" + (style["--input_DefaultValue__height_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($size === void 0 ? 32 : $size, "px"), style["--input_DefaultValue__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($width === void 0 ? $size === void 0 ? SIZES.small : $size : $width, "px"), "")), {
    "displayName": "DefaultValue"
});
