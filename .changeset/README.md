# Changesets

Every branch needs its own changeset. Run `pnpm changeset`, or `pnpm changeset --empty` for a change users don't see, such as playground or docs work. An empty changeset holds only the two `---` lines and adds nothing to the release notes.

Agents can't answer the prompts of `pnpm changeset`, so they write `.changeset/<short-name>.md` by hand. `pnpm changeset --empty` asks nothing and works for agents too.

```md
---
"@yak/react": patch
"@yak/solid": patch
---

Fixes a bug where an error from a broken import in a `.yak.ts` file stayed after you fixed it until the next edit
```

## Who reads the release notes

A web dev who uses dozens of packages and has little time. They never read yak's code, don't know its internals and won't open the PR. They skim the notes for a minute to learn what they must do and what got better. Every rule below follows from this reader.

## What goes in an entry

- Say what the user sees or must do instead of how yak does it. Write "no longer prints a `module.register()` warning on Node 26" instead of "loads files with `module.registerHooks()`": the mechanism doesn't help the reader decide anything
- Use the words from the docs at [yak.style](https://yak.style), like dynamic value, static math or `.yak.ts` file, and never internal names like evaluator, worker or resolver: the reader knows only the docs
- Put a required action first, like "`.yak.tsx` files no longer work on webpack, move JSX into a regular `.tsx` file": readers who skim stop after the first clause
- Start a fix with "Fixes a bug where" and describe the symptom in user terms, so readers can match it to a problem they have seen
- Check the commit or the test before you describe the old behavior: a wrong symptom sends readers after the wrong problem
- Give one complete example a user could paste, like `` const NEGATIVE_GAP = `-${GAP / 2}px` ``, and never a fragment without its context: one example says more than a sentence
- Keep an entry to one line, two only when the reader must act: a longer entry hides the one thing that matters
- Leave out edge cases on unsupported setups and lists of every place that changed: nobody acts on them
- State each fact in one changeset only and read the pending ones in this folder before you add yours: Changesets copies an entry into every package it lists, so a repeat shows up many times

## Examples

A required action:

```md
webpack now loads `.yak.ts` files in Node like Turbopack, Rsbuild and Vite do, so they export the same values on every bundler

`.yak.tsx` files no longer work on webpack, move JSX into a regular `.tsx` file
```

A fix:

```md
Fixes a bug where a minus before a dynamic value produced invalid CSS: `left: -${({ $x }) => $x}px` now sets `left` to `-32px` for `$x={32}`
```

A feature:

```md
Static math in styles now supports `**` like `${(GAP + 1) ** 2}px`
```

The same webpack change written from inside the code, which the reader can't use:

```md
webpack now evaluates `.yak.ts` files in a Node worker thread, like Turbopack, Rsbuild and Vite. A `.yak.ts` file now gets the same exports on every bundler.

`.yak.ts` files hold tokens and other values. Node can't load `.yak.tsx` files, which already failed on the other bundlers and now fail on webpack too. Move JSX into a regular `.tsx` file.
```

It names the mechanism, explains why Node can't load JSX and hides the action at the end.

## Frontmatter

- Use minor for a new feature or a change the reader must act on, and patch for a fix
- List every package whose users see the change even when its code didn't change. A feature in `@yak/swc` also lists `@yak/react` and `@yak/solid`: without them their notes show only "Updated dependencies [hash]" and their users never learn about the feature
- Point out a raised minimum Node version and ask whether it should be a minor: a patch can break CI that pins an older Node

## Style

- No period at the end of an entry and as few periods as possible: join clauses with a comma and write "like" instead of "e.g."
- No Oxford comma: "Turbopack, Rsbuild and Vite"
- Plain words, active voice and present tense with no metaphors and no em dashes
- Don't describe how the code used to look. Only a "Fixes a bug where" entry names the old behavior

## Before a release

Read all pending changesets together and preview the notes the way the release PR shows them: repeats and missing packages only show up across entries. When unsure about a shorter text, show the maintainer the shorter and the current text side by side and let them choose.
