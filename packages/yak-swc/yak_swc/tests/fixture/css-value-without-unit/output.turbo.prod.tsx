import { styled, __yak_cssValue } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1MSk7Cn0ueW03dUJCdTIgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1Myk7Cn0ueW03dUJCdTQgewogIHotaW5kZXg6IHZhcigtLXltN3VCQnU1KTsKfS55bTd1QkJ1NiB7CiAgd2lkdGg6IHZhcigtLXltN3VCQnU3KTsKfS55bTd1QkJ1OCB7CiAgd2lkdGg6IHZhcigtLXltN3VCQnU5KTsKfQ==";
// A value with a unit always goes through `__yak_cssValue`, which throws for
// `undefined` in development. A value without a unit goes through it in
// development only: production assigns the value as it is.
// folded: `style["--x"] = ...` inside the folded function
export const WithUnit = /*YAK EXPORTED STYLED:WithUnit:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu {
  width: var(--ym7uBBu1);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $w }, style)=>"ym7uBBu" + (style["--ym7uBBu1"] = /*#__PURE__*/ __yak_cssValue($w, "px"), ""));
export const WithoutUnit = /*YAK EXPORTED STYLED:WithoutUnit:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu2 {
  width: var(--ym7uBBu3);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $w }, style)=>"ym7uBBu2" + (style["--ym7uBBu3"] = $w, ""));
export const WithoutUnitBlockBody = /*YAK EXPORTED STYLED:WithoutUnitBlockBody:ym7uBBu4*//*YAK Extracted CSS:
.ym7uBBu4 {
  z-index: var(--ym7uBBu5);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $on }, style)=>"ym7uBBu4" + (style["--ym7uBBu5"] = $on ? 2 : undefined, ""));
// unfolded: the function stays in the style object, because a `let`
// keeps the folder from turning the block body into one expression
export const UnfoldedWithUnit = /*YAK EXPORTED STYLED:UnfoldedWithUnit:ym7uBBu6*//*YAK Extracted CSS:
.ym7uBBu6 {
  width: var(--ym7uBBu7);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu6", {
    "--ym7uBBu7": /*#__PURE__*/ __yak_cssValue(({ $w })=>{
        let w = $w;
        return w;
    }, "px")
});
export const UnfoldedWithoutUnit = /*YAK EXPORTED STYLED:UnfoldedWithoutUnit:ym7uBBu8*//*YAK Extracted CSS:
.ym7uBBu8 {
  width: var(--ym7uBBu9);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu8", {
    "--ym7uBBu9": ({ $w })=>{
        let w = $w;
        return w;
    }
});
