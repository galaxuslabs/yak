import { css } from "@yak/react";

/**
 * Give the element a name in the transition:
 *
 * html:active-view-transition-type(nav):has(&) #header {
 *   view-transition-name: header;
 * }
 */
export const transition = css`
  view-transition-name: page;
`;
