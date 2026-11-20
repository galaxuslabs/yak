import { css, styled } from "@yak/react";

const Title = styled.h1`
  color: blue;
`;

export function List({ items }: { items: string[] }) {
  // the element is the argument of a call
  const { node } = wrap(<div css={css`padding: 8px;`}>list</div>);
  // the element is inside a callback, like a column definition
  const [column] = useColumns({
    cell: () => <span css={css`color: red;`}>cell</span>,
  });
  // the element is a default value of the pattern
  const { fallback = <p css={css`margin: 0;`}>empty</p> } = useEmpty();
  return (
    <>
      <Title>{items.length}</Title>
      {node}
      {column}
      {fallback}
    </>
  );
}

declare function wrap(node: unknown): { node: unknown };
declare function useColumns(options: { cell: () => unknown }): unknown[];
declare function useEmpty(): { fallback?: unknown };
