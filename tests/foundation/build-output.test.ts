import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const SITE = "https://memo-web.vercel.app";

async function readLandingPage(locale: "en" | "es"): Promise<string> {
  const path = locale === "en" ? "dist/index.html" : "dist/es/index.html";

  return readFile(path, "utf8");
}

describe("production landing page output", () => {
  it.each([
    ["en", "Your AI should remember.", `${SITE}/`],
    ["es", "Tu IA debería recordar.", `${SITE}/es/`],
  ] as const)(
    "builds the %s page with localized content and reciprocal metadata",
    async (locale, hero, canonical) => {
      const html = await readLandingPage(locale);
      const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(([, id]) => id);

      expect(html).toContain(hero);
      expect(html).toMatch(/id=["']install["']/);
      expect(html).toContain(`rel="canonical" href="${canonical}"`);
      expect(html).toContain(`hreflang="en" href="${SITE}/"`);
      expect(html).toContain(`hreflang="es" href="${SITE}/es/"`);
      expect(html).not.toContain("https://api.github.com");
      expect(html).not.toContain("https://pypi.org/pypi/");
      expect(new Set(ids).size).toBe(ids.length);
    },
  );
});
