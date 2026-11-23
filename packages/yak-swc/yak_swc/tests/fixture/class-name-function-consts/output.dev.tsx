import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { calc, log, SIZES } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
type Size = "s" | "m" | "l";
type Layout = {
    medium?: {
        visualSize: Size;
        width: number;
    };
};
export const LayoutPosition = /*YAK EXPORTED STYLED:LayoutPosition:input_LayoutPosition_m7uBBu*//*YAK Extracted CSS:
.input_LayoutPosition___m7uBBu {
  padding: 2px;
}
.input_LayoutPosition___m7uBBu-01 {
  padding: 4px;
}
.input_LayoutPosition___m7uBBu-02 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_LayoutPosition_m7uBBu", 0, ({ $layoutPosition })=>"input_LayoutPosition_m7uBBu" + ($layoutPosition.medium?.visualSize === "s" ? " input_LayoutPosition___m7uBBu" : $layoutPosition.medium?.visualSize === "m" ? " input_LayoutPosition___m7uBBu-01" : " input_LayoutPosition___m7uBBu-02")), {
    "displayName": "LayoutPosition"
});
export const MemberParam = /*YAK EXPORTED STYLED:MemberParam:input_MemberParam_m7uBBu*//*YAK Extracted CSS:
.input_MemberParam___m7uBBu {
  padding: 2px;
}
.input_MemberParam___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MemberParam_m7uBBu", 0, ({ $layout })=>"input_MemberParam_m7uBBu" + ($layout.medium!.visualSize === "s" ? " input_MemberParam___m7uBBu" : " input_MemberParam___m7uBBu-01")), {
    "displayName": "MemberParam"
});
export const RenamedWithDefault = /*YAK EXPORTED STYLED:RenamedWithDefault:input_RenamedWithDefault_m7uBBu*//*YAK Extracted CSS:
.input_RenamedWithDefault___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_RenamedWithDefault_m7uBBu", 0, ({ $size })=>"input_RenamedWithDefault_m7uBBu" + (($size === void 0 ? "m" : $size) === "s" ? " input_RenamedWithDefault___m7uBBu" : "")), {
    "displayName": "RenamedWithDefault"
});
export const SeveralDeclarators = /*YAK EXPORTED STYLED:SeveralDeclarators:input_SeveralDeclarators_m7uBBu*//*YAK Extracted CSS:
.input_SeveralDeclarators___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SeveralDeclarators_m7uBBu", 0, ({ $a, $layout })=>"input_SeveralDeclarators_m7uBBu" + ($a && $layout.medium ? " input_SeveralDeclarators___m7uBBu" : "")), {
    "displayName": "SeveralDeclarators"
});
// a const that reads an earlier const
export const ConstOfConst = /*YAK EXPORTED STYLED:ConstOfConst:input_ConstOfConst_m7uBBu*//*YAK Extracted CSS:
.input_ConstOfConst___m7uBBu {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ConstOfConst_m7uBBu", 0, ({ $layout })=>"input_ConstOfConst_m7uBBu" + ($layout.medium?.visualSize === "l" ? " input_ConstOfConst___m7uBBu" : "")), {
    "displayName": "ConstOfConst"
});
// `medium.visualSize` throws for a missing `medium`, so it keeps the parens
export const MemberOfOptionalConst = /*YAK EXPORTED STYLED:MemberOfOptionalConst:input_MemberOfOptionalConst_m7uBBu*//*YAK Extracted CSS:
.input_MemberOfOptionalConst___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MemberOfOptionalConst_m7uBBu", 0, ({ $layout })=>"input_MemberOfOptionalConst_m7uBBu" + (($layout?.medium).visualSize === "s" ? " input_MemberOfOptionalConst___m7uBBu" : "")), {
    "displayName": "MemberOfOptionalConst"
});
export const LiteralConst = /*YAK EXPORTED STYLED:LiteralConst:input_LiteralConst_m7uBBu*//*YAK Extracted CSS:
.input_LiteralConst___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_LiteralConst_m7uBBu", 0, ({ $count })=>"input_LiteralConst_m7uBBu" + ($count > 2 ? " input_LiteralConst___m7uBBu" : "")), {
    "displayName": "LiteralConst"
});
// the same name in two blocks is two bindings
export const SameNameInTwoBlocks = /*YAK EXPORTED STYLED:SameNameInTwoBlocks:input_SameNameInTwoBlocks_m7uBBu*//*YAK Extracted CSS:
.input_SameNameInTwoBlocks___m7uBBu {
  padding: 2px;
}
.input_SameNameInTwoBlocks___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SameNameInTwoBlocks_m7uBBu", 0, ({ $on, $a, $b })=>"input_SameNameInTwoBlocks_m7uBBu" + ($on ? $a.medium?.visualSize === "s" ? " input_SameNameInTwoBlocks___m7uBBu" : "" : $b.medium?.visualSize === "s" ? " input_SameNameInTwoBlocks___m7uBBu-01" : "")), {
    "displayName": "SameNameInTwoBlocks"
});
// the same name in two functions of one component is two bindings
export const SameNameInTwoFunctions = /*YAK EXPORTED STYLED:SameNameInTwoFunctions:input_SameNameInTwoFunctions_m7uBBu*//*YAK Extracted CSS:
.input_SameNameInTwoFunctions___m7uBBu {
  padding: 2px;
}
.input_SameNameInTwoFunctions___m7uBBu-01 {
  margin: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SameNameInTwoFunctions_m7uBBu", 0, ({ $a, $b })=>"input_SameNameInTwoFunctions_m7uBBu" + ($a.medium?.visualSize === "s" ? " input_SameNameInTwoFunctions___m7uBBu" : "") + ($b.medium?.visualSize === "s" ? " input_SameNameInTwoFunctions___m7uBBu-01" : "")), {
    "displayName": "SameNameInTwoFunctions"
});
export const ConstInCase = /*YAK EXPORTED STYLED:ConstInCase:input_ConstInCase_m7uBBu*//*YAK Extracted CSS:
.input_ConstInCase___m7uBBu {
  padding: 2px;
}
.input_ConstInCase___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ConstInCase_m7uBBu", 0, ({ $kind, $layout })=>"input_ConstInCase_m7uBBu" + ($kind === "a" ? $layout.medium?.visualSize === "s" ? " input_ConstInCase___m7uBBu" : "" : $kind === "b" ? $layout.medium?.width === 1 ? " input_ConstInCase___m7uBBu-01" : "" : "")), {
    "displayName": "ConstInCase"
});
// reads in a nested css literal, a nested arrow, a call statement and a case value
export const ReadsEverywhere = /*YAK EXPORTED STYLED:ReadsEverywhere:input_ReadsEverywhere_m7uBBu*//*YAK Extracted CSS:
.input_ReadsEverywhere___m7uBBu {
  color: red;
}
.input_ReadsEverywhere___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReadsEverywhere_m7uBBu", 0, ({ $layout, $kind, $on })=>"input_ReadsEverywhere_m7uBBu" + (log($layout.medium?.visualSize, {
        size: $layout.medium?.visualSize
    }), $kind === $layout.medium?.visualSize ? " input_ReadsEverywhere___m7uBBu" + ($on && $layout.medium?.visualSize === "m" ? " input_ReadsEverywhere___m7uBBu-01" : "") : "")), {
    "displayName": "ReadsEverywhere"
});
// the parameter `size` of the nested arrow is another binding than the const
export const ShadowingParameter = /*YAK EXPORTED STYLED:ShadowingParameter:input_ShadowingParameter_m7uBBu*//*YAK Extracted CSS:
.input_ShadowingParameter__-and-_m7uBBu {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ShadowingParameter_m7uBBu", 0, ({ $layout, size })=>"input_ShadowingParameter_m7uBBu" + ($layout.medium?.visualSize === "s" ? " input_ShadowingParameter___m7uBBu" + (size === "m" ? " input_ShadowingParameter__-and-_m7uBBu" : "") : "")), {
    "displayName": "ShadowingParameter"
});
export const CssValue = /*YAK EXPORTED STYLED:CssValue:input_CssValue_m7uBBu*//*YAK Extracted CSS:
.input_CssValue_m7uBBu {
  width: var(--input_CssValue__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CssValue_m7uBBu", 2, ({ $layout }, style)=>"input_CssValue_m7uBBu" + (style["--input_CssValue__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($layout.medium?.width, "px"), "")), {
    "displayName": "CssValue"
});
// a module constant as initializer
export const ModuleConstant = /*YAK EXPORTED STYLED:ModuleConstant:input_ModuleConstant_m7uBBu*//*YAK Extracted CSS:
.input_ModuleConstant___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ModuleConstant_m7uBBu", 0, ({ $size })=>"input_ModuleConstant_m7uBBu" + ($size === SIZES.small ? " input_ModuleConstant___m7uBBu" : "")), {
    "displayName": "ModuleConstant"
});
// stays unfolded: `let` could change between two reads
export const LetBinding = /*YAK EXPORTED STYLED:LetBinding:input_LetBinding_m7uBBu*//*YAK Extracted CSS:
.input_LetBinding___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_LetBinding_m7uBBu", ({ $layout })=>{
    let size = $layout.medium?.visualSize;
    return size === "s" && /*#__PURE__*/ css("input_LetBinding___m7uBBu");
}), {
    "displayName": "LetBinding"
});
// stays unfolded: `var` could change between two reads
export const VarBinding = /*YAK EXPORTED STYLED:VarBinding:input_VarBinding_m7uBBu*//*YAK Extracted CSS:
.input_VarBinding___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_VarBinding_m7uBBu", ({ $layout })=>{
    var size = $layout.medium?.visualSize;
    return size === "s" && /*#__PURE__*/ css("input_VarBinding___m7uBBu");
}), {
    "displayName": "VarBinding"
});
// stays unfolded: a destructuring
export const Destructuring = /*YAK EXPORTED STYLED:Destructuring:input_Destructuring_m7uBBu*//*YAK Extracted CSS:
.input_Destructuring__medium_m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Destructuring_m7uBBu", ({ $layout })=>{
    const { medium } = $layout;
    return medium && /*#__PURE__*/ css("input_Destructuring__medium_m7uBBu");
}), {
    "displayName": "Destructuring"
});
// stays unfolded: a call would run once per read
export const CallInitializer = /*YAK EXPORTED STYLED:CallInitializer:input_CallInitializer_m7uBBu*//*YAK Extracted CSS:
.input_CallInitializer___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CallInitializer_m7uBBu", ({ $size })=>{
    const size = calc($size);
    return size > 2 && /*#__PURE__*/ css("input_CallInitializer___m7uBBu");
}), {
    "displayName": "CallInitializer"
});
// stays unfolded: a calculation
export const CalculatedInitializer = /*YAK EXPORTED STYLED:CalculatedInitializer:input_CalculatedInitializer_m7uBBu*//*YAK Extracted CSS:
.input_CalculatedInitializer__big_m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CalculatedInitializer_m7uBBu", ({ $size })=>{
    const big = $size > 2;
    return big && /*#__PURE__*/ css("input_CalculatedInitializer__big_m7uBBu");
}), {
    "displayName": "CalculatedInitializer"
});
// stays unfolded: a computed member read
export const ComputedInitializer = /*YAK EXPORTED STYLED:ComputedInitializer:input_ComputedInitializer_m7uBBu*//*YAK Extracted CSS:
.input_ComputedInitializer__medium_m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ComputedInitializer_m7uBBu", ({ $layout })=>{
    const medium = $layout["medium"];
    return medium && /*#__PURE__*/ css("input_ComputedInitializer__medium_m7uBBu");
}), {
    "displayName": "ComputedInitializer"
});
// stays unfolded: an optional call
export const OptionalCallInitializer = /*YAK EXPORTED STYLED:OptionalCallInitializer:input_OptionalCallInitializer_m7uBBu*//*YAK Extracted CSS:
.input_OptionalCallInitializer___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_OptionalCallInitializer_m7uBBu", ({ $read })=>{
    const size = $read?.();
    return size === "s" && /*#__PURE__*/ css("input_OptionalCallInitializer___m7uBBu");
}), {
    "displayName": "OptionalCallInitializer"
});
// stays unfolded: the const is called, and `$layout.read()` would run with `$layout` as `this`
export const CalledConst = /*YAK EXPORTED STYLED:CalledConst:input_CalledConst_m7uBBu*//*YAK Extracted CSS:
.input_CalledConst___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CalledConst_m7uBBu", ({ $layout })=>{
    const read = $layout.read;
    return read() && /*#__PURE__*/ css("input_CalledConst___m7uBBu");
}), {
    "displayName": "CalledConst"
});
// stays unfolded: a write to a const throws
export const WriteToConst = /*YAK EXPORTED STYLED:WriteToConst:input_WriteToConst_m7uBBu*//*YAK Extracted CSS:
.input_WriteToConst__on_m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_WriteToConst_m7uBBu", ({ $on })=>{
    const on = $on;
    log(on = false);
    return on && /*#__PURE__*/ css("input_WriteToConst__on_m7uBBu");
}), {
    "displayName": "WriteToConst"
});
// stays unfolded: the `if` reads `size` before its declaration and throws
export const ReadBeforeDeclaration = /*YAK EXPORTED STYLED:ReadBeforeDeclaration:input_ReadBeforeDeclaration_m7uBBu*//*YAK Extracted CSS:
.input_ReadBeforeDeclaration___m7uBBu {
  padding: 2px;
}
.input_ReadBeforeDeclaration___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReadBeforeDeclaration_m7uBBu", ({ $layout })=>{
    if (size === "s") return /*#__PURE__*/ css("input_ReadBeforeDeclaration___m7uBBu");
    const size = $layout.medium?.visualSize;
    return /*#__PURE__*/ css("input_ReadBeforeDeclaration___m7uBBu-01");
}), {
    "displayName": "ReadBeforeDeclaration"
});
// stays unfolded: the initializer reads the name it declares
export const SelfReference = /*YAK EXPORTED STYLED:SelfReference:input_SelfReference_m7uBBu*//*YAK Extracted CSS:
.input_SelfReference__medium_m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SelfReference_m7uBBu", ({ $layout })=>{
    const medium = medium.medium;
    return medium && /*#__PURE__*/ css("input_SelfReference__medium_m7uBBu");
}), {
    "displayName": "SelfReference"
});
// stays unfolded: the first declarator reads the second one before its declaration
export const ReadOfLaterDeclarator = /*YAK EXPORTED STYLED:ReadOfLaterDeclarator:input_ReadOfLaterDeclarator_m7uBBu*//*YAK Extracted CSS:
.input_ReadOfLaterDeclarator___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReadOfLaterDeclarator_m7uBBu", ({ $layout })=>{
    const size = medium.visualSize, medium = $layout.medium;
    return size === "s" && /*#__PURE__*/ css("input_ReadOfLaterDeclarator___m7uBBu");
}), {
    "displayName": "ReadOfLaterDeclarator"
});
// stays unfolded: case "m" reads the `size` of case "s" before its declaration
export const ConstOfOtherCase = /*YAK EXPORTED STYLED:ConstOfOtherCase:input_ConstOfOtherCase_m7uBBu*//*YAK Extracted CSS:
.input_ConstOfOtherCase___m7uBBu {
  padding: 2px;
}
.input_ConstOfOtherCase___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ConstOfOtherCase_m7uBBu", ({ $kind, $layout })=>{
    switch($kind){
        case "s":
            const size = $layout.medium?.visualSize;
            return size === "s" && /*#__PURE__*/ css("input_ConstOfOtherCase___m7uBBu");
        case "m":
            return size === "m" && /*#__PURE__*/ css("input_ConstOfOtherCase___m7uBBu-01");
    }
}), {
    "displayName": "ConstOfOtherCase"
});
// stays unfolded: a `const` after a `return`
export const ConstAfterReturn = /*YAK EXPORTED STYLED:ConstAfterReturn:input_ConstAfterReturn_m7uBBu*//*YAK Extracted CSS:
.input_ConstAfterReturn__\$on_m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ConstAfterReturn_m7uBBu", ({ $on })=>{
    return $on && /*#__PURE__*/ css("input_ConstAfterReturn__$on_m7uBBu");
    const unused = $on;
}), {
    "displayName": "ConstAfterReturn"
});
