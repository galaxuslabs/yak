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

    // the styled component keeps the caller's style and adds its CSS variable
    const barSharedStyle = page.getByTestId("bar-shared-style");
    await expect(barSharedStyle).toHaveCSS("width", "50px");
    await expect(barSharedStyle).toHaveCSS("opacity", "0.5");
    // the plain element with the same style object gets no CSS variable
    const sharedStyle = page.getByTestId("shared-style");
    await expect(sharedStyle).toHaveCSS("opacity", "0.5");
    expect(await sharedStyle.evaluate((element) => (element as HTMLElement).style.length)).toBe(1);
  }),
);
