# @yak/no-next-yak-import

📝 Reports imports from next-yak, which is now @yak/react.

💼 This rule is enabled in the ✅ `recommended` config.

🔧 This rule is automatically fixable by the [`--fix` CLI option](https://eslint.org/docs/latest/user-guide/command-line-interface#--fix).

<!-- end auto-generated rule header -->

Reports imports from `next-yak`, the old name of `@yak/react`.

## Reason why

`@yak/swc` only compiles imports from the new package names. A file that still imports from `next-yak` builds without errors, but its styles are missing:

```tsx
import { styled } from "next-yak"; // reported
import { styled } from "@yak/react"; // fine
```

The fix replaces `next-yak` with `@yak/react` and keeps the subpath, like `next-yak/withYak` with `@yak/react/withYak`. A subpath that `@yak/react` does not export gets reported without a fix.

The rule also reports `declare module "next-yak"`. That declaration adds types to the theme, and with the old name it no longer applies, so the theme type is empty.

See [Migration from next-yak](https://yak.style/docs/migration-from-next-yak) for the other steps.

## Rule details

The following patterns are considered errors:

```js
import { styled, css } from "next-yak";

import { withYak } from "next-yak/withYak";

export { styled } from "next-yak";

const { viteYak } = await import("next-yak/vite");

const { pluginYak } = require("next-yak/rsbuild");

declare module "next-yak" {
  export interface YakTheme {
    color: string;
  }
}
```

The following patterns are not considered errors:

```js
import { styled, css } from "@yak/react";

import { withYak } from "@yak/react/withYak";

export { styled } from "@yak/react";

const { viteYak } = await import("@yak/react/vite");

const { pluginYak } = require("@yak/react/rsbuild");

declare module "@yak/react" {
  export interface YakTheme {
    color: string;
  }
}
```
