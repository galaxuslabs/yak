---
"@yak/swc": patch
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where an imported mixin or a helper call that a function returns, like `${(p) => p.$on && importedMixin}` or `${(p) => size(p.$big)}`, applied no styles without an error, the build now fails and asks you to write `` css`${importedMixin}` `` or to return the mixin directly
