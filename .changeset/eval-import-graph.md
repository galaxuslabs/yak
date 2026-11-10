---
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where a `.yak.ts` file did not reload after a file it imports changed, for example a workspace package or a file loaded with `require()`
