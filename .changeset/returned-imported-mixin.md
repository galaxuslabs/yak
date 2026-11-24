---
"@yak/swc": patch
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where an imported mixin that a function returns, like `${(p) => p.$on && outlined}`, applied no styles without an error, the build now fails and asks you to write `` ${(p) => p.$on && css`${outlined}`} ``
