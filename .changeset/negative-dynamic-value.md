---
"@yak/react": patch
"@yak/solid": patch
"@yak/swc": patch
---

A minus before a dynamic value now negates it: `left: -${({ $x }) => $x}px` sets `left` to `-32px` for `$x={32}`.
