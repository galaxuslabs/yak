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
  valid: [
    "import { css, styled } from '@yak/react'; styled.div`width: ${({ $on, $big }) => { if ($on) { if ($big) return $big ? 1 : 2; } if ($big) return 3; return 4; }}px;`;",
  ],
  invalid: [
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => { const on = !$on; return on && css`color: red;`; }}`;",
      errors: [{ messageId: "constInitializer" }],
    },
    {
      code: "import { css, styled } from '@yak/react'; styled.div`width: ${({ $on, $big, $w }) => { if ($on) { if ($big) return $w; } if ($big) return 3; return 4; }}px;`;",
      errors: [{ messageId: "nullishReturn" }],
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

ruleTester.run("@yak/no-next-yak-import", yakPlugin.rules["no-next-yak-import"], {
  valid: ["import { styled } from '@yak/react';"],
  invalid: [
    {
      code: "import { styled } from 'next-yak';",
      output: "import { styled } from '@yak/react';",
      errors: [{ messageId: "renamed" }],
    },
    {
      code: "const load = () => import('next-yak/withYak'); require('next-yak/vite');",
      output: "const load = () => import('@yak/react/withYak'); require('@yak/react/vite');",
      errors: [{ messageId: "renamed" }, { messageId: "renamed" }],
    },
    {
      code: "declare module 'next-yak' { export interface YakTheme { color: string } }",
      output: "declare module '@yak/react' { export interface YakTheme { color: string } }",
      errors: [{ messageId: "renamedModule" }],
    },
    {
      code: "import { cssLoader } from 'next-yak/loaders/css-loader';",
      output: null,
      errors: [{ messageId: "unknownSubpath" }],
    },
  ],
});
