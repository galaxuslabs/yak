---
"@yak/react": patch
"@yak/solid": patch
---

`@yak/react` and `@yak/solid` now require Node.js 22.18 or later on Node 22, or 23.6 or later. Node 23.0 to 23.5 cannot strip TypeScript types without a flag, so `.yak.ts` files fail there. On Node 23.0 to 23.4 the evaluator now reports an error instead of crashing the process.
