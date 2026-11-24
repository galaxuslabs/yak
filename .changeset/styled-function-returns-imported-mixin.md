---
"@yak/eslint-plugin": minor
---

The lint rule `@yak/styled-function-returns` also reports an imported mixin that a function returns, like `${({ $on }) => $on && importedMixin}`, and suggests `` css`${importedMixin}` `` instead
