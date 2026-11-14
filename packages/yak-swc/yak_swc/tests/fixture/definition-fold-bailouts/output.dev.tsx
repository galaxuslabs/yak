import { styled, css, atoms, __yak_cssValue } from "@yak/react/internal";
import { mixin, calc } from "./helpers";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
export const Rest = /*YAK EXPORTED STYLED:Rest:input_Rest_m7uBBu*//*YAK Extracted CSS:
.input_Rest__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Rest_m7uBBu", ({ $on, ...rest })=>$on && /*#__PURE__*/ css("input_Rest__$on_m7uBBu")), {
    "displayName": "Rest"
});
export const Default = /*YAK EXPORTED STYLED:Default:input_Default_m7uBBu*//*YAK Extracted CSS:
.input_Default__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Default_m7uBBu", ({ $on = true })=>$on && /*#__PURE__*/ css("input_Default__$on_m7uBBu")), {
    "displayName": "Default"
});
export const Computed = /*YAK EXPORTED STYLED:Computed:input_Computed_m7uBBu*//*YAK Extracted CSS:
.input_Computed___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Computed_m7uBBu", (p)=>p["$on"] && /*#__PURE__*/ css("input_Computed___m7uBBu")), {
    "displayName": "Computed"
});
export const Escaping = /*YAK EXPORTED STYLED:Escaping:input_Escaping_m7uBBu*//*YAK Extracted CSS:
.input_Escaping___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Escaping_m7uBBu", (p)=>calc(p) && /*#__PURE__*/ css("input_Escaping___m7uBBu")), {
    "displayName": "Escaping"
});
export const MultiStatement = /*YAK EXPORTED STYLED:MultiStatement:input_MultiStatement_m7uBBu*//*YAK Extracted CSS:
.input_MultiStatement__on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MultiStatement_m7uBBu", ({ $on })=>{
    const on = !!$on;
    return on && /*#__PURE__*/ css("input_MultiStatement__on_m7uBBu");
}), {
    "displayName": "MultiStatement"
});
export const FunctionExpression = /*YAK EXPORTED STYLED:FunctionExpression:input_FunctionExpression_m7uBBu*//*YAK Extracted CSS:
.input_FunctionExpression__\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_FunctionExpression_m7uBBu", function({ $on }) {
    return $on && /*#__PURE__*/ css("input_FunctionExpression__$on_m7uBBu");
}), {
    "displayName": "FunctionExpression"
});
export const MixinReturn = /*YAK EXPORTED STYLED:MixinReturn:input_MixinReturn_m7uBBu*//*YAK Extracted CSS:

*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MixinReturn_m7uBBu", ({ $on })=>$on && mixin), {
    "displayName": "MixinReturn"
});
export const AtomsReturn = /*YAK EXPORTED STYLED:AtomsReturn:input_AtomsReturn_m7uBBu*//*YAK Extracted CSS:

*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_AtomsReturn_m7uBBu", ({ $on })=>$on && atoms("flex")), {
    "displayName": "AtomsReturn"
});
// the runtime evaluates a value inside a nested css once per render and
// calls the result with the props if it is a function
export const NestedHelperValue = /*YAK EXPORTED STYLED:NestedHelperValue:input_NestedHelperValue_m7uBBu*//*YAK Extracted CSS:
.input_NestedHelperValue__\$on_m7uBBu {
  color: var(--input_NestedHelperValue__color_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NestedHelperValue_m7uBBu", ({ $on })=>$on && /*#__PURE__*/ css("input_NestedHelperValue__$on_m7uBBu", {
        "style": {
            "--input_NestedHelperValue__color_m7uBBu": calc("primary")
        }
    })), {
    "displayName": "NestedHelperValue"
});
export const ValueReturnsFunction = /*YAK EXPORTED STYLED:ValueReturnsFunction:input_ValueReturnsFunction_m7uBBu*//*YAK Extracted CSS:
.input_ValueReturnsFunction_m7uBBu {
  left: var(--input_ValueReturnsFunction__left_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_ValueReturnsFunction_m7uBBu", {
    "style": {
        "--input_ValueReturnsFunction__left_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ $x })=>()=>$x, "px")
    }
}), {
    "displayName": "ValueReturnsFunction"
});
export const StyleReadInValue = /*YAK EXPORTED STYLED:StyleReadInValue:input_StyleReadInValue_m7uBBu*//*YAK Extracted CSS:
.input_StyleReadInValue_m7uBBu {
  left: var(--input_StyleReadInValue__left_m7uBBu);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_StyleReadInValue_m7uBBu", {
    "style": {
        "--input_StyleReadInValue__left_m7uBBu": /*#__PURE__*/ __yak_cssValue(({ style })=>style.left, "px")
    }
}), {
    "displayName": "StyleReadInValue"
});
export const OrOperator = /*YAK EXPORTED STYLED:OrOperator:input_OrOperator_m7uBBu*//*YAK Extracted CSS:
.input_OrOperator___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_OrOperator_m7uBBu", 0, ({ $on: __yak_$on })=>"input_OrOperator_m7uBBu" + (!__yak_$on ? "" : " input_OrOperator___m7uBBu")), {
    "displayName": "OrOperator"
});
// `OrOperator` above folds because `!$on` is a boolean; here the left side
// could be an object, whose class name the runtime would add
export const OrUnprovable = /*YAK EXPORTED STYLED:OrUnprovable:input_OrUnprovable_m7uBBu*//*YAK Extracted CSS:
.input_OrUnprovable__not_\$on_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_OrUnprovable_m7uBBu", ({ $on })=>$on || /*#__PURE__*/ css("input_OrUnprovable__not_$on_m7uBBu")), {
    "displayName": "OrUnprovable"
});
export const OrChainUnprovable = /*YAK EXPORTED STYLED:OrChainUnprovable:input_OrChainUnprovable_m7uBBu*//*YAK Extracted CSS:
.input_OrChainUnprovable___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_OrChainUnprovable_m7uBBu", ({ $a, $b })=>!$a || $b || /*#__PURE__*/ css("input_OrChainUnprovable___m7uBBu")), {
    "displayName": "OrChainUnprovable"
});
export const NullishOperator = /*YAK EXPORTED STYLED:NullishOperator:input_NullishOperator_m7uBBu*//*YAK Extracted CSS:
.input_NullishOperator___m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_NullishOperator_m7uBBu", ({ $on })=>$on ?? /*#__PURE__*/ css("input_NullishOperator___m7uBBu")), {
    "displayName": "NullishOperator"
});
export const StyleRead = /*YAK EXPORTED STYLED:StyleRead:input_StyleRead_m7uBBu*//*YAK Extracted CSS:
.input_StyleRead__style_m7uBBu {
  color: red;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_StyleRead_m7uBBu", ({ style })=>style && /*#__PURE__*/ css("input_StyleRead__style_m7uBBu")), {
    "displayName": "StyleRead"
});
export const MixinInterpolation = /*YAK EXPORTED STYLED:MixinInterpolation:input_MixinInterpolation_m7uBBu*//*YAK Extracted CSS:
.input_MixinInterpolation_m7uBBu {
  --yak-css-import: url("./helpers:mixin",mixin);
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_MixinInterpolation_m7uBBu"), {
    "displayName": "MixinInterpolation"
});
