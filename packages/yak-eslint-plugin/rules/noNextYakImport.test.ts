import tsParser from "@typescript-eslint/parser";
import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";
import yakPlugin from "../index.js";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester({ languageOptions: { parser: tsParser } });
const noNextYakImport = yakPlugin.rules["no-next-yak-import"] as unknown as Parameters<
  typeof ruleTester.run
>[1];

ruleTester.run("yak-no-next-yak-import", noNextYakImport, {
  valid: [
    'import { styled } from "@yak/react";',
    'import { withYak } from "@yak/react/withYak";',
    'import { styled } from "@yak/solid";',
    // a package that only starts with the same letters
    'import { foo } from "next-yak-utils";',
    'import { foo } from "next";',
    'const styled = require("@yak/react");',
    'const load = () => import("@yak/react");',
    // `require` with a variable or more than one argument
    "const name = 'next-yak'; require(name);",
    'declare module "@yak/react" { export interface YakTheme { color: string } }',
  ],
  invalid: [
    {
      code: 'import { styled, css } from "next-yak";',
      output: 'import { styled, css } from "@yak/react";',
      errors: [{ messageId: "renamed", data: { source: "@yak/react" } }],
    },
    {
      // the fix keeps the quote character
      code: "import { styled } from 'next-yak';",
      output: "import { styled } from '@yak/react';",
      errors: [{ messageId: "renamed", data: { source: "@yak/react" } }],
    },
    {
      code: 'import type { YakTheme } from "next-yak";',
      output: 'import type { YakTheme } from "@yak/react";',
      errors: [{ messageId: "renamed" }],
    },
    {
      code: 'import "next-yak";',
      output: 'import "@yak/react";',
      errors: [{ messageId: "renamed" }],
    },
    {
      code: 'import { withYak } from "next-yak/withYak";',
      output: 'import { withYak } from "@yak/react/withYak";',
      errors: [{ messageId: "renamed", data: { source: "@yak/react/withYak" } }],
    },
    {
      code: 'import { viteYak } from "next-yak/vite";',
      output: 'import { viteYak } from "@yak/react/vite";',
      errors: [{ messageId: "renamed", data: { source: "@yak/react/vite" } }],
    },
    {
      code: 'import { pluginYak } from "next-yak/rsbuild";',
      output: 'import { pluginYak } from "@yak/react/rsbuild";',
      errors: [{ messageId: "renamed", data: { source: "@yak/react/rsbuild" } }],
    },
    {
      code: 'import { getYakThemeContext } from "next-yak/context/baseContext";',
      output: 'import { getYakThemeContext } from "@yak/react/context/baseContext";',
      errors: [{ messageId: "renamed", data: { source: "@yak/react/context/baseContext" } }],
    },
    {
      code: 'export { styled } from "next-yak";',
      output: 'export { styled } from "@yak/react";',
      errors: [{ messageId: "renamed" }],
    },
    {
      code: 'export * from "next-yak";',
      output: 'export * from "@yak/react";',
      errors: [{ messageId: "renamed" }],
    },
    {
      code: 'const load = () => import("next-yak/static");',
      output: 'const load = () => import("@yak/react/static");',
      errors: [{ messageId: "renamed", data: { source: "@yak/react/static" } }],
    },
    {
      code: 'const { withYak } = require("next-yak/withYak");',
      output: 'const { withYak } = require("@yak/react/withYak");',
      errors: [{ messageId: "renamed", data: { source: "@yak/react/withYak" } }],
    },
    {
      code: 'declare module "next-yak" { export interface YakTheme { color: string } }',
      output: 'declare module "@yak/react" { export interface YakTheme { color: string } }',
      errors: [{ messageId: "renamedModule", data: { source: "@yak/react" } }],
    },
    {
      // a subpath that @yak/react does not export gets no fix
      code: 'import { cssLoader } from "next-yak/loaders/css-loader";',
      output: null,
      errors: [{ messageId: "unknownSubpath", data: { source: "@yak/react/loaders/css-loader" } }],
    },
    {
      code: [
        'import { styled } from "next-yak";',
        'import { withYak } from "next-yak/withYak";',
      ].join("\n"),
      output: [
        'import { styled } from "@yak/react";',
        'import { withYak } from "@yak/react/withYak";',
      ].join("\n"),
      errors: [{ messageId: "renamed" }, { messageId: "renamed" }],
    },
  ],
});
