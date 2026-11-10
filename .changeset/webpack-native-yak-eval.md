---
"@yak/react": minor
---

webpack now evaluates `.yak.ts` files in a Node worker thread, like Turbopack, Rsbuild and Vite. A `.yak.ts` file now gets the same exports on every bundler.

`.yak.ts` files hold tokens and other values. Node can't load `.yak.tsx` files, which already failed on the other bundlers and now fail on webpack too. Move JSX into a regular `.tsx` file.
