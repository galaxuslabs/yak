// A usage folds every component the styled function fold can turn into one
// class name expression: block bodies with `switch`, nested `css` literals and
// `atoms` calls fold at the usage like a plain `cond && css` condition.
import { atoms, css, styled } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LmlucHV0X0NlbnRlcl9tN3VCQnUgewogIGRpc3BsYXk6IGZsZXg7Cn0KLmlucHV0X0NlbnRlcl9fX203dUJCdSB7CiAgYmFja2dyb3VuZDogYmxhY2s7Cn0KLmlucHV0X0NlbnRlcl9fX203dUJCdS0wMSB7CiAgY29sb3I6IHJlZDsKfQouaW5wdXRfQ2VudGVyX19fbTd1QkJ1LTAyIHsKICBjb2xvcjogcHVycGxlOwp9Ci5pbnB1dF9DZW50ZXJfX19tN3VCQnUtMDMgewogIGNvbG9yOiBibHVlOwp9Ci5pbnB1dF9DZW50ZXJfXy1hbmQtXCR2YXJpYW50X203dUJCdSB7CiAgJjpob3ZlciB7CiAgICBiYWNrZ3JvdW5kOiBibGFjazsKICB9Cn0uaW5wdXRfQXRvbXNfX1wkd2lkZV9tN3VCQnUgewogIHdpZHRoOiAxMDAlOwp9LmlucHV0X1RoZW1lZF9fX203dUJCdSB7CiAgY29sb3I6IHdoaXRlOwp9";
declare const f: () => "s" | "m" | "l";
declare const props: {
    variant: "s" | "m" | "l";
    on: boolean;
};
const Center = /*YAK Extracted CSS:
.input_Center_m7uBBu {
  display: flex;
}
.input_Center___m7uBBu {
  background: black;
}
.input_Center___m7uBBu-01 {
  color: red;
}
.input_Center___m7uBBu-02 {
  color: purple;
}
.input_Center___m7uBBu-03 {
  color: blue;
}
.input_Center__-and-\$variant_m7uBBu {
  &:hover {
    background: black;
  }
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(0, ({ $variant, $on, $foo })=>"input_Center_m7uBBu" + ($variant && $on ? " input_Center___m7uBBu" : "") + ($variant === "m" ? " input_Center___m7uBBu-01" : $variant === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!$foo ? " input_Center___m7uBBu-04" + ($variant ? " input_Center__-and-$variant_m7uBBu" : "") : "")), {
    "displayName": "Center"
});
// the `atoms` call joins its class names next to the condition
const Atoms = /*YAK Extracted CSS:
.input_Atoms__\$wide_m7uBBu {
  width: 100%;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_span(0, ({ $wide })=>"input_Atoms_m7uBBu" + " flex gap-2" + ($wide ? " input_Atoms__$wide_m7uBBu" : "")), {
    "displayName": "Atoms"
});
// bails: the runtime passes the theme, which is unknown at build time
const Themed = /*YAK Extracted CSS:
.input_Themed___m7uBBu {
  color: white;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div(1, ({ $on }, style, theme)=>"input_Themed_m7uBBu" + (theme.dark && $on ? " input_Themed___m7uBBu" : "")), {
    "displayName": "Themed"
});
export const Usages = ({ v, $variant }: {
    v: "s" | "m" | "l";
    $variant: number;
})=><>
    { /* absent props are `void 0` */ }
    <div className={"input_Center_m7uBBu" + ((void 0) && void 0 ? " input_Center___m7uBBu" : "") + (void 0 === "m" ? " input_Center___m7uBBu-01" : void 0 === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (void 0 ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>no props</div>
    { /* a bare attribute is `true`, literals inline */ }
    <div className={"input_Center_m7uBBu" + ("m" && true ? " input_Center___m7uBBu" : "") + ("m" === "m" ? " input_Center___m7uBBu-01" : "m" === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!2 ? " input_Center___m7uBBu-04" + ("m" ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>
      literal props
    </div>
    { /* an identifier inlines at every read */ }
    <div className={"input_Center_m7uBBu" + (v && true ? " input_Center___m7uBBu" : "") + (v === "m" ? " input_Center___m7uBBu-01" : v === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (v ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>
      dynamic identifier
    </div>
    { /* a member read inlines at every read */ }
    <div className={"input_Center_m7uBBu" + (props.variant && props.on ? " input_Center___m7uBBu" : "") + (props.variant === "m" ? " input_Center___m7uBBu-01" : props.variant === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (props.variant ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>
      member read
    </div>
    { /* a call runs once: it is bound and every read uses the parameter */ }
    <div className={((__yak_$variant)=>"input_Center_m7uBBu" + (__yak_$variant && true ? " input_Center___m7uBBu" : "") + (__yak_$variant === "m" ? " input_Center___m7uBBu-01" : __yak_$variant === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (__yak_$variant ? " input_Center__-and-$variant_m7uBBu" : "") : ""))(f())}>
      call value
    </div>
    { /* the bound parameter is `__yak_$variant`, so the user `$variant` in the
        other attribute stays the user variable */ }
    <div className={((__yak_$variant)=>"input_Center_m7uBBu" + (__yak_$variant && void 0 ? " input_Center___m7uBBu" : "") + (__yak_$variant === "m" ? " input_Center___m7uBBu-01" : __yak_$variant === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!$variant ? " input_Center___m7uBBu-04" + (__yak_$variant ? " input_Center__-and-$variant_m7uBBu" : "") : ""))(f())}>
      user variable of the prop name
    </div>
    <span className={"input_Atoms_m7uBBu" + " flex gap-2" + (true ? " input_Atoms__$wide_m7uBBu" : "")}>atoms</span>
    <Themed $on>bails: theme</Themed>
  </>;
