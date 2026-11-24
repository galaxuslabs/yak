---
"@yak/swc": patch
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where a call that a function returns, like `${(p) => size(p.$big)}`, added no styles, the build now fails and asks you to write the condition in the template like `${(p) => (p.$big ? large : small)}`
