---
"@yak/react": patch
"@yak/swc": patch
---

Styled components render faster, most of all with dynamic values like ``${({ $active }) => $active && css`color: red;`}``, a constant `.attrs({...})` or a chain like `styled(styled(Button))`
