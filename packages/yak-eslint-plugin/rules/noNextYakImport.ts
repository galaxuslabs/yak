import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";

const oldPackage = "next-yak";
const newPackage = "@yak/react";

/**
 * The subpaths of `next-yak` 9 that `@yak/react` exports under the same name,
 * like `next-yak/withYak` -> `@yak/react/withYak`. The fix rewrites only
 * these, because their new path is certain
 */
const renamedSubpaths = new Set([
  "context",
  "context/baseContext",
  "cross-file-resolver",
  "internal",
  "isolated-source-eval",
  "jsx-dev-runtime",
  "jsx-runtime",
  "loaders/webpack-loader",
  "rsbuild",
  "static",
  "vite",
  "withYak",
]);

/**
 * Reports a module path of the old package name `next-yak`, which `@yak/swc`
 * no longer compiles. A file that imports `styled` from `next-yak` builds
 * without errors, but its styles are missing:
 *
 * import { styled } from "next-yak"; -> import { styled } from "@yak/react";
 *
 * The rule checks `import`, `export ... from`, `import()`, `require()` and
 * `declare module "next-yak"`, the declaration that adds types to the theme
 */
export const noNextYakImport = createRule("no-next-yak-import", {
  meta: {
    type: "problem",
    docs: {
      description: "Reports imports from next-yak, which is now @yak/react",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      renamed: `${oldPackage} is now ${newPackage}: import from "{{source}}".`,
      renamedModule: `${oldPackage} is now ${newPackage}: declare the module "{{source}}".`,
      unknownSubpath: `${oldPackage} is now ${newPackage}, but "{{source}}" does not exist: import from "${newPackage}" or one of its subpaths like "${newPackage}/withYak".`,
    },
    fixable: "code",
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    /** Reports `node` if it is the string literal `"next-yak"` or `"next-yak/<subpath>"` */
    const check = (node: ESTree.Node | null | undefined, kind: "import" | "module") => {
      if (node?.type !== "Literal" || typeof node.value !== "string") {
        return;
      }
      const subpath = getSubpath(node.value);
      if (subpath === undefined) {
        return;
      }
      if (subpath !== "" && !renamedSubpaths.has(subpath)) {
        context.report({
          node,
          messageId: "unknownSubpath",
          data: { source: `${newPackage}/${subpath}` },
        });
        return;
      }
      const source = subpath === "" ? newPackage : `${newPackage}/${subpath}`;
      // keep the quote character the file uses
      const quote = context.sourceCode.getText(node)[0];
      context.report({
        node,
        messageId: kind === "module" ? "renamedModule" : "renamed",
        data: { source },
        fix: (fixer) => fixer.replaceText(node, `${quote}${source}${quote}`),
      });
    };

    return {
      ImportDeclaration(node: ESTree.ImportDeclaration) {
        check(node.source, "import");
      },
      ExportNamedDeclaration(node: ESTree.ExportNamedDeclaration) {
        check(node.source, "import");
      },
      ExportAllDeclaration(node: ESTree.ExportAllDeclaration) {
        check(node.source, "import");
      },
      ImportExpression(node: ESTree.ImportExpression) {
        check(node.source, "import");
      },
      CallExpression(node: ESTree.CallExpression) {
        if (
          node.callee.type === "Identifier" &&
          node.callee.name === "require" &&
          node.arguments.length === 1
        ) {
          check(node.arguments[0], "import");
        }
      },
      TSModuleDeclaration(node: ESTree.TSModuleDeclaration) {
        check(node.id, "module");
      },
    };
  },
});

/** `""` for `next-yak`, `"withYak"` for `next-yak/withYak` and `undefined` for any other module */
function getSubpath(source: string): string | undefined {
  if (source === oldPackage) {
    return "";
  }
  return source.startsWith(`${oldPackage}/`) ? source.slice(oldPackage.length + 1) : undefined;
}
