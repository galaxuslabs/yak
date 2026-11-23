import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { log } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X0d1YXJkQmxvY2tzX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAxcHg7Cn0KLmlucHV0X0d1YXJkQmxvY2tzX19fbTd1QkJ1LTAxIHsKICBwYWRkaW5nOiAxMnB4Owp9Ci5pbnB1dF9HdWFyZEJsb2Nrc19fX203dUJCdS0wMiB7CiAgcGFkZGluZzogNnB4Owp9Ci5pbnB1dF9HdWFyZEJsb2Nrc19fX203dUJCdS0wMyB7CiAgcGFkZGluZzogOXB4Owp9Ci5pbnB1dF9HdWFyZEJsb2Nrc19fX203dUJCdS0wNCB7CiAgcGFkZGluZzogMDsKfS5pbnB1dF9SZXR1cm5Ob3RoaW5nSW5HdWFyZF9fX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfUmV0dXJuTm90aGluZ0luR3VhcmRfX19tN3VCQnUtMDEgewogIGNvbG9yOiBibHVlOwp9LmlucHV0X0lmRWxzZVdpdGhPcGVuQnJhbmNoX19fbTd1QkJ1IHsKICBjb2xvcjogcmVkOwp9Ci5pbnB1dF9JZkVsc2VXaXRoT3BlbkJyYW5jaF9fX203dUJCdS0wMSB7CiAgY29sb3I6IGdyZWVuOwp9Ci5pbnB1dF9JZkVsc2VXaXRoT3BlbkJyYW5jaF9fX203dUJCdS0wMiB7CiAgY29sb3I6IGJsdWU7Cn0KLmlucHV0X0lmRWxzZVdpdGhPcGVuQnJhbmNoX19fbTd1QkJ1LTAzIHsKICBjb2xvcjogYmxhY2s7Cn0uaW5wdXRfUGxhaW5CbG9ja19fX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfUGxhaW5CbG9ja19fX203dUJCdS0wMSB7CiAgY29sb3I6IGJsdWU7Cn0KLmlucHV0X1BsYWluQmxvY2tfX19tN3VCQnUtMDIgewogIGNvbG9yOiBibGFjazsKfS5pbnB1dF9Td2l0Y2hEZWZhdWx0VGhlblN0YXRlbWVudHNfX19tN3VCQnUgewogIHBhZGRpbmc6IDJweDsKfQouaW5wdXRfU3dpdGNoRGVmYXVsdFRoZW5TdGF0ZW1lbnRzX19fbTd1QkJ1LTAxIHsKICBwYWRkaW5nOiA0cHg7Cn0KLmlucHV0X1N3aXRjaERlZmF1bHRUaGVuU3RhdGVtZW50c19fX203dUJCdS0wMiB7CiAgcGFkZGluZzogOHB4Owp9LmlucHV0X1N3aXRjaExhc3RDYXNlVGhlblN0YXRlbWVudHNfX19tN3VCQnUgewogIHBhZGRpbmc6IDJweDsKfQouaW5wdXRfU3dpdGNoTGFzdENhc2VUaGVuU3RhdGVtZW50c19fX203dUJCdS0wMSB7CiAgcGFkZGluZzogNHB4Owp9Ci5pbnB1dF9Td2l0Y2hMYXN0Q2FzZVRoZW5TdGF0ZW1lbnRzX19fbTd1QkJ1LTAyIHsKICBwYWRkaW5nOiA2cHg7Cn0KLmlucHV0X1N3aXRjaExhc3RDYXNlVGhlblN0YXRlbWVudHNfX19tN3VCQnUtMDMgewogIHBhZGRpbmc6IDhweDsKfS5pbnB1dF9UaHJlZUxldmVsc19fX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfVGhyZWVMZXZlbHNfX19tN3VCQnUtMDEgewogIGNvbG9yOiBncmVlbjsKfQouaW5wdXRfVGhyZWVMZXZlbHNfX19tN3VCQnUtMDIgewogIGNvbG9yOiBibHVlOwp9Ci5pbnB1dF9UaHJlZUxldmVsc19fX203dUJCdS0wMyB7CiAgY29sb3I6IGJsYWNrOwp9LmlucHV0X0NhbGxJbkd1YXJkX19fbTd1QkJ1IHsKICBjb2xvcjogcmVkOwp9Ci5pbnB1dF9DYWxsSW5HdWFyZF9fX203dUJCdS0wMSB7CiAgY29sb3I6IGJsdWU7Cn0uaW5wdXRfQ29uc3RJbkd1YXJkX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0KLmlucHV0X0NvbnN0SW5HdWFyZF9fX203dUJCdS0wMSB7CiAgcGFkZGluZzogNHB4Owp9Ci5pbnB1dF9Db25zdEluR3VhcmRfX19tN3VCQnUtMDIgewogIHBhZGRpbmc6IDhweDsKfS5pbnB1dF9Db25kaXRpb25hbFZhbHVlc19fXCRjX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfQ29uZGl0aW9uYWxWYWx1ZXNfX1wkYl9tN3VCQnUgewogIGNvbG9yOiBncmVlbjsKfQouaW5wdXRfQ29uZGl0aW9uYWxWYWx1ZXNfX25vdF9cJGNfbTd1QkJ1IHsKICBjb2xvcjogYmx1ZTsKfQouaW5wdXRfQ29uZGl0aW9uYWxWYWx1ZXNfX19tN3VCQnUgewogIGNvbG9yOiBibGFjazsKfQouaW5wdXRfQ29uZGl0aW9uYWxWYWx1ZXNfX19tN3VCQnUtMDEgewogIGZvbnQtd2VpZ2h0OiBib2xkOwp9Ci5pbnB1dF9Db25kaXRpb25hbFZhbHVlc19fX203dUJCdS0wMiB7CiAgbWFyZ2luOiAwOwp9Ci5pbnB1dF9Db25kaXRpb25hbFZhbHVlc19fX203dUJCdS0wMyB7CiAgbWFyZ2luOiAycHg7Cn0KLmlucHV0X0NvbmRpdGlvbmFsVmFsdWVzX19fbTd1QkJ1LTA0IHsKICBtYXJnaW46IDRweDsKfS5pbnB1dF9OZXN0ZWRGdW5jdGlvbl9fX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfTmVzdGVkRnVuY3Rpb25fX19tN3VCQnUtMDEgewogIHBhZGRpbmc6IDRweDsKfQouaW5wdXRfTmVzdGVkRnVuY3Rpb25fX19tN3VCQnUtMDIgewogIHBhZGRpbmc6IDFweDsKfQouaW5wdXRfTmVzdGVkRnVuY3Rpb25fX19tN3VCQnUtMDMgewogIHBhZGRpbmc6IDA7Cn0KLmlucHV0X05lc3RlZEZ1bmN0aW9uX19fbTd1QkJ1LTA0IHsKICBjb2xvcjogYmx1ZTsKfQouaW5wdXRfTmVzdGVkRnVuY3Rpb25fX19tN3VCQnUtMDUgewogIGNvbG9yOiBibGFjazsKfS5pbnB1dF9HdWFyZEJsb2NrQXRUaGVFbmRfX19tN3VCQnUgewogIGNvbG9yOiByZWQ7Cn0uaW5wdXRfQ3NzVmFsdWVQb3NpdGlvbl9tN3VCQnUgewogIHdpZHRoOiB2YXIoLS1pbnB1dF9Dc3NWYWx1ZVBvc2l0aW9uX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X1JldHVyblZvaWRaZXJvSW5HdWFyZF9fX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfUmV0dXJuVm9pZFplcm9Jbkd1YXJkX19fbTd1QkJ1LTAxIHsKICBjb2xvcjogYmx1ZTsKfS5pbnB1dF9Vc2VyTnVsbGlzaF9fX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfVXNlck51bGxpc2hfX19tN3VCQnUtMDEgewogIGNvbG9yOiBibHVlOwp9Ci5pbnB1dF9Vc2VyTnVsbGlzaF9fX203dUJCdS0wMiB7CiAgY29sb3I6IGJsYWNrOwp9LmlucHV0X0JyZWFrSW5zaWRlSWZfX19tN3VCQnUgewogIHBhZGRpbmc6IDJweDsKfQouaW5wdXRfQnJlYWtJbnNpZGVJZl9fX203dUJCdS0wMSB7CiAgcGFkZGluZzogNHB4Owp9Ci5pbnB1dF9CcmVha0luc2lkZUlmX19fbTd1QkJ1LTAyIHsKICBwYWRkaW5nOiA2cHg7Cn0KLmlucHV0X0JyZWFrSW5zaWRlSWZfX19tN3VCQnUtMDMgewogIHBhZGRpbmc6IDhweDsKfQ==";
type Size = "s" | "m" | "l";
type Layout = {
    large?: {
        size: Size;
    };
};
// a path that leaves a guard block goes on with the next statement
export const GuardBlocks = /*YAK EXPORTED STYLED:GuardBlocks:input_GuardBlocks_m7uBBu*//*YAK Extracted CSS:
.input_GuardBlocks___m7uBBu {
  padding: 1px;
}
.input_GuardBlocks___m7uBBu-01 {
  padding: 12px;
}
.input_GuardBlocks___m7uBBu-02 {
  padding: 6px;
}
.input_GuardBlocks___m7uBBu-03 {
  padding: 9px;
}
.input_GuardBlocks___m7uBBu-04 {
  padding: 0;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_GuardBlocks_m7uBBu", 0, ({ $layout, $n })=>"input_GuardBlocks_m7uBBu" + ($layout.large?.size === "s" ? " input_GuardBlocks___m7uBBu" : ($layout.large?.size === "l" ? $n >= 12 ? " input_GuardBlocks___m7uBBu-01" : $n >= 6 ? " input_GuardBlocks___m7uBBu-02" : void 0 : void 0) ?? ($layout.large?.size === "m" ? $n >= 9 ? " input_GuardBlocks___m7uBBu-03" : " input_GuardBlocks___m7uBBu-04" : " input_GuardBlocks___m7uBBu-04"))), {
    "displayName": "GuardBlocks"
});
// `return;` and `return null;` end the function and add nothing
export const ReturnNothingInGuard = /*YAK EXPORTED STYLED:ReturnNothingInGuard:input_ReturnNothingInGuard_m7uBBu*//*YAK Extracted CSS:
.input_ReturnNothingInGuard___m7uBBu {
  color: red;
}
.input_ReturnNothingInGuard___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReturnNothingInGuard_m7uBBu", 0, ({ $on, $big, $wide })=>"input_ReturnNothingInGuard_m7uBBu" + (($on ? $big ? "" : $wide ? "" : void 0 : void 0) ?? ($big ? " input_ReturnNothingInGuard___m7uBBu" : " input_ReturnNothingInGuard___m7uBBu-01"))), {
    "displayName": "ReturnNothingInGuard"
});
export const IfElseWithOpenBranch = /*YAK EXPORTED STYLED:IfElseWithOpenBranch:input_IfElseWithOpenBranch_m7uBBu*//*YAK Extracted CSS:
.input_IfElseWithOpenBranch___m7uBBu {
  color: red;
}
.input_IfElseWithOpenBranch___m7uBBu-01 {
  color: green;
}
.input_IfElseWithOpenBranch___m7uBBu-02 {
  color: blue;
}
.input_IfElseWithOpenBranch___m7uBBu-03 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_IfElseWithOpenBranch_m7uBBu", 0, ({ $a, $b, $c })=>"input_IfElseWithOpenBranch_m7uBBu" + (($a ? $b ? " input_IfElseWithOpenBranch___m7uBBu" : void 0 : " input_IfElseWithOpenBranch___m7uBBu-01") ?? ($c ? " input_IfElseWithOpenBranch___m7uBBu-02" : " input_IfElseWithOpenBranch___m7uBBu-03"))), {
    "displayName": "IfElseWithOpenBranch"
});
export const PlainBlock = /*YAK EXPORTED STYLED:PlainBlock:input_PlainBlock_m7uBBu*//*YAK Extracted CSS:
.input_PlainBlock___m7uBBu {
  color: red;
}
.input_PlainBlock___m7uBBu-01 {
  color: blue;
}
.input_PlainBlock___m7uBBu-02 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_PlainBlock_m7uBBu", 0, ({ $a, $b })=>"input_PlainBlock_m7uBBu" + (($a ? " input_PlainBlock___m7uBBu" : void 0) ?? ($b ? " input_PlainBlock___m7uBBu-01" : " input_PlainBlock___m7uBBu-02"))), {
    "displayName": "PlainBlock"
});
export const SwitchDefaultThenStatements = /*YAK EXPORTED STYLED:SwitchDefaultThenStatements:input_SwitchDefaultThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_SwitchDefaultThenStatements___m7uBBu {
  padding: 2px;
}
.input_SwitchDefaultThenStatements___m7uBBu-01 {
  padding: 4px;
}
.input_SwitchDefaultThenStatements___m7uBBu-02 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SwitchDefaultThenStatements_m7uBBu", 0, ({ $size, $on })=>"input_SwitchDefaultThenStatements_m7uBBu" + (($size === "s" ? " input_SwitchDefaultThenStatements___m7uBBu" : (log($size), void 0)) ?? ($on ? " input_SwitchDefaultThenStatements___m7uBBu-01" : " input_SwitchDefaultThenStatements___m7uBBu-02"))), {
    "displayName": "SwitchDefaultThenStatements"
});
export const SwitchLastCaseThenStatements = /*YAK EXPORTED STYLED:SwitchLastCaseThenStatements:input_SwitchLastCaseThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_SwitchLastCaseThenStatements___m7uBBu {
  padding: 2px;
}
.input_SwitchLastCaseThenStatements___m7uBBu-01 {
  padding: 4px;
}
.input_SwitchLastCaseThenStatements___m7uBBu-02 {
  padding: 6px;
}
.input_SwitchLastCaseThenStatements___m7uBBu-03 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_SwitchLastCaseThenStatements_m7uBBu", 0, ({ $size, $on })=>"input_SwitchLastCaseThenStatements_m7uBBu" + (($size === "s" ? " input_SwitchLastCaseThenStatements___m7uBBu" : $size === "m" ? $on ? " input_SwitchLastCaseThenStatements___m7uBBu-01" : void 0 : void 0) ?? ($on ? " input_SwitchLastCaseThenStatements___m7uBBu-02" : " input_SwitchLastCaseThenStatements___m7uBBu-03"))), {
    "displayName": "SwitchLastCaseThenStatements"
});
export const ThreeLevels = /*YAK EXPORTED STYLED:ThreeLevels:input_ThreeLevels_m7uBBu*//*YAK Extracted CSS:
.input_ThreeLevels___m7uBBu {
  color: red;
}
.input_ThreeLevels___m7uBBu-01 {
  color: green;
}
.input_ThreeLevels___m7uBBu-02 {
  color: blue;
}
.input_ThreeLevels___m7uBBu-03 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ThreeLevels_m7uBBu", 0, ({ $a, $b, $c, $d })=>"input_ThreeLevels_m7uBBu" + (($a ? ($b ? $c ? " input_ThreeLevels___m7uBBu" : (log($c), void 0) : void 0) ?? ($d ? " input_ThreeLevels___m7uBBu-01" : void 0) : void 0) ?? ($c ? " input_ThreeLevels___m7uBBu-02" : " input_ThreeLevels___m7uBBu-03"))), {
    "displayName": "ThreeLevels"
});
export const CallInGuard = /*YAK EXPORTED STYLED:CallInGuard:input_CallInGuard_m7uBBu*//*YAK Extracted CSS:
.input_CallInGuard___m7uBBu {
  color: red;
}
.input_CallInGuard___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CallInGuard_m7uBBu", 0, ({ $on, $a, $b })=>"input_CallInGuard_m7uBBu" + (($on ? (log($a), void 0) : void 0) ?? ($b ? " input_CallInGuard___m7uBBu" : " input_CallInGuard___m7uBBu-01"))), {
    "displayName": "CallInGuard"
});
export const ConstInGuard = /*YAK EXPORTED STYLED:ConstInGuard:input_ConstInGuard_m7uBBu*//*YAK Extracted CSS:
.input_ConstInGuard___m7uBBu {
  padding: 2px;
}
.input_ConstInGuard___m7uBBu-01 {
  padding: 4px;
}
.input_ConstInGuard___m7uBBu-02 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ConstInGuard_m7uBBu", 0, ({ $on, $layout })=>"input_ConstInGuard_m7uBBu" + (($on ? $layout.large?.size === "s" ? " input_ConstInGuard___m7uBBu" : void 0 : void 0) ?? (!$on ? " input_ConstInGuard___m7uBBu-01" : " input_ConstInGuard___m7uBBu-02"))), {
    "displayName": "ConstInGuard"
});
// the conditions of the returned values keep their parens next to `??`
export const ConditionalValues = /*YAK EXPORTED STYLED:ConditionalValues:input_ConditionalValues_m7uBBu*//*YAK Extracted CSS:
.input_ConditionalValues__\$c_m7uBBu {
  color: red;
}
.input_ConditionalValues__\$b_m7uBBu {
  color: green;
}
.input_ConditionalValues__not_\$c_m7uBBu {
  color: blue;
}
.input_ConditionalValues___m7uBBu {
  color: black;
}
.input_ConditionalValues___m7uBBu-01 {
  font-weight: bold;
}
.input_ConditionalValues___m7uBBu-02 {
  margin: 0;
}
.input_ConditionalValues___m7uBBu-03 {
  margin: 2px;
}
.input_ConditionalValues___m7uBBu-04 {
  margin: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ConditionalValues_m7uBBu", 0, ({ $a, $b, $c })=>"input_ConditionalValues_m7uBBu" + (($a ? $b ? $c ? " input_ConditionalValues__$c_m7uBBu" : "" : $c ? $b ? " input_ConditionalValues__$b_m7uBBu" : "" : void 0 : void 0) ?? ($b ? $c ? "" : " input_ConditionalValues__not_$c_m7uBBu" : " input_ConditionalValues___m7uBBu" + ($c ? " input_ConditionalValues___m7uBBu-01" : ""))) + (($a ? $b ? " input_ConditionalValues___m7uBBu-02" : void 0 : void 0) ?? ($b ? " input_ConditionalValues___m7uBBu-03" : " input_ConditionalValues___m7uBBu-04"))), {
    "displayName": "ConditionalValues"
});
// a nested function has fall through markers of its own
export const NestedFunction = /*YAK EXPORTED STYLED:NestedFunction:input_NestedFunction_m7uBBu*//*YAK Extracted CSS:
.input_NestedFunction___m7uBBu {
  color: red;
}
.input_NestedFunction___m7uBBu-01 {
  padding: 4px;
}
.input_NestedFunction___m7uBBu-02 {
  padding: 1px;
}
.input_NestedFunction___m7uBBu-03 {
  padding: 0;
}
.input_NestedFunction___m7uBBu-04 {
  color: blue;
}
.input_NestedFunction___m7uBBu-05 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NestedFunction_m7uBBu", 0, ({ $on, $size, $n })=>"input_NestedFunction_m7uBBu" + (($on ? $size === "s" ? " input_NestedFunction___m7uBBu" + (($n > 2 ? $n > 4 ? " input_NestedFunction___m7uBBu-01" : void 0 : void 0) ?? ($n > 1 ? " input_NestedFunction___m7uBBu-02" : " input_NestedFunction___m7uBBu-03")) : void 0 : void 0) ?? ($size === "m" ? " input_NestedFunction___m7uBBu-04" : " input_NestedFunction___m7uBBu-05"))), {
    "displayName": "NestedFunction"
});
// a guard block at the end of the function adds nothing when no `return` runs
export const GuardBlockAtTheEnd = /*YAK EXPORTED STYLED:GuardBlockAtTheEnd:input_GuardBlockAtTheEnd_m7uBBu*//*YAK Extracted CSS:
.input_GuardBlockAtTheEnd___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_GuardBlockAtTheEnd_m7uBBu", 0, ({ $on, $big })=>"input_GuardBlockAtTheEnd_m7uBBu" + ($on ? $big ? " input_GuardBlockAtTheEnd___m7uBBu" : "" : "")), {
    "displayName": "GuardBlockAtTheEnd"
});
// stays unfolded: at a CSS value position, `null` is a value that a `??`
// would skip
export const CssValuePosition = /*YAK EXPORTED STYLED:CssValuePosition:input_CssValuePosition_m7uBBu*//*YAK Extracted CSS:
.input_CssValuePosition_m7uBBu {
  width: var(--input_CssValuePosition__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CssValuePosition_m7uBBu", {
    "--input_CssValuePosition__width_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $a, $b })=>{
        if ($a) {
            if ($b) return 2;
        }
        if ($b) return 4;
        return 8;
    }, "px")
}), {
    "displayName": "CssValuePosition"
});
// stays unfolded: `return void 0;` is no value the fold knows
export const ReturnVoidZeroInGuard = /*YAK EXPORTED STYLED:ReturnVoidZeroInGuard:input_ReturnVoidZeroInGuard_m7uBBu*//*YAK Extracted CSS:
.input_ReturnVoidZeroInGuard___m7uBBu {
  color: red;
}
.input_ReturnVoidZeroInGuard___m7uBBu-01 {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReturnVoidZeroInGuard_m7uBBu", ({ $on, $big })=>{
    if ($on) {
        if ($big) return void 0;
    }
    if ($big) return /*#__PURE__*/ css("input_ReturnVoidZeroInGuard___m7uBBu");
    return /*#__PURE__*/ css("input_ReturnVoidZeroInGuard___m7uBBu-01");
}), {
    "displayName": "ReturnVoidZeroInGuard"
});
// stays unfolded: a `??` that the user writes
export const UserNullish = /*YAK EXPORTED STYLED:UserNullish:input_UserNullish_m7uBBu*//*YAK Extracted CSS:
.input_UserNullish___m7uBBu {
  color: red;
}
.input_UserNullish___m7uBBu-01 {
  color: blue;
}
.input_UserNullish___m7uBBu-02 {
  color: black;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_UserNullish_m7uBBu", ({ $on })=>{
    if ($on) return /*#__PURE__*/ css("input_UserNullish___m7uBBu") ?? /*#__PURE__*/ css("input_UserNullish___m7uBBu-01");
    return /*#__PURE__*/ css("input_UserNullish___m7uBBu-02");
}), {
    "displayName": "UserNullish"
});
// stays unfolded: a `break` inside an `if` of the last case
export const BreakInsideIf = /*YAK EXPORTED STYLED:BreakInsideIf:input_BreakInsideIf_m7uBBu*//*YAK Extracted CSS:
.input_BreakInsideIf___m7uBBu {
  padding: 2px;
}
.input_BreakInsideIf___m7uBBu-01 {
  padding: 4px;
}
.input_BreakInsideIf___m7uBBu-02 {
  padding: 6px;
}
.input_BreakInsideIf___m7uBBu-03 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_BreakInsideIf_m7uBBu", ({ $size, $on })=>{
    switch($size){
        case "s":
            return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu");
        default:
            if ($on) break;
            return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu-01");
    }
    if ($on) return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu-02");
    return /*#__PURE__*/ css("input_BreakInsideIf___m7uBBu-03");
}), {
    "displayName": "BreakInsideIf"
});
