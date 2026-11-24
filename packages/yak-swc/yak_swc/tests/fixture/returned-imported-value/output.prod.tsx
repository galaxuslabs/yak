import { atoms, css, styled, __yak_cssValue } from "@yak/react/internal";
import { outlined, colors, spacing } from "./other";
import * as mixins from "./mixins";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
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
// allowed
const Wrapped = /*YAK Extracted CSS:
.ym7uBBu5 {
  --yak-css-import: url("./other:outlined",mixin);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu4", 0, ({ $on })=>"ym7uBBu4" + ($on ? " ym7uBBu5" : ""));
const Local = /*YAK Extracted CSS:
.ym7uBBu7 {
  outline: 3px solid red;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu6", 0, ({ $on })=>"ym7uBBu6" + ($on ? " ym7uBBu7" : ""));
const Atoms = /*#__PURE__*/ __yak.__yak_div("ym7uBBu8", 0, ({ $on })=>"ym7uBBu8" + ($on ? " shadow-md" : ""));
const PropertyValue = /*YAK Extracted CSS:
.ym7uBBu9 {
  color: var(--ym7uBBuA);
  padding: var(--ym7uBBuB);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu9", 2, ({ $on }, style)=>"ym7uBBu9" + (style["--ym7uBBuA"] = $on ? colors.primary : colors.secondary, style["--ym7uBBuB"] = /*#__PURE__*/ __yak_cssValue($on && spacing, "px"), ""));
const Call = /*#__PURE__*/ __yak.__yak_div("ym7uBBuC", ()=>getMixin());
