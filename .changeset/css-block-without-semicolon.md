---
"@yak/react": patch
"@yak/solid": patch
"@yak/swc": patch
---

Fixes a bug where a block that ends without a `;`, like `&:hover { color: blue }`, applied its CSS outside the block, so the element was always blue
