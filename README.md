# memo web

The public landing page for [memo](https://github.com/jagoff/memo), a local-first memory layer that gives AI agents durable, inspectable context across tools and sessions.

The site is a static [Astro](https://astro.build/) project. English is served at `/` and Spanish at `/es/`.

## Prerequisites

- Node.js 24
- pnpm 11

The exact pnpm release is recorded in `package.json`; Corepack can activate it automatically.

## Development

```bash
pnpm install
pnpm dev
```

The development server prints its local URL. Use `/` for English and `/es/` for Spanish.

## Verification and production build

```bash
pnpm check
pnpm test
pnpm build
```

`pnpm check` validates the Astro and TypeScript surface, `pnpm test` runs the unit contracts, and `pnpm build` emits the static production site in `dist/`. Additional browser, accessibility, visual, bundle, and Lighthouse gates are available through the scripts in `package.json`.

## Public project data

GitHub activity and the current PyPI version are fetched and validated at build time. If either public service is unavailable or returns invalid data, the build uses the last verified snapshot from `src/data/project-snapshot.json` and labels that data as stale in the rendered page. The browser does not call the GitHub or PyPI APIs.

## Design and implementation

- [Design specification](docs/superpowers/specs/2026-07-17-memo-web-design.md)
- [Implementation plan](docs/superpowers/plans/2026-07-17-memo-web-implementation.md)

## License

[MIT](LICENSE) © 2026 Fernando Ferrari
