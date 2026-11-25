import React from "react";
import { styled } from "../styled";
import { css } from "../cssLiteral";
import type { YakComponent } from "../publicStyledApi";

type Equal<X, Y> =
  (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2 ? true : false;
const assert = <T extends true>() => {};

const PropsReturnedFromAttrsReachInterpolations = () => {
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
      assert<Equal<typeof p.id, string | undefined>>();
      return "";
    }}
  `;
  <Dot disableAnimation />;
  // props returned from attrs do not become public props
  // @ts-expect-error
  <Dot $disableAnimation />;

  // a static attrs object adds props as well
  const Base = styled.div<{ $size: number }>``;
  styled(Base).attrs({ $size: 2, $label: "two" })`
    ${(p) => {
      const size: number = p.$size;
      const label: string = p.$label;
      return `${size}${label}`;
    }}
  `;

  // the explicit template props from before keep working
  styled.div.attrs(({ disableAnimation }: { disableAnimation?: boolean }) => ({
    $disableAnimation: disableAnimation,
  }))<{ $disableAnimation?: boolean }>`
    ${({ $disableAnimation }) =>
      $disableAnimation &&
      css`
        animation: none;
      `}
  `;

  // an explicit input type keeps the input props in interpolations
  styled.button.attrs<{ $submit?: boolean }>((p) => ({
    type: p.$submit ? "submit" : "button",
  }))`
    ${(p) => {
      assert<Equal<typeof p.$submit, boolean | undefined>>();
      return "";
    }}
  `;
};

const HyphenatedAttributesAreAccepted = () => {
  const Static = styled.div.attrs({ "data-foo": "", "aria-label": "dot" })``;
  const Dynamic = styled.div.attrs(() => ({ "data-foo": "" }))``;
  <Static />;
  <Dynamic />;
};

const ReturnedPropsKeepTheirDeclaredType = () => {
  // @ts-expect-error
  styled.input.attrs({ type: 1 })``;
  // @ts-expect-error
  styled.input.attrs(() => ({ type: 1 }))``;
  const Base = styled.div<{ $size: number }>``;
  // @ts-expect-error
  styled(Base).attrs({ $size: "2" })``;
};

const PropsSetByAttrsBecomeOptional = () => {
  const Sized = styled.div<{ $size: number }>``;
  const Static = styled(Sized).attrs({ $size: 2 })``;
  const Dynamic = styled(Sized).attrs(() => ({ $size: 2 }))``;
  <Static />;
  <Static $size={3} />;
  <Dynamic />;
  // @ts-expect-error
  <Static $size="3" />;
  // @ts-expect-error
  <Sized />;

  // template props that attrs sets become optional as well
  const WithTemplateProps = styled.div.attrs({ $tone: "dark" })<{ $tone: "dark" | "light" }>``;
  <WithTemplateProps />;
  <WithTemplateProps $tone="light" />;

  // props that attrs does not set stay required
  const Labeled = styled.div<{ $size: number; $label: string }>``;
  const LabeledWithAttrs = styled(Labeled).attrs({ $size: 2 })``;
  <LabeledWithAttrs $label="two" />;
  // @ts-expect-error
  <LabeledWithAttrs />;
};

const AttrsOnAComponentThatIsGenericOverTags = () => {
  type Tag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div" | "label" | "legend";
  const Title = <T extends Tag>(
    _: { as: T; size: "small" | "large" } & React.JSX.IntrinsicElements[T],
  ) => null;

  const Static = styled(Title).attrs({ as: "h1" })``;
  <Static size="small" />;
  <Static size="small" as="h2" />;
  // @ts-expect-error
  <Static />;
  // @ts-expect-error
  <Static size="medium" />;

  const Dynamic = styled(Title).attrs(({ size }) => ({ as: "h1", $size: size }))<{
    $tone: string;
  }>`
    ${({ $size, $tone }) => $size + $tone}
  `;
  <Dynamic size="small" $tone="dark" />;
  // @ts-expect-error
  <Dynamic size="small" />;
};

const AttrsKeepUnionProps = () => {
  type Shape = { kind: "circle"; radius: number } | { kind: "text"; label: string };
  const Base = (_: Shape) => null;

  // a key that only one union member has
  const WithRadius = styled(Base).attrs({ radius: 1 })``;
  <WithRadius kind="circle" />;
  <WithRadius kind="circle" radius={2} />;
  <WithRadius kind="text" label="two" />;
  // @ts-expect-error
  <WithRadius kind="text" />;

  // the discriminator of the union
  const WithKind = styled(Base).attrs({ kind: "circle" })``;
  <WithKind radius={2} />;
  // @ts-expect-error
  <WithKind kind="text" radius={2} />;

  const WithTemplateProps = styled.div.attrs({ $radius: 1 })<
    { $kind: "circle"; $radius: number } | { $kind: "text"; $label: string }
  >``;
  <WithTemplateProps $kind="circle" />;
  <WithTemplateProps $kind="circle" $radius={2} />;
  <WithTemplateProps $kind="text" $label="two" />;
};

const AttrsKeepTheTypeNextToAnIndexSignature = () => {
  const Base = (_: { [key: string]: unknown; $size: number }) => null;
  const WithAttrs = styled(Base).attrs({ $size: 2 })``;
  <WithAttrs />;
  <WithAttrs $size={3} />;
  // @ts-expect-error
  <WithAttrs $size="3" />;
};

const AttrsThatSetOnlyOptionalPropsKeepTheTypeShort = () => {
  type DivProps = React.JSX.IntrinsicElements["div"];
  const Static = styled.div.attrs({ id: "a", "data-foo": "" })``;
  assert<Equal<typeof Static, YakComponent<DivProps>>>();
  const WithTemplateProps = styled.div.attrs({ id: "a" })<{ $on: boolean }>``;
  assert<Equal<typeof WithTemplateProps, YakComponent<{ $on: boolean } & DivProps>>>();
};
