import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

function source(relativePath: string): string {
  const path = new URL(relativePath, import.meta.url);
  return existsSync(path) ? readFileSync(path, "utf8") : "";
}

const installSource = source(
  "../../src/components/sections/InstallSection.astro",
);
const comparisonSource = source(
  "../../src/components/sections/ComparisonSection.astro",
);
const finalSource = source("../../src/components/sections/FinalCTA.astro");
const footerSource = source("../../src/components/SiteFooter.astro");
const interactionsSource = source("../../src/scripts/interactions.ts");

describe("closing-section progressive enhancement", () => {
  it("keeps both platform commands readable and copy status accessible", () => {
    expect(installSource).toContain(
      "curl -fsSL https://raw.githubusercontent.com/jagoff/memo/master/install.sh | bash",
    );
    expect(installSource).toContain('pipx install "mlx-memo[cpu]"');
    expect(installSource).toMatch(/data-platform-panel=["{]macos/);
    expect(installSource).toMatch(/data-platform-panel=["{]linux/);
    expect(installSource).toContain("data-success={copy.copied}");
    expect(installSource).toContain("data-failure={copy.copyFailed}");
    expect(installSource).toContain('role="status"');
    expect(installSource).toContain('aria-live="polite"');
  });

  it("renders the typed comparison with its source link", () => {
    expect(comparisonSource).toContain("copy.rows.map");
    expect(comparisonSource).toContain("<caption>");
    expect(comparisonSource).toContain(
      "https://github.com/jagoff/memo#what-makes-memo-different",
    );
  });

  it("repeats install and GitHub actions and exposes project footer links", () => {
    expect(finalSource).toContain('href="#install"');
    expect(finalSource).toContain("https://github.com/jagoff/memo");
    expect(footerSource).toContain("https://github.com/jagoff/memo");
    expect(footerSource).toContain("https://pypi.org/project/mlx-memo/");
    expect(footerSource).toContain("https://opensource.org/license/mit/");
    expect(footerSource).toContain("https://github.com/jagoff");
  });
});

describe("browser interaction contract", () => {
  it("binds enhancements idempotently and imports clipboard code on demand", () => {
    expect(interactionsSource).toContain("dataset.bound");
    expect(interactionsSource).toContain('import("../lib/clipboard")');
    expect(interactionsSource).toContain("navigator.clipboard");
  });

  it("initializes accessible tabs and resets localized copy status", () => {
    expect(interactionsSource).toContain('setAttribute("aria-selected"');
    expect(interactionsSource).toContain("panel.hidden =");
    expect(interactionsSource).toContain("window.setTimeout");
    expect(interactionsSource).toContain('status.textContent = ""');
  });

  it("persists only explicit locale-link choices", () => {
    expect(interactionsSource).toContain('>("[data-locale-link]")');
    expect(interactionsSource).toContain(
      'window.localStorage.setItem("memo-locale"',
    );
  });
});
