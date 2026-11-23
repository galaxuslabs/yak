# @yak/styled-function-returned-calls

📝 Disallows returning a function call from a function that stands on its own in a yak styled/css literal.

<!-- end auto-generated rule header -->

Reports a call or a tagged template other than `css` that a function in a `styled` or `css` literal returns, when the function stands on its own.

## Reason why

A function that stands on its own in a `styled` or `css` literal adds class names. `@yak/react` compiles the functions of a styled component into one function that returns those class names. The compiler can not see what a call returns, so a returned call makes the component render slower:

```tsx
const Box = styled.div<{ $size: "s" | "m" }>`
  ${({ $size }) => {
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      default:
        return assertNever($size); // reported
    }
  }}
`;
```

Return the `css` literal itself. A call that only checks something needs no `return` in front of it:

```tsx
default:
  assertNever($size); // fine: the call still runs, and nothing is returned
```

The rule is not part of the recommended config: a helper that returns a `css` literal is valid code and the component still works. Turn the rule on when render speed matters. The rule only checks files that import from `@yak/react`, because only `@yak/react` renders slower for such a call.

## Rule details

The following patterns are considered errors:

```js
styled.button`
  ${({ theme }) => theme.helpers.focusRing()}
`;

styled.button`
  ${({ $active }) => $active && keyframes`from { opacity: 0; }`}
`;

styled.button`
  ${({ $size }) => {
    if ($size === "s") return css`padding: 2px;`;
    return assertNever($size);
  }}
`;
```

The following patterns are not considered errors:

```js
styled.button`
  ${({ $active }) => $active && css`font-weight: bold;`}
`;

styled.button`
  ${({ $active }) => $active && atoms("bold")}
`;

// the call still runs, and nothing is returned
styled.button`
  ${({ $size }) => {
    if ($size === "s") return css`padding: 2px;`;
    assertNever($size);
  }}
`;

// a function after a property sets a CSS value
styled.button`
  width: ${({ $size }) => getWidth($size)}px;
`;
```
