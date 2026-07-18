/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/foundation/build-output.test.ts"],
    coverage: { reporter: ["text", "html"] },
  },
});
