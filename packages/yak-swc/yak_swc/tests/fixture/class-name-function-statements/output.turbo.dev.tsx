import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { assertNever, log, getLogger } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X1N3aXRjaEFzc2VydE5ldmVyX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0KLmlucHV0X1N3aXRjaEFzc2VydE5ldmVyX19fbTd1QkJ1LTAxIHsKICBwYWRkaW5nOiA0cHg7Cn0uaW5wdXRfU3dpdGNoQXNzZXJ0TmV2ZXJCcmVha19fX203dUJCdSB7CiAgcGFkZGluZzogMnB4Owp9LmlucHV0X1N3aXRjaFNhdGlzZmllc05ldmVyX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0KLmlucHV0X1N3aXRjaFNhdGlzZmllc05ldmVyX19fbTd1QkJ1LTAxIHsKICBwYWRkaW5nOiA0cHg7Cn0uaW5wdXRfU3dpdGNoUmVuYW1lZERlZmF1bHRfX19tN3VCQnUgewogIHBhZGRpbmc6IDJweDsKfQouaW5wdXRfU3dpdGNoUmVuYW1lZERlZmF1bHRfX19tN3VCQnUtMDEgewogIHBhZGRpbmc6IDRweDsKfS5pbnB1dF9Td2l0Y2hNZW1iZXJSZWFkX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0KLmlucHV0X1N3aXRjaE1lbWJlclJlYWRfX19tN3VCQnUtMDEgewogIHBhZGRpbmc6IDRweDsKfS5pbnB1dF9DYXNlTG9nQmVmb3JlUmV0dXJuX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0KLmlucHV0X0Nhc2VMb2dCZWZvcmVSZXR1cm5fX19tN3VCQnUtMDEgewogIHBhZGRpbmc6IDRweDsKfS5pbnB1dF9MYXN0Q2FzZVdpdGhvdXRSZXR1cm5fX19tN3VCQnUgewogIHBhZGRpbmc6IDJweDsKfQouaW5wdXRfTGFzdENhc2VXaXRob3V0UmV0dXJuX19fbTd1QkJ1LTAxIHsKICBwYWRkaW5nOiA4cHg7Cn0uaW5wdXRfRGVmYXVsdFdpdGhvdXRSZXR1cm5UaGVuUmV0dXJuX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0KLmlucHV0X0RlZmF1bHRXaXRob3V0UmV0dXJuVGhlblJldHVybl9fX203dUJCdS0wMSB7CiAgcGFkZGluZzogOHB4Owp9LmlucHV0X0xvZ0JlZm9yZUlmX19fbTd1QkJ1IHsKICBjb2xvcjogcmVkOwp9LmlucHV0X1N0YXRlbWVudHNCZWZvcmVSZXR1cm5fX19tN3VCQnUgewogIGNvbG9yOiByZWQ7Cn0uaW5wdXRfSWZXaXRob3V0UmV0dXJuX19fbTd1QkJ1IHsKICBjb2xvcjogcmVkOwp9LmlucHV0X1N0YXRlbWVudEF0RW5kX19fbTd1QkJ1IHsKICBjb2xvcjogcmVkOwp9LmlucHV0X0Nzc1ZhcmlhYmxlX203dUJCdSB7CiAgd2lkdGg6IHZhcigtLWlucHV0X0Nzc1ZhcmlhYmxlX193aWR0aF9tN3VCQnUpOwp9LmlucHV0X1JldHVybkFzc2VydE5ldmVyX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0uaW5wdXRfRmFsbFRocm91Z2hBZnRlclN0YXRlbWVudF9fX203dUJCdSB7CiAgcGFkZGluZzogNHB4Owp9LmlucHV0X0JyZWFrQmVmb3JlTGFzdENhc2VfX19tN3VCQnUgewogIHBhZGRpbmc6IDRweDsKfS5pbnB1dF9MYXN0Q2FzZVRoZW5TdGF0ZW1lbnRzX19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0KLmlucHV0X0xhc3RDYXNlVGhlblN0YXRlbWVudHNfbTd1QkJ1IHsKICB3aWR0aDogdmFyKC0taW5wdXRfTGFzdENhc2VUaGVuU3RhdGVtZW50c19fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9JZldpdGhvdXRSZXR1cm5UaGVuU3RhdGVtZW50c19tN3VCQnUgewogIHdpZHRoOiB2YXIoLS1pbnB1dF9JZldpdGhvdXRSZXR1cm5UaGVuU3RhdGVtZW50c19fd2lkdGhfbTd1QkJ1KTsKfS5pbnB1dF9TdGF0ZW1lbnRBZnRlclJldHVybl9fXCRvbl9tN3VCQnUgewogIGNvbG9yOiByZWQ7Cn0uaW5wdXRfQXNzaWduUHJvcF9fX203dUJCdSB7CiAgcGFkZGluZzogMnB4Owp9LmlucHV0X1VwZGF0ZVByb3BfX19tN3VCQnUgewogIHBhZGRpbmc6IDJweDsKfS5pbnB1dF9Bc3NpZ25JbkFyZ3VtZW50X19fbTd1QkJ1IHsKICBwYWRkaW5nOiAycHg7Cn0uaW5wdXRfTWV0aG9kT25Qcm9wc19fcF9cJG9uX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfS5pbnB1dF9DYWxsT25DYWxsX19cJG9uX203dUJCdSB7CiAgY29sb3I6IHJlZDsKfQ==";
type Size = "s" | "m";
export const SwitchAssertNever = /*YAK EXPORTED STYLED:SwitchAssertNever:input_SwitchAssertNever_m7uBBu*//*YAK Extracted CSS:
.input_SwitchAssertNever___m7uBBu {
  padding: 2px;
}
.input_SwitchAssertNever___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_SwitchAssertNever_m7uBBu" + ($size === "s" ? " input_SwitchAssertNever___m7uBBu" : $size === "m" ? " input_SwitchAssertNever___m7uBBu-01" : (assertNever($size), ""))), {
    "displayName": "SwitchAssertNever"
});
export const SwitchAssertNeverBreak = /*YAK EXPORTED STYLED:SwitchAssertNeverBreak:input_SwitchAssertNeverBreak_m7uBBu*//*YAK Extracted CSS:
.input_SwitchAssertNeverBreak___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_SwitchAssertNeverBreak_m7uBBu" + ($size === "s" ? " input_SwitchAssertNeverBreak___m7uBBu" : (assertNever($size), ""))), {
    "displayName": "SwitchAssertNeverBreak"
});
export const SwitchSatisfiesNever = /*YAK EXPORTED STYLED:SwitchSatisfiesNever:input_SwitchSatisfiesNever_m7uBBu*//*YAK Extracted CSS:
.input_SwitchSatisfiesNever___m7uBBu {
  padding: 2px;
}
.input_SwitchSatisfiesNever___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_SwitchSatisfiesNever_m7uBBu" + ($size === "s" ? " input_SwitchSatisfiesNever___m7uBBu" : $size === "m" ? " input_SwitchSatisfiesNever___m7uBBu-01" : ($size, ""))), {
    "displayName": "SwitchSatisfiesNever"
});
export const SwitchRenamedDefault = /*YAK EXPORTED STYLED:SwitchRenamedDefault:input_SwitchRenamedDefault_m7uBBu*//*YAK Extracted CSS:
.input_SwitchRenamedDefault___m7uBBu {
  padding: 2px;
}
.input_SwitchRenamedDefault___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_SwitchRenamedDefault_m7uBBu" + (($size === void 0 ? "m" : $size) === "s" ? " input_SwitchRenamedDefault___m7uBBu" : ($size === void 0 ? "m" : $size) === "m" ? " input_SwitchRenamedDefault___m7uBBu-01" : (assertNever($size === void 0 ? "m" : $size), ""))), {
    "displayName": "SwitchRenamedDefault"
});
export const SwitchMemberRead = /*YAK EXPORTED STYLED:SwitchMemberRead:input_SwitchMemberRead_m7uBBu*//*YAK Extracted CSS:
.input_SwitchMemberRead___m7uBBu {
  padding: 2px;
}
.input_SwitchMemberRead___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_SwitchMemberRead_m7uBBu" + ($size === "s" ? " input_SwitchMemberRead___m7uBBu" : $size === "m" ? " input_SwitchMemberRead___m7uBBu-01" : (console.log($size), ""))), {
    "displayName": "SwitchMemberRead"
});
export const CaseLogBeforeReturn = /*YAK EXPORTED STYLED:CaseLogBeforeReturn:input_CaseLogBeforeReturn_m7uBBu*//*YAK Extracted CSS:
.input_CaseLogBeforeReturn___m7uBBu {
  padding: 2px;
}
.input_CaseLogBeforeReturn___m7uBBu-01 {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_CaseLogBeforeReturn_m7uBBu" + ($size === "s" ? (log($size), " input_CaseLogBeforeReturn___m7uBBu") : " input_CaseLogBeforeReturn___m7uBBu-01")), {
    "displayName": "CaseLogBeforeReturn"
});
// the last case runs out of the `switch` into the `return` after it
export const LastCaseWithoutReturn = /*YAK EXPORTED STYLED:LastCaseWithoutReturn:input_LastCaseWithoutReturn_m7uBBu*//*YAK Extracted CSS:
.input_LastCaseWithoutReturn___m7uBBu {
  padding: 2px;
}
.input_LastCaseWithoutReturn___m7uBBu-01 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_LastCaseWithoutReturn_m7uBBu" + ($size === "s" ? " input_LastCaseWithoutReturn___m7uBBu" : $size === "m" ? (log($size), " input_LastCaseWithoutReturn___m7uBBu-01") : " input_LastCaseWithoutReturn___m7uBBu-01")), {
    "displayName": "LastCaseWithoutReturn"
});
export const DefaultWithoutReturnThenReturn = /*YAK EXPORTED STYLED:DefaultWithoutReturnThenReturn:input_DefaultWithoutReturnThenReturn_m7uBBu*//*YAK Extracted CSS:
.input_DefaultWithoutReturnThenReturn___m7uBBu {
  padding: 2px;
}
.input_DefaultWithoutReturnThenReturn___m7uBBu-01 {
  padding: 8px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $size })=>"input_DefaultWithoutReturnThenReturn_m7uBBu" + ($size === "s" ? " input_DefaultWithoutReturnThenReturn___m7uBBu" : (log($size), " input_DefaultWithoutReturnThenReturn___m7uBBu-01"))), {
    "displayName": "DefaultWithoutReturnThenReturn"
});
export const LogBeforeIf = /*YAK EXPORTED STYLED:LogBeforeIf:input_LogBeforeIf_m7uBBu*//*YAK Extracted CSS:
.input_LogBeforeIf___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"input_LogBeforeIf_m7uBBu" + (console.log($on), $on ? " input_LogBeforeIf___m7uBBu" : "")), {
    "displayName": "LogBeforeIf"
});
export const StatementsBeforeReturn = /*YAK EXPORTED STYLED:StatementsBeforeReturn:input_StatementsBeforeReturn_m7uBBu*//*YAK Extracted CSS:
.input_StatementsBeforeReturn___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on, $a, $b })=>"input_StatementsBeforeReturn_m7uBBu" + ($on ? (log($a), log($b), " input_StatementsBeforeReturn___m7uBBu") : "")), {
    "displayName": "StatementsBeforeReturn"
});
export const IfWithoutReturn = /*YAK EXPORTED STYLED:IfWithoutReturn:input_IfWithoutReturn_m7uBBu*//*YAK Extracted CSS:
.input_IfWithoutReturn___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"input_IfWithoutReturn_m7uBBu" + ($on ? (log($on), " input_IfWithoutReturn___m7uBBu") : " input_IfWithoutReturn___m7uBBu")), {
    "displayName": "IfWithoutReturn"
});
export const StatementAtEnd = /*YAK EXPORTED STYLED:StatementAtEnd:input_StatementAtEnd_m7uBBu*//*YAK Extracted CSS:
.input_StatementAtEnd___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $on })=>"input_StatementAtEnd_m7uBBu" + ($on ? " input_StatementAtEnd___m7uBBu" : (log($on), ""))), {
    "displayName": "StatementAtEnd"
});
export const CssVariable = /*YAK EXPORTED STYLED:CssVariable:input_CssVariable_m7uBBu*//*YAK Extracted CSS:
.input_CssVariable_m7uBBu {
  width: var(--input_CssVariable__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $width }, style)=>"input_CssVariable_m7uBBu" + (style["--input_CssVariable__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue((log($width), $width), "px"), "")), {
    "displayName": "CssVariable"
});
// stays unfolded: a returned call can return a css literal
export const ReturnAssertNever = /*YAK EXPORTED STYLED:ReturnAssertNever:input_ReturnAssertNever_m7uBBu*//*YAK Extracted CSS:
.input_ReturnAssertNever___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ReturnAssertNever_m7uBBu", ({ $size })=>{
    switch($size){
        case "s":
            return /*#__PURE__*/ css("input_ReturnAssertNever___m7uBBu");
        default:
            return assertNever($size);
    }
}), {
    "displayName": "ReturnAssertNever"
});
// stays unfolded: the first case runs into the next one
export const FallThroughAfterStatement = /*YAK EXPORTED STYLED:FallThroughAfterStatement:input_FallThroughAfterStatement_m7uBBu*//*YAK Extracted CSS:
.input_FallThroughAfterStatement___m7uBBu {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_FallThroughAfterStatement_m7uBBu", ({ $size })=>{
    switch($size){
        case "s":
            log($size);
        case "m":
            return /*#__PURE__*/ css("input_FallThroughAfterStatement___m7uBBu");
    }
}), {
    "displayName": "FallThroughAfterStatement"
});
// stays unfolded: a `break` before the last case
export const BreakBeforeLastCase = /*YAK EXPORTED STYLED:BreakBeforeLastCase:input_BreakBeforeLastCase_m7uBBu*//*YAK Extracted CSS:
.input_BreakBeforeLastCase___m7uBBu {
  padding: 4px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_BreakBeforeLastCase_m7uBBu", ({ $size })=>{
    switch($size){
        case "s":
            log($size);
            break;
        case "m":
            return /*#__PURE__*/ css("input_BreakBeforeLastCase___m7uBBu");
    }
}), {
    "displayName": "BreakBeforeLastCase"
});
// at a CSS value position the last case can end without `return`
export const LastCaseThenStatements = /*YAK EXPORTED STYLED:LastCaseThenStatements:input_LastCaseThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_LastCaseThenStatements___m7uBBu {
  padding: 2px;
}
.input_LastCaseThenStatements_m7uBBu {
  width: var(--input_LastCaseThenStatements__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $size }, style)=>"input_LastCaseThenStatements_m7uBBu" + ($size === "s" ? " input_LastCaseThenStatements___m7uBBu" : "") + (style["--input_LastCaseThenStatements__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($size === "s" ? 2 : (log($size), void 0)) ?? (log($size), 8), "px"), "")), {
    "displayName": "LastCaseThenStatements"
});
// at a CSS value position the `if` can end without `return`
export const IfWithoutReturnThenStatements = /*YAK EXPORTED STYLED:IfWithoutReturnThenStatements:input_IfWithoutReturnThenStatements_m7uBBu*//*YAK Extracted CSS:
.input_IfWithoutReturnThenStatements_m7uBBu {
  width: var(--input_IfWithoutReturnThenStatements__width_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(2, ({ $on }, style)=>"input_IfWithoutReturnThenStatements_m7uBBu" + (style["--input_IfWithoutReturnThenStatements__width_m7uBBu"] = /*#__PURE__*/ __yak_cssValue(($on ? (log($on), void 0) : void 0) ?? (log($on), 8), "px"), "")), {
    "displayName": "IfWithoutReturnThenStatements"
});
// stays unfolded: a statement after a `return`
export const StatementAfterReturn = /*YAK EXPORTED STYLED:StatementAfterReturn:input_StatementAfterReturn_m7uBBu*//*YAK Extracted CSS:
.input_StatementAfterReturn__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_StatementAfterReturn_m7uBBu", ({ $on })=>{
    return $on && /*#__PURE__*/ css("input_StatementAfterReturn__$on_m7uBBu");
    log($on);
}), {
    "displayName": "StatementAfterReturn"
});
// stays unfolded: a write to a prop
export const AssignProp = /*YAK EXPORTED STYLED:AssignProp:input_AssignProp_m7uBBu*//*YAK Extracted CSS:
.input_AssignProp___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_AssignProp_m7uBBu", ({ $size })=>{
    $size = $size ?? "m";
    return $size === "s" && /*#__PURE__*/ css("input_AssignProp___m7uBBu");
}), {
    "displayName": "AssignProp"
});
// stays unfolded: a write to a prop
export const UpdateProp = /*YAK EXPORTED STYLED:UpdateProp:input_UpdateProp_m7uBBu*//*YAK Extracted CSS:
.input_UpdateProp___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_UpdateProp_m7uBBu", ({ $count })=>{
    $count++;
    return $count > 2 && /*#__PURE__*/ css("input_UpdateProp___m7uBBu");
}), {
    "displayName": "UpdateProp"
});
// stays unfolded: a write to a prop inside an argument
export const AssignInArgument = /*YAK EXPORTED STYLED:AssignInArgument:input_AssignInArgument_m7uBBu*//*YAK Extracted CSS:
.input_AssignInArgument___m7uBBu {
  padding: 2px;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_AssignInArgument_m7uBBu", ({ $size })=>{
    log($size = "m");
    return $size === "s" && /*#__PURE__*/ css("input_AssignInArgument___m7uBBu");
}), {
    "displayName": "AssignInArgument"
});
// stays unfolded: `onRender` runs with the props as `this`
export const MethodOnProps = /*YAK EXPORTED STYLED:MethodOnProps:input_MethodOnProps_m7uBBu*//*YAK Extracted CSS:
.input_MethodOnProps__p_\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MethodOnProps_m7uBBu", (p)=>{
    p.onRender();
    return p.$on && /*#__PURE__*/ css("input_MethodOnProps__p_$on_m7uBBu");
}), {
    "displayName": "MethodOnProps"
});
// stays unfolded: the callee is a call, not a plain read
export const CallOnCall = /*YAK EXPORTED STYLED:CallOnCall:input_CallOnCall_m7uBBu*//*YAK Extracted CSS:
.input_CallOnCall__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_CallOnCall_m7uBBu", ({ $on })=>{
    getLogger().log($on);
    return $on && /*#__PURE__*/ css("input_CallOnCall__$on_m7uBBu");
}), {
    "displayName": "CallOnCall"
});
