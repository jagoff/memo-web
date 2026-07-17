import { describe, expect, it, vi } from "vitest";
import { copyText } from "../../src/lib/clipboard";

describe("copyText", () => {
  it("returns true after a successful write", async () => {
    const writeText = vi.fn(async () => undefined);
    expect(await copyText("memo", { writeText })).toBe(true);
  });

  it("returns false after a rejected write", async () => {
    const writeText = vi.fn(async () => {
      throw new Error("denied");
    });
    expect(await copyText("memo", { writeText })).toBe(false);
  });
});
