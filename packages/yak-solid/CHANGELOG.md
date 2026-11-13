# @yak/solid

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
