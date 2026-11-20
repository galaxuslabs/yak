---
"@yak/eslint-plugin": minor
---

Adds the rule `@yak/styled-arrow-function-returns`, off by default: a function that adds class names in a `styled` or `css` literal has to return a `css` literal or nothing, so `${({ $active }) => $active && "font-weight: bold;"}` is an error
