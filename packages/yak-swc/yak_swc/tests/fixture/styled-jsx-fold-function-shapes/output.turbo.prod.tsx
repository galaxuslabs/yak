// A usage folds every component the styled function fold can turn into one
// class name expression: block bodies with `switch`, nested `css` literals and
// `atoms` calls fold at the usage like a plain `cond && css` condition.
import { atoms, css, styled } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUgewogIGRpc3BsYXk6IGZsZXg7Cn0KLnltN3VCQnUxIHsKICBiYWNrZ3JvdW5kOiBibGFjazsKfQoueW03dUJCdTIgewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnUzIHsKICBjb2xvcjogcHVycGxlOwp9Ci55bTd1QkJ1NCB7CiAgY29sb3I6IGJsdWU7Cn0KLnltN3VCQnU2IHsKICAmOmhvdmVyIHsKICAgIGJhY2tncm91bmQ6IGJsYWNrOwogIH0KfS55bTd1QkJ1OCB7CiAgd2lkdGg6IDEwMCU7Cn0ueW03dUJCdUEgewogIGNvbG9yOiB3aGl0ZTsKfQ==";
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
*/ /*#__PURE__*/ __yak.__yak_div(0, ({ $variant, $on, $foo })=>"ym7uBBu" + ($variant && $on ? " ym7uBBu1" : "") + ($variant === "m" ? " ym7uBBu2" : $variant === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!$foo ? " ym7uBBu5" + ($variant ? " ym7uBBu6" : "") : ""));
// the `atoms` call joins its class names next to the condition
const Atoms = /*YAK Extracted CSS:
.ym7uBBu8 {
  width: 100%;
}
*/ /*#__PURE__*/ __yak.__yak_span(0, ({ $wide })=>"ym7uBBu7" + " flex gap-2" + ($wide ? " ym7uBBu8" : ""));
// bails: the runtime passes the theme, which is unknown at build time
const Themed = /*YAK Extracted CSS:
.ym7uBBuA {
  color: white;
}
*/ /*#__PURE__*/ __yak.__yak_div(1, ({ $on }, style, theme)=>"ym7uBBu9" + (theme.dark && $on ? " ym7uBBuA" : ""));
export const Usages = ({ v, $variant }: {
    v: "s" | "m" | "l";
    $variant: number;
})=><>
    { /* absent props are `void 0` */ }
    <div className={"ym7uBBu" + ((void 0) && void 0 ? " ym7uBBu1" : "") + (void 0 === "m" ? " ym7uBBu2" : void 0 === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (void 0 ? " ym7uBBu6" : "") : "")}>no props</div>
    { /* a bare attribute is `true`, literals inline */ }
    <div className={"ym7uBBu" + ("m" && true ? " ym7uBBu1" : "") + ("m" === "m" ? " ym7uBBu2" : "m" === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!2 ? " ym7uBBu5" + ("m" ? " ym7uBBu6" : "") : "")}>
      literal props
    </div>
    { /* an identifier inlines at every read */ }
    <div className={"ym7uBBu" + (v && true ? " ym7uBBu1" : "") + (v === "m" ? " ym7uBBu2" : v === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (v ? " ym7uBBu6" : "") : "")}>
      dynamic identifier
    </div>
    { /* a member read inlines at every read */ }
    <div className={"ym7uBBu" + (props.variant && props.on ? " ym7uBBu1" : "") + (props.variant === "m" ? " ym7uBBu2" : props.variant === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (props.variant ? " ym7uBBu6" : "") : "")}>
      member read
    </div>
    { /* a call runs once: it is bound and every read uses the parameter */ }
    <div className={((__yak_$variant)=>"ym7uBBu" + (__yak_$variant && true ? " ym7uBBu1" : "") + (__yak_$variant === "m" ? " ym7uBBu2" : __yak_$variant === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!void 0 ? " ym7uBBu5" + (__yak_$variant ? " ym7uBBu6" : "") : ""))(f())}>
      call value
    </div>
    { /* the bound parameter is `__yak_$variant`, so the user `$variant` in the
        other attribute stays the user variable */ }
    <div className={((__yak_$variant)=>"ym7uBBu" + (__yak_$variant && void 0 ? " ym7uBBu1" : "") + (__yak_$variant === "m" ? " ym7uBBu2" : __yak_$variant === "l" ? " ym7uBBu3" : " ym7uBBu4") + (!!$variant ? " ym7uBBu5" + (__yak_$variant ? " ym7uBBu6" : "") : ""))(f())}>
      user variable of the prop name
    </div>
    <span className={"ym7uBBu7" + " flex gap-2" + (true ? " ym7uBBu8" : "")}>atoms</span>
    <Themed $on>bails: theme</Themed>
  </>;
