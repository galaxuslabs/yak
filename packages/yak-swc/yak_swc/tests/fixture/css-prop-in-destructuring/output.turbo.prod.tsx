import { css, styled, __yak_mergeCssProp } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "data:text/css;base64,LnltN3VCQnUgewogIGNvbG9yOiBibHVlOwp9LnltN3VCQnUxIHsKICBwYWRkaW5nOiA4cHg7Cn0ueW03dUJCdTIgewogIGNvbG9yOiByZWQ7Cn0ueW03dUJCdTMgewogIG1hcmdpbjogMDsKfQ==";
const Title = /*YAK Extracted CSS:
.ym7uBBu {
  color: blue;
}
*/ /*#__PURE__*/ __yak.__yak_h1("ym7uBBu");
export function List({ items }: {
    items: string[];
}) {
    // the element is the argument of a call
    const { node } = wrap(<div {...__yak_mergeCssProp(/*YAK Extracted CSS:
.ym7uBBu1 {
  padding: 8px;
}
*/ /*#__PURE__*/ css("ym7uBBu1"))}>list</div>);
    // the element is inside a callback, like a column definition
    const [column] = useColumns({
        cell: ()=><span {...__yak_mergeCssProp(/*YAK Extracted CSS:
.ym7uBBu2 {
  color: red;
}
*/ /*#__PURE__*/ css("ym7uBBu2"))}>cell</span>
    });
    // the element is a default value of the pattern
    const { fallback = <p {...__yak_mergeCssProp(/*YAK Extracted CSS:
.ym7uBBu3 {
  margin: 0;
}
*/ /*#__PURE__*/ css("ym7uBBu3"))}>empty</p> } = useEmpty();
    return <>
      <Title>{items.length}</Title>
      {node}
      {column}
      {fallback}
    </>;
}
declare function wrap(node: unknown): {
    node: unknown;
};
declare function useColumns(options: {
    cell: () => unknown;
}): unknown[];
declare function useEmpty(): {
    fallback?: unknown;
};
