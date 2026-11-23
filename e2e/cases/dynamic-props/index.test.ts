import { test, expect } from "@playwright/test";
import { withTestEnv } from "yak-e2e";

test(
  "renders dynamic props with CSS variables and conditional styles",
  withTestEnv("dynamic-props", async (testEnv, page) => {
    await page.goto(testEnv.url);

    const active = page.getByTestId("bar-active");
    await expect(active).toHaveCSS("width", "200px");
    await expect(active).toHaveCSS("background-color", "rgb(0, 128, 0)");

    const inactive = page.getByTestId("bar-inactive");
    await expect(inactive).toHaveCSS("width", "100px");
    await expect(inactive).toHaveCSS("background-color", "rgb(128, 128, 128)");

    const sized = page.getByTestId("sized");
    await expect(sized).toHaveCSS("width", "30px");
    await expect(sized).toHaveCSS("height", "10px");

    await expect(page.getByTestId("fallback")).toHaveCSS("height", "30px");
    await expect(page.getByTestId("fallback-label")).toHaveCSS("height", "10px");

    // the styled component keeps the caller's style and adds its CSS variable
    const barSharedStyle = page.getByTestId("bar-shared-style");
    await expect(barSharedStyle).toHaveCSS("width", "50px");
    await expect(barSharedStyle).toHaveCSS("opacity", "0.5");
    // the plain element with the same style object gets no CSS variable
    const sharedStyle = page.getByTestId("shared-style");
    await expect(sharedStyle).toHaveCSS("opacity", "0.5");
    expect(await sharedStyle.evaluate((element) => (element as HTMLElement).style.length)).toBe(1);

    // conditions written with `switch`, `if` and `return`
    const tagPrimary = page.getByTestId("tag-primary");
    await expect(tagPrimary).toHaveCSS("color", "rgb(0, 0, 255)");
    await expect(tagPrimary).toHaveCSS("padding-top", "1px");
    await expect(tagPrimary).toHaveCSS("margin-left", "4px");
    const tagDanger = page.getByTestId("tag-danger");
    await expect(tagDanger).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(tagDanger).toHaveCSS("padding-top", "3px");
    await expect(tagDanger).toHaveCSS("margin-left", "8px");
    const tagGhost = page.getByTestId("tag-ghost");
    await expect(tagGhost).toHaveCSS("color", "rgb(128, 128, 128)");
    await expect(tagGhost).toHaveCSS("padding-top", "0px");
    await expect(tagGhost).toHaveCSS("margin-left", "4px");
  }),
);
