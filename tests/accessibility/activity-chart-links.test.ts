import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const activityChartSource = readFileSync(
  new URL(
    "../../src/components/visualizations/ActivityChart.astro",
    import.meta.url,
  ),
  "utf8",
);

describe("ActivityChart release link semantics", () => {
  it("exposes every SVG release link inside a labeled group", () => {
    const svgMarkup = activityChartSource.slice(
      activityChartSource.indexOf("<svg"),
      activityChartSource.indexOf("</svg>") + "</svg>".length,
    );

    expect(svgMarkup).toContain('role="group"');
    expect(svgMarkup).not.toContain('role="img"');
    expect(svgMarkup).toContain("aria-labelledby={chartTitleId}");
    expect(svgMarkup).toContain("aria-describedby={chartDescriptionId}");
    expect(svgMarkup).toContain("points.map((point, index)");
    expect(svgMarkup).toContain("href={point.url}");
    expect(svgMarkup).toContain("aria-label={`${point.tag} — ${releaseDate}`}");
  });
});
