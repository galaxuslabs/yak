---
"@yak/solid": minor
"@yak/swc": minor
---

Constants that hold a template literal of other same-file constants now work in styles, e.g. `` const NEGATIVE_GAP = `-${GAP}` `` or `` `-${GAP / 2}px` ``.
