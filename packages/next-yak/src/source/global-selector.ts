import type { NodePath } from "@babel/traverse";
import type { Node, TaggedTemplateExpression } from "@babel/types";
import { WARNING } from "../warnings.ts";
import { importedYakName, type Ast, type Context, type Traverse } from "./context.ts";

const YAK_TAGS = new Set(["styled", "css", "keyframes", "globalStyle"]);

/**
 * `:global(selector)` was needed for CSS Modules, which yak no longer outputs. The selector
 * inside replaces it, but only in templates whose tag is imported from next-yak.
 */
export function unwrapGlobalSelectors(ast: Ast, traverse: Traverse, context: Context) {
  traverse(ast, {
    TaggedTemplateExpression(path) {
      if (!isYakTemplate(path)) return;
      // the CSS of the whole template with one \0 for each interpolation, and the source
      // offset of each character, so `:global(` can open and close in different quasis
      let css = "";
      const offsets: number[] = [];
      for (const quasi of path.node.quasi.quasis) {
        if (css) {
          css += "\0";
          offsets.push(-1);
        }
        // the source text, because the raw value has `\n` where the source has `\r\n`
        css += context.code.slice(quasi.start!, quasi.end!);
        for (let i = quasi.start!; i < quasi.end!; i++) offsets.push(i);
      }
      const { removals, unclosed } = findGlobalSelectors(css);
      if (unclosed) context.warn(path.node, WARNING.unclosedGlobal);
      for (const [from, to] of removals) {
        for (let i = from; i < to; i++) {
          if (offsets[i] !== -1) context.edits.remove(offsets[i], offsets[i] + 1);
        }
      }
    },
  });
}

/** follows `styled.div`, `styled(Button)`, `styled.input.attrs()` back to the imported binding */
function isYakTemplate(path: NodePath<TaggedTemplateExpression>) {
  let tag: Node = path.node.tag;
  for (;;) {
    if (tag.type === "MemberExpression") tag = tag.object;
    else if (tag.type === "CallExpression") tag = tag.callee;
    else break;
  }
  if (tag.type !== "Identifier") return false;
  const name = importedYakName(path.scope.getBinding(tag.name));
  return name !== null && YAK_TAGS.has(name);
}

/**
 * Finds the text to remove for each `:global(selector)` and bare `:global` in CSS. The
 * removals are `[from, to)` ranges, and `unclosed` is true when a `:global(` has no `)`.
 */
export function findGlobalSelectors(css: string) {
  const removals: [number, number][] = [];
  let unclosed = false;
  for (const match of css.matchAll(/:global\b/g)) {
    const start = match.index;
    let after = start + match[0].length;
    if (css[after] !== "(") {
      // `:global` without a selector switches to global mode, which plain CSS always is
      if (start === 0 || /\s/.test(css[start - 1])) while (/\s/.test(css[after] ?? "")) after++;
      removals.push([start, after]);
      continue;
    }
    const close = closingParenthesis(css, after + 1);
    if (close === -1) {
      unclosed = true;
      continue;
    }
    // the whitespace inside the parentheses goes too, `:has(&):global( ::x )` is `:has(&)::x`
    let first = after + 1;
    while (/\s/.test(css[first])) first++;
    let last = close;
    while (last > first && /\s/.test(css[last - 1])) last--;
    removals.push([start, first], [last, close + 1]);
  }
  return { removals, unclosed };
}

/** removes `:global()` from CSS text without interpolations, such as an example in a comment */
export function unwrapGlobalInText(text: string): string {
  const { removals } = findGlobalSelectors(text);
  let result = "";
  let index = 0;
  for (const [from, to] of removals.sort((a, b) => a[0] - b[0])) {
    result += text.slice(index, from);
    index = to;
  }
  return result + text.slice(index);
}

/** index of the `)` that closes the parenthesis opened before `from`, or -1 */
function closingParenthesis(text: string, from: number) {
  let depth = 1;
  for (let i = from; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")" && --depth === 0) return i;
  }
  return -1;
}
