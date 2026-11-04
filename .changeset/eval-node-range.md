---
"@yak/react": patch
"@yak/solid": patch
---

`@yak/react` and `@yak/solid` now require Node.js 22.18 or later, and 23.6 or later on Node 23. Node 23.0 to 23.5 cannot run `.yak.ts` files, and the plugin now reports a clear error there instead of crashing the process.
