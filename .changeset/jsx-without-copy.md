---
"@yak/react": minor
---

`styled(Component)` no longer applies the `defaultProps` of a function component, which React 19 already ignores in JSX, use default parameters like `const Price = ({ currency = "CHF" }) => <b>{currency}</b>`
