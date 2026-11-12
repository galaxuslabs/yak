import { styled } from "@yak/react";
// babel/babel#18264: Babel 8.1.0 cannot parse an async arrow with a return type in a conditional
export const load = ready ? async (): Promise<void> => {} : null;
export const Button = styled.button`
  .dark & {
    color: white;
  }
`;
