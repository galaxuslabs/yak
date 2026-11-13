# @yak/storybook

## 10.0.0

`storybook-addon-yak` is now `@yak/storybook`. The [migration guide](https://yak.js.org/docs/migration-from-next-yak) covers the switch.

### Major Changes

- Rename `storybook-addon-yak` to `@yak/storybook`.
- Remove the option `experiments.transpilationMode`. The addon always writes plain CSS.
- `@yak/storybook` needs Node.js 22.18 or later. CommonJS code can now load it with `require()`.

### Patch Changes

- Support Storybook 11.

## 10.0.0-rc.2

No changes in this release.

## 10.0.0-rc.1

### Major Changes

- Remove the option `experiments.transpilationMode`. The addon now always writes plain CSS. ([#667](https://github.com/galaxuslabs/yak/pull/667))

- `@yak/storybook` needs Node.js 22.18 or later. CommonJS code can now load it with `require()`. ([#681](https://github.com/galaxuslabs/yak/pull/681))

### Patch Changes

- Support storybook 11 ([#687](https://github.com/galaxuslabs/yak/pull/687))

## 10.0.0-rc.0

### Major Changes

- Rename `storybook-addon-yak` to `@yak/storybook`. ([#665](https://github.com/galaxuslabs/yak/pull/665))

### Patch Changes

- Updated dependencies:
  - @yak/react@10.0.0-rc.0

## 9.10.2

## 9.10.1

## 9.10.0

### Minor Changes

- Update dependencies and publish the direct dependencies with semver ranges instead of exact pins ([#641](https://github.com/galaxuslabs/yak/pull/641))

## 9.9.0

## 9.8.0

## 9.7.0

## 9.6.0

## 9.5.1

## 9.5.0

## 9.4.2

### Patch Changes

- Updated all dependencies ([#539](https://github.com/galaxuslabs/yak/pull/539))

## 9.4.1

### Patch Changes

- Updated dependencies:
  - next-yak@9.4.1

## 9.4.0

### Patch Changes

- Updated dependencies:
  - next-yak@9.4.0

## 9.3.0

### Patch Changes

- Updated dependencies:
  - next-yak@9.3.0

## 9.2.0

### Patch Changes

- Updated dependencies:
  - next-yak@9.2.0

## 9.1.0

### Patch Changes

- Release initial storybook addon for next-yak ([#457](https://github.com/galaxuslabs/yak/pull/457))
- Updated dependencies:
  - next-yak@9.1.0
