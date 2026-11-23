import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";
import { calleeName, checkReturnedValues } from "./returnedValues.js";
import { importsYak, isStyledOrCssTag } from "./utils.js";

const expected =
  "A function that stands on its own in a styled/css literal has to return a css`...` literal or nothing.";
const fix =
  "Return the css`...` literal, or remove the `return` in front of the call if it only checks something, like";

/**
 * Reports a call or a tagged template other than css`...` that a function
 * standing on its own returns. `@yak/react` compiles the functions of a
 * component into one function that returns its class names. The compiler can
 * not see the class names behind `focusRing()` in
 * `${({ $on }) => $on && focusRing()}`, so the component renders slower.
 *
 * A helper that returns a css`...` literal is valid code, so this rule is not
 * in the recommended config. Only `@yak/react` renders slower for such a
 * call, so the rule only checks files that import `@yak/react`
 */
export const styledFunctionReturnedCalls = createRule("styled-function-returned-calls", {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallows returning a function call from a function that stands on its own in a yak styled/css literal",
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      unclearReturn: `${expected} yak can not see what \`{{name}}()\` returns, and the call makes the component render slower. ${fix} \`{{example}}\`.`,
      unclearReturnWithoutName: `${expected} yak can not see what this call returns, and the call makes the component render slower. ${fix} \`assertNever($size);\`.`,
      unclearTaggedTemplate: `${expected} yak can not see what this tagged template returns, so the component renders slower. Return a css\`...\` literal instead.`,
    },
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    const { before, importedNames, ImportDeclaration } = importsYak(["@yak/react"]);

    /** The call as written, like `assertNever($size);`, or `name(...);` for a long or multi-line call */
    const example = (node: ESTree.CallExpression, name: string) => {
      const text = context.sourceCode.getText(node);
      return text.length <= 40 && !text.includes("\n") ? `${text};` : `${name}(...);`;
    };

    const check = (node: ESTree.Expression) => {
      if (node.type === "CallExpression") {
        const name = calleeName(node.callee);
        if (name === undefined) {
          context.report({ node, messageId: "unclearReturnWithoutName" });
        } else if (name !== "atoms") {
          context.report({
            node,
            messageId: "unclearReturn",
            data: { name, example: example(node, name) },
          });
        }
      } else if (
        node.type === "TaggedTemplateExpression" &&
        isStyledOrCssTag(node, importedNames) !== "css"
      ) {
        context.report({ node, messageId: "unclearTaggedTemplate" });
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
