/** The preview's shadow root styles this class. */
export const ERROR_CLASS = "playground-error";

/** The preview's shadow root styles this class on the element that fills the preview. */
export const WARNING_CLASS = "playground-warning";

/** Shown when the main file has neither a default export nor an export named `App`. */
export const MISSING_EXPORT_MESSAGE =
  "Could not find a default export or an export named App to render";

/** The preview follows the site theme, so the warning picks its colors with `light-dark()`. */
export const errorStyles = `
.${ERROR_CLASS} {
  margin: 16px;
  padding: 12px;
  border-radius: 8px;
  background: #fdecec;
  color: #8a1c1c;
  font: 13px/1.5 ui-monospace, monospace;
  white-space: pre-wrap;
}

.${WARNING_CLASS} {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 16px;
}

.${WARNING_CLASS} > p {
  margin: 0;
  max-width: 320px;
  padding: 12px 16px;
  border: 1px solid light-dark(#f0dca8, #5c4c24);
  border-radius: 8px;
  background: light-dark(#fdf7e7, #3a3322);
  color: light-dark(#7a5a10, #ecd08c);
  font-size: 14px;
  text-align: center;
}
`;
