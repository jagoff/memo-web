import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const footerSource = readFileSync(
  new URL("../../src/components/SiteFooter.astro", import.meta.url),
  "utf8",
);

describe("SiteFooter pointer targets", () => {
  it("keeps every project and author link at least 44 by 44 pixels", () => {
    const match = footerSource.match(
      /\.project-links a,\s*\.author-link\s*\{([^}]*)\}/s,
    );

    expect(match?.[1]).toContain("min-height: 44px");
    expect(match?.[1]).toContain("min-width: 44px");
  });
});
