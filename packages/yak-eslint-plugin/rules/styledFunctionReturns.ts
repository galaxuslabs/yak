import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";
import { calleeName, checkReturnedValues } from "./returnedValues.js";
import { importsYak, isStyledOrCssTag } from "./utils.js";

const expected =
  "A function that stands on its own in a styled/css literal has to return a css`...` literal or nothing.";

const callFix =
  "Write the css`...` literal in this function, or remove the `return` in front of the call if it only checks something, like";

/**
 * Reports a value without styles that a function standing on its own
 * returns. yak drops such a value without any sign:
 *
 * ${({ $on }) => $on && "color: red;"} adds no class name and no CSS
 *
 * A returned call adds no styles either. yak reads a css`...` literal at
 * build time, and only where a styled/css literal uses it directly. A
 * css`...` literal that a helper returns compiles to an empty `css()` call:
 *
 * const focusRing = () => css`outline: 2px solid blue;`;
 * -> const focusRing = () => css();
 *
 * So `${({ $on }) => $on && focusRing()}` adds no class name and no CSS.
 * `atoms()` is the one call that adds class names at runtime
 *
 * An imported mixin that a function returns is empty at runtime too, and the
 * build fails for it. Inside a css`...` literal, yak copies its styles from the
 * other file at build time
 */
export const styledFunctionReturns = createRule("styled-function-returns", {
  meta: {
    type: "problem",
    hasSuggestions: true,
    docs: {
      description:
        "Enforces that a function that stands on its own in a yak styled/css literal returns a css literal or nothing",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      stringReturn: `${expected} A string adds no styles here. Wrap the CSS in css\`...\`, or write the function after a property like \`color: \${...};\`.`,
      invalidReturn: `${expected} {{kind}} adds no styles here. Write the function after a property like \`color: \${...};\`.`,
      callReturn: `${expected} A css\`...\` literal that \`{{name}}()\` returns adds no styles. ${callFix} \`{{example}}\`.`,
      callReturnWithoutName: `${expected} A css\`...\` literal that this call returns adds no styles. ${callFix} \`assertNever($size);\`.`,
      taggedTemplateReturn: `${expected} Only a css\`...\` literal adds styles here, and this tagged template is none.`,
      importReturn: `${expected} A function that returns an imported mixin adds no styles, and the build fails. Wrap \`{{name}}\` in a css\`...\` literal, like \`{{fixed}}\`.`,
      wrapInCss: "Wrap `{{name}}` in a css`...` literal",
    },
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    const { before: beforeYak, importedNames, ImportDeclaration: trackYak } = importsYak();
    const imports = new Set<string>();

    /** The call as written, like `assertNever($size);`, or `name(...);` for a long or multi-line call */
    const example = (node: ESTree.CallExpression, name: string) => {
      const text = context.sourceCode.getText(node);
      return text.length <= 40 && !text.includes("\n") ? `${text};` : `${name}(...);`;
    };

    const check = (node: ESTree.Expression) => {
      switch (node.type) {
        case "CallExpression": {
          const name = calleeName(node.callee);
          if (name === undefined) {
            context.report({ node, messageId: "callReturnWithoutName" });
          } else if (name !== "atoms") {
            context.report({
              node,
              messageId: "callReturn",
              data: { name, example: example(node, name) },
            });
          }
          return;
        }
        case "TaggedTemplateExpression":
          if (isStyledOrCssTag(node, importedNames) !== "css") {
            context.report({ node, messageId: "taggedTemplateReturn" });
          }
          return;
        case "Literal":
          if (node.value === true) {
            context.report({ node, messageId: "invalidReturn", data: { kind: "`true`" } });
          } else if (typeof node.value === "string" && node.value !== "") {
            context.report({ node, messageId: "stringReturn" });
          } else if (typeof node.value === "number" && node.value !== 0) {
            context.report({ node, messageId: "invalidReturn", data: { kind: "A number" } });
          }
          return;
        case "TemplateLiteral":
          context.report({ node, messageId: "stringReturn" });
          return;
        case "BinaryExpression":
          context.report({ node, messageId: "invalidReturn", data: { kind: "A calculation" } });
          return;
        case "ObjectExpression":
          context.report({ node, messageId: "invalidReturn", data: { kind: "An object" } });
          return;
        case "ArrayExpression":
          context.report({ node, messageId: "invalidReturn", data: { kind: "An array" } });
          return;
        case "Identifier":
        case "MemberExpression": {
          const name = rootName(node);
          if (name === undefined || !imports.has(name)) {
            // a prop or a local constant can hold a css`...` literal, only an import surely fails
            return;
          }
          const text = context.sourceCode.getText(node);
          const fixed = `${importedNames.css ?? "css"}\`\${${text}}\``;
          context.report({
            node,
            messageId: "importReturn",
            data: { name: text, fixed },
            suggest: importedNames.css
              ? [
                  {
                    messageId: "wrapInCss",
                    data: { name: text },
                    fix: (fixer) => fixer.replaceText(node, fixed),
                  },
                ]
              : [],
          });
          return;
        }
        default:
          return;
      }
    };

    return {
      before() {
        beforeYak();
        imports.clear();
      },
      ImportDeclaration(node: ESTree.ImportDeclaration) {
        trackYak(node);
        if (node.importKind === "type") {
          return;
        }
        for (const specifier of node.specifiers) {
          if (specifier.type === "ImportSpecifier" && specifier.importKind === "type") {
            continue;
          }
          imports.add(specifier.local.name);
        }
      },
      TaggedTemplateExpression(node: ESTree.TaggedTemplateExpression) {
        checkReturnedValues(node, importedNames, check);
      },
    };
  },
});

/** `mixins` for `mixins.large.focus`, and `undefined` for a computed access like `mixins[name]` */
function rootName(node: ESTree.Node): string | undefined {
  let current = node;
  while (current.type === "MemberExpression" && !current.computed) {
    current = current.object;
  }
  return current.type === "Identifier" ? current.name : undefined;
}
