import { component$ } from "@qwik.dev/core";
import { styled, css } from "@yak/qwik";

const Bar = styled.div<{ $width: number; $active: boolean }>`
  height: 20px;
  width: ${(props) => props.$width}px;
  ${(props) =>
    props.$active
      ? css`
          background-color: green;
        `
      : css`
          background-color: gray;
        `}
`;

// A constant of the module with the name of a prop: the second condition
// reads the constant, so `Sized` gets the width and keeps its height
const $size = 1;

const Sized = styled.div<{ $size: number; $on: boolean }>`
  width: 10px;
  height: 10px;
  ${({ $size }) =>
    $size > 2 &&
    css`
      width: 30px;
    `}
  ${(props) =>
    props.$on &&
    $size > 2 &&
    css`
      height: 30px;
    `}
`;

// Conditions written as statements: a `switch` picks the color, an `if` with
// early returns picks the padding and the margin
const Tag = styled.span<{ $variant: "primary" | "danger" | "ghost"; $size?: "s" | "l" }>`
  display: inline-block;
  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return css`
          color: blue;
        `;
      case "danger":
        return css`
          color: red;
        `;
      default:
        return css`
          color: gray;
        `;
    }
  }}
  ${({ $size }) => {
    if ($size === "s") {
      return css`
        padding: 1px;
      `;
    }
    if ($size === "l") {
      return css`
        padding: 3px;
      `;
    }
  }}
  margin-left: ${({ $size }) => {
    if ($size === "l") {
      return 8;
    }
    return 4;
  }}px;
`;

// `||` adds the styles on its right side when the left side is falsy
const Fallback = styled.div<{ $label?: string }>`
  height: 10px;
  ${({ $label }) =>
    $label ||
    css`
      height: 30px;
    `}
`;

// One style object for a styled component and a plain element. The styled
// component adds its CSS variable for `width` to its own style only
const sharedStyle = { opacity: 0.5 };

export default component$(() => (
  <>
    <Bar data-testid="bar-active" $width={200} $active={true} />
    <Bar data-testid="bar-inactive" $width={100} $active={false} />
    <Sized data-testid="sized" $size={3} $on={true} />
    <Fallback data-testid="fallback" />
    <Fallback data-testid="fallback-label" $label="label" />
    <Bar data-testid="bar-shared-style" style={sharedStyle} $width={50} $active={false} />
    <span data-testid="shared-style" style={sharedStyle} />
    <Tag data-testid="tag-primary" $variant="primary" $size="s" />
    <Tag data-testid="tag-danger" $variant="danger" $size="l" />
    <Tag data-testid="tag-ghost" $variant="ghost" />
  </>
));
