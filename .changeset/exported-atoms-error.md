---
"@yak/react": minor
"@yak/solid": minor
---

An `atoms()` value imported from another file no longer works and fails the build, export the class names as a string like `export const buttonClasses = "shadow-md rounded"` and call `atoms(buttonClasses)` in the file that uses it
