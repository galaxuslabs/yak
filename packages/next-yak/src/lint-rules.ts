/** the rules of eslint-plugin-yak, `css-global-deprecated` is gone in @yak/eslint-plugin */
const RULES = [
  "css-nesting-operator",
  "enforce-semicolon",
  "style-conditions",
  "css-global-deprecated",
];
export const REMOVED_RULE = "css-global-deprecated";

/**
 * Returns the new id of a rule (`yak/enforce-semicolon` → `@yak/enforce-semicolon`), "removed"
 * for `css-global-deprecated`, or null when the text is not a yak rule id.
 */
export function migrateRuleId(id: string): string | "removed" | null {
  const match = /^@?yak\/([a-z-]+)$/.exec(id);
  if (!match || !RULES.includes(match[1])) return null;
  if (match[1] === REMOVED_RULE) return "removed";
  return id.startsWith("@") ? null : `@${id}`;
}

/** renames the yak rules in `eslint-disable` and `oxlint-disable` comments */
export function migrateDisableComment(text: string): string {
  if (!/(eslint|oxlint)-(disable|enable)/.test(text)) return text;
  return text.replace(/(^|[^@\w/-])yak\/([a-z-]+)/g, (all, before: string, rule: string) =>
    RULES.includes(rule) && rule !== REMOVED_RULE ? `${before}@yak/${rule}` : all,
  );
}
