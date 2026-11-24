---
"@yak/react": minor
"@yak/solid": minor
---

Importing an `atoms()` value from another file is no longer supported and fails the build, export the class names as a string like `export const buttonClasses = "shadow-md rounded"` and call `atoms(buttonClasses)` in the file that uses it
