import { RuleTester } from "oxlint/plugins-dev";
import * as vitest from "vitest";
import yakPlugin from "../index.js";

RuleTester.it = vitest.it;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({
  languageOptions: {
    parserOptions: {
      lang: "ts",
    },
  },
});

ruleTester.run("@yak/css-nesting-operator", yakPlugin.rules["css-nesting-operator"], {
  valid: [],
  invalid: [
    {
      code: ['import { styled } from "@yak/react";', "styled.div`", "  > div { }", "`;"].join("\n"),
      errors: [
        {
          messageId: "missingNestingOperator",
          suggestions: [
            {
              messageId: "missingNestingOperator",
              output: [
                'import { styled } from "@yak/react";',
                "styled.div`",
                "  & > div { }",
                "`;",
              ].join("\n"),
            },
          ],
        },
      ],
    },
  ],
});

ruleTester.run("@yak/enforce-semicolon", yakPlugin.rules["enforce-semicolon"], {
  valid: [],
  invalid: [
    {
      code: ['import { styled } from "@yak/react";', "styled.div`", "  ${mixin}", "`;"].join("\n"),
      output: ['import { styled } from "@yak/react";', "styled.div`", "  ${mixin};", "`;"].join(
        "\n",
      ),
      errors: [{ messageId: "lonelyExpression" }],
    },
  ],
});

ruleTester.run("@yak/style-conditions", yakPlugin.rules["style-conditions"], {
  valid: [],
  invalid: [
    {
      code: "import { css } from '@yak/react'; css`color: ${({ variant }) => (variant ? 'red' : 'blue')}`;",
      errors: [{ messageId: "invalidRuntimeReturnValueWithExample" }],
    },
  ],
});

ruleTester.run(
  "@yak/styled-arrow-function-statements",
  yakPlugin.rules["styled-arrow-function-statements"],
  {
    valid: [],
    invalid: [
      {
        code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => { const on = !$on; return on && css`color: red;`; }}`;",
        errors: [{ messageId: "constInitializer" }],
      },
    ],
  },
);

ruleTester.run(
  "@yak/styled-arrow-function-returns",
  yakPlugin.rules["styled-arrow-function-returns"],
  {
    valid: [],
    invalid: [
      {
        code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => $on && 'color: red;'}`;",
        errors: [{ messageId: "invalidReturn" }],
      },
    ],
  },
);
