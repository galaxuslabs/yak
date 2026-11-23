import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";
import { checkReturnedValues } from "./returnedValues.js";
import { importsYak } from "./utils.js";

const expected =
  "A function that stands on its own in a styled/css literal has to return a css`...` literal or nothing.";

/**
 * Reports a value without styles that a function standing on its own
 * returns. yak drops such a value without any sign:
 *
 * ${({ $on }) => $on && "color: red;"} adds no class name and no CSS
 */
export const styledFunctionReturns = createRule("styled-function-returns", {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that a function that stands on its own in a yak styled/css literal returns a css literal or nothing",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      stringReturn: `${expected} A string adds no styles here. Wrap the CSS in css\`...\`, or write the function after a property like \`color: \${...};\`.`,
      invalidReturn: `${expected} {{kind}} adds no styles here. Write the function after a property like \`color: \${...};\`.`,
    },
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    const { before, importedNames, ImportDeclaration } = importsYak();

    const check = (node: ESTree.Expression) => {
      switch (node.type) {
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
        // a prop or a constant can hold a css`...` literal, and
        // `styled-function-returned-calls` checks calls
        default:
          return;
      }
    };

    return {
      before,
      ImportDeclaration,
      TaggedTemplateExpression(node: ESTree.TaggedTemplateExpression) {
        checkReturnedValues(node, importedNames, check);
      },
    };
  },
});
