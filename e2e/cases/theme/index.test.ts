import { test, expect } from "@playwright/test";
import { withTestEnv } from "yak-e2e";

test(
  "switches extracted CSS classes when the theme changes",
  withTestEnv("theme", async (testEnv, page) => {
    await page.goto(testEnv.url);
    const panel = page.getByTestId("panel");
    await expect(panel).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(panel).toHaveAttribute("title", "brandA");
    await expect(panel).not.toHaveAttribute("theme");
    await expect(panel).not.toHaveAttribute("style");
    const brandAClass = await panel.getAttribute("class");
    // a component without attrs reads the theme of the provider
    const label = page.getByTestId("label");
    await expect(label).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(label).not.toHaveAttribute("theme");
    // a theme prop wins over the theme of the provider
    const labelThemeProp = page.getByTestId("label-theme-prop");
    await expect(labelThemeProp).toHaveCSS("color", "rgb(0, 0, 255)");
    // a constant named `theme` in the module is not the yak theme
    const badge = page.getByTestId("badge");
    await expect(badge).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(badge).toHaveCSS("text-decoration-line", "underline");

    await expect(async () => {
      await page.getByTestId("toggle-brand").click();
      await expect(panel).toHaveAttribute("title", "brandB", { timeout: 1000 });
    }).toPass({ timeout: 15_000 });
    await expect(panel).toHaveCSS("color", "rgb(0, 0, 255)");
    await expect(panel).not.toHaveAttribute("class", brandAClass!);
    await expect(label).toHaveCSS("color", "rgb(0, 0, 255)");
    await expect(labelThemeProp).toHaveCSS("color", "rgb(0, 0, 255)");
    await expect(panel).not.toHaveAttribute("theme");
    await expect(panel).not.toHaveAttribute("style");

    await page.getByTestId("toggle-brand").click();
    await expect(panel).toHaveAttribute("title", "brandA");
    await expect(panel).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(panel).toHaveAttribute("class", brandAClass!);
    await expect(label).toHaveCSS("color", "rgb(255, 0, 0)");
    await expect(labelThemeProp).toHaveCSS("color", "rgb(0, 0, 255)");
  }),
);
