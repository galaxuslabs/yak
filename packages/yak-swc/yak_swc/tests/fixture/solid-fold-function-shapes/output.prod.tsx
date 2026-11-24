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
.ym7uBBu {
  display: flex;
}
.ym7uBBu1 {
  background: black;
}
.ym7uBBu2 {
  color: red;
}
.ym7uBBu3 {
  color: purple;
}
.ym7uBBu4 {
  color: blue;
}
.ym7uBBu6 {
  &:hover {
    background: black;
  }
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu", ({ $variant, $on })=>$variant && $on && /*#__PURE__*/ css("ym7uBBu1"), ({ $variant })=>{
    switch($variant){
        case "m":
            return /*#__PURE__*/ css("ym7uBBu2");
        case "l":
            return /*#__PURE__*/ css("ym7uBBu3");
        default:
            return /*#__PURE__*/ css("ym7uBBu4");
    }
}, ({ $foo })=>!!$foo && /*#__PURE__*/ css("ym7uBBu5", ({ $variant })=>$variant && /*#__PURE__*/ css("ym7uBBu6")));
// the `atoms` call joins its class names next to the condition
const Atoms = /*YAK Extracted CSS:
.ym7uBBu8 {
  width: 100%;
}
*/ /*#__PURE__*/ __yak.__yak_span("ym7uBBu7", atoms("flex", "gap-2"), ({ $wide })=>$wide && /*#__PURE__*/ css("ym7uBBu8"));
// bails: the runtime passes the theme, which is unknown at build time
const Themed = /*YAK Extracted CSS:
.ym7uBBuA {
  color: white;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu9", ({ theme, $on })=>theme.dark && $on && /*#__PURE__*/ css("ym7uBBuA"));
export const Usages = ({ v, $variant }: {
    v: "s" | "m" | "l";
    $variant: number;
})=><>
    { /* absent props are `void 0` */ }
    <div class={"ym7uBBu" + ((void 0) && void 0 ? " ym7uBBu1" : "") + (void 0 === "m" ? " ym7uBBu2" : void 0 === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (void 0 ? " ym7uBBu6" : "") : "")}>no props</div>
    { /* a bare attribute is `true`, literals inline */ }
    <div class={"ym7uBBu" + ("m" && true ? " ym7uBBu1" : "") + ("m" === "m" ? " ym7uBBu2" : "m" === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!2 ? " ym7uBBu5" + ("m" ? " ym7uBBu6" : "") : "")}>
      literal props
    </div>
    { /* an identifier inlines at every read */ }
    <div class={"ym7uBBu" + (v && true ? " ym7uBBu1" : "") + (v === "m" ? " ym7uBBu2" : v === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (v ? " ym7uBBu6" : "") : "")}>
      dynamic identifier
    </div>
    { /* a member read inlines at every read */ }
    <div class={"ym7uBBu" + (props.variant && props.on ? " ym7uBBu1" : "") + (props.variant === "m" ? " ym7uBBu2" : props.variant === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (props.variant ? " ym7uBBu6" : "") : "")}>
      member read
    </div>
    { /* a call runs once: it is bound and every read uses the parameter */ }
    <div class={((__yak_$variant)=>"ym7uBBu" + (__yak_$variant && true ? " ym7uBBu1" : "") + (__yak_$variant === "m" ? " ym7uBBu2" : __yak_$variant === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (__yak_$variant ? " ym7uBBu6" : "") : ""))(f())}>
      call value
    </div>
    { /* the bound parameter is `__yak_$variant`, so the user `$variant` in the
        other attribute stays the user variable */ }
    <div class={((__yak_$variant)=>"ym7uBBu" + (__yak_$variant && void 0 ? " ym7uBBu1" : "") + (__yak_$variant === "m" ? " ym7uBBu2" : __yak_$variant === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!$variant ? " ym7uBBu5" + (__yak_$variant ? " ym7uBBu6" : "") : ""))(f())}>
      user variable of the prop name
    </div>
    <span class={"ym7uBBu7" + " flex gap-2" + (true ? " ym7uBBu8" : "")}>atoms</span>
    <Themed $on>bails: theme</Themed>
  </>;
// a bound non-$ prop needs the element-wrap shape, which would freeze the
// value in Solid: the usage keeps the runtime component
const Row = /*YAK Extracted CSS:
.ym7uBBuC {
  opacity: 0.5;
}
.ym7uBBuD {
  opacity: 1;
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuB", ({ disabled })=>{
    switch(disabled){
        case true:
            return /*#__PURE__*/ css("ym7uBBuC");
        default:
            return /*#__PURE__*/ css("ym7uBBuD");
    }
});
declare const busy: () => boolean;
export const Wrapped = ()=><Row disabled={busy()}/>;
