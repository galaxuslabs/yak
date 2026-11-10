# Changesets

Every branch needs its own changeset: run `pnpm changeset`, or `pnpm changeset --empty` for a change users don't see, such as playground or docs work. An empty changeset holds only the two `---` lines and adds nothing to the release notes.

## Who reads the release notes

A web dev who uses dozens of packages and has little time. They never read yak's code, don't know its internals and won't open the PR. They skim the notes for a minute to learn what they must do and what got better. Every rule below follows from this reader.

## What goes in an entry

- Say what the user sees or must do instead of how yak does it. Write "no longer prints a `module.register()` warning on Node 26" instead of "loads files with `module.registerHooks()`": the mechanism doesn't help the reader decide anything
- Put a required action first, like "`.yak.tsx` files no longer work on webpack, move JSX into a regular `.tsx` file": readers who skim stop after the first clause
- Start a fix with "Fixes a bug where" and describe the symptom in user terms, so readers can match it to a problem they have seen
- Check the commit before you describe the old behavior: a wrong symptom sends readers after the wrong problem
- Give one complete example a user could paste, like `` const NEGATIVE_GAP = `-${GAP / 2}px` ``, and never a fragment without its context: one example says more than a sentence
- Leave out edge cases on unsupported setups and lists of every place that changed: nobody acts on them
- State each fact in one changeset only: Changesets copies an entry into every package it lists, so a repeat shows up many times

## Frontmatter

- List every package whose users see the change even when its code didn't change. A feature in `@yak/swc` also lists `@yak/react` and `@yak/solid`: without them their notes show only "Updated dependencies [hash]" and their users never learn about the feature
- Point out a raised minimum Node version and ask whether it should be a minor: a patch can break CI that pins an older Node

## Style

- No period at the end of an entry and as few periods as possible: join clauses with a comma and write "like" instead of "e.g."
- No Oxford comma: "Turbopack, Rsbuild and Vite"
- Plain words, active voice and present tense with no metaphors and no em dashes
- Don't describe how the code used to look. Only a "Fixes a bug where" entry names the old behavior

## Before a release

Read all pending changesets together and preview the notes the way the release PR shows them: repeats and missing packages only show up across entries. When unsure about a shorter text, show the maintainer the shorter and the current text side by side and let them choose.
