# memo-web Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Build and publish a polished bilingual static landing page that converts developers into memo users through clear product storytelling, verified public data, and accessible GSAP motion.

**Architecture:** Astro generates English and Spanish static routes from one typed content contract. Small Astro components own each section, browser-native TypeScript owns interaction and GSAP scenes, and build-time adapters load validated GitHub/PyPI data with a checked-in snapshot fallback. Vercel serves only the generated dist directory; there are no runtime functions or visitor-side third-party data calls.

**Tech Stack:** Node.js 24, pnpm 11.12.0, Astro 7.0.9, TypeScript 6.0.3, GSAP 3.15.0, Zod 4.4.3, Vitest 4.1.10, Playwright 1.61.1, axe 4.12.1, Lighthouse CI 0.15.1.

## Global Constraints

- Repository path: /Users/fer/repos/memo-web; public remote: jagoff/memo-web.
- English is served at / and Spanish at /es/.
- Output is static HTML/CSS/JavaScript in dist; no React, backend, Vercel Functions, CMS, database, analytics, cookies, or telemetry.
- Visual direction is Neural Editorial: near-black/violet, cyan signal color, editorial display type, living SVG memory graph.
- Only GSAP core and ScrollTrigger may ship initially.
- Initial JavaScript is at most 120 KB gzip across the landing route.
- Lighthouse mobile Performance is at least 90; Accessibility and SEO are at least 95.
- LCP is below 2.5 seconds, CLS below 0.1, and supported lab INP below 200 ms.
- Essential content remains usable without JavaScript and with prefers-reduced-motion enabled.
- Real data is dated and sourced; narrative graphics contain no invented measurements.
- Vercel deployment must stay on the USD 0 Hobby plan. Never enable billing or paid add-ons.
- Use TDD for utilities and behavior. End every task with its focused checks and a commit.

---

## File map

The implementation creates these focused units:

- package.json, pnpm-lock.yaml, pnpm-workspace.yaml, .node-version: deterministic toolchain and explicit native build allowlist.
- astro.config.ts, tsconfig.json, eslint.config.js, prettier.config.mjs: build and quality configuration.
- src/content/types.ts, en.ts, es.ts: one typed bilingual content contract.
- src/lib/i18n.ts: locale lookup and anchor-preserving URL mapping.
- src/lib/seo.ts: localized canonical, hreflang, and structured metadata.
- src/lib/project-data.ts, src/data/project-snapshot.json: remote adapters, schemas, and fallback.
- src/lib/charts.ts: deterministic SVG point generation.
- src/lib/clipboard.ts: accessible clipboard behavior.
- src/styles/tokens.css, global.css: visual tokens, typography, resets, and shared utilities.
- src/layouts/BaseLayout.astro: document shell, SEO, fonts, and progressive-enhancement contract.
- src/components/navigation/: header and locale switch.
- src/components/sections/: the eight approved narrative sections.
- src/components/visualizations/: memory graph, recall flow, and activity chart.
- src/scripts/motion.ts: GSAP registration and scene lifecycle.
- src/scripts/interactions.ts: navigation, locale persistence, tabs, and clipboard enhancement.
- src/pages/index.astro, src/pages/es/index.astro, src/pages/404.astro, src/pages/robots.txt.ts: public routes.
- tests/: unit tests for content, locale, SEO, data, chart geometry, and clipboard behavior.
- e2e/: Playwright behavior, accessibility, and visual regression tests.
- scripts/check-bundle-size.mjs: enforce the JavaScript budget.
- .github/workflows/ci.yml: CI parity.
- lighthouserc.json: performance and accessibility budgets.
- README.md and LICENSE: repository documentation and MIT license.

---

### Task 1: Bootstrap the static Astro project and quality toolchain

**Files:**

- Create: package.json
- Create: pnpm-lock.yaml
- Create: pnpm-workspace.yaml
- Create: .node-version
- Create: .gitignore
- Create: astro.config.ts
- Create: tsconfig.json
- Create: eslint.config.js
- Create: prettier.config.mjs
- Create: vitest.config.ts
- Create: vitest.build.config.ts
- Create: src/env.d.ts
- Create: tests/foundation/routes.test.ts
- Create: src/pages/index.astro
- Create: src/pages/es/index.astro

**Interfaces:**

- Consumes: the approved repository and route constraints.
- Produces: pnpm scripts build, check, lint, format:check, test, test:e2e, test:a11y, test:visual, and lighthouse; valid static routes at / and /es/.

- [ ] **Step 1: Create the package and tool configuration**

Create package.json:

```json
{
  "name": "memo-web",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.12.0",
  "engines": {
    "node": "^22.13.0 || >=24 <27"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint .",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "test": "vitest run",
    "test:build": "astro build && vitest run --config vitest.build.config.ts",
    "test:watch": "vitest",
    "test:e2e": "playwright test e2e/site.spec.ts",
    "test:a11y": "playwright test e2e/accessibility.spec.ts",
    "test:visual": "playwright test e2e/visual.spec.ts",
    "budget": "node scripts/check-bundle-size.mjs",
    "lighthouse": "lhci autorun"
  },
  "dependencies": {
    "@fontsource-variable/fraunces": "5.2.9",
    "@fontsource-variable/geist": "5.2.9",
    "astro": "7.0.9",
    "gsap": "3.15.0",
    "zod": "4.4.3"
  },
  "devDependencies": {
    "@astrojs/check": "0.9.9",
    "@astrojs/sitemap": "3.7.3",
    "@axe-core/playwright": "4.12.1",
    "@lhci/cli": "0.15.1",
    "@playwright/test": "1.61.1",
    "@types/node": "24.13.3",
    "eslint": "10.7.0",
    "eslint-plugin-astro": "3.0.1",
    "prettier": "3.9.5",
    "prettier-plugin-astro": "0.14.1",
    "tsx": "4.23.1",
    "typescript": "6.0.3",
    "typescript-eslint": "8.64.0",
    "vitest": "4.1.10"
  }
}
```

Create .node-version with exactly:

```text
24
```

Create pnpm-workspace.yaml to allow only the native build scripts required by Astro:

```yaml
allowBuilds:
  esbuild: true
  sharp: true
```

Create .gitignore:

```gitignore
node_modules/
dist/
.astro/
.vercel/
.worktrees/
.superpowers/
coverage/
playwright-report/
test-results/
.DS_Store
```

Create astro.config.ts:

```ts
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://memo-web.vercel.app",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap()],
  i18n: {
    defaultLocale: "en",
    locales: ["en", "es"],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
});
```

Create tsconfig.json:

```json
{
  "extends": "astro/tsconfigs/strictest",
  "compilerOptions": {
    "allowJs": false,
    "noUncheckedIndexedAccess": true,
    "types": ["node", "vitest/globals"]
  },
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

Create eslint.config.js with TypeScript coverage for both standalone files and Astro frontmatter:

```js
import eslintPluginAstro from "eslint-plugin-astro";
import tseslint from "typescript-eslint";

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      "playwright-report/**",
      "test-results/**",
    ],
  },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  {
    files: ["**/*.astro"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
];
```

Create prettier.config.mjs:

```js
export default {
  plugins: ["prettier-plugin-astro"],
  overrides: [{ files: "*.astro", options: { parser: "astro" } }],
};
```

Create vitest.config.ts:

```ts
/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/**/*.test.ts"],
    exclude: ["tests/foundation/build-output.test.ts"],
    coverage: { reporter: ["text", "html"] },
  },
});
```

Create vitest.build.config.ts:

```ts
/// <reference types="vitest/config" />

import { getViteConfig } from "astro/config";

export default getViteConfig({
  test: {
    include: ["tests/foundation/build-output.test.ts"],
  },
});
```

Create src/env.d.ts:

```ts
/// <reference types="astro/client" />
```

- [ ] **Step 2: Install dependencies**

Run:

```bash
pnpm install
```

Expected: pnpm-lock.yaml is created, esbuild/sharp are the only approved dependency build scripts, and the command exits 0.

- [ ] **Step 3: Write the failing route test**

Create tests/foundation/routes.test.ts:

```ts
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("localized route files", () => {
  it("defines English and Spanish landing routes", () => {
    expect(existsSync("src/pages/index.astro")).toBe(true);
    expect(existsSync("src/pages/es/index.astro")).toBe(true);
  });
});
```

Run:

```bash
pnpm test tests/foundation/routes.test.ts
```

Expected: FAIL because both route files are absent.

- [ ] **Step 4: Add the smallest static route shells**

Create src/pages/index.astro:

```astro
---
const locale = "en";
---

<!doctype html>
<html lang={locale}>
  <head><meta charset="utf-8" /><title>memo</title></head>
  <body><main><h1>Your AI should remember.</h1></main></body>
</html>
```

Create src/pages/es/index.astro:

```astro
---
const locale = "es";
---

<!doctype html>
<html lang={locale}>
  <head><meta charset="utf-8" /><title>memo</title></head>
  <body><main><h1>Tu IA debería recordar.</h1></main></body>
</html>
```

- [ ] **Step 5: Verify the foundation**

Run:

```bash
pnpm test tests/foundation/routes.test.ts
pnpm check
pnpm build
```

Expected: one passing test, zero Astro/TypeScript errors, and dist/index.html plus dist/es/index.html.

- [ ] **Step 6: Commit**

```bash
git add package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version .gitignore astro.config.ts tsconfig.json eslint.config.js prettier.config.mjs vitest.config.ts vitest.build.config.ts src tests
git commit -m "chore: bootstrap Astro landing project"
```

---

### Task 2: Define typed bilingual copy and locale behavior

**Files:**

- Create: src/content/types.ts
- Create: src/content/en.ts
- Create: src/content/es.ts
- Create: src/lib/i18n.ts
- Create: tests/i18n/content.test.ts
- Create: tests/i18n/routes.test.ts

**Interfaces:**

- Consumes: Locale values en and es.
- Produces: type Locale, interface LandingCopy, CONTENT: Record<Locale, LandingCopy>, getCopy(locale), and localizedHref(locale, anchor).

- [ ] **Step 1: Write failing content and route tests**

Create tests/i18n/content.test.ts:

```ts
import { describe, expect, it } from "vitest";
import { CONTENT } from "../../src/content";

describe("localized content", () => {
  it("keeps top-level keys and list lengths in parity", () => {
    expect(Object.keys(CONTENT.en)).toEqual(Object.keys(CONTENT.es));
    expect(CONTENT.en.features).toHaveLength(4);
    expect(CONTENT.es.features).toHaveLength(4);
    expect(CONTENT.en.comparison.rows.length).toBe(
      CONTENT.es.comparison.rows.length,
    );
  });
});
```

Create tests/i18n/routes.test.ts:

```ts
import { describe, expect, it } from "vitest";
import { localizedHref } from "../../src/lib/i18n";

describe("localizedHref", () => {
  it("preserves anchors across locales", () => {
    expect(localizedHref("en", "install")).toBe("/#install");
    expect(localizedHref("es", "install")).toBe("/es/#install");
  });
});
```

Run:

```bash
pnpm test tests/i18n
```

Expected: FAIL because src/content and src/lib/i18n do not exist.

- [ ] **Step 2: Define the content contract**

Create src/content/types.ts:

```ts
export type Locale = "en" | "es";

export interface FeatureCopy {
  id: "time-machine" | "contradictions" | "capture" | "cross-agent";
  title: string;
  body: string;
}

export interface ComparisonRow {
  capability: string;
  memo: string;
  cloud: string;
  vector: string;
}

export interface LandingCopy {
  meta: { title: string; description: string };
  nav: { how: string; features: string; install: string; github: string };
  hero: {
    eyebrow: string;
    title: string;
    body: string;
    install: string;
    github: string;
  };
  problem: {
    eyebrow: string;
    title: string;
    body: string;
    lost: string;
    kept: string;
  };
  loop: {
    eyebrow: string;
    title: string;
    body: string;
    steps: readonly [string, string, string];
  };
  featuresHeading: { eyebrow: string; title: string; body: string };
  features: readonly FeatureCopy[];
  evidence: {
    eyebrow: string;
    title: string;
    body: string;
    illustration: string;
    updated: string;
  };
  install: {
    eyebrow: string;
    title: string;
    body: string;
    macos: string;
    linux: string;
    copy: string;
    copied: string;
    copyFailed: string;
    docs: string;
  };
  comparison: {
    eyebrow: string;
    title: string;
    body: string;
    headers: readonly [string, string, string, string];
    rows: readonly ComparisonRow[];
    full: string;
  };
  final: {
    eyebrow: string;
    title: string;
    body: string;
    install: string;
    github: string;
  };
  footer: { source: string; pypi: string; license: string; by: string };
}
```

- [ ] **Step 3: Add complete English and Spanish content**

Create src/content/en.ts and export an object satisfying LandingCopy with this exact approved copy:

```ts
import type { LandingCopy } from "./types";

export const en = {
  meta: {
    title: "memo — Local-first memory for AI agents",
    description:
      "Persistent semantic memory for every AI coding agent. Local, private, searchable, and stored as Markdown.",
  },
  nav: {
    how: "How it works",
    features: "Features",
    install: "Install",
    github: "GitHub",
  },
  hero: {
    eyebrow: "Local-first memory for AI",
    title: "Your AI should remember.",
    body: "Persistent semantic memory for every agent. Private, local, and yours.",
    install: "Install memo",
    github: "View on GitHub",
  },
  problem: {
    eyebrow: "Sessions end. Knowledge should not.",
    title: "Stop starting over.",
    body: "memo carries durable decisions, facts, and preferences into the next session before your agent answers.",
    lost: "A fresh agent reconstructs yesterday from scratch.",
    kept: "A memo-aware agent starts with what already matters.",
  },
  loop: {
    eyebrow: "One local loop",
    title: "Save once. Recall everywhere.",
    body: "Durable knowledge becomes readable Markdown, a hybrid index, and precise context for any MCP-aware agent.",
    steps: [
      "Capture durable knowledge",
      "Index Markdown locally",
      "Recall it in the next session",
    ],
  },
  featuresHeading: {
    eyebrow: "More than a vector store",
    title: "Memory with judgment.",
    body: "memo knows when knowledge changed, where it came from, and which agent needs it.",
  },
  features: [
    {
      id: "time-machine",
      title: "Time-machine",
      body: "Rewind the corpus and ask what was known on any date.",
    },
    {
      id: "contradictions",
      title: "Contradiction radar",
      body: "Find stale decisions and resolve conflicts without erasing history.",
    },
    {
      id: "capture",
      title: "Auto-capture",
      body: "Extract durable insights from real work without constant remember commands.",
    },
    {
      id: "cross-agent",
      title: "Cross-agent continuity",
      body: "Claude Code, Codex, Cursor, Devin, and other MCP clients share one memory.",
    },
  ],
  evidence: {
    eyebrow: "Smaller context. Stronger continuity.",
    title: "Useful memory, measurable.",
    body: "A compact MCP surface and tight recall budget reduce repeated model work while public project activity stays verifiable.",
    illustration: "Conceptual memory graph",
    updated: "Public data updated",
  },
  install: {
    eyebrow: "Runs on your machine",
    title: "One command. No cloud account.",
    body: "Use MLX on Apple Silicon or the CPU backend on Linux. Your prompts and memories stay local.",
    macos: "macOS / Apple Silicon",
    linux: "Linux / CPU",
    copy: "Copy command",
    copied: "Copied",
    copyFailed: "Copy failed. Select the command manually.",
    docs: "Read full installation guide",
  },
  comparison: {
    eyebrow: "Why memo",
    title: "Local is not a feature. It is the foundation.",
    body: "A compact comparison; the repository contains the sourced capability matrix.",
    headers: ["Capability", "memo", "Cloud memory", "Vector store"],
    rows: [
      {
        capability: "Local by default",
        memo: "Yes",
        cloud: "No",
        vector: "Sometimes",
      },
      { capability: "Time travel", memo: "Yes", cloud: "Rare", vector: "No" },
      {
        capability: "Contradiction handling",
        memo: "Yes",
        cloud: "Partial",
        vector: "No",
      },
      {
        capability: "Cross-agent recall",
        memo: "Yes",
        cloud: "Partial",
        vector: "Custom",
      },
    ],
    full: "See full sourced comparison",
  },
  final: {
    eyebrow: "Your agents already learn",
    title: "Let them remember.",
    body: "Install memo once and give every session a durable starting point.",
    install: "Install memo",
    github: "Star on GitHub",
  },
  footer: {
    source: "Source",
    pypi: "PyPI",
    license: "MIT License",
    by: "Built by Fernando Ferrari",
  },
} satisfies LandingCopy;
```

Create src/content/es.ts with the same structure:

```ts
import type { LandingCopy } from "./types";

export const es = {
  meta: {
    title: "memo — Memoria local para agentes de IA",
    description:
      "Memoria semántica persistente para cada agente de programación. Local, privada, buscable y guardada como Markdown.",
  },
  nav: {
    how: "Cómo funciona",
    features: "Funciones",
    install: "Instalar",
    github: "GitHub",
  },
  hero: {
    eyebrow: "Memoria local para IA",
    title: "Tu IA debería recordar.",
    body: "Memoria semántica persistente para cada agente. Privada, local y tuya.",
    install: "Instalar memo",
    github: "Ver en GitHub",
  },
  problem: {
    eyebrow: "Las sesiones terminan. El conocimiento no debería.",
    title: "Dejá de empezar de cero.",
    body: "memo lleva decisiones, hechos y preferencias durables a la próxima sesión antes de que tu agente responda.",
    lost: "Un agente nuevo reconstruye desde cero lo de ayer.",
    kept: "Un agente con memo empieza por lo que ya importa.",
  },
  loop: {
    eyebrow: "Un ciclo completamente local",
    title: "Guardá una vez. Recordá en todas partes.",
    body: "El conocimiento durable se convierte en Markdown legible, un índice híbrido y contexto preciso para cualquier agente MCP.",
    steps: [
      "Capturá conocimiento durable",
      "Indexá Markdown localmente",
      "Recuperalo en la próxima sesión",
    ],
  },
  featuresHeading: {
    eyebrow: "Mucho más que una base vectorial",
    title: "Memoria con criterio.",
    body: "memo sabe cuándo cambió el conocimiento, de dónde vino y qué agente lo necesita.",
  },
  features: [
    {
      id: "time-machine",
      title: "Máquina del tiempo",
      body: "Rebobiná el corpus y preguntá qué se sabía en cualquier fecha.",
    },
    {
      id: "contradictions",
      title: "Radar de contradicciones",
      body: "Encontrá decisiones obsoletas y resolvé conflictos sin borrar la historia.",
    },
    {
      id: "capture",
      title: "Captura automática",
      body: "Extraé aprendizajes durables del trabajo real sin comandos constantes.",
    },
    {
      id: "cross-agent",
      title: "Continuidad entre agentes",
      body: "Claude Code, Codex, Cursor, Devin y otros clientes MCP comparten una memoria.",
    },
  ],
  evidence: {
    eyebrow: "Menos contexto. Más continuidad.",
    title: "Memoria útil, medible.",
    body: "Una superficie MCP compacta y un presupuesto de recall ajustado reducen trabajo repetido mientras la actividad pública sigue siendo verificable.",
    illustration: "Grafo conceptual de memoria",
    updated: "Datos públicos actualizados",
  },
  install: {
    eyebrow: "Corre en tu máquina",
    title: "Un comando. Sin cuenta cloud.",
    body: "Usá MLX en Apple Silicon o el backend CPU en Linux. Tus prompts y memorias permanecen locales.",
    macos: "macOS / Apple Silicon",
    linux: "Linux / CPU",
    copy: "Copiar comando",
    copied: "Copiado",
    copyFailed: "No se pudo copiar. Seleccioná el comando manualmente.",
    docs: "Leer guía completa de instalación",
  },
  comparison: {
    eyebrow: "Por qué memo",
    title: "Local no es una función. Es la base.",
    body: "Una comparación compacta; el repositorio contiene la matriz completa con fuentes.",
    headers: ["Capacidad", "memo", "Memoria cloud", "Base vectorial"],
    rows: [
      {
        capability: "Local por defecto",
        memo: "Sí",
        cloud: "No",
        vector: "A veces",
      },
      {
        capability: "Viaje en el tiempo",
        memo: "Sí",
        cloud: "Raro",
        vector: "No",
      },
      {
        capability: "Contradicciones",
        memo: "Sí",
        cloud: "Parcial",
        vector: "No",
      },
      {
        capability: "Recall entre agentes",
        memo: "Sí",
        cloud: "Parcial",
        vector: "A medida",
      },
    ],
    full: "Ver comparación completa con fuentes",
  },
  final: {
    eyebrow: "Tus agentes ya aprenden",
    title: "Dejalos recordar.",
    body: "Instalá memo una vez y dale a cada sesión un punto de partida durable.",
    install: "Instalar memo",
    github: "Dar una estrella en GitHub",
  },
  footer: {
    source: "Código",
    pypi: "PyPI",
    license: "Licencia MIT",
    by: "Creado por Fernando Ferrari",
  },
} satisfies LandingCopy;
```

Create src/content/index.ts:

```ts
import { en } from "./en";
import { es } from "./es";
import type { LandingCopy, Locale } from "./types";

export const CONTENT: Record<Locale, LandingCopy> = { en, es };
export type { LandingCopy, Locale };
```

- [ ] **Step 4: Implement locale helpers**

Create src/lib/i18n.ts:

```ts
import { CONTENT, type LandingCopy, type Locale } from "../content";

export function getCopy(locale: Locale): LandingCopy {
  return CONTENT[locale];
}

export function localizedHref(locale: Locale, anchor?: string): string {
  const base = locale === "en" ? "/" : "/es/";
  return anchor ? base + "#" + anchor : base;
}

export function alternateLocale(locale: Locale): Locale {
  return locale === "en" ? "es" : "en";
}
```

- [ ] **Step 5: Verify and commit**

Run:

```bash
pnpm test tests/i18n
pnpm check
```

Expected: all i18n tests pass and TypeScript reports zero errors.

Commit:

```bash
git add src/content src/lib/i18n.ts tests/i18n
git commit -m "feat: add typed bilingual landing content"
```

---

### Task 3: Add validated public data with snapshot fallback

**Files:**

- Create: src/data/project-snapshot.json
- Create: src/lib/project-data.ts
- Create: tests/data/project-data.test.ts

**Interfaces:**

- Consumes: GitHub repository and release JSON, PyPI package JSON, and ProjectData snapshot.
- Produces: ProjectData, ProjectDataResult, ProjectDataSchema, loadProjectData(options).

- [ ] **Step 1: Write failing remote/fallback tests**

Create tests/data/project-data.test.ts with two cases: valid remote responses return stale false; a fetcher that always throws returns the supplied valid snapshot with stale true. Use a fixed now function returning 2026-07-17T20:00:00.000Z.

```ts
import { describe, expect, it, vi } from "vitest";
import { loadProjectData, type ProjectData } from "../../src/lib/project-data";

const snapshot: ProjectData = {
  stars: 6,
  forks: 2,
  latestRelease: {
    tag: "v3.7.0",
    publishedAt: "2026-07-16T03:56:09Z",
    url: "https://github.com/jagoff/memo/releases/tag/v3.7.0",
  },
  releases: [
    {
      tag: "v3.7.0",
      publishedAt: "2026-07-16T03:56:09Z",
      url: "https://github.com/jagoff/memo/releases/tag/v3.7.0",
    },
  ],
  pypiVersion: "3.7.0",
  pypiUrl: "https://pypi.org/project/mlx-memo/",
  updatedAt: "2026-07-17T19:00:00.000Z",
};

describe("loadProjectData", () => {
  it("uses validated remote data", async () => {
    const fetcher = vi.fn(async (url: RequestInfo | URL) => {
      const value = String(url);
      if (value.endsWith("/releases?per_page=5"))
        return new Response(JSON.stringify([snapshot.latestRelease]));
      if (value.includes("pypi.org"))
        return new Response(
          JSON.stringify({
            info: { version: "3.7.1", package_url: snapshot.pypiUrl },
          }),
        );
      return new Response(
        JSON.stringify({ stargazers_count: 7, forks_count: 3 }),
      );
    });
    const result = await loadProjectData({
      fetcher,
      snapshot,
      now: () => new Date("2026-07-17T20:00:00.000Z"),
    });
    expect(result.stale).toBe(false);
    expect(result.data.stars).toBe(7);
    expect(result.data.pypiVersion).toBe("3.7.1");
  });

  it("falls back to the dated snapshot", async () => {
    const fetcher = vi.fn(async () => {
      throw new Error("offline");
    });
    const result = await loadProjectData({
      fetcher,
      snapshot,
      retryDelayMs: 0,
    });
    expect(result).toEqual({ data: snapshot, stale: true });
  });
});
```

Run:

```bash
pnpm test tests/data/project-data.test.ts
```

Expected: FAIL because src/lib/project-data.ts does not exist.

- [ ] **Step 2: Add the initial verified snapshot**

Create src/data/project-snapshot.json:

```json
{
  "stars": 6,
  "forks": 2,
  "latestRelease": {
    "tag": "v3.7.0",
    "publishedAt": "2026-07-16T03:56:09Z",
    "url": "https://github.com/jagoff/memo/releases/tag/v3.7.0"
  },
  "releases": [
    {
      "tag": "v3.7.0",
      "publishedAt": "2026-07-16T03:56:09Z",
      "url": "https://github.com/jagoff/memo/releases/tag/v3.7.0"
    },
    {
      "tag": "v3.5.2",
      "publishedAt": "2026-07-15T18:32:21Z",
      "url": "https://github.com/jagoff/memo/releases/tag/v3.5.2"
    }
  ],
  "pypiVersion": "3.7.0",
  "pypiUrl": "https://pypi.org/project/mlx-memo/",
  "updatedAt": "2026-07-17T19:00:00.000Z"
}
```

- [ ] **Step 3: Implement schemas, retry, timeout, and fallback**

Create src/lib/project-data.ts. Define ProjectDataSchema with Zod, infer ProjectData, and implement loadProjectData with this signature:

```ts
export interface LoadProjectDataOptions {
  fetcher?: Fetcher;
  snapshot?: ProjectData;
  now?: () => Date;
  timeoutMs?: number;
  retryDelayMs?: number;
}

export interface ProjectDataResult {
  data: ProjectData;
  stale: boolean;
}

export type Fetcher = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export async function loadProjectData(
  options: LoadProjectDataOptions = {},
): Promise<ProjectDataResult>;
```

The implementation must:

1. Parse the supplied or imported snapshot before any request.
2. Fetch https://api.github.com/repos/jagoff/memo, https://api.github.com/repos/jagoff/memo/releases?per_page=5, and https://pypi.org/pypi/mlx-memo/json.
3. Use AbortSignal.timeout(options.timeoutMs ?? 2500).
4. Retry each failed request exactly once after options.retryDelayMs ?? 100 milliseconds.
5. Validate all three responses and assemble ProjectData with now().toISOString().
6. Return { data, stale: false } only if the complete remote set validates.
7. Catch request/schema errors, log one warning, and return the valid snapshot with stale true.

- [ ] **Step 4: Verify data behavior**

Run:

```bash
pnpm test tests/data/project-data.test.ts
pnpm check
```

Expected: both tests pass and TypeScript reports zero errors.

- [ ] **Step 5: Commit**

```bash
git add src/data src/lib/project-data.ts tests/data
git commit -m "feat: add resilient public project data"
```

---

### Task 4: Build the layout, SEO contract, visual tokens, and navigation

**Files:**

- Create: src/lib/seo.ts
- Create: tests/seo/seo.test.ts
- Create: src/styles/tokens.css
- Create: src/styles/global.css
- Create: src/layouts/BaseLayout.astro
- Create: src/components/navigation/SiteHeader.astro
- Create: src/components/navigation/LocaleSwitch.astro

**Interfaces:**

- Consumes: Locale, LandingCopy.meta, localizedHref.
- Produces: buildSeo(locale, meta), BaseLayout props { locale, meta }, keyboard-accessible header, locale switch preserving location.hash.

- [ ] **Step 1: Write failing SEO tests**

Create tests/seo/seo.test.ts:

```ts
import { describe, expect, it } from "vitest";
import { buildSeo } from "../../src/lib/seo";

describe("buildSeo", () => {
  it("builds reciprocal canonical locale metadata", () => {
    const seo = buildSeo("es", {
      title: "memo ES",
      description: "Memoria local",
    });
    expect(seo.canonical).toBe("https://memo-web.vercel.app/es/");
    expect(seo.alternates).toEqual([
      { lang: "en", href: "https://memo-web.vercel.app/" },
      { lang: "es", href: "https://memo-web.vercel.app/es/" },
    ]);
  });
});
```

Run:

```bash
pnpm test tests/seo/seo.test.ts
```

Expected: FAIL because src/lib/seo.ts does not exist.

- [ ] **Step 2: Implement SEO metadata**

Create src/lib/seo.ts with:

```ts
import type { LandingCopy, Locale } from "../content";

const SITE = "https://memo-web.vercel.app";

export function buildSeo(locale: Locale, meta: LandingCopy["meta"]) {
  const path = locale === "en" ? "/" : "/es/";
  return {
    ...meta,
    canonical: SITE + path,
    alternates: [
      { lang: "en", href: SITE + "/" },
      { lang: "es", href: SITE + "/es/" },
    ],
    ogImage: SITE + "/og.jpg",
  };
}
```

- [ ] **Step 3: Create the complete global visual foundation**

Create tokens.css with named color, type, spacing, radius, and shadow custom properties. Required exact core values:

```css
:root {
  --ink-950: #07050d;
  --ink-900: #0c0915;
  --ink-800: #151021;
  --paper-50: #f7f4fb;
  --paper-200: #cfc8da;
  --muted-400: #948ca3;
  --signal-300: #79f2e6;
  --signal-400: #57ddda;
  --violet-400: #9a6cf2;
  --violet-700: #4a237d;
  --font-display: "Fraunces Variable", Georgia, serif;
  --font-body: "Geist Variable", system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  --content: min(1180px, calc(100vw - 40px));
  --radius-sm: 10px;
  --radius-md: 18px;
  --radius-lg: 30px;
  --shadow-glow: 0 0 80px rgba(87, 221, 218, 0.12);
}
```

Create global.css. Import both variable fonts and tokens, then define box sizing, dark background, readable body defaults, fluid headings, focus-visible outline, skip-link behavior, shared container/eyebrow/button classes, and the reduced-motion rule:

```css
@import "@fontsource-variable/fraunces";
@import "@fontsource-variable/geist";
@import "./tokens.css";

*,
*::before,
*::after {
  box-sizing: border-box;
}
html {
  color-scheme: dark;
  scroll-behavior: smooth;
  background: var(--ink-950);
}
body {
  margin: 0;
  min-width: 320px;
  color: var(--paper-50);
  background: var(--ink-950);
  font-family: var(--font-body);
  line-height: 1.6;
}
a {
  color: inherit;
}
button,
a {
  -webkit-tap-highlight-color: transparent;
}
:focus-visible {
  outline: 3px solid var(--signal-300);
  outline-offset: 4px;
}
.container {
  width: var(--content);
  margin-inline: auto;
}
.eyebrow {
  color: var(--signal-300);
  font: 700 0.75rem/1 var(--font-mono);
  letter-spacing: 0.16em;
  text-transform: uppercase;
}
.display {
  margin: 0;
  font: 500 clamp(3.4rem, 8vw, 7.5rem)/0.9 var(--font-display);
  letter-spacing: -0.055em;
  text-wrap: balance;
}
.button {
  display: inline-flex;
  min-height: 44px;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--signal-300);
  border-radius: var(--radius-sm);
  text-decoration: none;
  font-weight: 750;
}
.button--primary {
  color: var(--ink-950);
  background: var(--signal-300);
}
.skip-link {
  position: fixed;
  z-index: 100;
  top: 0.75rem;
  left: 0.75rem;
  transform: translateY(-160%);
}
.skip-link:focus {
  transform: translateY(0);
}
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 4: Implement BaseLayout and navigation**

BaseLayout renders charset, viewport, title, description, canonical, reciprocal hreflang, Open Graph, Twitter card, favicon, JSON-LD SoftwareApplication data, skip link, header slot, main slot, and the module scripts for interactions and motion. It imports global.css.

SiteHeader renders the memo logo text, anchors #how, #features, #install, the GitHub link, a visible install button, and LocaleSwitch. LocaleSwitch uses real href values from localizedHref so it works without JavaScript; a small inline script appends window.location.hash and stores the explicit locale.

- [ ] **Step 5: Verify and commit**

Run:

```bash
pnpm test tests/seo/seo.test.ts
pnpm check
pnpm lint
pnpm format:check
```

Expected: all commands exit 0.

Commit:

```bash
git add src/lib/seo.ts tests/seo src/styles src/layouts src/components/navigation
git commit -m "feat: add layout navigation and SEO foundation"
```

---

### Task 5: Implement the hero, problem story, memory graph, and motion lifecycle

**Files:**

- Create: src/components/visualizations/MemoryGraph.astro
- Create: src/components/sections/HeroSection.astro
- Create: src/components/sections/ProblemSection.astro
- Create: src/scripts/motion.ts
- Create: src/lib/motion-preferences.ts
- Create: tests/motion/preferences.test.ts

**Interfaces:**

- Consumes: LandingCopy.hero, LandingCopy.problem.
- Produces: data-scene values hero and problem; prefersReducedMotion(matchMedia); idempotent initMotion().

- [ ] **Step 1: Write the failing preference test**

Create tests/motion/preferences.test.ts:

```ts
import { describe, expect, it } from "vitest";
import { prefersReducedMotion } from "../../src/lib/motion-preferences";

describe("prefersReducedMotion", () => {
  it("reads the reduce media query", () => {
    const matchMedia = () => ({ matches: true }) as MediaQueryList;
    expect(prefersReducedMotion(matchMedia)).toBe(true);
  });
});
```

Run:

```bash
pnpm test tests/motion/preferences.test.ts
```

Expected: FAIL because the module does not exist.

- [ ] **Step 2: Implement the pure motion preference helper**

Create src/lib/motion-preferences.ts:

```ts
export function prefersReducedMotion(
  matchMedia: (query: string) => MediaQueryList = window.matchMedia.bind(
    window,
  ),
): boolean {
  return matchMedia("(prefers-reduced-motion: reduce)").matches;
}
```

- [ ] **Step 3: Build the decorative memory graph**

MemoryGraph.astro owns a viewBox 0 0 640 640 SVG, twelve fixed nodes, fifteen edges, one central memo mark, a radial gradient, and accessible behavior. The SVG is aria-hidden because the hero text explains the product. Every node has class graph-node; every edge has class graph-edge; the wrapper uses data-graph.

Use only circles, lines, paths, gradients, and filters. Do not embed text in the graph. Scope styles so the graph remains a complete static end state without JavaScript.

- [ ] **Step 4: Build the hero and problem sections**

HeroSection accepts { copy: LandingCopy["hero"] }, renders the approved eyebrow/title/body, install anchor #install, external GitHub CTA, supported-agent chips, and MemoryGraph. The section uses data-scene="hero".

ProblemSection accepts { copy: LandingCopy["problem"] }, renders one lost-session card and one remembered-session card with complete text outside animated wrappers. The section uses data-scene="problem".

- [ ] **Step 5: Implement scoped GSAP lifecycle**

Create src/scripts/motion.ts. Register ScrollTrigger once, return immediately for reduced motion, create one gsap.context per scene, animate graph edges/nodes with opacity and scale, animate the problem connector once, and expose cleanup that reverts all contexts. Call cleanup before a repeated init. Initialize after DOMContentLoaded or immediately when the document is already interactive.

Do not hide headings, body copy, CTAs, or cards. Only decorative SVG layers may begin at reduced opacity after documentElement receives data-motion-ready.

- [ ] **Step 6: Verify and commit**

Run:

```bash
pnpm test tests/motion/preferences.test.ts
pnpm check
pnpm build
```

Expected: the test passes, type checking passes, and GSAP is emitted only in JavaScript bundles.

Commit:

```bash
git add src/components/visualizations/MemoryGraph.astro src/components/sections/HeroSection.astro src/components/sections/ProblemSection.astro src/scripts/motion.ts src/lib/motion-preferences.ts tests/motion
git commit -m "feat: add hero memory graph and opening story"
```

---

### Task 6: Implement the memory loop, features, evidence, and SVG release chart

**Files:**

- Create: src/lib/charts.ts
- Create: tests/charts/release-points.test.ts
- Create: src/components/visualizations/RecallFlow.astro
- Create: src/components/visualizations/ActivityChart.astro
- Create: src/components/sections/MemoryLoopSection.astro
- Create: src/components/sections/FeatureRail.astro
- Create: src/components/sections/EvidenceSection.astro
- Modify: src/scripts/motion.ts

**Interfaces:**

- Consumes: LandingCopy.loop, featuresHeading, features, evidence; ProjectDataResult.
- Produces: releasePoints(releases, width, height), data-scene values loop/features/evidence.

- [ ] **Step 1: Write the failing chart geometry test**

Create tests/charts/release-points.test.ts:

```ts
import { describe, expect, it } from "vitest";
import { releasePoints } from "../../src/lib/charts";

describe("releasePoints", () => {
  it("orders releases chronologically inside the SVG bounds", () => {
    const points = releasePoints(
      [
        { tag: "v2", publishedAt: "2026-07-16T00:00:00Z", url: "#" },
        { tag: "v1", publishedAt: "2026-07-01T00:00:00Z", url: "#" },
      ],
      200,
      80,
    );
    expect(points[0]?.tag).toBe("v1");
    expect(points.every((point) => point.x >= 12 && point.x <= 188)).toBe(true);
  });
});
```

Run:

```bash
pnpm test tests/charts/release-points.test.ts
```

Expected: FAIL because src/lib/charts.ts does not exist.

- [ ] **Step 2: Implement deterministic chart geometry**

Create releasePoints with signature:

```ts
import type { ProjectData } from "./project-data";

export interface ReleasePoint {
  tag: string;
  x: number;
  y: number;
  url: string;
}

export function releasePoints(
  releases: ProjectData["releases"],
  width: number,
  height: number,
): ReleasePoint[];
```

Sort copies of releases by publishedAt ascending. Use 12-pixel horizontal/vertical padding, spread x evenly, and alternate y between 35% and 70% of usable height. Return an empty array for no releases and the center point for one release.

- [ ] **Step 3: Build the recall flow and activity chart**

RecallFlow.astro renders the three localized steps as semantic ordered-list content and a decorative SVG connector. ActivityChart.astro receives ProjectData, calls releasePoints at build time, renders a labeled SVG with release links, and shows stars, forks, latest release, current PyPI version, and updatedAt. If ProjectDataResult.stale is true, render a localized stale-data note with the same date.

The release chart is measured data. Give it a title and description element. The separate memory graph remains labeled with copy.evidence.illustration.

- [ ] **Step 4: Build the three narrative sections**

MemoryLoopSection renders RecallFlow and data-scene="loop". FeatureRail renders exactly four article cards using the typed feature ids and data-scene="features". EvidenceSection renders measured metric cards, ActivityChart, and a clearly labeled conceptual graph area with data-scene="evidence".

- [ ] **Step 5: Extend motion.ts**

Add matchMedia branches:

- Desktop min-width 800px: pin only the loop inner wrapper for a scroll distance no greater than 75vh.
- Mobile: reveal each loop step without pinning.
- Feature cards: stagger y from 24 to 0 once.
- Evidence numbers: animate textContent from 0 only when the value is a plain integer. Version strings and approximations remain static.

All branches must return GSAP cleanup callbacks.

- [ ] **Step 6: Verify and commit**

Run:

```bash
pnpm test tests/charts/release-points.test.ts
pnpm check
pnpm build
```

Expected: all checks pass.

Commit:

```bash
git add src/lib/charts.ts tests/charts src/components/visualizations src/components/sections src/scripts/motion.ts
git commit -m "feat: add product story and evidence visualizations"
```

---

### Task 7: Implement installation, comparison, final CTA, and clipboard enhancement

**Files:**

- Create: src/lib/clipboard.ts
- Create: tests/interactions/clipboard.test.ts
- Create: src/components/sections/InstallSection.astro
- Create: src/components/sections/ComparisonSection.astro
- Create: src/components/sections/FinalCTA.astro
- Create: src/components/SiteFooter.astro
- Create: src/scripts/interactions.ts

**Interfaces:**

- Consumes: LandingCopy.install, comparison, final, footer.
- Produces: copyText(text, clipboard), data-platform tabs, accessible status updates.

- [ ] **Step 1: Write failing clipboard tests**

Create tests/interactions/clipboard.test.ts:

```ts
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
```

Run:

```bash
pnpm test tests/interactions/clipboard.test.ts
```

Expected: FAIL because src/lib/clipboard.ts does not exist.

- [ ] **Step 2: Implement clipboard behavior**

Create src/lib/clipboard.ts:

```ts
export interface ClipboardWriter {
  writeText(text: string): Promise<void>;
}

export async function copyText(
  text: string,
  clipboard: ClipboardWriter,
): Promise<boolean> {
  try {
    await clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
```

- [ ] **Step 3: Build the closing sections**

InstallSection uses these exact commands:

```text
macOS: curl -fsSL https://raw.githubusercontent.com/jagoff/memo/master/install.sh | bash
Linux: pipx install "mlx-memo[cpu]"
```

Render both commands in the HTML so no-JavaScript visitors can read them. Use progressively enhanced tabs to change emphasis, not to remove content. Each copy button carries data-copy, data-success, and data-failure strings; the status element has role="status" and aria-live="polite".

ComparisonSection renders the typed table with a caption and a link to https://github.com/jagoff/memo#what-makes-memo-different. FinalCTA repeats install and GitHub. SiteFooter links to GitHub, https://pypi.org/project/mlx-memo/, the MIT license, and https://github.com/jagoff.

- [ ] **Step 4: Implement interactions.ts**

The script:

1. Adds menu open/close behavior with aria-expanded.
2. Enhances platform tabs with aria-selected and hidden only after initialization.
3. Dynamically imports copyText when a data-copy button is clicked.
4. Writes localized success/failure text to the live region.
5. Persists explicit language-link clicks in localStorage.

All event binding is idempotent via data-bound attributes.

- [ ] **Step 5: Verify and commit**

Run:

```bash
pnpm test tests/interactions/clipboard.test.ts
pnpm check
pnpm build
```

Expected: all checks pass.

Commit:

```bash
git add src/lib/clipboard.ts tests/interactions src/components/sections src/components/SiteFooter.astro src/scripts/interactions.ts
git commit -m "feat: add install flow comparison and final CTA"
```

---

### Task 8: Compose both localized pages and static metadata assets

**Files:**

- Create: src/components/LandingPage.astro
- Modify: src/pages/index.astro
- Modify: src/pages/es/index.astro
- Create: src/pages/404.astro
- Create: src/pages/robots.txt.ts
- Create: public/logo.svg
- Create: public/og.jpg
- Create: public/favicon.svg
- Test: tests/foundation/build-output.test.ts

**Interfaces:**

- Consumes: getCopy, loadProjectData, BaseLayout, all section components.
- Produces: complete /, /es/, /404.html, /robots.txt, /sitemap-index.xml, first-party brand assets.

- [ ] **Step 1: Write the failing build-output test**

Create tests/foundation/build-output.test.ts. Read dist output after build and assert that English and Spanish files contain their localized hero, both contain #install, canonical links, reciprocal hreflang, and no client-side GitHub/PyPI API URLs.

Run:

```bash
pnpm test:build
```

Expected: FAIL because the composed metadata and sections are absent.

- [ ] **Step 2: Create LandingPage composition**

LandingPage.astro accepts { locale: Locale }, loads copy and project data in frontmatter, and renders in this exact order:

1. SiteHeader
2. HeroSection
3. ProblemSection
4. MemoryLoopSection with id how
5. FeatureRail with id features
6. EvidenceSection
7. InstallSection with id install
8. ComparisonSection
9. FinalCTA
10. SiteFooter

Wrap the composition in BaseLayout and main id main-content. Do not duplicate section markup between locales.

- [ ] **Step 3: Replace route shells and add 404/robots**

index.astro renders LandingPage locale="en"; es/index.astro renders LandingPage locale="es". The 404 page uses BaseLayout with a bilingual message and direct links to / and /es/. robots.txt.ts returns:

```text
User-agent: *
Allow: /
Sitemap: https://memo-web.vercel.app/sitemap-index.xml
```

- [ ] **Step 4: Add first-party assets**

Copy /Users/fer/repos/memo/docs/logo.svg to public/logo.svg and public/favicon.svg. Copy /Users/fer/repos/memo/docs/social-preview.jpg to public/og.jpg. Preserve the originals in memo; do not symlink across repositories.

- [ ] **Step 5: Verify and commit**

Run:

```bash
pnpm test:build
pnpm check
```

Expected: the build-output test passes and all static routes/assets exist.

Commit:

```bash
git add src/components/LandingPage.astro src/pages public tests/foundation/build-output.test.ts
git commit -m "feat: compose bilingual production landing pages"
```

---

### Task 9: Add end-to-end, accessibility, visual, bundle, and Lighthouse gates

**Files:**

- Create: playwright.config.ts
- Create: e2e/site.spec.ts
- Create: e2e/accessibility.spec.ts
- Create: e2e/visual.spec.ts
- Create: e2e/visual.spec.ts-snapshots/
- Create: scripts/check-bundle-size.mjs
- Create: lighthouserc.json
- Create: .github/workflows/ci.yml

**Interfaces:**

- Consumes: production static build.
- Produces: deterministic CI gates for behavior, axe, screenshots, links, JavaScript gzip size, and Lighthouse budgets.

- [ ] **Step 1: Configure Playwright**

Use baseURL http://127.0.0.1:4321, testDir e2e, forbidOnly/retries on CI, screenshot only-on-failure, trace retain-on-failure, and webServer command pnpm build && pnpm preview --host 127.0.0.1. Define Chromium desktop and Mobile Safari projects; visual snapshots run only on Chromium. Set snapshotPathTemplate to {testDir}/{testFilePath}-snapshots/{projectName}/{arg}{ext} so CI and local runs share one baseline.

- [ ] **Step 2: Write failing behavior tests**

site.spec.ts must assert:

- English title and hero at /.
- Spanish title and hero at /es/.
- Locale switch from /#install targets /es/#install.
- Install tabs expose both exact commands.
- Copy success updates the live region when clipboard permission is granted.
- GitHub CTAs use https://github.com/jagoff/memo.
- JavaScript-disabled context still shows all eight section headings and both install commands.
- Reduced-motion context reports zero pinned ScrollTrigger spacer elements after scroll.

Run:

```bash
pnpm exec playwright install chromium webkit
pnpm test:e2e
```

Expected on the first run: at least one failure that exposes missing behavior; fix the owning component/script, rerun, and reach all passing.

- [ ] **Step 3: Add axe accessibility tests**

accessibility.spec.ts visits / and /es/ at desktop and mobile widths, injects AxeBuilder, and asserts no violations with tags wcag2a, wcag2aa, wcag21a, wcag21aa. Also tab from the skip link through the header and assert visible focus.

Run:

```bash
pnpm test:a11y
```

Expected: zero axe violations and passing keyboard assertions.

- [ ] **Step 4: Add stable visual regression**

visual.spec.ts emulates reduced motion, waits for fonts, visits both locales, and captures full-page screenshots at 1440x1000 and 390x844 with maxDiffPixelRatio 0.02. Mask the updated date only. Generate and inspect baseline snapshots once:

```bash
pnpm test:visual --update-snapshots
pnpm test:visual
```

Expected: second run passes with no visual diff.

- [ ] **Step 5: Enforce the JavaScript budget**

Create scripts/check-bundle-size.mjs. Recursively find dist/**/*.js, gzip each unique file with node:zlib, sum compressed byte lengths, print the total, and exit 1 when total exceeds 122880 bytes.

Run:

```bash
pnpm build
pnpm budget
```

Expected: output includes JavaScript gzip total: N bytes and exits 0 below 122880.

- [ ] **Step 6: Configure Lighthouse CI**

Create lighthouserc.json with staticDistDir dist, three runs, and assertions:

- categories:performance >= 0.90
- categories:accessibility >= 0.95
- categories:seo >= 0.95
- largest-contentful-paint <= 2500
- cumulative-layout-shift <= 0.1
- interactive <= 3500

Run:

```bash
pnpm build
pnpm lighthouse
```

Expected: all assertions pass for / and /es/.

- [ ] **Step 7: Add CI**

The GitHub Actions workflow uses ubuntu-latest, actions/checkout@v7, Node 24, pnpm/action-setup@v6 with version 11.12.0, actions/setup-node@v7 with pnpm cache, pnpm install --frozen-lockfile, format:check, lint, check, build, test, test:build, budget, Playwright Chromium installation, e2e/a11y/visual tests, Lighthouse, and lycheeverse/lychee-action@v2.9.0 for outbound links. Upload Playwright reports with actions/upload-artifact@v7 only on failure.

- [ ] **Step 8: Run the complete local gate and commit**

Run:

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm check
pnpm test
pnpm test:build
pnpm build
pnpm budget
pnpm test:e2e
pnpm test:a11y
pnpm test:visual
pnpm lighthouse
```

Expected: every command exits 0.

Commit:

```bash
git add playwright.config.ts e2e scripts/check-bundle-size.mjs lighthouserc.json .github
git commit -m "test: add production quality gates"
```

---

### Task 10: Document, publish, connect Vercel, and verify production

**Files:**

- Create: README.md
- Create: LICENSE
- Modify: src/data/project-snapshot.json only if a final refresh returns newer valid public data.
- Generated and ignored: .vercel/

**Interfaces:**

- Consumes: passing Task 9 gate and authenticated jagoff GitHub account.
- Produces: public jagoff/memo-web repository, connected Vercel Hobby project, production URL, and automatic main-branch deployment.

- [ ] **Step 1: Write repository documentation and license**

README.md states the purpose, links to memo, lists Node 24 and pnpm 11 prerequisites, documents pnpm install/dev/build/check/test, explains / and /es/, explains data snapshot fallback, and links to the design and implementation plan.

Copy /Users/fer/repos/memo/LICENSE to LICENSE so the website code uses the same MIT terms and author.

- [ ] **Step 2: Run final verification**

Run:

```bash
pnpm format
pnpm format:check
pnpm lint
pnpm check
pnpm test
pnpm test:build
pnpm build
pnpm budget
pnpm test:e2e
pnpm test:a11y
pnpm test:visual
pnpm lighthouse
git status --short
```

Expected: all checks pass; git status shows only README.md and LICENSE before the documentation commit.

- [ ] **Step 3: Commit documentation**

```bash
git add README.md LICENSE
git commit -m "docs: add project usage and license"
```

- [ ] **Step 4: Create and push the public GitHub repository**

Confirm the name is still free:

```bash
gh repo view jagoff/memo-web
```

Expected: GraphQL could not resolve the repository.

Create and push:

```bash
gh repo create jagoff/memo-web --public --source=. --remote=origin --push --description "Neural editorial landing page for memo — local-first memory for AI agents"
gh repo view jagoff/memo-web --json url,visibility,defaultBranchRef
```

Expected: visibility PUBLIC, default branch main, and URL https://github.com/jagoff/memo-web.

- [ ] **Step 5: Restore Vercel authentication without enabling billing**

The current local Vercel token is invalid. Run:

```bash
npx vercel@56.3.1 logout
npx vercel@56.3.1 login
npx vercel@56.3.1 whoami
```

Expected: browser/email authentication completes and whoami prints the owner's personal Vercel username. Do not select, create, trial, or upgrade to a Pro team.

- [ ] **Step 6: Link the Hobby project and GitHub repository**

Run:

```bash
npx vercel@56.3.1 link --yes --project memo-web
npx vercel@56.3.1 git connect https://github.com/jagoff/memo-web
npx vercel@56.3.1 telemetry disable
```

Expected: the local directory is linked to a personal Hobby project and Git integration points to jagoff/memo-web. If Vercel asks for payment or Pro, stop instead of accepting.

- [ ] **Step 7: Deploy production**

Run:

```bash
npx vercel@56.3.1 deploy --prod --yes
```

Expected: a production URL. Prefer https://memo-web.vercel.app. If that project name is unavailable, rename the Vercel project to memo-memory, replace the exact string https://memo-web.vercel.app with https://memo-memory.vercel.app in astro.config.ts, src/lib/seo.ts, src/pages/robots.txt.ts, and tests/seo/seo.test.ts, rerun the complete gate, commit with message fix: align canonical production URL, and push before deploying.

- [ ] **Step 8: Verify the public result**

For the actual production URL, run:

```bash
curl -fsSI https://memo-web.vercel.app/
curl -fsSI https://memo-web.vercel.app/es/
curl -fsS https://memo-web.vercel.app/ | rg "Your AI should remember"
curl -fsS https://memo-web.vercel.app/es/ | rg "Tu IA debería recordar"
gh run list --repo jagoff/memo-web --limit 5
git status --short --branch
```

Expected: both routes return HTTP 200, both localized strings match, the latest CI run is successful, and the local branch is clean and aligned with origin/main.

- [ ] **Step 9: Save the durable release outcome**

Record the GitHub URL, Vercel URL, final commit, tool versions, test summary, and any fallback project name in memo. Run memo idle capture and display any resulting notification.

---

## Plan self-review checklist

- Every design-spec section maps to at least one task.
- No task adds backend code, React, analytics, cookies, or runtime third-party requests.
- Content keys, Locale, LandingCopy, ProjectData, loadProjectData, releasePoints, buildSeo, localizedHref, copyText, and prefersReducedMotion have one consistent definition.
- TDD covers locale parity, routing, SEO, remote fallback, SVG geometry, motion preference, and clipboard behavior.
- Playwright covers the user-visible contract, no-JavaScript state, reduced motion, accessibility, and screenshots.
- CI enforces the exact 120 KB, Lighthouse, LCP, and CLS budgets.
- Deployment explicitly stops rather than enabling a paid Vercel plan.
