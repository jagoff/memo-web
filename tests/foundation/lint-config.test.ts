import { ESLint } from "eslint";
import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("ESLint TypeScript coverage", () => {
  const eslint = new ESLint();

  it("applies lint configuration to TypeScript files", async () => {
    await expect(
      eslint.calculateConfigForFile("src/example.ts"),
    ).resolves.toBeDefined();
  });

  it("parses typed Astro frontmatter", async () => {
    const [result] = await eslint.lintText(
      '---\nconst value: string = "typed";\n---\n<p>{value}</p>\n',
      { filePath: "src/pages/typed.astro" },
    );

    expect(result).toBeDefined();
    expect(result?.fatalErrorCount).toBe(0);
  });
});

describe("package toolchain contract", () => {
  it("advertises only Node versions supported by direct tooling", async () => {
    const packageJson = JSON.parse(await readFile("package.json", "utf8")) as {
      engines?: { node?: string };
    };

    expect(packageJson.engines?.node).toBe(
      "^22.22.3 || ^24.16.0 || >=26.3.0 <27",
    );
  });
});
