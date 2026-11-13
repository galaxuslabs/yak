# @yak/swc

## 10.0.0

`yak-swc` is now `@yak/swc`. The [migration guide](https://yak.js.org/docs/migration-from-next-yak) covers the switch.

### Major Changes

- Rename `yak-swc` to `@yak/swc`.
- The default yak package is now `@yak/react` instead of `next-yak`. Imports from `next-yak` are no longer compiled.
- Remove the CSS Modules output. The options `importMode.transpilation` and `suppressDeprecationWarnings` no longer exist.
- A `:global()` selector is now a build error.

### Patch Changes

- Support Next.js 16.4.
- Fix the Rolldown warning `INVALID_ANNOTATION`.

## 10.0.0-rc.2

### Patch Changes

- Fix the warning `INVALID_ANNOTATION` that Rolldown reported ([#685](https://github.com/galaxuslabs/yak/pull/685))

## 10.0.0-rc.1

### Major Changes

- Remove the CSS Modules output. The option `importMode.transpilation` and the option `suppressDeprecationWarnings` no longer exist. ([#667](https://github.com/galaxuslabs/yak/pull/667))

- A `:global()` selector is now a build error. ([#667](https://github.com/galaxuslabs/yak/pull/667))

### Patch Changes

- Update dependencies and add support for next.js 16.4 ([#688](https://github.com/galaxuslabs/yak/pull/688))

## 10.0.0-rc.0

### Major Changes

- Rename `yak-swc` to `@yak/swc`. ([#665](https://github.com/galaxuslabs/yak/pull/665))

- The default yak package is now `@yak/react` instead of `next-yak`. ([#665](https://github.com/galaxuslabs/yak/pull/665))

- Imports from `next-yak` are no longer compiled. Import from `@yak/react` instead. ([#665](https://github.com/galaxuslabs/yak/pull/665))

## 9.10.2

## 9.10.1

## 9.10.0

### Minor Changes

- Update dependencies and publish the direct dependencies with semver ranges instead of exact pins ([#641](https://github.com/galaxuslabs/yak/pull/641))

### Patch Changes

- Fix an issue where a css prop combined with a spread didn't hydrate on SolidJS. ([#645](https://github.com/galaxuslabs/yak/pull/645))

## 9.9.0

### Minor Changes

- Add support for `SolidJS` together with the new `@yak/solid` package ([#632](https://github.com/galaxuslabs/yak/pull/632))

### Patch Changes

- Reject `css` prop values which can not apply styles (e.g. `css={[a, b]}` or `css={{ color: "red" }}`) ([#637](https://github.com/galaxuslabs/yak/pull/637))

- Folding a static styled component into a plain element now removes all `$`-prefixed props ([#633](https://github.com/galaxuslabs/yak/pull/633))

## 9.8.0

### Minor Changes

- Interpolations of the same function in one styled component now share a single CSS variable, so the function runs once per render and the element carries fewer inline style entries. ([#626](https://github.com/galaxuslabs/yak/pull/626))

### Patch Changes

- CSS variables of styled components declared in object literals now carry the full path in development, e.g. `--buttons_primary__color` instead of `--buttons__color-01`. ([#629](https://github.com/galaxuslabs/yak/pull/629))

## 9.7.0

### Minor Changes

- Fold statically known css props into a plain `className` at build time instead of emitting a per-render `__yak_mergeCssProp` call, e.g. `<div css={css`color: red`} />` becomes `<div className="yX" />` and conditional styles become `className={"yX" + (on ? " yX1" : "")}`. Elements with an existing `className`, spread props or dynamic values keep the runtime merge path unchanged, as does every css prop when `foldStatic: false`; a css prop that references a mixin is a compile error. ([#567](https://github.com/galaxuslabs/yak/pull/567))

- The css prop now rejects a reference to styles declared elsewhere (`css={mixin}`) with a compile error. Wrap the reference in a css template instead: `css={css`${mixin}`}`. Such a reference compiles to nothing at the usage, so it silently rendered unstyled. ([#567](https://github.com/galaxuslabs/yak/pull/567))

- Add JSX folding: a usage of a styled component declared in the same file compiles to a plain element, skipping the runtime wrapper. Rendering gets considerably faster, and nothing needs configuring. ([#568](https://github.com/galaxuslabs/yak/pull/568))

  ```tsx
  const Icon = styled.span<{ $active?: boolean }>`
    min-height: 24px;
    ${({ $active }) =>
      $active &&
      css`
        color: red;
      `}
  `;
  const App = () => <Icon $active={on} />;

  // compiles to
  const App = () => <span className={"yak-icon" + (on ? " yak-icon--active" : "")} />;
  ```

  What folds:

  - A fully static component folds to its plain element.
  - `styled(Component)` folds to the wrapped component, which may be imported.
  - A fully static `styled(Parent)` chain collapses to the base element, at any depth, with the class names merged parent-first. The declaration flattens too, so an exported chain ships one wrapper and its unused base components drop out.

  What keeps the runtime path: spread props, a `theme` prop, dynamic css values, `.attrs()`, and components not declared as a top-level `const`. A chain also stays a chain when its parent is dynamic, imported, or bound with `let`.

  Set `foldStatic: false` to turn folding off; it also gates the css prop fold.

  Caveats: a folded usage is no longer a component, so it does not appear in React DevTools or component stacks, and `child.type === Icon` no longer matches it. Foreign `$props` on a folded usage are forwarded to the element, not stripped. Prop expressions still run the same number of times, in the same order, as the original JSX — except in code React's purity rule already forbids: an unread `$prop` is dropped without running, and a getter behind a member read (`$a={obj.x}`) can fire once per condition. The FAQ has the full rules.

### Patch Changes

- A `className` string next to a `css` prop kept its JSX encoding: `className="Food &amp; Drink"` rendered the entity into the DOM class, and a backslash class like `before:content-['\2713']` broke the build with a SyntaxError. The value now reaches the DOM exactly as written. ([#614](https://github.com/galaxuslabs/yak/pull/614))

- Drop empty css props at build time instead of emitting a dead class name, e.g. `<div css={css``} />` becomes `<div />` and an empty ternary arm folds to `""`. A nested empty ` css` `` also folds to an empty class name instead of keeping the whole css prop on the runtime merge path. ([#567](https://github.com/galaxuslabs/yak/pull/567))

- A folded `className` merge keeps the user's class name exactly as written: backslashes, HTML entities and emoji reach the DOM byte for byte. ([#615](https://github.com/galaxuslabs/yak/pull/615))

## 9.6.0

### Minor Changes

- Add `globalStyle` to write global styles that are extracted at build time and apply once the file is imported ([#571](https://github.com/galaxuslabs/yak/pull/571))

## 9.5.1

### Patch Changes

- Fix a stray `/*#__PURE__*/` on inlined `css` mixins that could make a bundler tree-shake away an entire export under the wasm plugin ([#572](https://github.com/galaxuslabs/yak/pull/572))

- Emit the default-export marker for styled components exported through a TS cast (e.g. `export default Page as typeof Page`) so cross-file default imports resolve correctly ([#572](https://github.com/galaxuslabs/yak/pull/572))

- Add a `strictCssProp` option (default `true`) that fails the build on a `css` prop next-yak can't handle. Turn it off to leave unrecognized `css` props untouched, e.g. when another library on the same element uses its own `css` prop. Invalid `css` props are now left in place rather than silently stripped. ([#574](https://github.com/galaxuslabs/yak/pull/574))

## 9.5.0

### Minor Changes

- Update dependencies ([#566](https://github.com/galaxuslabs/yak/pull/566))

### Patch Changes

- Fix building the SWC plugin on Rust 1.96+ and upgrade swc_core from 56.0.0 to 68.0.6. ([#559](https://github.com/galaxuslabs/yak/pull/559))

  Rust 1.96 removed the implicit `--allow-undefined` for wasm targets, which broke linking the plugin (`undefined symbol: __set_transform_result`). The wasm build now passes the link-arg explicitly, the Rust toolchain is pinned via `rust-toolchain.toml`, and swc_core (plus the separately pinned swc crates) moved to the current major. No behavior changes — all transform snapshots are unchanged.

## 9.4.2

### Patch Changes

- Fix dynamic interpolations wrapped in CSS string quotes (e.g. `content: "${(p) => p.$x}"`) ([#532](https://github.com/galaxuslabs/yak/pull/532))

- Fix typecasts (`as unknown as ...`) breaking cross-file selectors, mixin inlining and keyframes references. ([#535](https://github.com/galaxuslabs/yak/pull/535))

- TypeScript casts (`as`, `as const`, `!`, `satisfies`, parens) inside CSS interpolations no longer prevent values from being statically inlined. ([#536](https://github.com/galaxuslabs/yak/pull/536))

- Emit an error when a dynamic interpolation is used inside an at-rule query. ([#534](https://github.com/galaxuslabs/yak/pull/534))

- Fix HMR full page reloads for styled-only files by injecting `$RefreshReg$` for exported styled components ([#524](https://github.com/galaxuslabs/yak/pull/524))

## 9.4.1

## 9.4.0

### Patch Changes

- Fix false "Could not parse member expression" error for dynamic computed member access in runtime expressions (e.g. `SIZES[size].width`) ([#504](https://github.com/galaxuslabs/yak/pull/504))

- Skip empty CSS imports ([#502](https://github.com/galaxuslabs/yak/pull/502))

- Fix referencing components without any styles ([#503](https://github.com/galaxuslabs/yak/pull/503))

## 9.3.0

## 9.2.0

### Patch Changes

- Updated dependencies ([#475](https://github.com/galaxuslabs/yak/pull/475))

## 9.1.0

### Minor Changes

- Add deprecation warning for `:global()` selectors ([#448](https://github.com/galaxuslabs/yak/pull/448))

### Patch Changes

- Add experimental vite support ([#434](https://github.com/galaxuslabs/yak/pull/434))

- Unified CSS import configuration with placeholder support ([#454](https://github.com/galaxuslabs/yak/pull/454))

## 9.0.0

### Major Changes

- Add support for next.js 16.1.0 ([#449](https://github.com/galaxuslabs/yak/pull/449))

## 8.0.2

## 8.0.1

## 8.0.0

### Major Changes

- Add limited Turbopack support (Limitation: .yak files can't use `import` statements) ([#421](https://github.com/galaxuslabs/yak/pull/421))

- Update to Next.js 16 ([#420](https://github.com/galaxuslabs/yak/pull/420))

### Minor Changes

- Add support for async RSC Yak Theme Contexts (yak.context.ts) ([#429](https://github.com/galaxuslabs/yak/pull/429))

### Patch Changes

- Allow exporting Yak components as default expressions ([#402](https://github.com/galaxuslabs/yak/pull/402))

## 7.0.0

### Major Changes

- Add support for next.js >= 15.4.4 ([#411](https://github.com/galaxuslabs/yak/pull/411))

## 6.0.0

### Major Changes

- Update swc_core to be compatible with Next.js 15.4 ([#387](https://github.com/galaxuslabs/yak/pull/387))

## 5.7.2

### Patch Changes

- Fixed an issue when only `atoms` are used ([#383](https://github.com/galaxuslabs/yak/pull/383))

## 5.7.1

## 5.7.0

### Minor Changes

- Added support for atoms in CSS prop & enhanced atoms function to manipulate class names and styles in a callback ([#375](https://github.com/galaxuslabs/yak/pull/375))

### Patch Changes

- Improve typings ([#363](https://github.com/galaxuslabs/yak/pull/363))

- Added support for constant string and number keys of object in the same file ([#374](https://github.com/galaxuslabs/yak/pull/374))

## 5.6.1

### Patch Changes

- Add cross file constant supports also for default or namespace imports ([#360](https://github.com/galaxuslabs/yak/pull/360))

## 5.6.0

### Minor Changes

- Add new "experiments.transpilationMode" option to transpile to CSS instead of CSS Modules ([#349](https://github.com/galaxuslabs/yak/pull/349))

- Make swc plugin integration an enabled-by-default cargo feature (not used in playground) ([#343](https://github.com/galaxuslabs/yak/pull/343))

## 5.5.0

### Minor Changes

- Updated all dependencies ([#332](https://github.com/galaxuslabs/yak/pull/332))

### Patch Changes

- Add support for turbopacks relative filepaths ([#334](https://github.com/galaxuslabs/yak/pull/334))

## 5.4.0

### Minor Changes

- Add support for `@property` inside `styled` and `css` tags ([#327](https://github.com/galaxuslabs/yak/pull/327))

## 5.3.1

### Patch Changes

- Fix animation references by using "global()" instead of ":global()" ([#323](https://github.com/galaxuslabs/yak/pull/323))

## 5.3.0

### Minor Changes

- use a turbopack compatible swc plugin path ([#318](https://github.com/galaxuslabs/yak/pull/318))

### Patch Changes

- Fix keyframe animation references when used before declaration ([#321](https://github.com/galaxuslabs/yak/pull/321))

## 5.2.2

### Patch Changes

- fix cross file selectors ([#314](https://github.com/galaxuslabs/yak/pull/314))

- fix recursive class name replacement inside mixins ([#317](https://github.com/galaxuslabs/yak/pull/317))

## 5.2.1

### Patch Changes

- fix class name escaping in dev mode ([#310](https://github.com/galaxuslabs/yak/pull/310))

## 5.2.0

### Minor Changes

- minify class names for production builds ([#220](https://github.com/galaxuslabs/yak/pull/220))

## 5.1.0

### Minor Changes

- Improved React DevTools support - Styled components created with next-yak now show up with their actual variable names in React DevTools instead of a generic yak label ([#300](https://github.com/galaxuslabs/yak/pull/300))

### Patch Changes

- Mark `__yak_unitPostFix` as pure (generated code) ([#299](https://github.com/galaxuslabs/yak/pull/299))

- Minor refactoring of visitors ([#296](https://github.com/galaxuslabs/yak/pull/296))

## 5.0.0

### Major Changes

- **swc:** Update to swc_core 16.0.0 (compatible with @swc/core@1.11.1) ([#281](https://github.com/galaxuslabs/yak/pull/281))

## 4.1.0

### Minor Changes

- improve bundle size by compiling styled.TAG_NAME ([#154](https://github.com/galaxuslabs/yak/pull/154))

### Patch Changes

- Update wasm target to wasm-wasip1 ([#259](https://github.com/galaxuslabs/yak/pull/259))

## 4.0.4

### Patch Changes

- Fix issue with the css prop where it wouldn't be generated when used inside an exported component ([#253](https://github.com/galaxuslabs/yak/pull/253))

- Updated all dependencies ([#251](https://github.com/galaxuslabs/yak/pull/251))

## 4.0.3

### Patch Changes

- fix css prop class name access in nested jsx ([#245](https://github.com/galaxuslabs/yak/pull/245))

## 4.0.2

### Patch Changes

- Enable css prop support for styled components, not just native HTML elements by fixing a bug in the types ([#243](https://github.com/galaxuslabs/yak/pull/243))

- Enable conditional styling for the css prop ([#242](https://github.com/galaxuslabs/yak/pull/242))

## 4.0.1

### Patch Changes

- Improve cross-os hashes to be more consistent. ([#237](https://github.com/galaxuslabs/yak/pull/237))

## 4.0.0

### Major Changes

- Add support for Next.js 15.0.4 (SWC 5.x) ([#235](https://github.com/galaxuslabs/yak/pull/235))

## 3.1.0

### Minor Changes

- allow to define a prefix for generated css names like variables ([#225](https://github.com/galaxuslabs/yak/pull/225))

### Patch Changes

- fix a parsing bug for unquoted urls inside url() ([#227](https://github.com/galaxuslabs/yak/pull/227))

## 3.0.1

### Patch Changes

- Better error message for wrong usage of dynamic properties in nested template ([#212](https://github.com/galaxuslabs/yak/pull/212))

## 3.0.0

### Major Changes

- Upgrade SWC to 3.x to add support for Next.js 15.0.0 ([#196](https://github.com/galaxuslabs/yak/pull/196))

## 0.8.0

### Minor Changes

- Improved CSS class name generation using FNV-1a hashing for better cross-platform consistency and shorter identifiers ([#205](https://github.com/galaxuslabs/yak/pull/205))
