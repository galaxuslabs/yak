---
"@yak/eslint-plugin": minor
---

Adds the rule `@yak/styled-function-returns`, an error in the recommended config: a function that stands on its own in a `styled` or `css` literal has to return a `css` literal or nothing, so `${({ $active }) => $active && "font-weight: bold;"}` is an error because it drops the styles
