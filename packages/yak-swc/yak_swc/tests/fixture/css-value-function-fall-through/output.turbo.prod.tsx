import { styled, css, __yak_cssValue } from "@yak/react/internal";
import { log, getWidth } from "./helpers";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1MSk7Cn0ueW03dUJCdTIgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1Myk7Cn0ueW03dUJCdTQgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1NSk7Cn0ueW03dUJCdTYgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1Nyk7Cn0ueW03dUJCdTggewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1OSk7Cn0ueW03dUJCdUEgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1Qik7Cn0ueW03dUJCdUMgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1RCk7Cn0ueW03dUJCdUUgewogIHdpZHRoOiB2YXIoLS15bTd1QkJ1Rik7Cn0ueW03dUJCdUggewogIGNvbG9yOiByZWQ7Cn0KLnltN3VCQnVHIHsKICBoZWlnaHQ6IHZhcigtLXltN3VCQnVJKTsKfQ==";
type Size = "s" | "m" | "l";
// every `return` in the guard block returns a number, which is never
// `null` or `undefined`, so `??` goes on after the block only for its end
export const NumberReturns = /*YAK EXPORTED STYLED:NumberReturns:ym7uBBu*//*YAK Extracted CSS:
.ym7uBBu {
  width: var(--ym7uBBu1);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big, $wide }, style)=>"ym7uBBu" + (style["--ym7uBBu1"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? 1 : void 0 : void 0) ?? ($wide ? 3 : 2), "px"), ""));
// a nested ternary of literals, a template literal, a calculation, `||` and
// `??` with a number on the right side
export const NeverNullishShapes = /*YAK EXPORTED STYLED:NeverNullishShapes:ym7uBBu2*//*YAK Extracted CSS:
.ym7uBBu2 {
  width: var(--ym7uBBu3);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $a, $b, $n }, style)=>"ym7uBBu2" + (style["--ym7uBBu3"] = ($a ? $b ? $n > 2 ? $n > 4 ? 4 : 2 : 1 : $n > 8 ? `${$n}px` : $n > 6 ? $n * 2 : $n > 4 ? $n || 4 : $n > 3 ? $n ?? 3 : void 0 : void 0) ?? ($b ? $n : 0), ""));
// the last case of a `switch` ends without `return`
export const SwitchLastCaseThenStatements = /*YAK EXPORTED STYLED:SwitchLastCaseThenStatements:ym7uBBu4*//*YAK Extracted CSS:
.ym7uBBu4 {
  width: var(--ym7uBBu5);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $size, $on }, style)=>"ym7uBBu4" + (style["--ym7uBBu5"] = /*#__PURE__*/ __yak_cssValue(($size === "s" ? 2 : (log($size), void 0)) ?? ($on ? 4 : 8), "px"), ""));
// stays unfolded: `$width` can be `undefined`
export const ReadReturn = /*YAK EXPORTED STYLED:ReadReturn:ym7uBBu6*//*YAK Extracted CSS:
.ym7uBBu6 {
  width: var(--ym7uBBu7);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu6", {
    "--ym7uBBu7": /*#__PURE__*/ __yak_cssValue(({ $on, $big, $width })=>{
        if ($on) {
            if ($big) return $width;
        }
        if ($big) return 4;
        return 8;
    }, "px")
});
// stays unfolded: `$a && 1` returns `$a` when it is falsy, e.g. `null`
export const AndReturn = /*YAK EXPORTED STYLED:AndReturn:ym7uBBu8*//*YAK Extracted CSS:
.ym7uBBu8 {
  width: var(--ym7uBBu9);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBu8", {
    "--ym7uBBu9": /*#__PURE__*/ __yak_cssValue(({ $on, $a })=>{
        if ($on) {
            if ($a) return $a && 1;
        }
        if ($a) return 4;
        return 8;
    }, "px")
});
// stays unfolded: a call can return anything, also in a nested `switch`
export const CallReturnInSwitch = /*YAK EXPORTED STYLED:CallReturnInSwitch:ym7uBBuA*//*YAK Extracted CSS:
.ym7uBBuA {
  width: var(--ym7uBBuB);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuA", {
    "--ym7uBBuB": /*#__PURE__*/ __yak_cssValue(({ $on, $size })=>{
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
});
// stays unfolded: `return;` is `undefined`
export const EmptyReturn = /*YAK EXPORTED STYLED:EmptyReturn:ym7uBBuC*//*YAK Extracted CSS:
.ym7uBBuC {
  width: var(--ym7uBBuD);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuC", {
    "--ym7uBBuD": /*#__PURE__*/ __yak_cssValue(({ $on, $big })=>{
        if ($on) {
            if ($big) return;
        }
        if ($big) return 4;
        return 8;
    }, "px")
});
// stays unfolded: a `null` in the `else` of the branch
export const NullInElse = /*YAK EXPORTED STYLED:NullInElse:ym7uBBuE*//*YAK Extracted CSS:
.ym7uBBuE {
  width: var(--ym7uBBuF);
}
*/ /*#__PURE__*/ __yak.__yak_div("ym7uBBuE", {
    "--ym7uBBuF": /*#__PURE__*/ __yak_cssValue(({ $on, $big })=>{
        if ($on) {
            if ($big) return 2;
        } else {
            return null;
        }
        if ($big) return 4;
        return 8;
    }, "px")
});
// a CSS value folds into the same function as the class names next to it
export const NextToClassNames = /*YAK EXPORTED STYLED:NextToClassNames:ym7uBBuG*//*YAK Extracted CSS:
.ym7uBBuH {
  color: red;
}
.ym7uBBuG {
  height: var(--ym7uBBuI);
}
*/ /*#__PURE__*/ __yak.__yak_div(2, ({ $on, $big }, style)=>"ym7uBBuG" + ($on ? " ym7uBBuH" : "") + (style["--ym7uBBuI"] = /*#__PURE__*/ __yak_cssValue(($on ? $big ? 10 : void 0 : void 0) ?? (log($big), 20), "px"), ""));
