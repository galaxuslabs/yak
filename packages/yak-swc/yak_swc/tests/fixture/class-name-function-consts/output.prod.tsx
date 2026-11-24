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
export const LayoutPosition = /*YAK EXPORTED STYLED:LayoutPosition:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  padding: 2px;
}
.ym7uBBu2 {
  padding: 4px;
}
.ym7uBBu3 {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $layoutPosition })=>"ym7uBBu" + ($layoutPosition.medium?.visualSize === "s" ? " ym7uBBu1" : $layoutPosition.medium?.visualSize === "m" ? " ym7uBBu2" : " ym7uBBu3"));
export const MemberParam = /*YAK EXPORTED STYLED:MemberParam:ym7uBBu4*//*YAK Extracted CSS:
.ym7uBBu5 {
  padding: 2px;
}
.ym7uBBu6 {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $layout })=>"ym7uBBu4" + ($layout.medium!.visualSize === "s" ? " ym7uBBu5" : " ym7uBBu6"));
export const RenamedWithDefault = /*YAK EXPORTED STYLED:RenamedWithDefault:ym7uBBu7*//*YAK Extracted CSS:
.ym7uBBu8 {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBu7" + (($size === void 0 ? "m" : $size) === "s" ? " ym7uBBu8" : ""));
export const SeveralDeclarators = /*YAK EXPORTED STYLED:SeveralDeclarators:ym7uBBu9*//*YAK Extracted CSS:
.ym7uBBuA {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $a, $layout })=>"ym7uBBu9" + ($a && $layout.medium ? " ym7uBBuA" : ""));
// a const that reads an earlier const
export const ConstOfConst = /*YAK EXPORTED STYLED:ConstOfConst:ym7uBBuB*//*YAK Extracted CSS:
.ym7uBBuC {
  padding: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $layout })=>"ym7uBBuB" + ($layout.medium?.visualSize === "l" ? " ym7uBBuC" : ""));
// `medium.visualSize` throws for a missing `medium`, so it keeps the parens
export const MemberOfOptionalConst = /*YAK EXPORTED STYLED:MemberOfOptionalConst:ym7uBBuD*//*YAK Extracted CSS:
.ym7uBBuE {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $layout })=>"ym7uBBuD" + (($layout?.medium).visualSize === "s" ? " ym7uBBuE" : ""));
export const LiteralConst = /*YAK EXPORTED STYLED:LiteralConst:ym7uBBuF*//*YAK Extracted CSS:
.ym7uBBuG {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $count })=>"ym7uBBuF" + ($count > 2 ? " ym7uBBuG" : ""));
// the same name in two blocks is two bindings
export const SameNameInTwoBlocks = /*YAK EXPORTED STYLED:SameNameInTwoBlocks:ym7uBBuH*//*YAK Extracted CSS:
.ym7uBBuI {
  padding: 2px;
}
.ym7uBBuJ {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on, $a, $b })=>"ym7uBBuH" + ($on ? $a.medium?.visualSize === "s" ? " ym7uBBuI" : "" : $b.medium?.visualSize === "s" ? " ym7uBBuJ" : ""));
// the same name in two functions of one component is two bindings
export const SameNameInTwoFunctions = /*YAK EXPORTED STYLED:SameNameInTwoFunctions:ym7uBBuK*//*YAK Extracted CSS:
.ym7uBBuL {
  padding: 2px;
}
.ym7uBBuM {
  margin: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $a, $b })=>"ym7uBBuK" + ($a.medium?.visualSize === "s" ? " ym7uBBuL" : "") + ($b.medium?.visualSize === "s" ? " ym7uBBuM" : ""));
export const ConstInCase = /*YAK EXPORTED STYLED:ConstInCase:ym7uBBuN*//*YAK Extracted CSS:
.ym7uBBuO {
  padding: 2px;
}
.ym7uBBuP {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $kind, $layout })=>"ym7uBBuN" + ($kind === "a" ? $layout.medium?.visualSize === "s" ? " ym7uBBuO" : "" : $kind === "b" ? $layout.medium?.width === 1 ? " ym7uBBuP" : "" : ""));
// reads in a nested css literal, a nested arrow, a call statement and a case value
export const ReadsEverywhere = /*YAK EXPORTED STYLED:ReadsEverywhere:ym7uBBuQ*//*YAK Extracted CSS:
.ym7uBBuR {
  color: red;
}
.ym7uBBuS {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $layout, $kind, $on })=>"ym7uBBuQ" + (log($layout.medium?.visualSize, {
        size: $layout.medium?.visualSize
    }), $kind === $layout.medium?.visualSize ? " ym7uBBuR" + ($on && $layout.medium?.visualSize === "m" ? " ym7uBBuS" : "") : ""));
// the parameter `size` of the nested arrow is another binding than the const
export const ShadowingParameter = /*YAK EXPORTED STYLED:ShadowingParameter:ym7uBBuT*//*YAK Extracted CSS:
.ym7uBBuV {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $layout, size })=>"ym7uBBuT" + ($layout.medium?.visualSize === "s" ? " ym7uBBuU" + (size === "m" ? " ym7uBBuV" : "") : ""));
export const CssValue = /*YAK EXPORTED STYLED:CssValue:ym7uBBuW*//*YAK Extracted CSS:
.ym7uBBuW {
  width: var(--ym7uBBuX);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $layout }, style)=>"ym7uBBuW" + (style["--ym7uBBuX"] = /*#__PURE__*/ __yak_cssValue($layout.medium?.width, "px"), ""));
// a module constant as initializer
export const ModuleConstant = /*YAK EXPORTED STYLED:ModuleConstant:ym7uBBuY*//*YAK Extracted CSS:
.ym7uBBuZ {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"ym7uBBuY" + ($size === SIZES.small ? " ym7uBBuZ" : ""));
// stays unfolded: `let` could change between two reads
export const LetBinding = /*YAK EXPORTED STYLED:LetBinding:ym7uBBua*//*YAK Extracted CSS:
.ym7uBBub {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBua", ({ $layout })=>{
    let size = $layout.medium?.visualSize;
    return size === "s" && /*#__PURE__*/ css("ym7uBBub");
});
// stays unfolded: `var` could change between two reads
export const VarBinding = /*YAK EXPORTED STYLED:VarBinding:ym7uBBuc*//*YAK Extracted CSS:
.ym7uBBud {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuc", ({ $layout })=>{
    var size = $layout.medium?.visualSize;
    return size === "s" && /*#__PURE__*/ css("ym7uBBud");
});
// stays unfolded: a destructuring
export const Destructuring = /*YAK EXPORTED STYLED:Destructuring:ym7uBBue*//*YAK Extracted CSS:
.ym7uBBuf {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBue", ({ $layout })=>{
    const { medium } = $layout;
    return medium && /*#__PURE__*/ css("ym7uBBuf");
});
// stays unfolded: a call would run once per read
export const CallInitializer = /*YAK EXPORTED STYLED:CallInitializer:ym7uBBug*//*YAK Extracted CSS:
.ym7uBBuh {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBug", ({ $size })=>{
    const size = calc($size);
    return size > 2 && /*#__PURE__*/ css("ym7uBBuh");
});
// stays unfolded: a calculation
export const CalculatedInitializer = /*YAK EXPORTED STYLED:CalculatedInitializer:ym7uBBui*//*YAK Extracted CSS:
.ym7uBBuj {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBui", ({ $size })=>{
    const big = $size > 2;
    return big && /*#__PURE__*/ css("ym7uBBuj");
});
// stays unfolded: a computed member read
export const ComputedInitializer = /*YAK EXPORTED STYLED:ComputedInitializer:ym7uBBuk*//*YAK Extracted CSS:
.ym7uBBul {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuk", ({ $layout })=>{
    const medium = $layout["medium"];
    return medium && /*#__PURE__*/ css("ym7uBBul");
});
// stays unfolded: an optional call
export const OptionalCallInitializer = /*YAK EXPORTED STYLED:OptionalCallInitializer:ym7uBBum*//*YAK Extracted CSS:
.ym7uBBun {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBum", ({ $read })=>{
    const size = $read?.();
    return size === "s" && /*#__PURE__*/ css("ym7uBBun");
});
// stays unfolded: the const is called, and `$layout.read()` would run with `$layout` as `this`
export const CalledConst = /*YAK EXPORTED STYLED:CalledConst:ym7uBBuo*//*YAK Extracted CSS:
.ym7uBBup {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuo", ({ $layout })=>{
    const read = $layout.read;
    return read() && /*#__PURE__*/ css("ym7uBBup");
});
// stays unfolded: a write to a const throws
export const WriteToConst = /*YAK EXPORTED STYLED:WriteToConst:ym7uBBuq*//*YAK Extracted CSS:
.ym7uBBur {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuq", ({ $on })=>{
    const on = $on;
    log(on = false);
    return on && /*#__PURE__*/ css("ym7uBBur");
});
// stays unfolded: the `if` reads `size` before its declaration and throws
export const ReadBeforeDeclaration = /*YAK EXPORTED STYLED:ReadBeforeDeclaration:ym7uBBus*//*YAK Extracted CSS:
.ym7uBBut {
  padding: 2px;
}
.ym7uBBuu {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBus", ({ $layout })=>{
    if (size === "s") return /*#__PURE__*/ css("ym7uBBut");
    const size = $layout.medium?.visualSize;
    return /*#__PURE__*/ css("ym7uBBuu");
});
// stays unfolded: the initializer reads the name it declares
export const SelfReference = /*YAK EXPORTED STYLED:SelfReference:ym7uBBuv*//*YAK Extracted CSS:
.ym7uBBuw {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuv", ({ $layout })=>{
    const medium = medium.medium;
    return medium && /*#__PURE__*/ css("ym7uBBuw");
});
// stays unfolded: the first declarator reads the second one before its declaration
export const ReadOfLaterDeclarator = /*YAK EXPORTED STYLED:ReadOfLaterDeclarator:ym7uBBux*//*YAK Extracted CSS:
.ym7uBBuy {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBux", ({ $layout })=>{
    const size = medium.visualSize, medium = $layout.medium;
    return size === "s" && /*#__PURE__*/ css("ym7uBBuy");
});
// stays unfolded: case "m" reads the `size` of case "s" before its declaration
export const ConstOfOtherCase = /*YAK EXPORTED STYLED:ConstOfOtherCase:ym7uBBuz*//*YAK Extracted CSS:
.ym7uBBu- {
  padding: 2px;
}
.ym7uBBu_ {
  padding: 4px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuz", ({ $kind, $layout })=>{
    switch($kind){
        case "s":
            const size = $layout.medium?.visualSize;
            return size === "s" && /*#__PURE__*/ css("ym7uBBu-");
        case "m":
            return size === "m" && /*#__PURE__*/ css("ym7uBBu_");
    }
});
// stays unfolded: a `const` after a `return`
export const ConstAfterReturn = /*YAK EXPORTED STYLED:ConstAfterReturn:ym7uBBu10*//*YAK Extracted CSS:
.ym7uBBu11 {
  padding: 2px;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu10", ({ $on })=>{
    return $on && /*#__PURE__*/ css("ym7uBBu11");
    const unused = $on;
});
