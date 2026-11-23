import type { ESTree } from "@oxlint/plugins";
import { yakPackageNames } from "yak-internals/package-names";

/**
 * `packageNames` limits the tracked imports, e.g. to `["@yak/react"]` for a
 * rule that only applies to the React runtime
 */
export const importsYak = (packageNames: readonly string[] = yakPackageNames) => {
  /** track the imported names for css and styled from a yak runtime package */
  const importedNames: ImportedNames = {};

  return {
    importedNames,
    before() {
      importedNames.styled = undefined;
      importedNames.css = undefined;
    },
    ImportDeclaration(node: ESTree.ImportDeclaration) {
      if (packageNames.includes(node.source.value)) {
        node.specifiers.forEach((specifier) => {
          if (specifier.type === "ImportSpecifier" && specifier.imported.type === "Identifier") {
            if (specifier.imported.name === "styled") {
              importedNames.styled = specifier.local.name;
            } else if (specifier.imported.name === "css") {
              importedNames.css = specifier.local.name;
            }
          }
        });
      }
    },
  };
};

export type ImportedNames = {
  styled?: string;
  css?: string;
};

export function isStyledOrCssTag(
  node: ESTree.Node,
  importedNames: ImportedNames,
): false | "styled" | "css" {
  if (node.type !== "TaggedTemplateExpression") {
    return false;
  }
  const { tag } = node;

  // Check for simple styled`` or css``
  if (tag.type === "Identifier") {
    if (tag.name === importedNames.styled) {
      return "styled";
    }
    if (tag.name === importedNames.css) {
      return "css";
    }
  }
  // Check for styled.button`` or styled(Component)``
  if (tag.type === "MemberExpression") {
    return tag.object.type === "Identifier" && tag.object.name === importedNames.styled
      ? ("styled" as const)
      : false;
  }
  // Check for styled(button)`` or styled(button).attrs()`` or styled.div.attrs()``
  if (tag.type === "CallExpression") {
    // Check for attrs() method
    if (tag.callee.type === "MemberExpression") {
      const callee = tag.callee as ESTree.MemberExpression;
      if (callee.property.type === "Identifier" && callee.property.name === "attrs") {
        const memberExpression = callee.property.parent as ESTree.MemberExpression;

        // styled(button).attrs()
        if (memberExpression.object.type === "CallExpression") {
          const callExpression = memberExpression.object as ESTree.CallExpression;

          return callExpression.callee.type === "Identifier" &&
            callExpression.callee.name === importedNames.styled
            ? "styled"
            : false;
        }
        // styled.button.attrs()
        else if (memberExpression.object.type === "MemberExpression") {
          const memberExpressionObject = memberExpression.object as ESTree.MemberExpression;
          return memberExpressionObject.object.type === "Identifier" &&
            memberExpressionObject.object.name === importedNames.styled
            ? "styled"
            : false;
        }
      }
    }

    // Check for styled()
    return tag.callee.type === "Identifier" && tag.callee.name === importedNames.styled
      ? "styled"
      : false;
  }

  return false;
}

/** `$size` for `$size as string`, `$size!`, `$size satisfies Size`, `<string>$size` or `($size)` */
export function unwrapTypeCasts(expression: ESTree.Expression): ESTree.Expression {
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
