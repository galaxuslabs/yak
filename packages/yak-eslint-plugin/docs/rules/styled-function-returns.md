# @yak/styled-function-returns

📝 Enforces that a function that stands on its own in a yak styled/css literal returns a css literal or nothing.

💼 This rule is enabled in the ✅ `recommended` config.

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/latest/use/core-concepts#rule-suggestions).

<!-- end auto-generated rule header -->

Reports a function in a `styled` or `css` literal that stands on its own and returns a value without styles, like a string or a call.

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

A returned call adds no styles either, and the build fails for it. yak reads a `css` literal at build time, and only where a `styled` or `css` literal uses it directly. A `css` literal that a helper returns arrives empty:

```tsx
const focusRing = () => css`outline: 2px solid blue;`;

const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && focusRing()} // reported: adds no styles
  ${({ $active }) => $active && css`outline: 2px solid blue;`} // fine
`;
```

A call that only checks something, like `assertNever`, returns nothing. It needs no `return` in front of it:

```tsx
default:
  return assertNever($size); // reported

default:
  assertNever($size); // fine: the call still runs, and nothing is returned
```

`atoms()` is the one call that adds class names when it is returned.

An imported mixin is empty at runtime for the same reason, and the build fails for it. A local mixin works, because yak
replaces it with its class name at build time. For an imported mixin, wrap it in a `css` literal, so yak reads its
styles from the other file:

```tsx
import { outlined } from "./mixins";

const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && outlined} // reported: the build fails
  ${({ $active }) => $active && css`${outlined}`} // fine
`;
```

An `atoms()` value from another file can't be wrapped like this, because yak can't read its classes at build time.
Export the class names as a string instead and call `atoms()` once in the file that uses them:

```tsx
import { buttonClasses } from "./shared"; // "shadow-md rounded"

const buttonAtoms = atoms(buttonClasses);

const Button = styled.button<{ $active: boolean }>`
  ${({ $active }) => $active && buttonAtoms}
`;
```

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
