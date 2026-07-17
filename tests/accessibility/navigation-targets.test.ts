import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const headerSource = readFileSync(
  new URL("../../src/components/navigation/SiteHeader.astro", import.meta.url),
  "utf8",
);

function declarationsFor(selector: string): Record<string, string>[] {
  const escapedSelector = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const blocks = headerSource.matchAll(
    new RegExp(`${escapedSelector}\\s*\\{([^}]*)\\}`, "gs"),
  );

  return [...blocks].map(([, block = ""]) =>
    Object.fromEntries(
      block
        .split(";")
        .map((declaration) => declaration.trim())
        .filter(Boolean)
        .map((declaration) => {
          const separator = declaration.indexOf(":");
          return [
            declaration.slice(0, separator).trim(),
            declaration.slice(separator + 1).trim(),
          ];
        }),
    ),
  );
}

describe("SiteHeader pointer targets", () => {
  it("keeps brand and primary links at 44px with focus-safe mobile overflow", () => {
    expect(declarationsFor(".brand")).toContainEqual(
      expect.objectContaining({ "min-height": "44px" }),
    );
    expect(declarationsFor(".site-nav a")).toContainEqual(
      expect.objectContaining({
        "min-height": "44px",
        "min-width": "44px",
      }),
    );

    const mobileOverflowRule = declarationsFor(".site-nav").find(
      (rule) => rule["overflow-x"] === "auto",
    );
    expect(mobileOverflowRule).toEqual(
      expect.objectContaining({
        "padding-block": "0.5rem",
        "padding-inline": "0.5rem",
      }),
    );
  });
});
