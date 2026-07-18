import { ESLint } from "eslint";
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
