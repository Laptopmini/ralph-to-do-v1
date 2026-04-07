# ralph-to-do

A fork of [ralph-node](https://github.com/Laptopmini/ralph-node) implementing a static HTML based to-do list application with persistence.

Fork this repo and drop in a new `PRD.md` to start building something with the loop already bootstrapped.

For full documentation on how the Ralph Loop works and how to use these repos, see the [original ralph-node README](https://github.com/Laptopmini/ralph-node#readme).

## Prompt

`npm run maestro -- \`
> To-Do List with Persistence: Add, toggle complete, delete, and save to LocalStorage so it survives a page refresh. I want this application to be a practical to-do list tracker website with persistence. I want to be able to add tasks, mark them as complete, and delete them. I should be able to refresh the page and keep my tasks in their current state. The interface should be simple and intuitive. Something clean and modern, with a minimalist design. It should also be responsive, so it works well on both desktop and mobile devices. I should be able to add tasks by clicking on the "Add Task" button and mark them as complete by clicking on the checkbox next to each task. I should be able to delete tasks by clicking on the "Delete" button next to each task.

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
