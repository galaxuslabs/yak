import { test, expect } from "@playwright/test";
import { withTestEnv } from "yak-e2e";

test(
  "overrides a default exported styled component in the same file",
  withTestEnv("default-export-composition", async (testEnv, page) => {
    await page.goto(testEnv.url);

    await expect(page.getByTestId("base")).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(page.getByTestId("extended")).toHaveCSS("color", "rgb(0, 0, 255)");
  }),
);
