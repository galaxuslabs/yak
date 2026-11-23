---
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where `attrs` failed the type check for a hyphenated attribute like `styled.div.attrs({ "data-foo": "" })`.
