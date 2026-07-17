import { describe, expect, it } from "vitest";
import { localizedHref } from "../../src/lib/i18n";

describe("localizedHref", () => {
  it("preserves anchors across locales", () => {
    expect(localizedHref("en", "install")).toBe("/#install");
    expect(localizedHref("es", "install")).toBe("/es/#install");
  });
});
