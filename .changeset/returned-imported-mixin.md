---
"@yak/swc": patch
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where an imported mixin that a function returns, like `${(p) => p.$on && importedMixin}`, added no styles, the build now fails and asks you to wrap it in a `css` literal like ``${(p) => p.$on && css`${importedMixin}`}``
