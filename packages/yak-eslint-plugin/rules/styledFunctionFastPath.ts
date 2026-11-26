import type { ESTree } from "@oxlint/plugins";
import { createRule } from "../utils.js";
import { isInsideCssDeclarationValue } from "./styleConditions.js";
import { importsYak, isStyledOrCssTag, unwrapTypeCasts } from "./utils.js";

const slower = "in a function of a styled/css literal makes the component render slower.";

/**
 * yak compiles the functions of a styled component into one function that
 * returns its class names:
 *
 * ({ $size }) => { if ($size === "s") return css`...`; return css`...`; }
 * -> ($size === "s" ? " yB1" : " yB2")
 *
 * That works for a body of `if`, `else`, `switch` and `return`. A call like
 * `assertNever($size);` also works: the compiler keeps it at its place. So
 * does a `const` that names a prop read: the compiler writes the read at
 * each use of the name.
 * Every other statement has no place in an expression, so the component
 * renders slower. This rule reports those statements
 *
 * Only `@yak/react` compiles this way
 */
export const styledFunctionFastPath = createRule("styled-function-fast-path", {
  meta: {
    type: "problem",
    docs: {
      description:
        "Reports code in functions of yak styled/css literals that makes the component render slower",
      recommended: true,
      requiresTypeChecking: false,
    },
    messages: {
      statement: `{{statement}} ${slower} Write the logic with \`if\`, \`switch\`, \`return\` and \`const\` only.`,
      variable: `{{statement}} ${slower} Use a \`const\` that names one prop read, like \`const size = $layout.size;\`.`,
      constInitializer:
        "`const {{name}}` holds more than a prop read, so the component renders slower. A `const` can name a prop read like `const size = $layout.size;`. Write the expression where you use `{{name}}`.",
      functionExpression:
        "A `function` expression in a styled/css literal makes the component render slower. Use an arrow function like `({ $active }) => { if ($active) return css`...`; }`.",
      nullishReturn:
        "This `return` can be `undefined` or `null`, so the component renders slower. In a CSS value like `width: ${...}px`, the {{statement}} around it can end without `return` while more code follows. Return a value that is never `undefined` or `null` here, like a number or a string.",
      propsObject:
        "`{{name}}` is passed on as a whole object, so the component renders slower. Read the props by name and pass those, like `({ $a, $b }) => helper({ $a, $b })`.",
      propsComputedKey:
        "`{{name}}[...]` reads a prop by a computed key, so the component renders slower. Read the props by name, like `{{name}}.$active`.",
      restParameter:
        "`...{{name}}` collects the other props into a new object, so the component renders slower. Destructure the props by name and pass those, like `({ $a, $b }) => helper({ $a, $b })`.",
      switchDiscriminant:
        "A `switch` in a styled/css literal has to switch on a prop like `$variant` or `props.$variant`, or the component renders slower. Use `if` and `return` for anything else.",
      switchCaseTest:
        'A `case` in a styled/css literal has to be a value like `"small"`, `1` or `Size.Small`, or the component renders slower. Use `if` and `return` for anything else.',
      switchCaseWithoutReturn:
        "Every `case` before the last one has to end with `return`, or the component renders slower. Replace a `break` with `return;`, and add a `return` where the `case` runs into the next one.",
      switchDefaultNotLast:
        "Move `default` to the end of the `switch`. Any other order in a styled/css literal makes the component render slower.",
    },
    schema: [],
    defaultOptions: [],
  },
  createOnce: (context) => {
    const { before, importedNames, ImportDeclaration } = importsYak(["@yak/react"]);

    /**
     * True while the checked function sets a CSS value, like the one in
     * `width: ${fn}px;`. A function that adds class names can leave a branch
     * without a `return`: the compiler goes on with the code after it
     *
     * { if ($on) { if ($big) return css`a`; } if ($big) return css`b`; return css`c`; }
     * -> (($on ? ($big ? " a" : void 0) : void 0) ?? ($big ? " b" : " c"))
     *
     * The compiled code goes on after a branch with `??`, which treats a
     * returned `null` or `undefined` as "go on". A function that sets a CSS
     * value can return those on purpose, so the compiler folds its branch only
     * when no `return` in it can be `null` or `undefined`, see `isNeverNullish`:
     *
     * { if ($on) { if ($big) return 1; } if ($big) return 2; return 3; }
     * -> ($on ? $big ? 1 : void 0 : void 0) ?? ($big ? 2 : 3)
     */
    let setsCssValue = false;

    /** The returns already reported, as a nested branch can report them again */
    let reportedReturns = new Set<ESTree.ReturnStatement>();

    /**
     * Reports each `return` in a branch that can end without `return` while
     * more code follows, if it can be `undefined` or `null`
     */
    const checkBranchReturns = (statement: ESTree.Statement, name: string) => {
      for (const returnStatement of findReturns([statement])) {
        if (
          (returnStatement.argument && isNeverNullish(returnStatement.argument)) ||
          reportedReturns.has(returnStatement)
        ) {
          continue;
        }
        reportedReturns.add(returnStatement);
        context.report({
          node: returnStatement,
          messageId: "nullishReturn",
          data: { statement: name },
        });
      }
    };

    /** Reports every statement of a function body the compiler can not turn into an expression */
    const checkStatements = (statements: readonly ESTree.Statement[]) => {
      statements.forEach((statement, index) => {
        // the compiler copies a single `return` into a branch that ends without one
        const rest = statements.slice(index + 1);
        const hasCodeAfter =
          setsCssValue &&
          rest.some((next) => next.type !== "EmptyStatement") &&
          !(rest.length === 1 && rest[0].type === "ReturnStatement");
        switch (statement.type) {
          case "ReturnStatement":
          case "EmptyStatement":
            return;
          case "BlockStatement":
            if (hasCodeAfter && !alwaysReturns([statement])) {
              checkBranchReturns(statement, "block");
            }
            checkStatements(statement.body);
            return;
          case "IfStatement":
            // the compiler checks the returns of both branches
            if (
              hasCodeAfter &&
              (!alwaysReturns([statement.consequent]) ||
                (statement.alternate && !alwaysReturns([statement.alternate])))
            ) {
              checkBranchReturns(statement, "`if`");
            }
            checkStatements([statement.consequent]);
            if (statement.alternate) {
              checkStatements([statement.alternate]);
            }
            return;
          case "SwitchStatement":
            // the compiler checks the returns of every case
            if (hasCodeAfter && lastCaseCanEnd(statement)) {
              checkBranchReturns(statement, "`switch`");
            }
            checkSwitch(statement);
            return;
          case "VariableDeclaration":
            if (statement.kind !== "const") {
              context.report({
                node: statement,
                messageId: "variable",
                data: {
                  statement: `${/^[aeiou]/.test(statement.kind) ? "An" : "A"} \`${statement.kind}\``,
                },
              });
              return;
            }
            for (const declaration of statement.declarations) {
              if (declaration.id.type !== "Identifier") {
                context.report({
                  node: declaration,
                  messageId: "variable",
                  data: { statement: "A destructuring" },
                });
              } else if (!isConstInitializer(declaration.init)) {
                context.report({
                  node: declaration,
                  messageId: "constInitializer",
                  data: { name: declaration.id.name },
                });
              }
            }
            return;
          case "ExpressionStatement":
            if (!isDiscardedExpression(statement.expression)) {
              context.report({
                node: statement,
                messageId: "statement",
                data: { statement: expressionStatementName(statement.expression) },
              });
            }
            return;
          default:
            context.report({
              node: statement,
              messageId: "statement",
              data: { statement: statementNames[statement.type] ?? "This line" },
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
        // the last case can end the `switch`, e.g. `default: assertNever($size);`
        if (!isLast && !alwaysReturns(switchCase.consequent)) {
          context.report({ node: switchCase, messageId: "switchCaseWithoutReturn" });
        }
        checkStatements(switchCase.consequent.filter((inner) => inner.type !== "BreakStatement"));
      });
    };

    /**
     * The compiled function gets the props it reads by name and no props
     * object, so `(props) => helper(props)`, `(props) => props[key]` and
     * `({ $on, ...rest }) => ...` make the component render slower
     */
    const checkParameter = (arrow: ESTree.ArrowFunctionExpression) => {
      const [parameter] = arrow.params;
      if (parameter?.type === "Identifier") {
        for (const node of findObjectUses(arrow.body, parameter.name)) {
          const isComputedRead =
            node.parent?.type === "MemberExpression" &&
            node.parent.computed &&
            node.parent.object === node;
          context.report({
            node,
            messageId: isComputedRead ? "propsComputedKey" : "propsObject",
            data: { name: parameter.name },
          });
        }
      } else if (parameter?.type === "ObjectPattern") {
        for (const property of parameter.properties) {
          if (property.type === "RestElement") {
            context.report({
              node: property,
              messageId: "restParameter",
              data: {
                name: property.argument.type === "Identifier" ? property.argument.name : "rest",
              },
            });
          }
        }
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
          if (expression.type === "FunctionExpression") {
            context.report({ node: expression, messageId: "functionExpression" });
          } else if (expression.type === "ArrowFunctionExpression") {
            checkParameter(expression);
            if (expression.body.type === "BlockStatement") {
              setsCssValue = isInsideCssDeclarationValue(node, expression);
              reportedReturns = new Set();
              checkStatements(expression.body.body);
            }
          }
        }
      },
    };
  },
});

const statementNames: Partial<Record<ESTree.Statement["type"], string>> = {
  DebuggerStatement: "A `debugger` statement",
  ForStatement: "A loop",
  ForInStatement: "A loop",
  ForOfStatement: "A loop",
  WhileStatement: "A loop",
  DoWhileStatement: "A loop",
  TryStatement: "A `try` statement",
  ThrowStatement: "A `throw` statement",
  FunctionDeclaration: "A function declaration",
  ClassDeclaration: "A class declaration",
  BreakStatement: "A `break` statement",
  LabeledStatement: "A label",
};

/** "An assignment" for `$a = 1` or `$count++`, "This line" for anything else like `$on && log($on);` */
function expressionStatementName(expression: ESTree.Expression): string {
  const node = unwrapTypeCasts(expression);
  return node.type === "AssignmentExpression" || node.type === "UpdateExpression"
    ? "An assignment"
    : "This line";
}

/**
 * Every use of the props parameter that is not a read by name: `helper(props)`
 * or `props[key]`, but not `props.$on`
 */
function findObjectUses(root: unknown, name: string): ESTree.Node[] {
  const uses: ESTree.Node[] = [];
  const visit = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value !== "object" || value === null || !("type" in value)) {
      return;
    }
    const node = value as ESTree.Node;
    if (node.type === "Identifier") {
      if (node.name === name) {
        uses.push(node);
      }
      return;
    }
    if (node.type === "MemberExpression") {
      const isNamedRead =
        !node.computed && node.object.type === "Identifier" && node.object.name === name;
      if (!isNamedRead) {
        visit(node.object);
      }
      if (node.computed) {
        visit(node.property);
      }
      return;
    }
    if (node.type === "Property" && !node.computed) {
      visit(node.value);
      return;
    }
    // a nested function with a parameter of the same name reads its own value
    if (
      (node.type === "ArrowFunctionExpression" || node.type === "FunctionExpression") &&
      node.params.some((param) => param.type === "Identifier" && param.name === name)
    ) {
      return;
    }
    for (const [key, child] of Object.entries(node)) {
      if (key !== "parent" && key !== "typeAnnotation" && key !== "typeArguments") {
        visit(child);
      }
    }
  };
  visit(root);
  return uses;
}

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

/**
 * The `return` statements in the statements, in nested blocks, `if`
 * branches and `switch` cases. Every other statement is reported on its own
 */
function findReturns(statements: readonly ESTree.Statement[]): ESTree.ReturnStatement[] {
  return statements.flatMap((statement) => {
    switch (statement.type) {
      case "ReturnStatement":
        return [statement];
      case "BlockStatement":
        return findReturns(statement.body);
      case "IfStatement":
        return findReturns(
          statement.alternate
            ? [statement.consequent, statement.alternate]
            : [statement.consequent],
        );
      case "SwitchStatement":
        return statement.cases.flatMap((switchCase) => findReturns(switchCase.consequent));
      default:
        return [];
    }
  });
}

/**
 * True if the value can never be `undefined` or `null`. The compiler uses the
 * same definition in `is_never_nullish` in yak-swc:
 *
 * - a literal other than `null`, e.g. `2`, `"auto"` or `true`, and a template
 *   literal like `${$n}px` in backticks
 * - `-$n`, `!$on` or `typeof $n`: every unary operator but `void` returns a
 *   number, a string or a boolean
 * - `$n * 2`, `$n + "px"` or `$n > 2`: every binary operator but `&&`, `||`
 *   and `??` returns a number, a string or a boolean
 * - `a ? 1 : 2` when both branches count
 * - `a || 1` and `a ?? 1` when the right side counts: they return the left
 *   side only when it is truthy or not nullish
 * - `a && 1` when both sides count: it returns the left side when it is
 *   falsy, and a falsy `$a` can be `null`
 * - `(log($a), 1)` when the last expression counts
 *
 * A read like `$width` or `props.x` and a call like `getWidth()` can return
 * anything
 */
function isNeverNullish(expression: ESTree.Expression): boolean {
  const node = unwrapTypeCasts(expression);
  switch (node.type) {
    case "Literal":
      return node.raw !== "null";
    case "TemplateLiteral":
    case "BinaryExpression":
      return true;
    case "UnaryExpression":
      return node.operator !== "void";
    case "LogicalExpression":
      return node.operator === "&&"
        ? isNeverNullish(node.left) && isNeverNullish(node.right)
        : isNeverNullish(node.right);
    case "ConditionalExpression":
      return isNeverNullish(node.consequent) && isNeverNullish(node.alternate);
    case "SequenceExpression":
      return (
        node.expressions.length > 0 && isNeverNullish(node.expressions[node.expressions.length - 1])
      );
    default:
      return false;
  }
}

/** True if the last `case` of the `switch` has statements and a path through them ends without a `return` */
function lastCaseCanEnd(statement: ESTree.SwitchStatement): boolean {
  const last = statement.cases[statement.cases.length - 1];
  return last !== undefined && last.consequent.length > 0 && !alwaysReturns(last.consequent);
}

/**
 * A statement the compiler keeps at its place, because its value adds no
 * class name: a call like `assertNever($size);` or `console.log($size);`, or
 * a plain read like `$size satisfies never;`
 *
 * { log($on); return css`...`; } -> (log($on), " yB1")
 *
 * The callee has to be a plain read. An assignment like `$size = "s"` could
 * change a prop that a later condition reads
 */
function isDiscardedExpression(expression: ESTree.Expression): boolean {
  const node = unwrapTypeCasts(expression);
  if (node.type === "CallExpression") {
    return node.callee.type !== "Super" && !node.optional && isPlainRead(node.callee);
  }
  return isPlainRead(node);
}

/**
 * A `const` that gives a prop read a short name. The compiler writes the
 * initializer at each read of the name:
 *
 * { const size = $layout.medium?.size; return size === "s" && css`...`; }
 * -> ($layout.medium?.size === "s" ? " yB1" : "")
 *
 * The initializer runs once per read, so it has to be a plain read with or
 * without `?.`, or a literal. A call or a calculation would run several times
 */
function isConstInitializer(init: ESTree.Expression | null | undefined): boolean {
  return init != null && (isReadChain(init) || isCaseValue(init));
}

/** `$a`, `props.$a.b`, `$a?.b` or `$a.b?.c`, with or without a type cast */
function isReadChain(expression: ESTree.Expression): boolean {
  let node = unwrapTypeCasts(expression);
  if (node.type === "ChainExpression") {
    node = unwrapTypeCasts(node.expression);
  }
  if (node.type === "Identifier") {
    return true;
  }
  return (
    node.type === "MemberExpression" &&
    !node.computed &&
    node.object.type !== "Super" &&
    isReadChain(node.object)
  );
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
