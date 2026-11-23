import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import yakPlugin from "../index.js";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({ languageOptions: { parser: tsParser } });
const rule = yakPlugin.rules["styled-function-returned-calls"] as unknown as Parameters<
  typeof ruleTester.run
>[1];

const react = 'import { atoms, css, styled } from "@yak/react";';
const code = (...lines: string[]) => [react, ...lines].join("\n");

ruleTester.run("yak-styled-function-returned-calls", rule, {
  valid: [
    {
      name: "a css literal, atoms and nothing",
      code: code(
        "styled.div`",
        "  ${({ $on }) => $on && css`color: red;`}",
        "  ${({ $on }) => {",
        '    if ($on) return atoms("flex");',
        "    assertNever($on);",
        "  }}",
        "`;",
      ),
    },
    {
      name: "a function that sets a CSS value",
      code: code("styled.div`", "  width: ${({ $size }) => getWidth($size)}px;", "`;"),
    },
    {
      name: "a string is left to styled-function-returns",
      code: code("styled.div`", '  ${({ $on }) => $on && "color: red;"}', "`;"),
    },
    {
      name: "a file that imports @yak/solid",
      code: [
        'import { styled } from "@yak/solid";',
        "styled.div`",
        "  ${({ theme }) => theme.helpers.focus()}",
        "`;",
      ].join("\n"),
    },
  ],
  invalid: [
    {
      name: "a call in the default case of a switch",
      code: code(
        "styled.div`",
        "  ${({ $size }) => {",
        "    switch ($size) {",
        '      case "s":',
        "        return css`padding: 1px;`;",
        "      default:",
        "        return assertNever($size);",
        "    }",
        "  }}",
        "`;",
      ),
      errors: [
        {
          messageId: "unclearReturn",
          data: { name: "assertNever", example: "assertNever($size);" },
          line: 8,
        },
      ],
    },
    {
      name: "a helper call in a nested css literal",
      code: code(
        "styled.div`",
        "  ${({ $on }) =>",
        "    $on &&",
        "    css`",
        "      ${({ theme }) => theme.helpers.focus(1)}",
        "    `}",
        "`;",
      ),
      errors: [
        {
          messageId: "unclearReturn",
          data: { name: "theme.helpers.focus", example: "theme.helpers.focus(1);" },
          line: 6,
        },
      ],
    },
    {
      name: "a call on the result of a call",
      code: code("styled.div`", "  ${({ $on }) => $on && getHelpers().focus()}", "`;"),
      errors: [{ messageId: "unclearReturnWithoutName", line: 3 }],
    },
    {
      name: "a tagged template other than css",
      code: code(
        "styled.div`",
        "  ${({ $on }) => ($on ? keyframes`from { opacity: 0; }` : styled.span`color: red;`)}",
        "`;",
      ),
      errors: [
        { messageId: "unclearTaggedTemplate", line: 3 },
        { messageId: "unclearTaggedTemplate", line: 3 },
      ],
    },
  ],
});

vitest.describe("styled-function-returned-calls in the recommended config", () => {
  vitest.it("is not set", () => {
    vitest
      .expect(yakPlugin.configs.recommended.rules)
      .not.toHaveProperty("@yak/styled-function-returned-calls");
  });
});
