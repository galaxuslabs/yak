import { css, styled, __yak_mergeCssProp } from "@yak/react/internal";
import * as __yak from "@yak/react/internal";
import "./input.yak.css!=!./input?./input.yak.css";
const Title = /*YAK Extracted CSS:
.input_Title_m7uBBu {
  color: blue;
}
*/ /*#__PURE__*/ Object.assign(/*#__PURE__*/ __yak.__yak_h1("input_Title_m7uBBu"), {
    "displayName": "Title"
});
export function List({ items }: {
    items: string[];
}) {
    // the element is the argument of a call
    const { node } = wrap(<div {...__yak_mergeCssProp(/*YAK Extracted CSS:
.input_yak_m7uBBu {
  padding: 8px;
}
*/ /*#__PURE__*/ css("input_yak_m7uBBu"))}>list</div>);
    // the element is inside a callback, like a column definition
    const [column] = useColumns({
        cell: ()=><span {...__yak_mergeCssProp(/*YAK Extracted CSS:
.input_yak_m7uBBu-01 {
  color: red;
}
*/ /*#__PURE__*/ css("input_yak_m7uBBu-01"))}>cell</span>
    });
    // the element is a default value of the pattern
    const { fallback = <p {...__yak_mergeCssProp(/*YAK Extracted CSS:
.input_yak_m7uBBu-02 {
  margin: 0;
}
*/ /*#__PURE__*/ css("input_yak_m7uBBu-02"))}>empty</p> } = useEmpty();
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
