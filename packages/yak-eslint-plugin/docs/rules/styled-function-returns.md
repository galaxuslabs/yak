# @yak/styled-function-returns

📝 Enforces that a function outside a CSS property in a yak styled/css literal returns a css literal or nothing.

💼 This rule is enabled in the ✅ `recommended` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Reports a function in a `styled` or `css` literal that returns a value without styles, like a string or a call like `size($big)`.

## Reason why

A function in a `styled` or `css` literal either sets a CSS value, when it stands after a property, or works as a mixin and adds styles:

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

Wrap the CSS in a `css` literal, otherwise the function adds no styles:

```tsx
const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && "font-weight: bold;"} // reported
  ${({ $active }) => $active && css`font-weight: bold;`} // fine
`;
```

A number, `true`, a calculation, an object or an array adds no styles either. To set a CSS value, write the function after a property.

Return the `css` literal from the function itself instead of a call, otherwise the build fails. To reuse the styles, make a `css` constant instead of a function:

```tsx
const getFocusRing = () => css`outline: 2px solid blue;`;
const focusRing = css`outline: 2px solid blue;`;

const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && getFocusRing()} // reported: the build fails
  ${({ $active }) => $active && focusRing} // fine
`;
```

The only call you can return is `atoms()`.

A mixin from the same file works as is, like `focusRing` above. Wrap a mixin imported from another file in a `css` literal, otherwise the build fails:

```tsx
import { outlined } from "./mixins";

const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && outlined} // reported: the build fails
  ${({ $active }) => $active && css`${outlined}`} // fine
`;
```

An `atoms()` value imported from another file does not work in a `css` literal either. See [Troubleshooting](https://yak.style/docs/troubleshooting#an-atoms-value-from-another-file).

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

styled.button`
  ${({ theme }) => theme.helpers.focusRing()}
`;

styled.button`
  ${({ $active }) => $active && keyframes`from { opacity: 0; }`}
`;

// outlined is imported from another file
styled.button`
  ${({ $active }) => $active && outlined}
`;
```

The following patterns are not considered errors:

```js
styled.button`
  ${({ $active }) => $active && css`font-weight: bold;`}
`;

// a prop or a local constant can hold a css literal
styled.button`
  ${({ $big, $mixin }) => ($big ? large : $mixin)}
`;

// an imported mixin in a css literal
styled.button`
  ${({ $active }) => $active && css`${outlined}`}
`;

styled.button`
  ${({ $active }) => $active && atoms("bold")}
`;

// a call that is not returned
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
