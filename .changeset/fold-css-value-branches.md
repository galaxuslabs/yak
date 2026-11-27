---
"@yak/swc": patch
"@yak/react": patch
---

A dynamic value whose `if` can end without `return` now renders faster, like ``const Sidebar = styled.aside<{ $open?: boolean; $pinned?: boolean; $width?: number; $railWidth?: number }>`width: ${({ $open, $pinned, $width, $railWidth }) => { if ($open) { if ($pinned) return $width; if ($width) return 240; } if ($pinned) return $railWidth; return 0; }}px;` ``
