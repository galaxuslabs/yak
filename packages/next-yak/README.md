# next-yak

next-yak is now [@yak/react](https://www.npmjs.com/package/@yak/react). Version 10 of this package
contains no runtime. It holds a codemod that moves your project from next-yak 9 to @yak/react 10.

## Migrate

Commit your changes first, then run this command in the root of your project. When git shows
uncommitted changes, the codemod asks before it continues.

```bash
npx next-yak@10 migrate
```

The codemod changes these parts of your project:

- imports, `require()` calls and mocks of `next-yak`, `eslint-plugin-yak`, `storybook-addon-yak`
  and `yak-swc`
- the dependencies in `package.json` files and the catalogs in `pnpm-workspace.yaml`,
  `.yarnrc.yml` and `package.json`
- `declare module "next-yak"`, the `@jsxImportSource` pragma and `jsxImportSource` in `tsconfig.json`
- `:global()` in yak styles, because @yak/react always writes plain CSS
- the options of `withYak`, `viteYak` and `pluginYak`: `experiments.debug` moves to the top level,
  and the removed options go away
- the lint config: rule ids move from `yak/` to `@yak/`, and `css-global-deprecated` goes away
- `.yak.module.css` patterns, because @yak/react writes `.yak.css` files

When it finds code that it cannot change safely, it shows the file and the line. The codemod does
not format the changed files. Run the formatter of your project after it.

The codemod asks whether it should also rename next-yak in comments, prose strings, Markdown and
CSS files. The default is yes. Without a terminal, it renames next-yak in both code and text.

Options:

- `--text` also renames next-yak in comments and docs, without the question
- `--no-text` changes only code, without the question
- `--dry-run` shows a summary of the changes, but does not write them
- `--force` runs when git shows uncommitted changes, without the question

Then install the new packages and start your dev server. The
[migration guide](https://yak.style/docs/migration-from-next-yak) explains each step.
