---
"@yak/swc": patch
"@yak/react": patch
---

Fixes a bug where a dynamic value without a unit, like ``const Box = styled.div<{ $bg?: string }>`background: ${({ $bg }) => $bg};` ``, threw no error in development for a missing `$bg` and took the background of an outer `Box` in production
