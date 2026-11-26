---
"@yak/eslint-plugin": patch
---

The rule `@yak/styled-function-fast-path` no longer reports an `if` without `return` in a dynamic value like `width: ${...}px` when no `return` in it can be `null` or `undefined`, and otherwise points at the `return` that can, like `return $width;`
