# Next.js Example

Example Next.js app using @yak/react for CSS-in-JS. Works with both **Webpack** and **Turbopack**.

## Getting Started

```bash
# From the repository root
pnpm install
pnpm build && pnpm build:swc
pnpm example
```

## Key Files

- `next.config.ts` - @yak/react configuration via `withYak`
- `app/` - App Router pages and components using `styled`, `css`, and `keyframes`
- `yak.context.ts` - Theme context configuration

## Documentation

See the full docs at [yak.style](https://yak.style/docs/getting-started).

`yak.context.ts` in this example reads cookies, which makes the App Router route dynamic.
For light and dark mode on a static route, see
[Light and dark mode on static routes](https://yak.style/docs/features#light-dark-static-routes).
