# ralph-html

A fork of [ralph-node](https://github.com/Laptopmini/ralph-node) with a simple boilerplate to serve a static HTML based application.

Fork this repo and drop in a new `PRD.md` to start building something with the loop already bootstrapped.

For full documentation on how the Ralph Loop works and how to use these repos, see the [original ralph-node README](https://github.com/Laptopmini/ralph-node#readme).

## Changelog

This repo uses [ralph-node-base](https://github.com/Laptopmini/ralph-node-base) as a starting point.

- **TypeScript** — `tsconfig.json` with ES2022 target, NodeNext modules, strict mode, and `dist/` output
- **Jest** — `jest.config.js` with `@swc/jest` transform scoped to unit tests, plus a sanity test
- **Playwright** — `playwright.config.ts` targeting Chromium at `localhost:3000`, plus a sanity E2E test
- **Root test script** — `npm test` wired to run unit then E2E tests sequentially
- **Static HTML website** — Configured to serve a static HTML based application
- **Playwright webServer** — Updated Playwright configuration with webServer block for proper test execution

## License

Apache 2.0
