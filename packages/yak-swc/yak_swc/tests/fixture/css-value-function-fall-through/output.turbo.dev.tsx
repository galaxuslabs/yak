import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { log, getWidth } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X051bWJlclJldHVybnNfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfTnVtYmVyUmV0dXJuc19fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9OZXZlck51bGxpc2hTaGFwZXNfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfTmV2ZXJOdWxsaXNoU2hhcGVzX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X1N3aXRjaExhc3RDYXNlVGhlblN0YXRlbWVudHNfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfU3dpdGNoTGFzdENhc2VUaGVuU3RhdGVtZW50c19fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9SZWFkUmV0dXJuX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X1JlYWRSZXR1cm5fX3dpZHRoX203dUJCdSk7Cn0uaW5wdXRfQW5kUmV0dXJuX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X0FuZFJldHVybl9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9DYWxsUmV0dXJuSW5Td2l0Y2hfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfQ2FsbFJldHVybkluU3dpdGNoX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X0VtcHR5UmV0dXJuX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X0VtcHR5UmV0dXJuX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X051bGxJbkVsc2VfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfTnVsbEluRWxzZV9fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9OZXh0VG9DbGFzc05hbWVzX19cJG9uX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfTmV4dFRvQ2xhc3NOYW1lc19tN3VCQnUgewogIGhlaWdodDogdmFyKC0taW5wdXRfTmV4dFRvQ2xhc3NOYW1lc19faGVpZ2h0X203dUJCdSk7Cn0=";
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
// stays unfolded: `$width` can be `undefined`
export const ReadReturn = /*YAK EXPORTED STYLED:ReadReturn:input_ReadReturn_m7uBBu*//*YAK Extracted CSS:
.input_ReadReturn_m7uBBu {
  width: var(--input_ReadReturn__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReadReturn_m7uBBu", {
    "--input_ReadReturn__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $on, $big, $width })=>{
        if ($on) {
            if ($big) return $width;
        }
        if ($big) return 4;
        return 8;
    }, "px")
}), {
    "displayName": "ReadReturn"
});
// stays unfolded: `$a && 1` returns `$a` when it is falsy, e.g. `null`
export const AndReturn = /*YAK EXPORTED STYLED:AndReturn:input_AndReturn_m7uBBu*//*YAK Extracted CSS:
.input_AndReturn_m7uBBu {
  width: var(--input_AndReturn__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_AndReturn_m7uBBu", {
    "--input_AndReturn__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $on, $a })=>{
        if ($on) {
            if ($a) return $a && 1;
        }
        if ($a) return 4;
        return 8;
    }, "px")
}), {
    "displayName": "AndReturn"
});
// stays unfolded: a call can return anything, also in a nested `switch`
export const CallReturnInSwitch = /*YAK EXPORTED STYLED:CallReturnInSwitch:input_CallReturnInSwitch_m7uBBu*//*YAK Extracted CSS:
.input_CallReturnInSwitch_m7uBBu {
  width: var(--input_CallReturnInSwitch__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CallReturnInSwitch_m7uBBu", {
    "--input_CallReturnInSwitch__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $on, $size })=>{
        if ($on) {
            switch($size){
                case "s":
                    return getWidth($size);
                case "m":
                    return 2;
            }
        }
        if ($size === "l") return 4;
        return 8;
    }, "px")
}), {
    "displayName": "CallReturnInSwitch"
});
// stays unfolded: `return;` is `undefined`
export const EmptyReturn = /*YAK EXPORTED STYLED:EmptyReturn:input_EmptyReturn_m7uBBu*//*YAK Extracted CSS:
.input_EmptyReturn_m7uBBu {
  width: var(--input_EmptyReturn__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_EmptyReturn_m7uBBu", {
    "--input_EmptyReturn__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $on, $big })=>{
        if ($on) {
            if ($big) return;
        }
        if ($big) return 4;
        return 8;
    }, "px")
}), {
    "displayName": "EmptyReturn"
});
// stays unfolded: a `null` in the `else` of the branch
export const NullInElse = /*YAK EXPORTED STYLED:NullInElse:input_NullInElse_m7uBBu*//*YAK Extracted CSS:
.input_NullInElse_m7uBBu {
  width: var(--input_NullInElse__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NullInElse_m7uBBu", {
    "--input_NullInElse__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $on, $big })=>{
        if ($on) {
            if ($big) return 2;
        } else {
            return null;
        }
        if ($big) return 4;
        return 8;
    }, "px")
}), {
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
