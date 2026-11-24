import { atoms, css, styled, __yak_cssValue } from "@yak/react/internal";
import { outlined, colors, spacing } from "./other";
import * as mixins from "./mixins";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnU3IHsKICAtLXlhay1jc3MtaW1wb3J0OiB1cmwoIi4vb3RoZXI6b3V0bGluZWQiLG1peGluKTsKfS55bTd1QkJ1OSB7CiAgb3V0bGluZTogM3B4IHNvbGlkIHJlZDsKfS55bTd1QkJ1QiB7CiAgY29sb3I6IHZhcigtLXltN3VCQnVDKTsKICBwYWRkaW5nOiB2YXIoLS15bTd1QkJ1RCk7Cn0=";
const local = /*#__PURE__*/ css();
const getMixin = ()=>outlined;
// errors: an imported value that a function returns
const Imported = /*#__PURE__*/ __yak.__yak_div("ym7uBBu1", (p)=>p.$on && outlined);
const Namespace = /*#__PURE__*/ __yak.__yak_div("ym7uBBu2", (p)=>p.$on ? mixins.large : null);
const Block = /*#__PURE__*/ __yak.__yak_div("ym7uBBu3", (p)=>{
    if (p.$on) {
        return outlined;
    }
    return null;
});
const Call = /*#__PURE__*/ __yak.__yak_div("ym7uBBu4", ()=>getMixin());
const size = (big?: boolean)=>big ? local : null;
const Helper = /*#__PURE__*/ __yak.__yak_div("ym7uBBu5", (p)=>size(p.$big));
// allowed
const Wrapped = /*YAK Extracted CSS:
.ym7uBBu7 {
  --yak-css-import: url("./other:outlined",mixin);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu6", 0, ({ $on })=>"ym7uBBu6" + ($on ? " ym7uBBu7" : ""));
const Local = /*YAK Extracted CSS:
.ym7uBBu9 {
  outline: 3px solid red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu8", 0, ({ $on })=>"ym7uBBu8" + ($on ? " ym7uBBu9" : ""));
const Atoms = /*#__PURE__*/ __yak.__yak_div("ym7uBBuA", 0, ({ $on })=>"ym7uBBuA" + ($on ? " shadow-md" : ""));
const PropertyValue = /*YAK Extracted CSS:
.ym7uBBuB {
  color: var(--ym7uBBuC);
  padding: var(--ym7uBBuD);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuB", 2, ({ $on }, style)=>"ym7uBBuB" + (style["--ym7uBBuC"] = $on ? colors.primary : colors.secondary, style["--ym7uBBuD"] = /*#__PURE__*/ __yak_cssValue($on && spacing, "px"), ""));
