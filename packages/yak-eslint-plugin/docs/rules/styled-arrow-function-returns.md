# @yak/styled-arrow-function-returns

📝 Enforces that functions which add class names in yak styled/css literals return a css literal or nothing.

<!-- end auto-generated rule header -->

Reports a function in a `styled` or `css` literal that adds class names but returns something else than a `css` literal.

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

A string or a number at the second place adds no styles, and nothing tells the dev:

```tsx
const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && "font-weight: bold;"}
`;
```

A call to any other function is unclear: yak can not tell what it returns. With `@yak/react` such a call also moves the component to a slower render path. An exhaustive check like `assertNever($size);` works as a statement without `return`.

The rule is not part of the recommended config, because a helper that returns a `css` literal is valid code and the rule reports it too. Turn the rule on when your code base returns `css` literals directly.

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
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        return assertNever($size);
    }
  }}
`;

styled.button`
  ${({ theme }) => theme.helpers.focusRing()}
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

styled.button`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        return;
    }
  }}
`;

// a check as a statement returns nothing
styled.button`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        assertNever($size);
    }
  }}
`;

// a function after a property sets a CSS value
styled.button`
  color: ${({ $active }) => ($active ? "red" : "blue")};
  width: ${({ $size }) => getWidth($size)}px;
`;
```
