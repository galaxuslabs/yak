# @yak/styled-function-fast-path

📝 Reports code in functions of yak styled/css literals that makes the component render slower.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Reports code in a function of a `styled` or `css` literal that makes the component render slower.

## Reason why

`@yak/react` compiles the functions of a styled component into one function that returns the class names of a render:

```tsx
const Button = styled.button<{ $size: "s" | "m" }>`
  ${({ $size }) => {
    if ($size === "s") {
      return css`
        padding: 2px;
      `;
    }
    return css`
      padding: 4px;
    `;
  }}
`;
```

compiles to something like

```js
({ $size }) => "Button" + ($size === "s" ? " Button_s" : " Button_m");
```

That works when the function is an expression, or when its body holds only `if`, `else`, `switch`, `return`, calls like `assertNever($size);` and a `const` that names a prop read. Every other statement, like a `const` with a calculation, an assignment or a loop, has no place in such an expression. The component still works, but it renders slower.

A returned call like `return helper()` also makes the component render slower, and the rule [`styled-function-returned-calls`](./styled-function-returned-calls.md) reports it.

A function that needs such a statement can turn the rule off for that line. The comment stands inside the function, above the reported statement:

```tsx
const Button = styled.button<{ $size: number }>`
  ${({ $size }) => {
    // eslint-disable-next-line @yak/styled-function-fast-path
    const padding = Math.min($size, 8);
    return padding > 4 && css`...`;
  }}
`;
```

The rule only checks files that import from `@yak/react`.

## Rule details

The following patterns are considered errors:

```js
// a `const` with a calculation, `let`, `var`, destructuring and loops
styled.button`
  ${({ $size, $layout }) => {
    const big = $size > 2;
    let { medium } = $layout;
    for (const item of medium.items) log(item);
    return big && css`padding: 8px;`;
  }}
`;

styled.button`
  ${function ({ $active }) {
    return $active && css`color: red;`;
  }}
`;

// a function that sets a CSS value can not leave a branch without `return`
// when more than a single `return` follows
styled.button`
  width: ${({ $active, $big }) => {
    if ($active) {
      if ($big) return 8;
    }
    if ($big) return 4;
    return 2;
  }}px;
`;

// a `switch` has to switch on a prop, with a `return` in every `case` before the last one
styled.button`
  ${({ $size }) => {
    switch (String($size)) {
      case "1":
        break;
      default:
        return css`padding: 8px;`;
    }
  }}
`;

// the compiled function has the props it reads by name and no props object
styled.button`
  padding: ${(props) => getPadding(props)}px;
  ${({ $brand, ...rest }) => isActive(rest) && css`color: red;`}
`;
```

The following patterns are not considered errors:

```js
styled.button`
  ${({ $active }) => $active && css`color: red;`}
`;

// a `const` can give a prop read a short name, and a call stays at its place
styled.button`
  ${({ $layout }) => {
    const size = $layout.medium?.size;
    console.log(size);
    switch (size) {
      case "s":
      case "m":
        return css`padding: 2px;`;
      default:
        assertNever(size);
    }
  }}
`;

// a function that adds class names can leave a block and go on after it
styled.button`
  ${({ $active, $big }) => {
    if ($active) {
      if ($big) return css`color: red;`;
    }
    if ($big) return css`color: green;`;
    return css`color: blue;`;
  }}
`;
```
