# @yak/eslint-plugin

## 2.0.1

### Patch Changes

- The docs moved to [yak.style](https://yak.style) ([#728](https://github.com/galaxuslabs/yak/pull/728))

## 2.0.0

`eslint-plugin-yak` is now `@yak/eslint-plugin`. The [migration guide](https://yak.js.org/docs/migration-from-next-yak) covers the switch.

### Major Changes

- Rename `eslint-plugin-yak` to `@yak/eslint-plugin`. The rule prefix is now `@yak/` in ESLint and in Oxlint.
- The rules no longer check files that import from `next-yak`. Import from `@yak/react` instead.
- Remove the rule `css-global-deprecated`. The compiler now rejects `:global()` with a build error.
- `@yak/eslint-plugin` needs Node.js 22.18 or later. CommonJS configs can now load it with `require()`.

### Minor Changes

- Support `@yak/solid`.

## 2.0.0-rc.1

### Major Changes

- `@yak/eslint-plugin` needs Node.js 22.18 or later. CommonJS configs can now load it with `require()`. ([#681](https://github.com/galaxuslabs/yak/pull/681))

- Remove the rule `css-global-deprecated`. The compiler now rejects `:global()` with a build error. ([#667](https://github.com/galaxuslabs/yak/pull/667))

## 2.0.0-rc.0

### Major Changes

- The rules no longer check files that import from `next-yak`. Import from `@yak/react` instead. ([#665](https://github.com/galaxuslabs/yak/pull/665))

- The rule prefix is now `@yak/` in ESLint and in Oxlint. ([#665](https://github.com/galaxuslabs/yak/pull/665))

- Rename `eslint-plugin-yak` to `@yak/eslint-plugin`. ([#665](https://github.com/galaxuslabs/yak/pull/665))

### Minor Changes

- Add support for `@yak/solid`. ([#665](https://github.com/galaxuslabs/yak/pull/665))

## 1.4.0

### Minor Changes

- Update dependencies and publish the direct dependencies with semver ranges instead of exact pins ([#641](https://github.com/galaxuslabs/yak/pull/641))

## 1.3.0

### Minor Changes

- Add direct Oxlint JS plugin support while preserving ESLint compatibility. Rules now use Oxlint's `createOnce` API and can be loaded directly through `jsPlugins` without installing ESLint. ([#631](https://github.com/galaxuslabs/yak/pull/631))

## 1.2.0

### Minor Changes

- Improve linting messages to show a concrete before/after built from your own code instead of a generic hint ([#577](https://github.com/galaxuslabs/yak/pull/577))

### Patch Changes

- Allow prop-derived function calls as runtime values in the style-conditions rule ([#579](https://github.com/galaxuslabs/yak/pull/579))

- Handle CSS escape sequences in the enforce-semicolon rule without crashing. ([#580](https://github.com/galaxuslabs/yak/pull/580))

- Detect declaration values in the style-conditions rule by parsing the CSS instead of guessing from a trailing colon ([#584](https://github.com/galaxuslabs/yak/pull/584))

- Keep css nesting fixes as editor suggestions instead of advertising automatic fixes ([#581](https://github.com/galaxuslabs/yak/pull/581))

## 1.1.3

### Patch Changes

- Build eslint-plugin-yak before publishing packages so its dist entrypoint is included in the npm artifact. ([#556](https://github.com/galaxuslabs/yak/pull/556))

## 1.1.2

### Patch Changes

- Updated all dependencies ([#539](https://github.com/galaxuslabs/yak/pull/539))

## 1.1.1

### Patch Changes

- Update docs ([`e906d2a`](https://github.com/galaxuslabs/yak/commit/e906d2a454487770f761f35f706011d9a8d44720))

## 1.1.0

### Minor Changes

- Add deprecation warning for `:global()` selectors ([#448](https://github.com/galaxuslabs/yak/pull/448))

## 1.0.1

### Patch Changes

- add typings for recommended eslint configs ([#338](https://github.com/galaxuslabs/yak/pull/338))

## 1.0.0

### Major Changes

- Add eslint plugins to help with the migration from styled-components to next-yak ([#337](https://github.com/galaxuslabs/yak/pull/337))
