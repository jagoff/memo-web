import { fileURLToPath } from "node:url";
import { expect, test } from "@playwright/test";

test.skip(
  ({ browserName }) => browserName !== "chromium",
  "Visual baselines are generated once with Chromium.",
);

const locales = [
  { name: "en", path: "/" },
  { name: "es", path: "/es/" },
] as const;

const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
] as const;

const stableDataStyle = fileURLToPath(
  new URL("./visual-stable-data.css", import.meta.url),
);

for (const locale of locales) {
  for (const viewport of viewports) {
    test(`${locale.name} ${viewport.name} landing page`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto(locale.path);
      await page.evaluate(async () => {
        await document.fonts.ready;
      });

      await expect(page).toHaveScreenshot(
        `${locale.name}-${viewport.name}.png`,
        {
          fullPage: true,
          mask: [page.locator("[data-public-data-freshness] time")],
          maxDiffPixelRatio: 0.02,
          stylePath: stableDataStyle,
        },
      );
    });
  }
}
