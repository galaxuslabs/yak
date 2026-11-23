---
"@yak/eslint-plugin": minor
---

Adds the rule `@yak/styled-function-returns`, an error in the recommended config: a function that stands on its own in a `styled` or `css` literal has to return a `css` literal or nothing, so `${({ $active }) => $active && "font-weight: bold;"}` and `${({ $active }) => $active && helper()}` are errors because they add no styles
