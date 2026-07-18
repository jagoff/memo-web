import { describe, expect, it } from "vitest";
import { buildSeo } from "../../src/lib/seo";

describe("buildSeo", () => {
  it("builds reciprocal canonical locale metadata", () => {
    const seo = buildSeo("es", {
      title: "memo ES",
      description: "Memoria local",
    });
    expect(seo.canonical).toBe("https://memo-memory.vercel.app/es/");
    expect(seo.alternates).toEqual([
      { lang: "en", href: "https://memo-memory.vercel.app/" },
      { lang: "es", href: "https://memo-memory.vercel.app/es/" },
    ]);
  });
});
