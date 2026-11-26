---
"@yak/eslint-plugin": minor
---

Adds the rule `@yak/no-next-yak-import`, an error in the recommended config: it reports an import from the old package name like `import { styled } from "next-yak";` and `--fix` changes it to `import { styled } from "@yak/react";`
