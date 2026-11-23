import React from "react";
import { styled } from "../styled";
import { css } from "../cssLiteral";

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
