---
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where an error from a broken import in a `.yak.ts` file stayed after you fixed it, until the next edit.
