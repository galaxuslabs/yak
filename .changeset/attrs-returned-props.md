---
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where interpolations could not read a prop that `attrs` returns, like `$muted` in `` styled.input.attrs(({ disabled }) => ({ $muted: disabled }))`opacity: ${({ $muted }) => ($muted ? 0.5 : 1)};` ``
