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
      name: "an imported mixin in a css literal, used directly, and local values",
      code: code(
        'import { outlined, buttonClasses } from "./mixins";',
        'import type { Theme } from "./theme";',
        "const local = css`color: red;`;",
        "const buttonAtoms = atoms(buttonClasses);",
        "styled.div`",
        "  ${outlined};",
        "  ${({ $on }) => $on && css`${outlined}`}",
        "  ${({ $on }) => $on && local}",
        "  ${({ $on }) => $on && buttonAtoms}",
        "  ${({ $on, theme }) => $on && (theme as Theme)}",
        "`;",
      ),
    },
    {
      name: "an imported value after a property sets a CSS value",
      code: code(
        'import { colors } from "./tokens";',
        "styled.div`",
        "  color: ${({ $on }) => ($on ? colors.primary : colors.secondary)};",
        "`;",
      ),
    },
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
      name: "a call that is not returned",
      code: code(
        "styled.div`",
        "  ${({ $size }) => {",
        "    if ($size === 1) return css`color: red;`;",
        "    assertNever($size);",
        "  }}",
        "  width: ${({ $size }) => getWidth($size)}px;",
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
      name: "an imported mixin behind a condition",
      code: code(
        'import { outlined } from "./mixins";',
        "styled.div`",
        "  ${({ $on }) => $on && outlined}",
        "`;",
      ),
      errors: [
        {
          messageId: "importReturn",
          line: 4,
          suggestions: [
            {
              messageId: "wrapInCss",
              output: code(
                'import { outlined } from "./mixins";',
                "styled.div`",
                "  ${({ $on }) => $on && css`${outlined}`}",
                "`;",
              ),
            },
          ],
        },
      ],
    },
    {
      name: "a member of an imported namespace in a return",
      code: code(
        'import * as mixins from "./mixins";',
        "styled.div`",
        "  &:hover {",
        "    ${({ $on }) => {",
        "      if ($on) return mixins.large;",
        "      return null;",
        "    }}",
        "  }",
        "`;",
      ),
      errors: [
        {
          messageId: "importReturn",
          line: 6,
          suggestions: [
            {
              messageId: "wrapInCss",
              output: code(
                'import * as mixins from "./mixins";',
                "styled.div`",
                "  &:hover {",
                "    ${({ $on }) => {",
                "      if ($on) return css`${mixins.large}`;",
                "      return null;",
                "    }}",
                "  }",
                "`;",
              ),
            },
          ],
        },
      ],
    },
    {
      name: "an imported mixin without an import of css gets no suggestion",
      code: [
        'import { styled } from "@yak/react";',
        'import { outlined } from "./mixins";',
        "styled.div`",
        "  ${({ $on }) => ($on ? outlined : null)}",
        "`;",
      ].join("\n"),
      errors: [{ messageId: "importReturn", line: 4, suggestions: [] }],
    },
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
          messageId: "callReturn",
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
          messageId: "callReturn",
          data: { name: "theme.helpers.focus", example: "theme.helpers.focus(1);" },
          line: 6,
        },
      ],
    },
    {
      name: "a call on the result of a call",
      code: code("styled.div`", "  ${({ $on }) => $on && getHelpers().focus()}", "`;"),
      errors: [{ messageId: "callReturnWithoutName", line: 3 }],
    },
    {
      name: "a tagged template other than css",
      code: code(
        "styled.div`",
        "  ${({ $on }) => ($on ? keyframes`from { opacity: 0; }` : styled.span`color: red;`)}",
        "`;",
      ),
      errors: [
        { messageId: "taggedTemplateReturn", line: 3 },
        { messageId: "taggedTemplateReturn", line: 3 },
      ],
    },
    {
      name: "a helper call with @yak/solid",
      code: [
        'import { styled } from "@yak/solid";',
        "styled.div`",
        "  ${({ theme }) => theme.helpers.focus()}",
        "`;",
      ].join("\n"),
      errors: [{ messageId: "callReturn", line: 3 }],
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
