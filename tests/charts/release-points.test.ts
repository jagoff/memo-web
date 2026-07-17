import { describe, expect, it } from "vitest";
import { releasePoints } from "../../src/lib/charts";

describe("releasePoints", () => {
  it("orders releases chronologically inside the SVG bounds", () => {
    const points = releasePoints(
      [
        { tag: "v2", publishedAt: "2026-07-16T00:00:00Z", url: "#" },
        { tag: "v1", publishedAt: "2026-07-01T00:00:00Z", url: "#" },
      ],
      200,
      80,
    );
    expect(points[0]?.tag).toBe("v1");
    expect(points.every((point) => point.x >= 12 && point.x <= 188)).toBe(true);
  });
});
