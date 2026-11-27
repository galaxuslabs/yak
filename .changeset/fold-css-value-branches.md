---
"@yak/swc": patch
"@yak/react": patch
---

A dynamic value with an `if` that can end without `return` now renders faster, like `width: ${({ $on, $big, $width }) => { if ($on) { if ($big) return $width; } if ($big) return 4; return 2; }}px;`
