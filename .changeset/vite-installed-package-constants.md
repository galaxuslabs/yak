---
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where a constant from an installed package, like `${layout.reading}` from `import { layout } from "my-ui"`, failed in Vite with "Error while resolving cross-file selectors"
