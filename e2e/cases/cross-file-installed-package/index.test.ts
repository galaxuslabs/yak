import { test, expect } from "@playwright/test";
import { withTestEnv } from "yak-e2e";

test(
  "renders constants and yak components from installed packages",
  withTestEnv("cross-file-installed-package", async (testEnv, page) => {
    await page.goto(testEnv.url);

    await expect(page.getByTestId("pre-bundled")).toHaveCSS("color", "rgb(128, 0, 128)");
    await expect(page.getByTestId("pre-bundled-subpath")).toHaveCSS("color", "rgb(255, 165, 0)");
    await expect(page.getByTestId("excluded")).toHaveCSS("color", "rgb(0, 128, 128)");
    await expect(page.getByTestId("excluded-subpath")).toHaveCSS("color", "rgb(0, 0, 128)");
    await expect(page.getByTestId("ts-token")).toHaveCSS("border-top-left-radius", "6px");
    await expect(page.getByTestId("yak-file")).toHaveCSS("border-top-width", "4px");
    await expect(page.getByTestId("box")).toHaveCSS("border-top-color", "rgb(102, 51, 153)");
    await expect(page.getByTestId("card")).toHaveCSS("border-top-left-radius", "6px");
  }),
);
