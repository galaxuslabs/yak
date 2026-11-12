import { styled } from "next-yak";

// eslint-disable-next-line yak/style-conditions -- the condition is static
export const Button = styled.button`
  color: red;
`;
const rules = ["style-conditions", "css-global-deprecated"] as const;
const ruleNames = [
  "enforce-semicolon",
  "style-conditions",
  "css-global-deprecated",
] as const;
lint.enable("yak/css-global-deprecated");
