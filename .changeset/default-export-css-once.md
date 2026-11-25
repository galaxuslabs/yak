---
"@yak/react": patch
"@yak/solid": patch
"@yak/swc": patch
---

Fixes a bug where a component that extends a default exported styled component from the same file kept the base styles, like `Blue` rendering red in ``const Base = styled.div`color: red;`; export const Blue = styled(Base)`color: blue;`; export default Base;``
