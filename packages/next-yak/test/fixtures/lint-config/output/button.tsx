import { styled } from "@yak/react";

// eslint-disable-next-line @yak/style-conditions -- the condition is static
export const Button = styled.button`
  color: red;
`;
const rules = ["style-conditions"] as const;
const ruleNames = [
  "enforce-semicolon",
  "style-conditions",
] as const;
lint.enable("yak/css-global-deprecated");
