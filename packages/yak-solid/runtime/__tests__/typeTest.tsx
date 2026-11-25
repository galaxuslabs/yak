/**
 * Type-only tests for the public @yak/solid API (pre-compilation typings).
 * Checked by `pnpm test:types`, never executed.
 */
import type { JSX } from "@solidjs/web";
import { css, styled, keyframes, useTheme, YakThemeProvider, YakThemeContext } from "@yak/solid";

// styled with intrinsic elements infers tag props
const Button = styled.button<{ $primary?: boolean }>`
  color: ${({ $primary }) => ($primary ? "red" : "blue")};
`;

const buttonUsage = (
  <Button type="submit" $primary onClick={(event) => event.currentTarget.disabled} />
);

// @ts-expect-error - unknown props are rejected
const invalidPropUsage = <Button unknownProp />;

// styled(Component) requires class/style compatible props
const Custom = (props: { class?: string; label: string }) => <div class={props.class} />;
const StyledCustom = styled(Custom)`
  color: red;
`;
const customUsage = <StyledCustom label="hello" />;

// @ts-expect-error - missing required prop
const missingPropUsage = <StyledCustom />;

// attrs narrow the outer props
const WithAttrs = styled.input.attrs({ type: "text" })`
  color: red;
`;
const withAttrsUsage = <WithAttrs value="x" />;

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
const assert = <T extends true>() => {};

// props returned from attrs reach interpolations
const Dot = styled.div.attrs(({ disableAnimation }: { disableAnimation?: boolean }) => ({
  $disableAnimation: disableAnimation,
  disableAnimation: undefined,
}))`
  ${({ $disableAnimation }) =>
    $disableAnimation &&
    css`
      animation: none;
    `}
  ${(p) => {
    assert<Equal<typeof p.$disableAnimation, boolean | undefined>>();
    assert<Equal<typeof p.disableAnimation, undefined>>();
    return "";
  }}
`;
const dotUsage = <Dot disableAnimation />;
// @ts-expect-error - props returned from attrs do not become public props
const dotPrivateUsage = <Dot $disableAnimation />;

// a static attrs object adds props as well
const Sized = styled.div<{ $size: number }>``;
const SizedWithAttrs = styled(Sized).attrs({ $size: 2, $label: "two" })`
  ${(p) => {
    const size: number = p.$size;
    const label: string = p.$label;
    return `${size}${label}`;
  }}
`;

// attrs accept hyphenated attributes
const WithDataAttrs = styled.div.attrs({ "data-foo": "", "aria-label": "dot" })``;
const WithDataAttrsFn = styled.div.attrs(() => ({ "data-foo": "" }))``;

// returned props keep their declared type
// @ts-expect-error - wrong type for a known attribute
const wrongAttrType = styled.input.attrs({ type: 1 })``;
// @ts-expect-error - wrong type for a known custom prop
const wrongCustomPropType = styled(Sized).attrs({ $size: "2" })``;

// props that attrs sets become optional
const SizedStatic = styled(Sized).attrs({ $size: 2 })``;
const SizedDynamic = styled(Sized).attrs(() => ({ $size: 2 }))``;
const sizedStaticUsage = <SizedStatic />;
const sizedOverrideUsage = <SizedStatic $size={3} />;
const sizedDynamicUsage = <SizedDynamic />;
// @ts-expect-error - a prop that attrs sets keeps its type
const sizedWrongUsage = <SizedStatic $size="3" />;
// @ts-expect-error - without attrs the prop stays required
const sizedMissingUsage = <Sized />;
const Labeled = styled.div<{ $size: number; $label: string }>``;
const LabeledWithAttrs = styled(Labeled).attrs({ $size: 2 })``;
const labeledUsage = <LabeledWithAttrs $label="two" />;
// @ts-expect-error - props that attrs does not set stay required
const labeledMissingUsage = <LabeledWithAttrs />;

// attrs work on a component that is generic over several tags
type TitleTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label" | "legend";
const Title = <T extends TitleTag>(
  _: { as: T; size: "small" | "large" } & JSX.IntrinsicElements[T],
) => null;
const TitleWithAttrs = styled(Title).attrs({ as: "h1" })``;
const titleUsage = <TitleWithAttrs size="small" />;
// @ts-expect-error - props that attrs does not set stay required
const titleMissingUsage = <TitleWithAttrs />;

// attrs keep a prop that only one union member has
type Shape = { kind: "circle"; radius: number } | { kind: "text"; label: string };
const ShapeBase = (_: Shape) => null;
const ShapeWithAttrs = styled(ShapeBase).attrs({ radius: 1 })``;
const shapeUsage = <ShapeWithAttrs kind="circle" />;
const shapeOverrideUsage = <ShapeWithAttrs kind="circle" radius={2} />;
const shapeOtherUsage = <ShapeWithAttrs kind="text" label="two" />;
// @ts-expect-error - the other union member keeps its required props
const shapeMissingUsage = <ShapeWithAttrs kind="text" />;

// attrs keep the type of a prop next to an index signature
const IndexedBase = (_: { [key: string]: unknown; $size: number }) => null;
const IndexedWithAttrs = styled(IndexedBase).attrs({ $size: 2 })``;
const indexedUsage = <IndexedWithAttrs />;
// @ts-expect-error - a prop that attrs sets keeps its type
const indexedWrongUsage = <IndexedWithAttrs $size="3" />;

// keyframes returns an animation-name usable in interpolations
const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;
const Spinner = styled.div`
  animation: ${rotate} 1s linear infinite;
`;

// css prop is available on intrinsic elements (via css-prop.d.ts)
const cssPropUsage = (
  <div
    css={css`
      color: red;
    `}
  />
);

// theme APIs: useTheme returns an accessor to the (augmentable) theme
const theme = useTheme();
const themeValue: import("../context/index.ts").YakTheme = theme();
const provider = <YakThemeProvider theme={{}}>{cssPropUsage}</YakThemeProvider>;
// the context itself is a provider taking an accessor (plain objects are rejected)
const override = <YakThemeContext value={() => ({})}>{cssPropUsage}</YakThemeContext>;
// @ts-expect-error - the context value must be an accessor, not a theme object
const invalidOverride = <YakThemeContext value={{}}>{cssPropUsage}</YakThemeContext>;

export {
  buttonUsage,
  customUsage,
  withAttrsUsage,
  Spinner,
  provider,
  themeValue,
  override,
  invalidOverride,
};
