import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";
import { calleeName, checkReturnedValues } from "./returnedValues.js";
import { importsYak, isStyledOrCssTag } from "./utils.js";

const expected =
  "A function outside a CSS property in a styled/css literal has to return a css`...` literal or nothing.";

const callWhy =
  "That's why a function here can't return a call. If the call builds styles, make them a css constant and";

const callDocs = "See https://yak.style/docs/troubleshooting#a-call-returned-from-a-function";

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
        "Enforces that a function outside a CSS property in a yak styled/css literal returns a css literal or nothing",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      stringReturn: `${expected} A string adds no styles here. Wrap the CSS in css\`...\`, or write the function after a property like \`color: \${...};\`.`,
      invalidReturn: `${expected} {{kind}} adds no styles here. Write the function after a property like \`color: \${...};\`.`,
      callReturn: `yak can't see the styles that a call like \`{{name}}()\` returns. ${callWhy} use that, like \`{{constant}}\`. If it only does something, like logging, call it without returning its result: \`{{example}}\`. ${callDocs}`,
      callReturnStatement: `yak can't see the styles that a call like \`{{name}}()\` returns. ${callWhy} return that. If it only does something, like a check, call it without returning its result: \`{{example}}\`. ${callDocs}`,
      callReturnWithoutName: `yak can't see the styles that this call returns. ${callWhy} use that. If it only does something, like a check or logging, call it without returning its result. ${callDocs}`,
      taggedTemplateReturn: `${expected} Only a css\`...\` literal adds styles here, and this tagged template is none.`,
      importReturn: `${expected} A mixin from the same file works as is, but a mixin from another file needs a css\`...\` literal around it, or the build fails. Wrap \`{{name}}\` like \`{{fixed}}\`.`,
      wrapInCss: "Wrap `{{name}}` in a css`...` literal",
    },
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    const { before: beforeYak, importedNames, ImportDeclaration: trackYak } = importsYak();
    const imports = new Set<string>();

    /** The source text of a node if it fits on one short line, like `getHelpers().focus` */
    const shortText = (node: ESTree.Node) => {
      const text = context.sourceCode.getText(node);
      return text.length <= 40 && !text.includes("\n") ? text : undefined;
    };

    /** The call as written, like `assertNever($size);`, or `name(...);` for a long or multi-line call */
    const example = (node: ESTree.CallExpression, name: string) => {
      const text = shortText(node);
      return text === undefined ? `${name}(...);` : `${text};`;
    };

    /**
     * The data for a call that an arrow function returns without a `return`,
     * built from the user's code where it has the shape `cond && call()`:
     *
     * ({ $on }) => $on && getFocusRing()
     * -> constant `$on && focusRing`
     * -> example `({ $on }) => { if ($on) getFocusRing(); }`
     *
     * Any other shape, or a part that is too long, gets a generic example
     */
    const expressionData = (
      node: ESTree.CallExpression,
      arrow: ESTree.ArrowFunctionExpression,
      name: string,
    ) => {
      // `getFocusRing` -> `focusRing`, any other name -> `styles`
      const getter = /^get([A-Z])(\w*)$/.exec(name);
      const constant = getter ? `${getter[1].toLowerCase()}${getter[2]}` : "styles";
      const body = arrow.body;
      if (body.type === "LogicalExpression" && body.operator === "&&" && body.right === node) {
        const params = arrow.params.map(shortText);
        const condition = shortText(body.left);
        const call = shortText(node);
        if (condition !== undefined && call !== undefined && !params.includes(undefined)) {
          return {
            name,
            constant: `${condition} && ${constant}`,
            example: `(${params.join(", ")}) => { if (${condition}) ${call}; }`,
          };
        }
      }
      return { name, constant, example: `{ if (condition) ${name}(); }` };
    };

    const check = (node: ESTree.Expression) => {
      switch (node.type) {
        case "CallExpression": {
          // a callee without a plain name, like `getHelpers().focus`, is named by its source text
          const name = calleeName(node.callee) ?? shortText(node.callee);
          if (name === undefined) {
            context.report({ node, messageId: "callReturnWithoutName" });
          } else if (name !== "atoms") {
            const arrow = enclosingArrow(node);
            if (arrow === undefined || arrow.body.type === "BlockStatement") {
              context.report({
                node,
                messageId: "callReturnStatement",
                data: { name, example: example(node, name) },
              });
            } else {
              context.report({
                node,
                messageId: "callReturn",
                data: expressionData(node, arrow, name),
              });
            }
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

/**
 * The arrow function in the styled/css literal that returns `node`. The
 * returned values never come from a nested function, so the closest arrow
 * function is the one in the literal
 */
function enclosingArrow(node: ESTree.Node): ESTree.ArrowFunctionExpression | undefined {
  let current: ESTree.Node | null | undefined = node.parent;
  while (current && current.type !== "ArrowFunctionExpression") {
    current = current.parent;
  }
  return current ?? undefined;
}
