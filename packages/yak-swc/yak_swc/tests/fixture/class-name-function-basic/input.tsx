import { styled, css } from "@yak/react";

export const Button = styled.button<{ $active: boolean; $sth: boolean }>`
  color: blue;
  ${({ $active }) => $active && css`background-color: purple;`}
  ${({ $sth }) => $sth && css`
    color: green;
    ${({ $active }) => $active ? css`color: white;` : css`color: black;`}
  `}
`;
