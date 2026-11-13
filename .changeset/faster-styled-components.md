---
"@yak/react": patch
"@yak/swc": patch
---

Styled components with dynamic values like ``${({ $active }) => $active && css`color: red;`}``, constant `.attrs({...})` or a chain like `styled(styled(Button))` render faster
