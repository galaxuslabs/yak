---
"@yak/react": minor
---

webpack now loads `.yak.ts` files in Node like Turbopack, Rsbuild and Vite do, so they export the same values on every bundler

`.yak.tsx` files no longer work on webpack, move JSX into a regular `.tsx` file
