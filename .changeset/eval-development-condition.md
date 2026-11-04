---
"@yak/react": patch
"@yak/solid": patch
---

In development, `.yak.ts` files resolve imports with the `development` export condition. A workspace package with `exports: { development: "./src/index.ts" }` is now read from its source, as Vite and Next.js already do.
