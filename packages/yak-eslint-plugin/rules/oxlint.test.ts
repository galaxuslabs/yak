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

ruleTester.run("@yak/styled-function-fast-path", yakPlugin.rules["styled-function-fast-path"], {
  valid: [],
  invalid: [
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => { const on = !$on; return on && css`color: red;`; }}`;",
      errors: [{ messageId: "constInitializer" }],
    },
  ],
});

ruleTester.run("@yak/styled-function-returns", yakPlugin.rules["styled-function-returns"], {
  valid: [],
  invalid: [
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => $on && 'color: red;'}`;",
      errors: [{ messageId: "stringReturn" }],
    },
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => $on && helper()}`;",
      errors: [{ messageId: "callReturn" }],
    },
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => $on && getHelpers().focus()}`;",
      errors: [
        {
          messageId: "callReturn",
          data: { name: "getHelpers().focus", example: "getHelpers().focus();" },
        },
      ],
    },
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => $on && getHelpers({\n}).focus()}`;",
      errors: [{ messageId: "callReturnWithoutName" }],
    },
    {
      code: [
        'import { styled, css } from "@yak/react";',
        'import { outlined } from "./mixins";',
        "styled.div`${({ $on }) => $on && outlined}`;",
      ].join("\n"),
      errors: [
        {
          messageId: "importReturn",
          suggestions: [
            {
              messageId: "wrapInCss",
              output: [
                'import { styled, css } from "@yak/react";',
                'import { outlined } from "./mixins";',
                "styled.div`${({ $on }) => $on && css`${outlined}`}`;",
              ].join("\n"),
            },
          ],
        },
      ],
    },
  ],
});
