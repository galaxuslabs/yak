import { atoms, css, styled, __yak_cssValue } from "@yak/react/internal";
import { outlined, colors, spacing } from "./other";
import * as mixins from "./mixins";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X1dyYXBwZWRfX3BfXCRvbl9tN3VCQnUgewogIC0teWFrLWNzcy1pbXBvcnQ6IHVybCgiLi9vdGhlcjpvdXRsaW5lZCIsbWl4aW4pOwp9LmlucHV0X0xvY2FsX19wX1wkb25fbTd1QkJ1IHsKICBvdXRsaW5lOiAzcHggc29saWQgcmVkOwp9LmlucHV0X1Byb3BlcnR5VmFsdWVfbTd1QkJ1IHsKICBjb2xvcjogdmFyKC0taW5wdXRfUHJvcGVydHlWYWx1ZV9fY29sb3JfbTd1QkJ1KTsKICBwYWRkaW5nOiB2YXIoLS1pbnB1dF9Qcm9wZXJ0eVZhbHVlX19wYWRkaW5nX203dUJCdSk7Cn0=";
const local = /*#__PURE__*/ css();
const getMixin = ()=>outlined;
// errors: an imported value that a function returns
const Imported = /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Imported_m7uBBu", (p)=>p.$on && outlined), {
    "displayName": "Imported"
});
const Namespace = /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Namespace_m7uBBu", (p)=>p.$on ? mixins.large : null), {
    "displayName": "Namespace"
});
const Block = /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Block_m7uBBu", (p)=>{
    if (p.$on) {
        return outlined;
    }
    return null;
}), {
    "displayName": "Block"
});
const Call = /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Call_m7uBBu", ()=>getMixin()), {
    "displayName": "Call"
});
const size = (big?: boolean)=>big ? local : null;
const Helper = /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Helper_m7uBBu", (p)=>size(p.$big)), {
    "displayName": "Helper"
});
// allowed
const Wrapped = /*YAK Extracted CSS:
.input_Wrapped__p_\$on_m7uBBu {
  --yak-css-import: url("./other:outlined",mixin);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"input_Wrapped_m7uBBu" + ($on ? " input_Wrapped__p_$on_m7uBBu" : "")), {
    "displayName": "Wrapped"
});
const Local = /*YAK Extracted CSS:
.input_Local__p_\$on_m7uBBu {
  outline: 3px solid red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"input_Local_m7uBBu" + ($on ? " input_Local__p_$on_m7uBBu" : "")), {
    "displayName": "Local"
});
const Atoms = /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"input_Atoms_m7uBBu" + ($on ? " shadow-md" : "")), {
    "displayName": "Atoms"
});
const PropertyValue = /*YAK Extracted CSS:
.input_PropertyValue_m7uBBu {
  color: var(--input_PropertyValue__color_m7uBBu);
  padding: var(--input_PropertyValue__padding_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on }, style)=>"input_PropertyValue_m7uBBu" + (style["--input_PropertyValue__color_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($on ? colors.primary : colors.secondary, ""), style["--input_PropertyValue__padding_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($on && spacing, "px"), "")), {
    "displayName": "PropertyValue"
});
