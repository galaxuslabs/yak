---
"@yak/react": patch
"@yak/solid": patch
---

Vite and Next.js with Turbopack load `.yak.ts` files with `module.registerHooks()`, so Node 26 no longer warns that `module.register()` is deprecated. A `.yak.ts` file now also reloads when a file it loads with `require()` changes.
