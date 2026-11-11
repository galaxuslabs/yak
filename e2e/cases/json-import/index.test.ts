import { test, expect } from "@playwright/test";
import { withTestEnv } from "yak-e2e";

test(
  "imports a JSON file that names the yak package",
  withTestEnv("json-import", async (testEnv, page) => {
    await page.goto(testEnv.url);

    const name = page.getByTestId("name");
    await expect(name).toHaveText("json-import");
    await expect(name).toHaveCSS("color", "rgb(255, 0, 0)");
  }),
);
