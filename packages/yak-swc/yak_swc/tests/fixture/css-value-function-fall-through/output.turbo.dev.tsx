import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { log, getWidth } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X051bWJlclJldHVybnNfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfTnVtYmVyUmV0dXJuc19fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9OZXZlck51bGxpc2hTaGFwZXNfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfTmV2ZXJOdWxsaXNoU2hhcGVzX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X1N3aXRjaExhc3RDYXNlVGhlblN0YXRlbWVudHNfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfU3dpdGNoTGFzdENhc2VUaGVuU3RhdGVtZW50c19fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9SZWFkUmV0dXJuX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X1JlYWRSZXR1cm5fX3dpZHRoX203dUJCdSk7Cn0uaW5wdXRfQW5kUmV0dXJuX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X0FuZFJldHVybl9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9DYWxsUmV0dXJuSW5Td2l0Y2hfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfQ2FsbFJldHVybkluU3dpdGNoX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X0VtcHR5UmV0dXJuX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X0VtcHR5UmV0dXJuX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X051bGxJbkVsc2VfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfTnVsbEluRWxzZV9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9OZXh0VG9DbGFzc05hbWVzX19cJG9uX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfTmV4dFRvQ2xhc3NOYW1lc19tN3VCQnUgewogIGhlaWdodDogdmFyKC0taW5wdXRfTmV4dFRvQ2xhc3NOYW1lc19faGVpZ2h0X203dUJCdSk7Cn0uaW5wdXRfUmVhZFJldHVybldpdGhvdXRVbml0X203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X1JlYWRSZXR1cm5XaXRob3V0VW5pdF9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9DYWxsUmV0dXJuV2l0aG91dFVuaXRfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfQ2FsbFJldHVybldpdGhvdXRVbml0X193aWR0aF9tN3VCQnUpOwp9LmlucHV0X01pbnVzQmVmb3JlVmFsdWVfbTd1QkJ1IHsKICBsZWZ0OiB2YXIoLS1pbnB1dF9NaW51c0JlZm9yZVZhbHVlX19sZWZ0X203dUJCdSk7Cn0uaW5wdXRfVHdvR3VhcmRCbG9ja3NfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfVHdvR3VhcmRCbG9ja3NfX3dpZHRoX203dUJCdSk7Cn0uaW5wdXRfR3VhcmRJbkd1YXJkX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X0d1YXJkSW5HdWFyZF9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9Db25zdFJlYWRSZXR1cm5fbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfQ29uc3RSZWFkUmV0dXJuX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X1N3aXRjaExhc3RDYXNlQnJlYWtfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfU3dpdGNoTGFzdENhc2VCcmVha19fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9EZWZhdWx0UHJvcF9tN3VCQnUgewogIHdpZHRoOiB2YXIoLS1pbnB1dF9EZWZhdWx0UHJvcF9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9OZXN0ZWRDc3NWYWx1ZV9fXCRvbl9tN3VCQnUgewogIHdpZHRoOiB2YXIoLS1pbnB1dF9OZXN0ZWRDc3NWYWx1ZV9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9TaW5nbGVSZXR1cm5BZnRlckJsb2NrX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X1NpbmdsZVJldHVybkFmdGVyQmxvY2tfX3dpZHRoX203dUJCdSk7Cn0=";
type Size = "s" | "m" | "l";
// every `return` in the guard block returns a number, which is never
// `null` or `undefined`, so `??` goes on after the block only for its end
export const NumberReturns = /*YAK EXPORTED STYLED:NumberReturns:input_NumberReturns_m7uBBu*//*YAK Extracted CSS:
.input_NumberReturns_m7uBBu {
  width: var(--input_NumberReturns__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $wide }, style)=>"input_NumberReturns_m7uBBu" + (style["--input_NumberReturns__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? 1 : void 0 : void 0) ?? ($wide ? 3 : 2), "px"), "")), {
    "displayName": "NumberReturns"
});
// a nested ternary of literals, a template literal, a calculation, `||` and
// `??` with a number on the right side
export const NeverNullishShapes = /*YAK EXPORTED STYLED:NeverNullishShapes:input_NeverNullishShapes_m7uBBu*//*YAK Extracted CSS:
.input_NeverNullishShapes_m7uBBu {
  width: var(--input_NeverNullishShapes__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $a, $b, $n }, style)=>"input_NeverNullishShapes_m7uBBu" + (style["--input_NeverNullishShapes__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($a ? $b ? $n > 2 ? $n > 4 ? 4 : 2 : 1 : $n > 8 ? `${$n}px` : $n > 6 ? $n * 2 : $n > 4 ? $n || 4 : $n > 3 ? $n ?? 3 : void 0 : void 0) ?? ($b ? $n : 0), ""), "")), {
    "displayName": "NeverNullishShapes"
});
// the last case of a `switch` ends without `return`
export const SwitchLastCaseThenStatements = /*YAK EXPORTED STYLED:SwitchLastCaseThenStatements:input_SwitchLastCaseThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_SwitchLastCaseThenStatements_m7uBBu {
  width: var(--input_SwitchLastCaseThenStatements__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $size, $on }, style)=>"input_SwitchLastCaseThenStatements_m7uBBu" + (style["--input_SwitchLastCaseThenStatements__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($size === "s" ? 2 : (log($size), void 0)) ?? ($on ? 4 : 8), "px"), "")), {
    "displayName": "SwitchLastCaseThenStatements"
});
// `$width` can be `undefined`, so its `return` gets a wrapper and `??` never
// goes on after the block for it
export const ReadReturn = /*YAK EXPORTED STYLED:ReadReturn:input_ReadReturn_m7uBBu*//*YAK Extracted CSS:
.input_ReadReturn_m7uBBu {
  width: var(--input_ReadReturn__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $width }, style)=>"input_ReadReturn_m7uBBu" + (style["--input_ReadReturn__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? /*#__PURE__*/ __yak_cssValue($width, "") : void 0 : void 0) ?? ($big ? 4 : 8), "px"), "")), {
    "displayName": "ReadReturn"
});
// `$a && 1` returns `$a` when it is falsy, e.g. `null`, so it gets a wrapper
export const AndReturn = /*YAK EXPORTED STYLED:AndReturn:input_AndReturn_m7uBBu*//*YAK Extracted CSS:
.input_AndReturn_m7uBBu {
  width: var(--input_AndReturn__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $a }, style)=>"input_AndReturn_m7uBBu" + (style["--input_AndReturn__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $a ? /*#__PURE__*/ __yak_cssValue($a && 1, "") : void 0 : void 0) ?? ($a ? 4 : 8), "px"), "")), {
    "displayName": "AndReturn"
});
// a call can return anything, so it gets a wrapper, also in a nested `switch`
export const CallReturnInSwitch = /*YAK EXPORTED STYLED:CallReturnInSwitch:input_CallReturnInSwitch_m7uBBu*//*YAK Extracted CSS:
.input_CallReturnInSwitch_m7uBBu {
  width: var(--input_CallReturnInSwitch__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $size }, style)=>"input_CallReturnInSwitch_m7uBBu" + (style["--input_CallReturnInSwitch__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $size === "s" ? /*#__PURE__*/ __yak_cssValue(getWidth($size), "") : $size === "m" ? 2 : void 0 : void 0) ?? ($size === "l" ? 4 : 8), "px"), "")), {
    "displayName": "CallReturnInSwitch"
});
// `return;` is `undefined` and gets a wrapper
export const EmptyReturn = /*YAK EXPORTED STYLED:EmptyReturn:input_EmptyReturn_m7uBBu*//*YAK Extracted CSS:
.input_EmptyReturn_m7uBBu {
  width: var(--input_EmptyReturn__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big }, style)=>"input_EmptyReturn_m7uBBu" + (style["--input_EmptyReturn__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? /*#__PURE__*/ __yak_cssValue(undefined, "") : void 0 : void 0) ?? ($big ? 4 : 8), "px"), "")), {
    "displayName": "EmptyReturn"
});
// a `null` in the `else` of the branch gets a wrapper
export const NullInElse = /*YAK EXPORTED STYLED:NullInElse:input_NullInElse_m7uBBu*//*YAK Extracted CSS:
.input_NullInElse_m7uBBu {
  width: var(--input_NullInElse__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big }, style)=>"input_NullInElse_m7uBBu" + (style["--input_NullInElse__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? 2 : void 0 : /*#__PURE__*/ __yak_cssValue(null, "")) ?? ($big ? 4 : 8), "px"), "")), {
    "displayName": "NullInElse"
});
// a CSS value folds into the same function as the class names next to it
export const NextToClassNames = /*YAK EXPORTED STYLED:NextToClassNames:input_NextToClassNames_m7uBBu*//*YAK Extracted CSS:
.input_NextToClassNames__\$on_m7uBBu {
  color: red;
}
.input_NextToClassNames_m7uBBu {
  height: var(--input_NextToClassNames__height_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big }, style)=>"input_NextToClassNames_m7uBBu" + ($on ? " input_NextToClassNames__$on_m7uBBu" : "") + (style["--input_NextToClassNames__height_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? 10 : void 0 : void 0) ?? (log($big), 20), "px"), "")), {
    "displayName": "NextToClassNames"
});
// a value without a unit gets the same wrapper
export const ReadReturnWithoutUnit = /*YAK EXPORTED STYLED:ReadReturnWithoutUnit:input_ReadReturnWithoutUnit_m7uBBu*//*YAK Extracted CSS:
.input_ReadReturnWithoutUnit_m7uBBu {
  width: var(--input_ReadReturnWithoutUnit__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $width }, style)=>"input_ReadReturnWithoutUnit_m7uBBu" + (style["--input_ReadReturnWithoutUnit__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? /*#__PURE__*/ __yak_cssValue($width, "") : $width ? 1 : void 0 : void 0) ?? ($big ? 2 : 3), ""), "")), {
    "displayName": "ReadReturnWithoutUnit"
});
// a call without a unit, and a call after the block that runs only when the
// block ends without `return`
export const CallReturnWithoutUnit = /*YAK EXPORTED STYLED:CallReturnWithoutUnit:input_CallReturnWithoutUnit_m7uBBu*//*YAK Extracted CSS:
.input_CallReturnWithoutUnit_m7uBBu {
  width: var(--input_CallReturnWithoutUnit__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $size }, style)=>"input_CallReturnWithoutUnit_m7uBBu" + (style["--input_CallReturnWithoutUnit__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $size === "s" ? /*#__PURE__*/ __yak_cssValue(getWidth($size), "") : void 0 : void 0) ?? (log($size), 8), ""), "")), {
    "displayName": "CallReturnWithoutUnit"
});
// a minus before the value: the wrapped `$x` reaches `__yak_cssValue` as text,
// which adds the minus and the unit
export const MinusBeforeValue = /*YAK EXPORTED STYLED:MinusBeforeValue:input_MinusBeforeValue_m7uBBu*//*YAK Extracted CSS:
.input_MinusBeforeValue_m7uBBu {
  left: var(--input_MinusBeforeValue__left_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $x }, style)=>"input_MinusBeforeValue_m7uBBu" + (style["--input_MinusBeforeValue__left_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? /*#__PURE__*/ __yak_cssValue($x, "") : void 0 : void 0) ?? ($big ? 4 : 8), "px", true), "")), {
    "displayName": "MinusBeforeValue"
});
// two guard blocks in a row: `a ?? b ?? rest`
export const TwoGuardBlocks = /*YAK EXPORTED STYLED:TwoGuardBlocks:input_TwoGuardBlocks_m7uBBu*//*YAK Extracted CSS:
.input_TwoGuardBlocks_m7uBBu {
  width: var(--input_TwoGuardBlocks__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $a, $b, $w }, style)=>"input_TwoGuardBlocks_m7uBBu" + (style["--input_TwoGuardBlocks__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($a ? $b ? /*#__PURE__*/ __yak_cssValue($w, "") : void 0 : void 0) ?? ($b ? $a ? 2 : void 0 : void 0) ?? ($a ? 4 : 8), "px"), "")), {
    "displayName": "TwoGuardBlocks"
});
// a guard block inside a guard block: the inner `??` sits in the outer branch
export const GuardInGuard = /*YAK EXPORTED STYLED:GuardInGuard:input_GuardInGuard_m7uBBu*//*YAK Extracted CSS:
.input_GuardInGuard_m7uBBu {
  width: var(--input_GuardInGuard__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $a, $b, $c, $w }, style)=>"input_GuardInGuard_m7uBBu" + (style["--input_GuardInGuard__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($a ? ($b ? $c ? /*#__PURE__*/ __yak_cssValue($w, "") : void 0 : void 0) ?? ($c ? 1 : void 0) : void 0) ?? ($b ? 2 : 3), "px"), "")), {
    "displayName": "GuardInGuard"
});
// a `const` that names a prop read becomes the read inside the wrapper
export const ConstReadReturn = /*YAK EXPORTED STYLED:ConstReadReturn:input_ConstReadReturn_m7uBBu*//*YAK Extracted CSS:
.input_ConstReadReturn_m7uBBu {
  width: var(--input_ConstReadReturn__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $layout }, style)=>"input_ConstReadReturn_m7uBBu" + (style["--input_ConstReadReturn__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? /*#__PURE__*/ __yak_cssValue($layout.w, "") : void 0 : void 0) ?? ($big ? 4 : 8), "px"), "")), {
    "displayName": "ConstReadReturn"
});
// the last case of a `switch` ends with `break`
export const SwitchLastCaseBreak = /*YAK EXPORTED STYLED:SwitchLastCaseBreak:input_SwitchLastCaseBreak_m7uBBu*//*YAK Extracted CSS:
.input_SwitchLastCaseBreak_m7uBBu {
  width: var(--input_SwitchLastCaseBreak__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $size, $w, $on }, style)=>"input_SwitchLastCaseBreak_m7uBBu" + (style["--input_SwitchLastCaseBreak__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($size === "s" ? /*#__PURE__*/ __yak_cssValue($w, "") : $size === "m" ? (log($size), void 0) : void 0) ?? ($on ? 4 : 8), "px"), "")), {
    "displayName": "SwitchLastCaseBreak"
});
// a prop with a default value can still be `null`, so it gets a wrapper
export const DefaultProp = /*YAK EXPORTED STYLED:DefaultProp:input_DefaultProp_m7uBBu*//*YAK Extracted CSS:
.input_DefaultProp_m7uBBu {
  width: var(--input_DefaultProp__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $w }, style)=>"input_DefaultProp_m7uBBu" + (style["--input_DefaultProp__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? /*#__PURE__*/ __yak_cssValue($w === void 0 ? 16 : $w, "") : void 0 : void 0) ?? ($big ? 4 : 8), "px"), "")), {
    "displayName": "DefaultProp"
});
// a value in a nested `css` literal
export const NestedCssValue = /*YAK EXPORTED STYLED:NestedCssValue:input_NestedCssValue_m7uBBu*//*YAK Extracted CSS:
.input_NestedCssValue__\$on_m7uBBu {
  width: var(--input_NestedCssValue__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $w }, style)=>"input_NestedCssValue_m7uBBu" + ($on ? " input_NestedCssValue__$on_m7uBBu" + (style["--input_NestedCssValue__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($big ? $w ? /*#__PURE__*/ __yak_cssValue($w, "") : void 0 : void 0) ?? ($big ? 4 : 8), "px"), "") : "")), {
    "displayName": "NestedCssValue"
});
// a single `return` after the block is copied into the block, so there is no
// `??` and `$w` needs no wrapper
export const SingleReturnAfterBlock = /*YAK EXPORTED STYLED:SingleReturnAfterBlock:input_SingleReturnAfterBlock_m7uBBu*//*YAK Extracted CSS:
.input_SingleReturnAfterBlock_m7uBBu {
  width: var(--input_SingleReturnAfterBlock__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $w }, style)=>"input_SingleReturnAfterBlock_m7uBBu" + (style["--input_SingleReturnAfterBlock__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue($on ? $big ? $w : 8 : 8, "px"), "")), {
    "displayName": "SingleReturnAfterBlock"
});
