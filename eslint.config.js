import eslintPluginAstro from "eslint-plugin-astro";

export default [
  { ignores: ["dist/**", ".astro/**", "playwright-report/**", "test-results/**"] },
  ...eslintPluginAstro.configs.recommended
];
