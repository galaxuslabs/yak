---
"@yak/react": patch
"@yak/solid": patch
"@yak/swc": patch
---

Fixes a bug where a `css` prop inside a destructuring declaration rendered without styles, like ``const { getByText } = render(<div css={css`color: red;`} />)``
