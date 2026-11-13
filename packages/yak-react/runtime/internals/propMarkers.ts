/**
 * Carries the constant `.attrs({...})` object on the merged attrs function,
 * marking it theme-independent so the fast render path can apply it without
 * executing anything. Lives on the function, never on props
 */
export const STATIC_ATTRS = "$sa" as const;
