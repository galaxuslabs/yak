// The Solid twin of styled-jsx-fold-function-shapes: the same components fold
// into a `class` attribute, which the Solid compiler keeps reactive.
import { atoms, css, styled } from "@yak/solid/internal";
import * as __yak from "@yak/solid/internal";
import "./input.yak.css!=!./input?./input.yak.css";
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
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Center_m7uBBu", ({ $variant, $on })=>$variant && $on && /*#__PURE__*/ css("input_Center___m7uBBu"), ({ $variant })=>{
    switch($variant){
        case "m":
            return /*#__PURE__*/ css("input_Center___m7uBBu-01");
        case "l":
            return /*#__PURE__*/ css("input_Center___m7uBBu-02");
        default:
            return /*#__PURE__*/ css("input_Center___m7uBBu-03");
    }
}, ({ $foo })=>!!$foo && /*#__PURE__*/ css("input_Center___m7uBBu-04", ({ $variant })=>$variant && /*#__PURE__*/ css("input_Center__-and-$variant_m7uBBu"))), {
    "displayName": "Center"
});
// the `atoms` call joins its class names next to the condition
const Atoms = /*YAK Extracted CSS:
.input_Atoms__\$wide_m7uBBu {
  width: 100%;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_span("input_Atoms_m7uBBu", atoms("flex", "gap-2"), ({ $wide })=>$wide && /*#__PURE__*/ css("input_Atoms__$wide_m7uBBu")), {
    "displayName": "Atoms"
});
// bails: the runtime passes the theme, which is unknown at build time
const Themed = /*YAK Extracted CSS:
.input_Themed___m7uBBu {
  color: white;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Themed_m7uBBu", ({ theme, $on })=>theme.dark && $on && /*#__PURE__*/ css("input_Themed___m7uBBu")), {
    "displayName": "Themed"
});
export const Usages = ({ v, $variant }: {
    v: "s" | "m" | "l";
    $variant: number;
})=><>
    { /* absent props are `void 0` */ }
    <div class={"input_Center_m7uBBu" + ((void 0) && void 0 ? " input_Center___m7uBBu" : "") + (void 0 === "m" ? " input_Center___m7uBBu-01" : void 0 === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (void 0 ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>no props</div>
    { /* a bare attribute is `true`, literals inline */ }
    <div class={"input_Center_m7uBBu" + ("m" && true ? " input_Center___m7uBBu" : "") + ("m" === "m" ? " input_Center___m7uBBu-01" : "m" === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!2 ? " input_Center___m7uBBu-04" + ("m" ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>
      literal props
    </div>
    { /* an identifier inlines at every read */ }
    <div class={"input_Center_m7uBBu" + (v && true ? " input_Center___m7uBBu" : "") + (v === "m" ? " input_Center___m7uBBu-01" : v === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (v ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>
      dynamic identifier
    </div>
    { /* a member read inlines at every read */ }
    <div class={"input_Center_m7uBBu" + (props.variant && props.on ? " input_Center___m7uBBu" : "") + (props.variant === "m" ? " input_Center___m7uBBu-01" : props.variant === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (props.variant ? " input_Center__-and-$variant_m7uBBu" : "") : "")}>
      member read
    </div>
    { /* a call runs once: it is bound and every read uses the parameter */ }
    <div class={((__yak_$variant)=>"input_Center_m7uBBu" + (__yak_$variant && true ? " input_Center___m7uBBu" : "") + (__yak_$variant === "m" ? " input_Center___m7uBBu-01" : __yak_$variant === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!void 0 ? " input_Center___m7uBBu-04" + (__yak_$variant ? " input_Center__-and-$variant_m7uBBu" : "") : ""))(f())}>
      call value
    </div>
    { /* the bound parameter is `__yak_$variant`, so the user `$variant` in the
        other attribute stays the user variable */ }
    <div class={((__yak_$variant)=>"input_Center_m7uBBu" + (__yak_$variant && void 0 ? " input_Center___m7uBBu" : "") + (__yak_$variant === "m" ? " input_Center___m7uBBu-01" : __yak_$variant === "l" ? " input_Center___m7uBBu-02" : " input_Center___m7uBBu-03") + (!!$variant ? " input_Center___m7uBBu-04" + (__yak_$variant ? " input_Center__-and-$variant_m7uBBu" : "") : ""))(f())}>
      user variable of the prop name
    </div>
    <span class={"input_Atoms_m7uBBu" + " flex gap-2" + (true ? " input_Atoms__$wide_m7uBBu" : "")}>atoms</span>
    <Themed $on>bails: theme</Themed>
  </>;
// a bound non-$ prop needs the element-wrap shape, which would freeze the
// value in Solid: the usage keeps the runtime component
const Row = /*YAK Extracted CSS:
.input_Row___m7uBBu {
  opacity: 0.5;
}
.input_Row___m7uBBu-01 {
  opacity: 1;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_div("input_Row_m7uBBu", ({ disabled })=>{
    switch(disabled){
        case true:
            return /*#__PURE__*/ css("input_Row___m7uBBu");
        default:
            return /*#__PURE__*/ css("input_Row___m7uBBu-01");
    }
}), {
    "displayName": "Row"
});
declare const busy: () => boolean;
export const Wrapped = ()=><Row disabled={busy()}/>;
