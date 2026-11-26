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
  valid: [
    "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => { if ($on) console.log('test'); }}`;",
  ],
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
          data: {
            name: "getHelpers().focus",
            constant: "$on && styles",
            example: "({ $on }) => { if ($on) getHelpers().focus(); }",
          },
        },
      ],
    },
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => $on && getFocusRing()}`;",
      errors: [
        {
          messageId: "callReturn",
          data: {
            name: "getFocusRing",
            constant: "$on && focusRing",
            example: "({ $on }) => { if ($on) getFocusRing(); }",
          },
        },
      ],
    },
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $on }) => $on && console.log('test')}`;",
      errors: [
        {
          messageId: "callReturn",
          data: {
            name: "console.log",
            constant: "$on && styles",
            example: "({ $on }) => { if ($on) console.log('test'); }",
          },
        },
      ],
    },
    {
      code: "import { css, styled } from '@yak/react'; styled.div`${({ $size }) => { switch ($size) { case 's': return css`padding: 1px;`; default: return assertNever($size); } }}`;",
      errors: [
        {
          messageId: "callReturnStatement",
          data: { name: "assertNever", example: "assertNever($size);" },
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
