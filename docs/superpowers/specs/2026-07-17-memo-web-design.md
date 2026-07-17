# memo-web Design Specification

**Date:** 2026-07-17  
**Status:** Approved design  
**Repository:** `jagoff/memo-web`  
**Local path:** `/Users/fer/repos/memo-web`  
**Product source:** `jagoff/memo`

## 1. Purpose

`memo-web` is the public marketing site for `memo`, a local-first semantic memory system for AI agents. It is a separate repository and deployment. It does not extend, package, or run the Python application or its local dashboard.

The landing page has one primary job: convert an interested developer into a user. It must explain the product quickly, demonstrate why it differs from generic vector stores and cloud memory products, and lead visitors to either install `memo` or inspect its GitHub repository.

## 2. Goals

- Publish a polished, bilingual English/Spanish landing page.
- Make the value proposition understandable above the fold.
- Preserve `memo`'s local-first, privacy-respecting identity.
- Use GSAP animation and hybrid data visualizations without compromising speed or accessibility.
- Make installation and GitHub the two dominant calls to action.
- Deploy for USD 0 on Vercel Hobby from a public personal GitHub repository.
- Remain portable to any static host.

## 3. Non-goals

- Replacing the `memo` README or reference documentation.
- Rebuilding the local `memo dashboard` for the web.
- Adding accounts, authentication, a database, a CMS, forms, or server APIs.
- Showing private/local memory data.
- Shipping a live playground that executes `memo`.
- Adding a blog, changelog UI, documentation portal, analytics, cookies, or telemetry in the first release.
- Adding WebGL, Three.js, smooth-scroll hijacking, or decorative cursor effects.

## 4. Audience and conversion

The primary audience is developers already using AI coding agents such as Claude Code, Codex, Cursor, Devin, Cline, or other MCP-aware tools. Secondary audiences are technical leads evaluating memory infrastructure and open-source contributors.

Primary conversion:

1. Copy or follow the install command.
2. Open `https://github.com/jagoff/memo`.

Secondary conversion:

- Open the PyPI package page.
- Read the full installation or architecture documentation in the `memo` repository.

The site will not invent a signup funnel. All calls to action lead to existing open-source surfaces.

## 5. Experience direction

The approved art direction is **Neural Editorial**:

- Deep violet/near-black base.
- Cyan/teal signals and restrained purple bloom.
- Editorial display typography paired with a clean sans-serif body face.
- A living memory graph as the signature motif.
- Precise technical labels and terminal details.
- Cinematic movement with generous negative space.

The site must feel sophisticated and authored, not like a generic SaaS template. Dense factual sections use the calmer spacing and hierarchy of the rejected “Sovereign Minimal” direction so that visual spectacle never harms readability.

Proposed typography:

- Fraunces Variable for display headings.
- Geist Sans Variable for body and navigation.
- The platform monospace stack for commands and technical labels.

Fonts are self-hosted as WOFF2 files. The site uses the existing `memo` logo assets where appropriate, while the main hero graph is purpose-built as SVG rather than using the current banner as a full-screen background.

## 6. Information architecture

The product is one landing page rendered in two languages. English is the default at `/`; Spanish is available at `/es/`.

The approved narrative is:

1. **Hero — “Your AI should remember.”**
   - One-sentence value proposition.
   - Living memory graph.
   - Install and GitHub calls to action.
   - Supported-agent trust strip.
2. **Problem — “Stop starting over.”**
   - Contrast between a forgotten session and durable continuity.
3. **How it works — “Save once. Recall everywhere.”**
   - Capture → Markdown/index → recall loop.
   - A short pinned-scroll sequence on larger screens; normal stacked content on small screens.
4. **Signature capabilities — “Memory with judgment.”**
   - Time-machine.
   - Contradiction radar.
   - Auto-capture.
   - Cross-agent continuity.
5. **Evidence — “Useful memory, measurable.”**
   - Verified product facts and public project activity.
   - Conceptual graphs clearly separated from measured data.
6. **Demo and install — “One command. No cloud account.”**
   - Terminal demonstration.
   - macOS/Apple Silicon and Linux/CPU variants.
   - Copy-to-clipboard control and links to full instructions.
7. **Differentiation — “Local isn't a feature. It's the foundation.”**
   - Compact, sourced comparison.
   - Link to the exhaustive comparison in the README.
8. **Final CTA — “Let them remember.”**
   - Install and GitHub actions.
   - PyPI, license, repository, and author links in the footer.

The sticky navigation links to How it works, Features, Install, GitHub, and the alternate locale. It condenses on mobile without hiding the primary install action.

## 7. Technical architecture

### 7.1 Runtime and build

- Astro static output.
- TypeScript in strict mode.
- Astro components and browser-native TypeScript; no React dependency in the first release.
- Scoped component CSS plus a small global token layer; no utility CSS framework.
- GSAP core and ScrollTrigger only.
- SVG for the signature graph and diagrams.
- Canvas is allowed only if profiling proves that the hero node count is inefficient in SVG.
- No Vercel Functions, middleware, ISR, or runtime server.

Vercel runs the production build and publishes `dist/`. The generated directory is deployable unchanged to any static file host.

### 7.2 Component boundaries

Each component has one responsibility and consumes typed props:

- `BaseLayout`: document shell, metadata, locale, fonts, global styles.
- `SiteHeader`: sticky navigation and primary CTA.
- `LocaleSwitch`: maps the current anchor between English and Spanish.
- `HeroSection`: value proposition and graph shell.
- `ProblemSection`: forgotten-versus-remembered narrative.
- `MemoryLoopSection`: capture/index/recall story.
- `FeatureRail`: signature capability cards.
- `EvidenceSection`: measured facts, public stats, and labels.
- `InstallSection`: platform tabs, command, copy action, full-doc links.
- `ComparisonSection`: compact sourced comparison.
- `FinalCTA` and `SiteFooter`: closing conversion and project links.
- `MemoryGraph`, `RecallFlow`, and `ActivityChart`: isolated visualizations.

Shared modules:

- `lib/motion`: plugin registration, media queries, scene lifecycle, and cleanup.
- `lib/data`: schema validation, API adapters, snapshot fallback, and freshness metadata.
- `lib/i18n`: locale types, route mapping, and translation lookup.
- `content/en.ts` and `content/es.ts`: typed localized copy with identical keys.

No section imports another section. Pages compose sections and pass them typed content and data.

## 8. Internationalization and SEO

- English is served at `/` and Spanish at `/es/`.
- A manual language choice persists in `localStorage` but never overrides a directly visited localized URL.
- The language switch preserves the current section anchor.
- The root route does not perform a browser-language redirect. This keeps crawling deterministic and gives shared URLs stable behavior.
- Both pages include correct `lang`, canonical URL, reciprocal `hreflang`, Open Graph, Twitter card metadata, and localized title/description.
- JSON-LD describes the project as open-source software and points to the canonical GitHub repository.
- A sitemap and robots file include both locales.
- Social preview assets use localized text or a language-neutral image.

Translation dictionaries are compiled and tested. A missing key is a build error, not a runtime fallback. Product names, commands, identifiers, and code remain untranslated.

## 9. Motion system

Motion is progressive enhancement. Initial HTML and CSS are readable before scripts execute. JavaScript adds a `data-motion-ready` attribute before applying animation-specific starting states, preventing invisible content when scripts fail.

Scenes:

- Hero nodes breathe and form links with a slow, non-blocking loop.
- The problem section reconnects a broken conversation thread.
- The memory loop advances through capture, index, and recall as the visitor scrolls.
- Capability cards use small, distinct SVG microanimations.
- Evidence counters animate once when entering the viewport.
- The install terminal reveals one real command sequence without simulating fake output indefinitely.

Rules:

- No scroll-jacking.
- Pinned scenes have short durations and release the page naturally.
- Mobile layouts use shorter timelines and avoid pinned horizontal rails.
- `prefers-reduced-motion: reduce` disables scrubbed timelines, counters, parallax, and looping motion. Equivalent static end states remain visible.
- GSAP scenes use scoped contexts and are reverted during page lifecycle changes.
- Resize and orientation changes rebuild only the affected scene.

## 10. Data model and sourcing

The site distinguishes three data classes.

### 10.1 Public live-at-build data

Fetched during the build and schema-validated:

- GitHub stars and forks.
- Latest GitHub release and recent release dates.
- Current PyPI version and package link.

These values show an “updated” date. They are never fetched from the visitor's browser.

### 10.2 Curated product facts

Facts are copied from authoritative files in `jagoff/memo` and retain a source URL in the data model. Initial candidates include:

- Local-first storage and execution.
- Markdown as the source of truth.
- Warm recall target under 200 ms.
- Default agent surface of 14 tools / approximately 1.4k schema tokens compared with the full 131-tool / approximately 15k-token surface.
- Time-machine, contradiction radar, synthesis, cross-agent resume, and hybrid retrieval.

Claims that may change are versioned in the checked-in snapshot and reviewed when `memo` releases. The landing does not parse prose from the README during every build.

### 10.3 Narrative visualizations

The memory graph, retrieval flow, and illustrative continuity curves explain behavior. They do not present invented measurements, unlabeled axes, fake user counts, or simulated live activity. The UI identifies them as illustrations when they could otherwise be mistaken for empirical charts.

### 10.4 Snapshot and fallback

`src/data/project-snapshot.json` stores the last known valid public values and their retrieval timestamp. The build attempts a short network refresh. On timeout, invalid JSON, API rate limiting, or an unavailable service, it logs a warning and uses the snapshot. A third-party outage cannot break a deployment.

The build fails only when both the remote response and the checked-in snapshot are invalid or when a curated claim lacks its required source.

## 11. Error handling

- External fetches have explicit timeouts and one retry for transient failures.
- Remote payloads are parsed through schemas; unknown fields are ignored and required fields are validated.
- Stale public data remains visible with its last-updated date.
- Copy-to-clipboard reports success or failure through an accessible live region. The command always remains selectable manually.
- Missing optional art falls back to CSS/SVG structure without losing text.
- Animation initialization failures are caught per scene so one broken visualization does not disable the rest of the page.
- Broken outbound links are detected in CI.
- The 404 page offers English and Spanish navigation back to the landing.

## 12. Accessibility and privacy

- Semantic landmarks and heading order.
- Full keyboard operation and visible focus states.
- Skip link and descriptive link text.
- WCAG AA color contrast for text and controls.
- Text alternatives for all informative visuals; decorative graph layers are hidden from assistive technology.
- No meaning conveyed by animation or color alone.
- Touch targets are at least 44 × 44 CSS pixels.
- Reduced-motion behavior is tested, not merely declared.
- No cookies, analytics, fingerprinting, contact forms, or client-side third-party API calls.
- Self-hosted fonts and first-party optimized assets avoid unnecessary visitor requests.

## 13. Performance budget

Release budgets, measured on the production build:

- Initial JavaScript: at most 120 KB gzip across the landing route.
- LCP: below 2.5 seconds on the Lighthouse mobile profile.
- CLS: below 0.1.
- INP: below 200 ms in supported lab checks.
- Lighthouse mobile: at least 90 Performance.
- Lighthouse: at least 95 Accessibility and SEO.

Hero imagery uses responsive AVIF/WebP with explicit dimensions. SVGs are optimized. Noncritical scenes initialize near the viewport. There is no autoplay video above the fold.

## 14. Testing and CI

Every pull request runs:

1. Formatting and lint checks.
2. `astro check` and strict TypeScript.
3. Unit tests for data validation, timeouts, snapshots, locale parity, route mapping, and copy state.
4. A clean production build for both locales.
5. Playwright tests for navigation, anchor-preserving language switching, CTAs, install variants, clipboard fallback, 404 behavior, and reduced motion.
6. axe accessibility scans of both locales.
7. Visual regression captures at desktop and mobile widths.
8. Lighthouse CI against the stated budgets.
9. An outbound-link check for GitHub, PyPI, and documentation URLs.

Supported browsers are the latest two major versions of Chrome, Firefox, and Safari, plus current iOS Safari. The experience may be visually simpler in older browsers but must retain content and installation actions.

## 15. Deployment

- Local repository: `/Users/fer/repos/memo-web`.
- GitHub repository: public `jagoff/memo-web`.
- Production branch: `main`.
- Hosting: Vercel Hobby under the owner's personal account.
- Target production URL: `https://memo-web.vercel.app` if available; fallback: `https://memo-memory.vercel.app`.
- Pull requests receive Vercel preview deployments.
- No paid domain, storage, functions, or add-ons are required.

Vercel Hobby is restricted to personal/non-commercial use. If the project's use no longer satisfies that condition, deployment must stop and the user must choose another free static host or authorize a paid plan. The implementation must never enable billing automatically.

## 16. Acceptance criteria

The first release is complete when:

- Both localized routes deploy successfully and contain equivalent content.
- The landing follows the approved eight-section narrative and Neural Editorial direction.
- Install and GitHub are visible above the fold and in the final CTA.
- The install command can be copied and remains manually selectable on clipboard failure.
- Real data is sourced, dated, and resilient to API failure.
- Narrative graphics cannot be mistaken for measured data.
- All essential content works with JavaScript disabled and with reduced motion enabled.
- Keyboard navigation, screen-reader structure, and contrast pass automated and manual smoke checks.
- CI, Playwright, axe, visual regression, and Lighthouse budgets pass.
- The public GitHub repository and Vercel production URL are reachable.
- Hosting remains at USD 0 with no billing method required by the implementation.

## 17. Implementation boundary

This specification authorizes a static marketing site only. Any later request for documentation pages, analytics, a live playground, user accounts, server APIs, or automatic synchronization with private `memo` data requires a separate design and implementation plan.
