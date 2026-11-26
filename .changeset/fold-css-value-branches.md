---
"@yak/swc": patch
"@yak/react": patch
---

A dynamic value with a nested `if` now renders faster when each of its `return`s is a number, a string or another value that is never `null` or `undefined`, like `width: ${({ $on, $big }) => { if ($on) { if ($big) return 8; } if ($big) return 4; return 2; }}px;`
