---
"@yak/swc": minor
"@yak/react": minor
---

A dynamic value without a unit, like `z-index: ${({ $on }) => $on && 2};`, now throws in development when it returns `false`, `null` or `undefined`, return a value like `$on ? 2 : 0` instead or set the whole property with ``${({ $on }) => $on && css`z-index: 2;`}``
