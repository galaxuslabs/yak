/** a kind of code that the codemod leaves to the user, and the reason */
export interface WarningType {
  /** the kind of code, for one and for more than one */
  one: string;
  many: string;
  reason: string;
  /** true when the codemod changes this code too in text mode */
  textMode?: boolean;
}

/** a place at `file` or `file:line` that the user must change */
export interface Warning {
  type: WarningType;
  location: string;
  /** what is special at this place, such as the name of an unknown option */
  detail?: string;
}

const YAK_MODULE_CSS =
  "`.yak.module.css` no longer matches, because @yak/react writes `.yak.css` files.";
const UNREADABLE_OPTIONS =
  "The codemod cannot read the yak options, because they are not a plain object.";

/** the kinds of manual changes, in the order of the list that the codemod prints */
export const WARNING = {
  unreadableFile: { one: "file", many: "files", reason: "The codemod cannot read the file." },
  invalidJson: { one: "file", many: "files", reason: "The file is not valid JSON." },
  unclosedGlobal: {
    one: "yak style",
    many: "yak styles",
    reason: "`:global(` has no closing parenthesis.",
  },
  unreadableOptions: { one: "yak config", many: "yak configs", reason: UNREADABLE_OPTIONS },
  unknownOption: {
    one: "yak option",
    many: "yak options",
    reason: "The codemod does not know this option of `experiments`.",
  },
  removedRule: {
    one: "lint rule",
    many: "lint rules",
    reason: "@yak/eslint-plugin has no `css-global-deprecated` rule. Remove it.",
  },
  nextJest: {
    one: "Jest config",
    many: "Jest configs",
    reason: "Add `@yak/react` to `transpilePackages` in the Next.js config.",
  },
  yakModuleInRegex: { one: "regex", many: "regexes", reason: YAK_MODULE_CSS },
  yakModuleInString: { one: "string", many: "strings", reason: YAK_MODULE_CSS },
  oldNameInRegex: {
    one: "regex",
    many: "regexes",
    reason: "The regex contains an old package name.",
  },
  globalInComment: {
    one: "comment",
    many: "comments",
    reason: "The comment contains `:global()`, which @yak/react does not need.",
    textMode: true,
  },
  oldNameInText: {
    one: "text",
    many: "texts",
    reason: "The text still contains an old package name.",
    textMode: true,
  },
} satisfies Record<string, WarningType>;
