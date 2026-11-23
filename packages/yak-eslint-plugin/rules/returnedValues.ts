import type { ESTree } from "@oxlint/plugins";
import { isInsideCssDeclarationValue } from "./styleConditions.js";
import { type ImportedNames, isStyledOrCssTag, unwrapTypeCasts } from "./utils.js";

/**
 * A function in a styled/css literal has one of two jobs, and its place in
 * the CSS decides which:
 *
 * styled.div`
 *   color: ${({ $color }) => $color};            // sets a CSS value
 *   ${({ $on }) => $on && css`color: red;`}      // stands on its own and adds class names
 * `
 *
 * A function that stands on its own returns a css`...` literal, an `atoms()`
 * call or nothing. This calls `check` with every value such a function can
 * return, so `$on ? css`a` : helper()` gives css`a` and `helper()`. The
 * condition left of `&&` is never returned as a class name, so it is skipped
 */
export function checkReturnedValues(
  node: ESTree.TaggedTemplateExpression,
  importedNames: ImportedNames,
  check: (value: ESTree.Expression) => void,
) {
  if (importedNames.styled === undefined && importedNames.css === undefined) {
    return;
  }
  if (!isStyledOrCssTag(node, importedNames)) {
    return;
  }
  const checkValue = (value: ESTree.Expression) => {
    const inner = unwrapTypeCasts(value);
    if (inner.type === "LogicalExpression") {
      if (inner.operator !== "&&") {
        checkValue(inner.left);
      }
      checkValue(inner.right);
    } else if (inner.type === "ConditionalExpression") {
      checkValue(inner.consequent);
      checkValue(inner.alternate);
    } else {
      check(inner);
    }
  };
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
}

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

/**
 * `helper` for `helper()` and `theme.helper` for `theme.helper()`. A callee
 * like `getHelpers().focus` has no simple name and gives `undefined`
 */
export function calleeName(callee: ESTree.Node): string | undefined {
  if (callee.type === "Identifier") {
    return callee.name;
  }
  if (
    callee.type === "MemberExpression" &&
    !callee.computed &&
    callee.property.type === "Identifier"
  ) {
    const objectName = calleeName(callee.object);
    return objectName === undefined ? undefined : `${objectName}.${callee.property.name}`;
  }
  return undefined;
}
