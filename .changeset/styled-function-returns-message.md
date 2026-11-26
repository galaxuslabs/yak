---
"@yak/eslint-plugin": patch
---

Fixes a bug where `styled-function-returns` showed `assertNever($size);` as the example for a returned call like `getHelpers().focus()`, it now names the call you wrote and tells you to move the css literal into the function when the call builds styles
