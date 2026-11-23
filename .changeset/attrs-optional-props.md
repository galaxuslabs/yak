---
"@yak/react": minor
"@yak/solid": minor
---

Props that `attrs` sets are now optional on the component, like `$size` in `` const Icon = styled.svg.attrs({ $size: 24 })<{ $size: number }>`width: ${({ $size }) => $size}px;` `` that renders as `<Icon />`
