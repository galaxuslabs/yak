---
"@yak/eslint-plugin": patch
---

`@yak/styled-function-fast-path` no longer reports a dynamic value like ``styled.div<{ $on?: boolean; $big?: boolean; $width?: number }>`width: ${({ $on, $big, $width }) => { if ($on) { if ($big) return $width; } if ($big) return 4; return 2; }}px;` `` whose `if` can end without `return`
