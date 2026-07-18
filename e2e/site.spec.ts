import { expect, test } from "@playwright/test";

const GITHUB_URL = "https://github.com/jagoff/memo";
const MACOS_COMMAND =
  "curl -fsSL https://raw.githubusercontent.com/jagoff/memo/master/install.sh | bash";
const LINUX_COMMAND = 'pipx install "mlx-memo[cpu]"';

test("renders the English title and hero", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("memo — Local-first memory for AI agents");
  await expect(
    page.getByRole("heading", { level: 1, name: "Your AI should remember." }),
  ).toBeVisible();
});

test("renders the Spanish title and hero", async ({ page }) => {
  await page.goto("/es/");

  await expect(page).toHaveTitle("memo — Memoria local para agentes de IA");
  await expect(
    page.getByRole("heading", { level: 1, name: "Tu IA debería recordar." }),
  ).toBeVisible();
});

test("preserves the install anchor when switching locale", async ({ page }) => {
  await page.goto("/#install");

  const spanishLocaleLink = page
    .getByRole("group", { name: "Choose language" })
    .getByRole("link", { name: "ES" });

  await expect(spanishLocaleLink).toHaveAttribute("href", /\/es\/#install$/);
  await spanishLocaleLink.click();

  await expect(page).toHaveURL("/es/#install");
});

test("install tabs expose both exact commands", async ({ page }) => {
  await page.goto("/#install");

  await page.getByRole("tab", { name: "macOS / Apple Silicon" }).click();
  await expect(
    page.getByRole("tabpanel", { name: "macOS / Apple Silicon" }),
  ).toContainText(MACOS_COMMAND);

  await page.getByRole("tab", { name: "Linux / CPU" }).click();
  await expect(
    page.getByRole("tabpanel", { name: "Linux / CPU" }),
  ).toContainText(LINUX_COMMAND);
});

test("copy success updates the live region", async ({
  baseURL,
  browserName,
  context,
  page,
}) => {
  test.skip(
    browserName !== "chromium",
    "Clipboard permission grants are verified in Chromium.",
  );
  if (!baseURL) throw new Error("Playwright baseURL must be configured.");
  await context.grantPermissions(["clipboard-read", "clipboard-write"], {
    origin: baseURL,
  });
  await page.goto("/#install");

  await page.getByRole("button", { name: "Copy command" }).first().click();

  await expect(page.getByRole("status")).toHaveText("Copied");
});

test("GitHub calls to action use the canonical repository", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.locator(`.hero-actions a[href="${GITHUB_URL}"]`),
  ).toHaveCount(1);
  await expect(
    page.locator(`.final-actions a[href="${GITHUB_URL}"]`),
  ).toHaveCount(1);
  await expect(
    page.getByRole("link", { name: /GitHub stars:/ }),
  ).toHaveAttribute("href", GITHUB_URL);
});

test("critical content remains available without JavaScript", async ({
  baseURL,
  browser,
}) => {
  if (!baseURL) throw new Error("Playwright baseURL must be configured.");
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();

  try {
    const localizedPages = [
      {
        path: "/",
        headings: [
          "Your AI should remember.",
          "Stop starting over.",
          "Save once. Recall everywhere.",
          "Memory with judgment.",
          "Useful memory, measurable.",
          "One command. No cloud account.",
          "Local is not a feature. It is the foundation.",
          "Let them remember.",
        ],
      },
      {
        path: "/es/",
        headings: [
          "Tu IA debería recordar.",
          "Dejá de empezar de cero.",
          "Guardá una vez. Recordá en todas partes.",
          "Memoria con criterio.",
          "Memoria útil, medible.",
          "Un comando. Sin cuenta cloud.",
          "Local no es una función. Es la base.",
          "Dejalos recordar.",
        ],
      },
    ] as const;

    for (const localizedPage of localizedPages) {
      await page.goto(new URL(localizedPage.path, baseURL).href);

      for (const heading of localizedPage.headings) {
        await expect(
          page.getByRole("heading", { name: heading }),
        ).toBeVisible();
      }
      await expect(
        page.getByText(MACOS_COMMAND, { exact: true }),
      ).toBeVisible();
      await expect(
        page.getByText(LINUX_COMMAND, { exact: true }),
      ).toBeVisible();
    }
  } finally {
    await context.close();
  }
});

test("reduced motion creates no pinned ScrollTrigger spacers", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const path of ["/", "/es/"]) {
    await page.goto(path);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    await expect(
      page.locator(".pin-spacer, [data-scrolltrigger-pin-spacer]"),
    ).toHaveCount(0);
  }
});
