# @yak/styled-function-returns

📝 Enforces that a function that stands on its own in a yak styled/css literal returns a css literal or nothing.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Reports a function in a `styled` or `css` literal that stands on its own and returns a value without styles.

## Reason why

A function in a `styled` or `css` literal has one of two jobs, and its place in the CSS decides which:

```tsx
const Button = styled.button<{ $color: string; $active: boolean }>`
  color: ${({ $color }) => $color};
  ${({ $active }) =>
    $active &&
    css`
      font-weight: bold;
    `}
`;
```

The first function stands after a property, so it sets a CSS value and can return a string or a number. The second function stands on its own, so it adds class names. It has to return a `css` literal, an `atoms()` call or nothing.

A string at the second place drops the styles, and nothing tells you:

```tsx
const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && "font-weight: bold;"}
`;
```

The fix is to wrap the CSS in a `css` literal, like `` $active && css`font-weight: bold;` ``. A number, `true`, a calculation, an object or an array adds no styles either. To set a CSS value, write the function after a property.

The rule leaves returned calls to [`styled-function-returned-calls`](./styled-function-returned-calls.md).

## Rule details

The following patterns are considered errors:

```js
styled.button`
  ${({ $active }) => $active && "font-weight: bold;"}
`;

styled.button`
  ${({ $size }) => $size * 2}
`;

styled.button`
  ${({ $active }) => $active && { fontWeight: "bold" }}
`;
```

The following patterns are not considered errors:

```js
styled.button`
  ${({ $active }) => $active && css`font-weight: bold;`}
`;

// a prop or a constant can hold a css literal
styled.button`
  ${({ $big, $mixin }) => ($big ? large : $mixin)}
`;

// nothing
styled.button`
  ${({ $size }) => {
    if ($size === "s") return css`padding: 2px;`;
    assertNever($size);
  }}
`;

// a function after a property sets a CSS value
styled.button`
  color: ${({ $active }) => ($active ? "red" : "blue")};
  width: ${({ $size }) => $size * 2}px;
`;
```
