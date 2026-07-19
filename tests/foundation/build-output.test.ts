import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

const SITE = "https://memo-web-sigma.vercel.app";

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
      expect(html).toContain(`hreflang="x-default" href="${SITE}/"`);
      expect(html).toContain(
        'name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"',
      );
      expect(html).toContain('property="og:image:width" content="1280"');
      expect(html).toContain('property="og:image:height" content="640"');
      expect(html).toContain('property="og:image:type" content="image/jpeg"');
      expect(html).toContain('id="faq"');
      expect(html).toContain('"@type":"SoftwareApplication"');
      expect(html).toContain('"@type":"FAQPage"');
      expect(html).not.toContain("https://api.github.com");
      expect(html).not.toContain("https://pypi.org/pypi/");
      expect(new Set(ids).size).toBe(ids.length);
    },
  );

  it("keeps the 404 page out of the index without canonicalizing it to home", async () => {
    const html = await readFile("dist/404.html", "utf8");

    expect(html).toContain('name="robots" content="noindex, follow"');
    expect(html).not.toContain('rel="canonical"');
    expect(html).not.toContain("hreflang=");
    expect(html).not.toContain('type="application/ld+json"');
  });

  it("connects both locale URLs in the XML sitemap", async () => {
    const sitemap = await readFile("dist/sitemap-0.xml", "utf8");

    expect(sitemap).toContain('hreflang="en"');
    expect(sitemap).toContain('hreflang="es"');
    expect(sitemap).toContain(`${SITE}/es/`);
  });

  it.each(["en", "es"] as const)(
    "includes Vercel Web Analytics on the %s page",
    async (locale) => {
      const html = await readLandingPage(locale);

      expect(html).toContain("/_vercel/insights/script.js");
    },
  );
});
