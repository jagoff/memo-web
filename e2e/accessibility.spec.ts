import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const locales = [
  {
    path: "/",
    skip: "Skip to content",
    home: "memo home",
    nav: ["How it works", "Features", "Install", "GitHub"],
  },
  {
    path: "/es/",
    skip: "Saltar al contenido",
    home: "Inicio de memo",
    nav: ["Cómo funciona", "Funciones", "Instalar", "GitHub"],
  },
] as const;

for (const locale of locales) {
  test(`has no WCAG 2.1 AA violations at ${locale.path}`, async ({ page }) => {
    await page.goto(locale.path);

    const results = await new AxeBuilder({ page })
      .withTags(WCAG_TAGS)
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test(`shows focus from the skip link through the ${locale.path} header`, async ({
    browserName,
    page,
  }) => {
    test.skip(
      browserName !== "chromium",
      "Keyboard focus order is exercised in the desktop keyboard project.",
    );
    await page.goto(locale.path);

    const focusOrder = [
      page.getByRole("link", { name: locale.skip }),
      page.getByRole("link", { name: locale.home }),
      ...locale.nav.map((name) =>
        page
          .getByRole("navigation", {
            name:
              locale.path === "/"
                ? "Primary navigation"
                : "Navegación principal",
          })
          .getByRole("link", { name }),
      ),
      page.locator(".header-actions").getByRole("link", {
        name: locale.nav[2],
      }),
      page
        .getByRole("group", {
          name: locale.path === "/" ? "Choose language" : "Elegir idioma",
        })
        .getByRole("link", { name: "EN" }),
      page
        .getByRole("group", {
          name: locale.path === "/" ? "Choose language" : "Elegir idioma",
        })
        .getByRole("link", { name: "ES" }),
    ];

    for (const target of focusOrder) {
      await page.keyboard.press("Tab");
      await expect(target).toBeFocused();
      await expect(target).toBeVisible();
    }
  });
}
