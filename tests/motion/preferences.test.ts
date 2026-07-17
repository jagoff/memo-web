import { describe, expect, it } from "vitest";

import { prefersReducedMotion } from "../../src/lib/motion-preferences";

describe("prefersReducedMotion", () => {
  it("reads the reduce media query", () => {
    const matchMedia = () => ({ matches: true }) as MediaQueryList;

    expect(prefersReducedMotion(matchMedia)).toBe(true);
  });
});
