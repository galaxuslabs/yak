---
"@yak/react": patch
"@yak/solid": patch
---

A `.yak.ts` file now reloads when any file it imports changes. This includes modules that another `.yak.ts` file imported first, workspace packages reached through a `node_modules` symlink, and files in `node_modules`.
