---
"@yak/eslint-plugin": minor
---

Adds the rule `@yak/styled-function-returned-calls`, off by default: it reports a call returned from a function that stands on its own in a `styled` or `css` literal, like `${({ theme }) => theme.helpers.focusRing()}`, because the component renders slower with `@yak/react`
