# @yak/solid

## 0.6.1

### Patch Changes

- Fixes a bug where `attrs` on a component that accepts the props of several HTML elements failed with "Expression produces a union type that is too complex to represent", like `` styled(Title).attrs({ id: "title" })`color: red;` `` with `const Title = (props: JSX.IntrinsicElements["h1" | "p" | "label"]) => …` ([#810](https://github.com/galaxuslabs/yak/pull/810))

- Fixes a bug where a component that extends a default exported styled component from the same file kept the base styles, like `Blue` rendering red in ``const Base = styled.div`color: red;`; export const Blue = styled(Base)`color: blue;`; export default Base;`` ([#808](https://github.com/galaxuslabs/yak/pull/808)) Thanks @drewbitt!

- Fixes a bug where installs failed under a minimum release age because the required version of `@babel/parser` or `@oxlint/plugins` was too new ([#811](https://github.com/galaxuslabs/yak/pull/811))
- Updated dependencies:
  - @yak/swc@10.2.1

## 0.6.0

### Minor Changes

- Props that `attrs` sets are now optional on the component, like `$size` in `` const Icon = styled.svg.attrs({ $size: 24 })<{ $size: number }>`width: ${({ $size }) => $size}px;` `` that renders as `<Icon />` ([#800](https://github.com/galaxuslabs/yak/pull/800))

- Importing an `atoms()` value from another file is no longer supported and fails the build, export the class names as a string like `export const buttonClasses = "shadow-md rounded"` and call `atoms(buttonClasses)` in the file that uses it ([#803](https://github.com/galaxuslabs/yak/pull/803))

### Patch Changes

- Fixes a bug where `attrs` failed the type check for a hyphenated attribute like `styled.div.attrs({ "data-foo": "" })`. ([#800](https://github.com/galaxuslabs/yak/pull/800))

- Fixes a bug where interpolations could not read a prop that `attrs` returns, like `$muted` in `` styled.input.attrs(({ disabled }) => ({ $muted: disabled }))`opacity: ${({ $muted }) => ($muted ? 0.5 : 1)};` `` ([#800](https://github.com/galaxuslabs/yak/pull/800))

- Fixes a bug where a `css` prop inside a destructuring declaration rendered without styles, like ``const { getByText } = render(<div css={css`color: red;`} />)`` ([#783](https://github.com/galaxuslabs/yak/pull/783)) Thanks @drewbitt!

- A component with a dynamic value like `width: ${({ $width }) => $width}px` now compiles to less JavaScript ([#772](https://github.com/galaxuslabs/yak/pull/772))

- `atoms()` accepts `null` and `undefined`, so an optional prop works as a condition: `atoms("flex", $wide && "w-full")` ([#768](https://github.com/galaxuslabs/yak/pull/768))

- A styled component whose dynamic values use a `switch`, an `if` block, a nested `css` literal, `atoms` or a renamed or default prop like `({ $size = "m" }) => ...` now renders as a plain element where you use it in the same file ([#802](https://github.com/galaxuslabs/yak/pull/802))

- Fixes a bug where a call to a function that returns mixins, like `${(p) => size(p.$big)}`, added no styles, the build now fails and asks you to write the condition in the template like `${(p) => (p.$big ? large : small)}` ([#803](https://github.com/galaxuslabs/yak/pull/803))

- Fixes a bug where an imported mixin that a function returns, like `${(p) => p.$on && importedMixin}`, added no styles, the build now fails and asks you to wrap it in a `css` literal like ``${(p) => p.$on && css`${importedMixin}`}`` ([#803](https://github.com/galaxuslabs/yak/pull/803))

- Fixes a bug where `vite dev` failed with an `ENOENT` on the CSS of a yak component in a file of an installed package ([#787](https://github.com/galaxuslabs/yak/pull/787))

- Fixes a bug where a constant from an installed package, like `${layout.reading}` from `import { layout } from "my-ui"`, failed in Vite with "Error while resolving cross-file selectors" ([#787](https://github.com/galaxuslabs/yak/pull/787))
- Updated dependencies:
  - @yak/swc@10.2.0

## 0.5.0

### Minor Changes

- Constants built from other constants of the same file with a template literal now work in styles like `` const NEGATIVE_GAP = `-${GAP / 2}px` `` ([#709](https://github.com/galaxuslabs/yak/pull/709))

- A missing `:` or an unmatched bracket in styles now stops the build with an error that shows the line, like `color red;` or `@media (min-width: 600px {`, so fix the lines it reports when you update ([#684](https://github.com/galaxuslabs/yak/pull/684))

- Static math in styles now supports `**` like `${(GAP + 1) ** 2}px` ([#710](https://github.com/galaxuslabs/yak/pull/710))

### Patch Changes

- Fixes a bug where a block that ends without a `;`, like `&:hover { color: blue }`, applied its CSS outside the block, so the element was always blue ([#684](https://github.com/galaxuslabs/yak/pull/684))

- Fixes a bug where a `.yak.ts` file did not reload after a file it imports changed, for example a workspace package or a file loaded with `require()` ([#718](https://github.com/galaxuslabs/yak/pull/718))

- `@yak/react` and `@yak/solid` now require Node.js 22.18+ or 23.6+, the first versions that strip TypeScript types without a flag ([#719](https://github.com/galaxuslabs/yak/pull/719))

- Fixes a bug where an error from a broken import in a `.yak.ts` file stayed after you fixed it until the next edit ([#722](https://github.com/galaxuslabs/yak/pull/722))

- Fixes a bug where a minus before a dynamic value produced invalid CSS: `left: -${({ $x }) => $x}px` now sets `left` to `-32px` for `$x={32}` ([#724](https://github.com/galaxuslabs/yak/pull/724))

- Vite and Next.js with Turbopack no longer print a `module.register()` deprecation warning on Node 26 ([#716](https://github.com/galaxuslabs/yak/pull/716))

- Fixes a bug where Vite failed with a syntax error like `Error transforming /…/package.json` on `import pkg from "./package.json"` ([#735](https://github.com/galaxuslabs/yak/pull/735))

- The docs moved to [yak.style](https://yak.style) ([#728](https://github.com/galaxuslabs/yak/pull/728))
- Updated dependencies:
  - @yak/swc@10.1.0

## 0.4.0

### Minor Changes

- Move the option `experiments.debug` of the Vite plugin to `debug`.
- `@yak/solid` needs Node.js 22.18 or later. CommonJS code can now load it with `require()`.

### Patch Changes

- Relative `url()` paths in yak styles load their files, also when a mixin from another directory uses them.
- Remove the two "Module not found" warnings that Turbopack showed for the `.yak` file evaluator.
- Use `@yak/swc` 10.0.0.

## 0.4.0-rc.2

### Patch Changes

- Relative `url()` paths in yak styles load their files, also when a mixin from another directory uses them. ([#693](https://github.com/galaxuslabs/yak/pull/693))

- Remove the two "Module not found" warnings that Turbopack showed for the `.yak` file evaluator ([#696](https://github.com/galaxuslabs/yak/pull/696))
- Updated dependencies:
  - @yak/swc@10.0.0-rc.2

## 0.4.0-rc.1

### Minor Changes

- Move the option `experiments.debug` of the Vite plugin to `debug`. ([#680](https://github.com/galaxuslabs/yak/pull/680))

- `@yak/solid` needs Node.js 22.18 or later. CommonJS code can now load it with `require()`. ([#681](https://github.com/galaxuslabs/yak/pull/681))

### Patch Changes

- Updated dependencies:
  - @yak/swc@10.0.0-rc.1

## 0.3.1-rc.0

### Patch Changes

- Updated dependencies:
  - @yak/swc@10.0.0-rc.0

## 0.3.0

### Minor Changes

- Improve server rendering performance for `styled(Component)` and fix crashes when forwarding reactive props. ([#659](https://github.com/galaxuslabs/yak/pull/659))

  Requires `solid-js` and `@solidjs/web` 2.0.0-rc.10 or later.

### Patch Changes

- yak-swc@9.10.2

## 0.2.1

### Patch Changes

- Respect Vite's file access restrictions when loading virtual CSS modules in the dev server. ([#660](https://github.com/galaxuslabs/yak/pull/660))
- yak-swc@9.10.1

## 0.2.0

### Minor Changes

- Update dependencies and publish the direct dependencies with semver ranges instead of exact pins ([#641](https://github.com/galaxuslabs/yak/pull/641))

- Faster styled components, especially on the server. Requires Solid 2.0.0-rc.8; an app that bundles `@yak/solid` for SSR (`ssr.noExternal`) must bundle Solid too. ([#644](https://github.com/galaxuslabs/yak/pull/644))

  - Object-form `.attrs()` with plain values is baked into the tag at definition, so such components render on the static path
  - `a`, `script`, `style` and `title` render like every other tag; hydration keys change, so server and client need the same `@yak/solid` version
  - Fixes: `merge()` on a component target keeps the generated class and sees no `$` props; chained `.attrs()` render a child once; a `textarea` renders its `value` as content; `script` and `style` content stays raw; a `component` prop reaches styled tags; the untransformed `styled` export no longer breaks `await`

### Patch Changes

- Fix an issue where a css prop combined with a spread didn't hydrate on SolidJS. ([#645](https://github.com/galaxuslabs/yak/pull/645))
- Updated dependencies:
  - yak-swc@9.10.0

## 0.1.0

### Minor Changes

- Initial release of `@yak/solid` the SolidJS runtime for yak targeting Solid 2 with full build time css extraction ([#632](https://github.com/galaxuslabs/yak/pull/632))

### Patch Changes

- Updated dependencies:
  - yak-swc@9.9.0
