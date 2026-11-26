---
"@yak/eslint-plugin": patch
---

Fixes a bug where `styled-function-returns` showed `assertNever($size);` as the fix for any returned call, its message now names your call and shows both fixes: a css constant for styles, or calling it without returning its result
