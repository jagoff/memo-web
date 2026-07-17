import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("localized route files", () => {
  it("defines English and Spanish landing routes", () => {
    expect(existsSync("src/pages/index.astro")).toBe(true);
    expect(existsSync("src/pages/es/index.astro")).toBe(true);
  });
});
