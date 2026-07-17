import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";

import { cleanupMotion, initMotion } from "../../src/scripts/motion";

const motionSource = readFileSync(
  new URL("../../src/scripts/motion.ts", import.meta.url),
  "utf8",
);

afterEach(() => cleanupMotion());

describe("install motion scene", () => {
  it("includes the install terminal in scoped scene animation", () => {
    expect(motionSource).toContain(`'[data-scene="install"]'`);
    expect(motionSource).toContain('scene.dataset.scene === "install"');
    expect(motionSource).toContain('"[data-install-terminal]"');
  });

  it("leaves the static install state untouched for reduced motion", async () => {
    const setAttribute = vi.fn();
    const removeAttribute = vi.fn();
    const querySelectorAll = vi.fn(() => []);
    const doc = {
      defaultView: {
        matchMedia: vi.fn(() => ({ matches: true }) as MediaQueryList),
      },
      documentElement: { removeAttribute, setAttribute },
      querySelectorAll,
    } as unknown as Document;

    await initMotion(doc);

    expect(setAttribute).not.toHaveBeenCalled();
    expect(removeAttribute).not.toHaveBeenCalled();
    expect(querySelectorAll).not.toHaveBeenCalled();
  });
});
