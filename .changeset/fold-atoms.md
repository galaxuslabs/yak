---
"@yak/react": patch
"@yak/solid": patch
---

`atoms()` accepts `null` and `undefined`, so an optional prop works as a condition: `atoms("flex", $wide && "w-full")`
