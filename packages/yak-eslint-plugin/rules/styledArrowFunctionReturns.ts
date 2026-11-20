import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";
import { isInsideCssDeclarationValue } from "./styleConditions.js";
import { importsYak, isStyledOrCssTag } from "./utils.js";

const expected =
  "A function at this place of a styled/css literal adds class names, so it has to return a css`...` literal or nothing.";

/**
 * A function in a styled/css literal has one of two jobs, and its place in
 * the CSS decides which:
 *
 * styled.div`
 *   color: ${({ $color }) => $color};            // sets a CSS value
 *   ${({ $on }) => $on && css`color: red;`}      // adds class names
 * `
 *
 * This rule checks the second kind. Such a function returns a css`...`
 * literal, an `atoms()` call or nothing. A string or a number adds no styles,
 * and yak can not tell what any other call returns
 */
export const styledArrowFunctionReturns = createRule("styled-arrow-function-returns", {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that functions which add class names in yak styled/css literals return a css literal or nothing",
      recommended: false,
      requiresTypeChecking: false,
    },
    messages: {
      invalidReturn: `${expected} {{kind}} adds no styles. To set a CSS value, write the function after a property, e.g. \`color: \${({ $color }) => $color};\`.`,
      unclearReturn: `${expected} yak can not tell what \`{{name}}(...)\` returns, and with \`@yak/react\` the call moves the component to the slower render path. Return the css\`...\` literal here, or return nothing with \`return;\`.`,
    },
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    const { before, importedNames, ImportDeclaration } = importsYak();

    const checkValue = (value: ESTree.Expression) => {
      const node = unwrapTypeCasts(value);
      switch (node.type) {
        // `$on && css`...``, `$mixin || css`...`` and `$on ? css`...` : css`...``
        case "LogicalExpression":
          if (node.operator !== "&&") {
            checkValue(node.left);
          }
          checkValue(node.right);
          return;
        case "ConditionalExpression":
          checkValue(node.consequent);
          checkValue(node.alternate);
          return;
        case "CallExpression": {
          const name = calleeName(node.callee);
          if (name !== "atoms") {
            context.report({ node, messageId: "unclearReturn", data: { name } });
          }
          return;
        }
        case "TaggedTemplateExpression":
          if (isStyledOrCssTag(node, importedNames) !== "css") {
            context.report({
              node,
              messageId: "unclearReturn",
              data: { name: calleeName(node.tag) },
            });
          }
          return;
        case "Literal":
          if (node.value === true) {
            context.report({ node, messageId: "invalidReturn", data: { kind: "`true`" } });
          } else if (typeof node.value === "string" && node.value !== "") {
            context.report({ node, messageId: "invalidReturn", data: { kind: "A string" } });
          } else if (typeof node.value === "number" && node.value !== 0) {
            context.report({ node, messageId: "invalidReturn", data: { kind: "A number" } });
          }
          return;
        case "TemplateLiteral":
          context.report({ node, messageId: "invalidReturn", data: { kind: "A string" } });
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
        // a prop or a constant can hold a css`...` literal
        default:
          return;
      }
    };

    return {
      before,
      ImportDeclaration,
      TaggedTemplateExpression(node: ESTree.TaggedTemplateExpression) {
        if (importedNames.styled === undefined && importedNames.css === undefined) {
          return;
        }
        if (!isStyledOrCssTag(node, importedNames)) {
          return;
        }
        for (const expression of node.quasi.expressions) {
          if (
            expression.type !== "ArrowFunctionExpression" ||
            isInsideCssDeclarationValue(node, expression)
          ) {
            continue;
          }
          if (expression.body.type === "BlockStatement") {
            findReturnValues(expression.body).forEach(checkValue);
          } else {
            checkValue(expression.body);
          }
        }
      },
    };
  },
});

/** The value of every `return` of a function body, without nested functions */
function findReturnValues(root: ESTree.Node): ESTree.Expression[] {
  const values: ESTree.Expression[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value !== "object" || value === null || !("type" in value)) {
      return;
    }
    const node = value as ESTree.Node;
    if (node.type === "ReturnStatement") {
      if (node.argument) {
        values.push(node.argument);
      }
      return;
    }
    if (
      node.type === "ArrowFunctionExpression" ||
      node.type === "FunctionExpression" ||
      node.type === "FunctionDeclaration"
    ) {
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key !== "parent") {
        visit(child);
      }
    }
  };
  visit(root);
  return values;
}

/** `helper` for `helper()`, `theme.helper` for `theme.helper()` */
function calleeName(callee: ESTree.Node): string {
  if (callee.type === "Identifier") {
    return callee.name;
  }
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier"
  ) {
    return `${calleeName(callee.object)}.${callee.property.name}`;
  }
  return "the function";
}

function unwrapTypeCasts(expression: ESTree.Expression): ESTree.Expression {
  let node = expression;
  while (
    node.type === "TSAsExpression" ||
    node.type === "TSSatisfiesExpression" ||
    node.type === "TSNonNullExpression" ||
    node.type === "TSTypeAssertion"
  ) {
    node = node.expression;
  }
  return node;
}
