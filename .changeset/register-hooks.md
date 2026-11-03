---
"@yak/react": patch
"@yak/solid": patch
---

The Vite plugin evaluates `.yak.ts` files with `module.registerHooks()`, so Node 26 no longer warns that `module.register()` is deprecated.
