# The next-yak codemod

`cli.js` is the codemod that moves a project from next-yak to @yak/react. With this folder,
`npx next-yak migrate` works in a project that uses next-yak 8.

Do not change `cli.js` here. It is the build of `packages/next-yak` on the
[v10 branch](https://github.com/galaxuslabs/yak/tree/v10/packages/next-yak), at commit b818a52e.
To update it, build that package on v10 and copy `dist/cli.js` and `dist/THIRD_PARTY_LICENSES.md`
into this folder.
