import { styled, css } from "@yak/react";

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

// One style object for a styled component and a plain element. The styled
// component adds its CSS variable for `width` to its own style only
const sharedStyle = { opacity: 0.5 };

export default function App() {
  return (
    <>
      <Bar data-testid="bar-active" $width={200} $active={true} />
      <Bar data-testid="bar-inactive" $width={100} $active={false} />
      <Sized data-testid="sized" $size={3} $on={true} />
      <Bar data-testid="bar-shared-style" style={sharedStyle} $width={50} $active={false} />
      <span data-testid="shared-style" style={sharedStyle} />
    </>
  );
}
