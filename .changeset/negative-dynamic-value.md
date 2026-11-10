---
"@yak/react": patch
"@yak/solid": patch
"@yak/swc": patch
---

Fixes a bug where a minus before a dynamic value produced invalid CSS: `left: -${({ $x }) => $x}px` now sets `left` to `-32px` for `$x={32}`.
