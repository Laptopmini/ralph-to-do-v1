# ralph-to-do

A fork of [ralph-node](https://github.com/Laptopmini/ralph-node) implementing a static HTML based to-do list application with persistence.

Fork this repo and drop in a new `PRD.md` to start building something with the loop already bootstrapped.

For full documentation on how the Ralph Loop works and how to use these repos, see the [original ralph-node README](https://github.com/Laptopmini/ralph-node#readme).

## Prompt

`npm run maestro -- \`
> Turn this website application into a persistent To-Do List application that allows users to add, toggle completion status, and delete tasks, utilizing LocalStorage to ensure all data is preserved across page refreshes. The feature should be delivered with a modern, minimalist aesthetic characterized by a clean, uncluttered interface, professional typography, and an intuitive user experience. To achieve a polished, premium feel, please incorporate subtle micro-interactions—such as smooth transitions when adding or removing items—and ensure the layout is fully responsive to maintain a high-end visual experience across all device breakpoints.

## Changelog

This repo uses [ralph-html](https://github.com/Laptopmini/ralph-html) as a starting point.

- **TypeScript** — `tsconfig.json` with ES2022 target, NodeNext modules, strict mode, and `dist/` output
- **Jest** — `jest.config.js` with `@swc/jest` transform scoped to unit tests, plus a sanity test
- **Playwright** — `playwright.config.ts` targeting Chromium at `localhost:3000`, plus a sanity E2E test
- **Root test script** — `npm test` wired to run unit then E2E tests sequentially
- **Static HTML website** — Configured to serve a static HTML based application
- **Playwright webServer** — Updated Playwright configuration with webServer block for proper test execution

## Stack

| Tool | Role |
|------|------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | Agentic CLI |
| [OpenCode](https://opencode.ai/) | Open Source Agentic CLI |
| [LM Studio](https://lmstudio.ai/) | Local LLM Server |
| [Jest](https://jestjs.io/) | Unit testing |
| [Playwright](https://playwright.dev/) | E2E testing |
| [Biome](https://biomejs.dev/) | Linting and formatting |
| [serve](https://github.com/vercel/serve) | Static File Server |

## License

Apache 2.0