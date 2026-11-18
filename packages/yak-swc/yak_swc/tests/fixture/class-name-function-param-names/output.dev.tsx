import { css, styled } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
const $size = 4;
const items = [
    1,
    2,
    3
];
// every spelling of one prop shares one parameter with the name of the prop
export const SharedName = /*YAK EXPORTED STYLED:SharedName:input_SharedName_m7uBBu*//*YAK Extracted CSS:
.input_SharedName__\$on_m7uBBu {
  color: red;
}
.input_SharedName__on_m7uBBu {
  color: blue;
}
.input_SharedName__p_\$on_m7uBBu {
  color: green;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SharedName_m7uBBu", 0, ({ $on })=>"input_SharedName_m7uBBu" + ($on ? " input_SharedName__$on_m7uBBu" : "") + ($on ? " input_SharedName__on_m7uBBu" : "") + ($on ? " input_SharedName__p_$on_m7uBBu" : "")), {
    "displayName": "SharedName"
});
// the second expression reads the constant `$size` of the module,
// so the parameter for the prop keeps its prefix
export const ModuleConstant = /*YAK EXPORTED STYLED:ModuleConstant:input_ModuleConstant_m7uBBu*//*YAK Extracted CSS:
.input_ModuleConstant___m7uBBu {
  padding: 8px;
}
.input_ModuleConstant___m7uBBu-01 {
  margin: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ModuleConstant_m7uBBu", 0, ({ $size: $size1, $on })=>"input_ModuleConstant_m7uBBu" + ($size1 > 2 ? " input_ModuleConstant___m7uBBu" : "") + ($on && $size > 2 ? " input_ModuleConstant___m7uBBu-01" : "")), {
    "displayName": "ModuleConstant"
});
// `Math` is a global, so the parameter for the prop keeps its prefix
export const Global = /*YAK EXPORTED STYLED:Global:input_Global_m7uBBu*//*YAK Extracted CSS:
.input_Global___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Global_m7uBBu", 0, ({ Math: Math1, $a })=>"input_Global_m7uBBu" + (Math1 && Math.max($a, 2) > 2 ? " input_Global___m7uBBu" : "")), {
    "displayName": "Global"
});
// the callback has its own `$on`, which would hide a parameter of that name
export const InnerBinding = /*YAK EXPORTED STYLED:InnerBinding:input_InnerBinding_m7uBBu*//*YAK Extracted CSS:
.input_InnerBinding___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_InnerBinding_m7uBBu", 0, ({ $on })=>"input_InnerBinding_m7uBBu" + (items.some(($on1)=>$on1 > 2 && $on) ? " input_InnerBinding___m7uBBu" : "")), {
    "displayName": "InnerBinding"
});
// `class` is a reserved word and can not be a parameter name
export const ReservedWord = /*YAK EXPORTED STYLED:ReservedWord:input_ReservedWord_m7uBBu*//*YAK Extracted CSS:
.input_ReservedWord__p_class_m7uBBu {
  color: red;
}
.input_ReservedWord__d_m7uBBu {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReservedWord_m7uBBu", 0, ({ class: __yak_class, default: __yak_default })=>"input_ReservedWord_m7uBBu" + (__yak_class ? " input_ReservedWord__p_class_m7uBBu" : "") + (__yak_default ? " input_ReservedWord__d_m7uBBu" : "")), {
    "displayName": "ReservedWord"
});
// a property name is no identifier, so the parameter can be `$on`
export const PropertyName = /*YAK EXPORTED STYLED:PropertyName:input_PropertyName_m7uBBu*//*YAK Extracted CSS:
.input_PropertyName___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_PropertyName_m7uBBu", 0, ({ $on })=>"input_PropertyName_m7uBBu" + ($on && items.$on !== 0 ? " input_PropertyName___m7uBBu" : "")), {
    "displayName": "PropertyName"
});
// `class` is a reserved word, so its parameter is `__yak_class`. A prop with
// that very name is next to it, and the hygiene pass of SWC renames one
export const ReservedClash = /*YAK EXPORTED STYLED:ReservedClash:input_ReservedClash_m7uBBu*//*YAK Extracted CSS:
.input_ReservedClash__p_class_m7uBBu {
  color: red;
}
.input_ReservedClash__p___yak_class_m7uBBu {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReservedClash_m7uBBu", 0, ({ class: __yak_class, __yak_class: __yak_class1 })=>"input_ReservedClash_m7uBBu" + (__yak_class ? " input_ReservedClash__p_class_m7uBBu" : "") + (__yak_class1 ? " input_ReservedClash__p___yak_class_m7uBBu" : "")), {
    "displayName": "ReservedClash"
});
