---
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where `attrs` on a component that accepts the props of several HTML elements failed with "Expression produces a union type that is too complex to represent", like `` styled(Title).attrs({ id: "title" })`color: red;` `` with `const Title = (props: JSX.IntrinsicElements["h1" | "p" | "label"]) => …`
