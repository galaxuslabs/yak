import { styled } from "@yak/react";
import { radius } from "./radius";

const Frame = styled.div`
  border-radius: ${radius.small};
  border: 1px solid;
`;

export function Card(props: { children: string }) {
  return <Frame data-testid="card">{props.children}</Frame>;
}
