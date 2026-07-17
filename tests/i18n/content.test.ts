import { describe, expect, it } from "vitest";
import { CONTENT } from "../../src/content";

describe("localized content", () => {
  it("keeps top-level keys and list lengths in parity", () => {
    expect(Object.keys(CONTENT.en)).toEqual(Object.keys(CONTENT.es));
    expect(CONTENT.en.features).toHaveLength(4);
    expect(CONTENT.es.features).toHaveLength(4);
    expect(CONTENT.en.comparison.rows.length).toBe(
      CONTENT.es.comparison.rows.length,
    );
  });
});
