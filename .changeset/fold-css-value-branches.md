---
"@yak/swc": patch
"@yak/react": patch
---

Dynamic values that leave an `if` without `return` before more code now render faster when every `return` in that `if` is a number, a string or another value that is never `null` or `undefined`, like `width: ${({ $on, $big }) => { if ($on) { if ($big) return 8; } if ($big) return 4; return 2; }}px;`
