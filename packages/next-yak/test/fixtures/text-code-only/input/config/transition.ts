import { css } from "next-yak";

/**
 * Give the element a name in the transition:
 *
 * html:active-view-transition-type(nav):has(&) :global(#header) {
 *   view-transition-name: header;
 * }
 */
export const transition = css`
  view-transition-name: page;
`;
