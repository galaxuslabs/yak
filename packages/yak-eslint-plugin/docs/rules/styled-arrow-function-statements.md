# @yak/styled-arrow-function-statements

📝 Enforces that functions in yak styled/css literals only use if, else, switch and return, so the component keeps the fast render path.

💼 This rule is enabled in the ✅ `recommended` config.

<!-- end auto-generated rule header -->

Reports a function in a `styled` or `css` literal that yak can not compile to the fast render path.

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

That works when the function is an expression, or when its body holds only `if`, `else`, `switch`, `return`, calls like `assertNever($size);` and a `const` that names a prop read. Every other statement, like a `const` with a calculation, an assignment or a loop, has no place in such an expression. The component still works, but it renders on a slower path.

A function that needs such a statement can turn the rule off for that line:

```tsx
const Button = styled.button<{ $size: number }>`
  // eslint-disable-next-line @yak/styled-arrow-function-statements
  ${({ $size }) => {
    const padding = Math.min($size, 8);
    return padding > 4 && css`...`;
  }}
`;
```

The rule only checks files that import from `@yak/react`.

## Rule details

The following patterns are considered errors:

```js
styled.button`
  ${({ $size }) => {
    const big = $size > 2;
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
`;

styled.button`
  ${({ $brand, ...rest }) => isActive(rest) && css`color: red;`}
`;
```

The following patterns are not considered errors:

```js
styled.button`
  ${({ $active }) => $active && css`color: red;`}
`;

styled.button`
  ${({ $size }) => {
    if ($size === "s") return css`padding: 2px;`;
    if ($size === "m") return css`padding: 4px;`;
    return css`padding: 8px;`;
  }}
`;

styled.button`
  ${({ $variant }) => {
    switch ($variant) {
      case "primary":
        return css`color: blue;`;
      case "danger":
      case "warning":
        return css`color: red;`;
      default:
        return css`color: gray;`;
    }
  }}
`;

// a `const` can give a prop read a short name
styled.button`
  ${({ $layout }) => {
    const size = $layout.medium?.size;
    if (size === "s") return css`padding: 2px;`;
    return css`padding: 8px;`;
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

// a call stays at its place, so an exhaustive check or a `console.log` is fine
styled.button`
  ${({ $size }) => {
    console.log($size);
    switch ($size) {
      case "s":
        return css`padding: 2px;`;
      case "m":
        return css`padding: 4px;`;
      default:
        assertNever($size);
    }
  }}
`;

styled.button`
  left: ${({ $x }) => {
    if ($x === undefined) return 0;
    return $x;
  }}px;
`;
```
