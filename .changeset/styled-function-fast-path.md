---
"@yak/eslint-plugin": minor
---

Adds the rule `@yak/styled-function-fast-path`, an error in the recommended config: it reports code in a function of a `styled` or `css` literal that makes the component render slower, like `const big = $size > 2;` in `${({ $size }) => { const big = $size > 2; return big && css`padding: 8px;`; }}`
