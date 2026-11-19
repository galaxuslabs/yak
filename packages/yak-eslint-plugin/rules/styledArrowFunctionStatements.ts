import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";
import { importsYak, isStyledOrCssTag } from "./utils.js";

const hint =
  "Write the logic with `if`, `else`, `switch` and `return` only, or as an expression like `({ $active }) => $active && css`...``.";

/**
 * yak compiles the functions of a styled component into one function that
 * returns its class names:
 *
 * ({ $size }) => { if ($size === "s") return css`...`; return css`...`; }
 * -> ($size === "s" ? " yB1" : " yB2")
 *
 * That works for a body of `if`, `else`, `switch` and `return`. Every other
 * statement has no place in an expression, so the component falls back to the
 * slower render path. This rule reports those statements
 *
 * Only `@yak/react` compiles this way
 */
export const styledArrowFunctionStatements = createRule("styled-arrow-function-statements", {
  meta: {
    type: "problem",
    docs: {
      description:
        "Enforces that functions in yak styled/css literals only use if, else, switch and return, so the component keeps the fast render path",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      statement: `A {{statement}} inside a function of a styled/css literal moves the component to the slower render path. ${hint}`,
      functionExpression:
        "A `function` expression inside a styled/css literal moves the component to the slower render path. Use an arrow function, e.g. `({ $active }) => $active && css`...``.",
      branchWithoutReturn: `This {{statement}} can end without a \`return\` and more than a single \`return\` follows it, which moves the component to the slower render path. Return in every branch or move the code after it into the branches. ${hint}`,
      switchDiscriminant:
        "A `switch` inside a styled/css literal has to switch on a prop like `$variant` or `props.$variant`. A call or a calculation moves the component to the slower render path. Use `if` and `return` for it.",
      switchCaseTest:
        'A `case` inside a styled/css literal has to be a value like `"small"`, `1`, `SMALL` or `Size.Small`. A call or a calculation moves the component to the slower render path. Use `if` and `return` for it.',
      switchCaseWithoutReturn:
        "Every `case` inside a styled/css literal has to end with a `return`. A `break` or a `case` that runs into the next one moves the component to the slower render path.",
      switchDefaultNotLast:
        "The `default` case inside a styled/css literal has to be the last one. Any other order moves the component to the slower render path.",
    },
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    const { before, importedNames, ImportDeclaration } = importsYak(["@yak/react"]);

    /** Reports every statement of a function body the compiler can not turn into an expression */
    const checkStatements = (statements: readonly ESTree.Statement[]) => {
      statements.forEach((statement, index) => {
        // the compiler copies a single `return` into a branch that ends without one
        const rest = statements.slice(index + 1);
        const hasCodeAfter =
          rest.some((next) => next.type !== "EmptyStatement") &&
          !(rest.length === 1 && rest[0].type === "ReturnStatement");
        switch (statement.type) {
          case "ReturnStatement":
          case "EmptyStatement":
            return;
          case "BlockStatement":
            if (hasCodeAfter && !alwaysReturns([statement])) {
              context.report({
                node: statement,
                messageId: "branchWithoutReturn",
                data: { statement: "block" },
              });
            }
            checkStatements(statement.body);
            return;
          case "IfStatement":
            if (hasCodeAfter && !alwaysReturns([statement.consequent])) {
              context.report({
                node: statement,
                messageId: "branchWithoutReturn",
                data: { statement: "`if` branch" },
              });
            } else if (
              hasCodeAfter &&
              statement.alternate &&
              !alwaysReturns([statement.alternate])
            ) {
              context.report({
                node: statement.alternate,
                messageId: "branchWithoutReturn",
                data: { statement: "`else` branch" },
              });
            }
            checkStatements([statement.consequent]);
            if (statement.alternate) {
              checkStatements([statement.alternate]);
            }
            return;
          case "SwitchStatement":
            checkSwitch(statement);
            return;
          default:
            context.report({
              node: statement,
              messageId: "statement",
              data: { statement: statementNames[statement.type] ?? "statement" },
            });
        }
      });
    };

    const checkSwitch = (statement: ESTree.SwitchStatement) => {
      if (!isPlainRead(statement.discriminant)) {
        context.report({ node: statement.discriminant, messageId: "switchDiscriminant" });
      }
      statement.cases.forEach((switchCase, index) => {
        const isLast = index === statement.cases.length - 1;
        if (switchCase.test === null) {
          if (!isLast) {
            context.report({ node: switchCase, messageId: "switchDefaultNotLast" });
          }
        } else if (!isCaseValue(switchCase.test)) {
          context.report({ node: switchCase.test, messageId: "switchCaseTest" });
        }
        // `case "s": case "m": return ...` shares the statements of the next case
        if (switchCase.consequent.length === 0 && !isLast) {
          return;
        }
        if (!alwaysReturns(switchCase.consequent)) {
          context.report({ node: switchCase, messageId: "switchCaseWithoutReturn" });
        }
        checkStatements(switchCase.consequent.filter((inner) => inner.type !== "BreakStatement"));
      });
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
          if (expression.type === "FunctionExpression") {
            context.report({ node: expression, messageId: "functionExpression" });
          } else if (
            expression.type === "ArrowFunctionExpression" &&
            expression.body.type === "BlockStatement"
          ) {
            checkStatements(expression.body.body);
          }
        }
      },
    };
  },
});

const statementNames: Partial<Record<ESTree.Statement["type"], string>> = {
  VariableDeclaration: "variable declaration",
  ExpressionStatement: "statement like a function call or an assignment",
  DebuggerStatement: "`debugger` statement",
  ForStatement: "loop",
  ForInStatement: "loop",
  ForOfStatement: "loop",
  WhileStatement: "loop",
  DoWhileStatement: "loop",
  TryStatement: "`try` statement",
  ThrowStatement: "`throw` statement",
  FunctionDeclaration: "function declaration",
  BreakStatement: "`break` statement",
  LabeledStatement: "label",
};

/** True if no path through the statements ends without a `return` */
function alwaysReturns(statements: readonly ESTree.Statement[]): boolean {
  return statements.some((statement) => {
    switch (statement.type) {
      case "ReturnStatement":
        return true;
      case "BlockStatement":
        return alwaysReturns(statement.body);
      case "IfStatement":
        return (
          statement.alternate != null &&
          alwaysReturns([statement.consequent]) &&
          alwaysReturns([statement.alternate])
        );
      case "SwitchStatement":
        return (
          statement.cases.some((switchCase) => switchCase.test === null) &&
          statement.cases.every(
            (switchCase) =>
              switchCase.consequent.length === 0 || alwaysReturns(switchCase.consequent),
          ) &&
          (statement.cases[statement.cases.length - 1]?.consequent.length ?? 0) > 0
        );
      default:
        return false;
    }
  });
}

/** `$size`, `props.$size` or `props.theme.mode`, with or without a type cast */
function isPlainRead(expression: ESTree.Expression): boolean {
  const node = unwrapTypeCasts(expression);
  if (node.type === "Identifier") {
    return true;
  }
  return (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.object.type !== "Super" &&
    isPlainRead(node.object)
  );
}

/** `"s"`, `1`, `SMALL` or `Size.Small` */
function isCaseValue(expression: ESTree.Expression): boolean {
  const node = unwrapTypeCasts(expression);
  if (node.type !== "Literal") {
    return isPlainRead(node);
  }
  return (
    (node.value === null ||
      typeof node.value === "string" ||
      typeof node.value === "number" ||
      typeof node.value === "boolean") &&
    !("regex" in node && node.regex)
  );
}

function unwrapTypeCasts(expression: ESTree.Expression): ESTree.Expression {
  let node = expression;
  while (
    node.type === "TSAsExpression" ||
    node.type === "TSNonNullExpression" ||
    node.type === "TSSatisfiesExpression" ||
    node.type === "TSTypeAssertion" ||
    node.type === "ParenthesizedExpression"
  ) {
    node = node.expression;
  }
  return node;
}
