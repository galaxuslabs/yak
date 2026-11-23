import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import yakPlugin from "../index.js";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({ languageOptions: { parser: tsParser } });
const rule = yakPlugin.rules["styled-function-returns"] as unknown as Parameters<
  typeof ruleTester.run
>[1];

const react = 'import { atoms, css, styled } from "@yak/react";';
const code = (...lines: string[]) => [react, ...lines].join("\n");

ruleTester.run("yak-styled-function-returns", rule, {
  valid: [
    {
      name: "a css literal behind a condition",
      code: code(
        "styled.div`",
        "  ${({ $on }) => $on && css`color: red;`}",
        "  ${({ $on }) => ($on ? css`color: red;` : css`color: blue;`)}",
        "  ${({ $mixin }) => $mixin || css`color: red;`}",
        "`;",
      ),
    },
    {
      name: "nothing, a falsy value and atoms",
      code: code(
        "styled.div`",
        "  ${({ $on }) => {",
        "    if ($on) return css`color: red;`;",
        "    if ($on === 0) return;",
        "    if ($on === 1) return null;",
        "    if ($on === 2) return false;",
        '    return atoms("flex");',
        "  }}",
        "`;",
      ),
    },
    {
      name: "a prop or a constant that can hold a css literal",
      code: code(
        "const large = css`padding: 2px;`;",
        "styled.div`",
        "  ${({ $big, $mixin }) => ($big ? large : $mixin)}",
        "  ${({ theme }) => theme.mixins.focus}",
        "`;",
      ),
    },
    {
      name: "a function that sets a CSS value",
      code: code(
        "styled.div`",
        '  color: ${({ $on }) => ($on ? "red" : "blue")};',
        "  width: ${({ $size }) => getWidth($size)}px;",
        "  margin: 0 ${({ $size }) => {",
        "    switch ($size) {",
        '      case "s":',
        "        return 1;",
        "      default:",
        "        return assertNever($size);",
        "    }",
        "  }}px;",
        "`;",
      ),
    },
    {
      name: "a returned call or tagged template",
      code: code(
        "styled.div`",
        "  ${({ theme }) => theme.helpers.focus(1)}",
        "  ${({ $on }) => $on && keyframes`from { opacity: 0; }`}",
        "`;",
      ),
    },
    {
      name: "a function inside a returned function is not checked",
      code: code("styled.div`", '  ${({ $on }) => $on && css`color: ${() => "red"};`}', "`;"),
    },
    {
      name: "a file without yak",
      code: 'styled.div`${({ $on }) => $on && "red"}`;',
    },
  ],
  invalid: [
    {
      name: "a string",
      code: code("styled.div`", '  ${({ $on }) => $on && "color: red;"}', "`;"),
      errors: [{ messageId: "stringReturn", line: 3 }],
    },
    {
      name: "a template string in a block body",
      code: code(
        "styled.div`",
        "  ${({ $color }) => {",
        "    if ($color) {",
        "      return `color: ${$color};`;",
        "    }",
        "  }}",
        "`;",
      ),
      errors: [{ messageId: "stringReturn", line: 5 }],
    },
    {
      name: "a number and true in a ternary",
      code: code("styled.div`", "  ${({ $on }) => ($on ? 12 : true)}", "`;"),
      errors: [
        { messageId: "invalidReturn", data: { kind: "A number" }, line: 3 },
        { messageId: "invalidReturn", data: { kind: "`true`" }, line: 3 },
      ],
    },
    {
      name: "a calculation and an object",
      code: code(
        "styled.div`",
        "  ${({ $size }) => $size * 2}",
        '  ${({ $on }) => $on && { color: "red" }}',
        "`;",
      ),
      errors: [
        { messageId: "invalidReturn", data: { kind: "A calculation" }, line: 3 },
        { messageId: "invalidReturn", data: { kind: "An object" }, line: 4 },
      ],
    },
    {
      name: "an array",
      code: code("styled.div`", "  ${({ $on }) => $on && [css`color: red;`]}", "`;"),
      errors: [{ messageId: "invalidReturn", data: { kind: "An array" }, line: 3 }],
    },
    {
      name: "a string with @yak/solid",
      code: [
        'import { styled } from "@yak/solid";',
        "styled.div`",
        '  ${({ $on }) => $on && "color: red;"}',
        "`;",
      ].join("\n"),
      errors: [{ messageId: "stringReturn", line: 3 }],
    },
  ],
});

vitest.describe("styled-function-returns in the recommended config", () => {
  vitest.it("is an error", () => {
    vitest
      .expect(yakPlugin.configs.recommended.rules["@yak/styled-function-returns"])
      .toBe("error");
  });
});
