import { styled } from "@yak/react";

export const Box = styled.div<{ $x: number; $z: number }>`
  /* minus with a unit */
  left: -${({ $x }) => $x}px;
  /* minus without a unit */
  z-index: -${({ $z }) => $z};
  /* minus after a space and inside a function */
  margin: 0 -${({ $x }) => $x}px;
  width: calc(10px + -${({ $x }) => $x}px);
  /* a minus that ends a name is not a sign */
  grid-area: area-${({ $z }) => $z};
  /* a minus inside a string is not a sign */
  &::before {
    content: "a -${({ $z }) => $z}";
  }
`;
