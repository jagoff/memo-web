import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const heroSource = readFileSync(
  new URL("../../src/components/sections/HeroSection.astro", import.meta.url),
  "utf8",
);

describe("HeroSection GitHub action", () => {
  it("renders the GitHub mark without changing the link's accessible name", () => {
    expect(heroSource).toContain('class="github-mark"');
    expect(heroSource).toContain('aria-hidden="true"');
    expect(heroSource).toContain('focusable="false"');
    expect(heroSource).toContain('viewBox="0 0 24 24"');
    expect(heroSource).toContain("{copy.github}");
    expect(heroSource).not.toContain(">↗</span>");
  });
});
