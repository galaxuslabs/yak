import { css, styled } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUxIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1MiB7CiAgY29sb3I6IGJsdWU7Cn0KLnltN3VCQnUzIHsKICBjb2xvcjogZ3JlZW47Cn0ueW03dUJCdTUgewogIHBhZGRpbmc6IDhweDsKfQoueW03dUJCdTYgewogIG1hcmdpbjogOHB4Owp9LnltN3VCQnU4IHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVBIHsKICBjb2xvcjogcmVkOwp9LnltN3VCQnVDIHsKICBjb2xvcjogcmVkOwp9Ci55bTd1QkJ1RCB7CiAgY29sb3I6IGJsdWU7Cn0ueW03dUJCdUYgewogIGNvbG9yOiByZWQ7Cn0ueW03dUJCdUggewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVJIHsKICBjb2xvcjogYmx1ZTsKfQ==";
const $size = 4;
const items = [
    1,
    2,
    3
];
// every spelling of one prop shares one parameter with the name of the prop
export const SharedName = /*YAK EXPORTED STYLED:SharedName:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu1 {
  color: red;
}
.ym7uBBu2 {
  color: blue;
}
.ym7uBBu3 {
  color: green;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBu" + ($on ? " ym7uBBu1" : "") + ($on ? " ym7uBBu2" : "") + ($on ? " ym7uBBu3" : ""));
// the second expression reads the constant `$size` of the module,
// so the parameter for the prop keeps its prefix
export const ModuleConstant = /*YAK EXPORTED STYLED:ModuleConstant:ym7uBBu4*//*YAK Extracted CSS:
.ym7uBBu5 {
  padding: 8px;
}
.ym7uBBu6 {
  margin: 8px;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $size: $size1, $on })=>"ym7uBBu4" + ($size1 > 2 ? " ym7uBBu5" : "") + ($on && $size > 2 ? " ym7uBBu6" : ""));
// `Math` is a global, so the parameter for the prop keeps its prefix
export const Global = /*YAK EXPORTED STYLED:Global:ym7uBBu7*//*YAK Extracted CSS:
.ym7uBBu8 {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ Math: Math1, $a })=>"ym7uBBu7" + (Math1 && Math.max($a, 2) > 2 ? " ym7uBBu8" : ""));
// the callback has its own `$on`, which would hide a parameter of that name
export const InnerBinding = /*YAK EXPORTED STYLED:InnerBinding:ym7uBBu9*//*YAK Extracted CSS:
.ym7uBBuA {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBu9" + (items.some(($on1)=>$on1 > 2 && $on) ? " ym7uBBuA" : ""));
// `class` is a reserved word and can not be a parameter name
export const ReservedWord = /*YAK EXPORTED STYLED:ReservedWord:ym7uBBuB*//*YAK Extracted CSS:
.ym7uBBuC {
  color: red;
}
.ym7uBBuD {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ class: __yak_class, default: __yak_default })=>"ym7uBBuB" + (__yak_class ? " ym7uBBuC" : "") + (__yak_default ? " ym7uBBuD" : ""));
// a property name is no identifier, so the parameter can be `$on`
export const PropertyName = /*YAK EXPORTED STYLED:PropertyName:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuF {
  color: red;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"ym7uBBuE" + ($on && items.$on !== 0 ? " ym7uBBuF" : ""));
// `class` is a reserved word, so its parameter is `__yak_class`. A prop with
// that very name is next to it, and the hygiene pass of SWC renames one
export const ReservedClash = /*YAK EXPORTED STYLED:ReservedClash:ym7uBBuG*//*YAK Extracted CSS:
.ym7uBBuH {
  color: red;
}
.ym7uBBuI {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ class: __yak_class, __yak_class: __yak_class1 })=>"ym7uBBuG" + (__yak_class ? " ym7uBBuH" : "") + (__yak_class1 ? " ym7uBBuI" : ""));
