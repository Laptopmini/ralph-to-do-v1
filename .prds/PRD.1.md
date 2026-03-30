# PRD: Create initial static HTML app

## Objective

We want to provide the basic setup for starting to work on a static HTML website. This website will use `serve` from Vercel to host the app locally. In the future, further PRDs will be able to indicate what the purpose of this static website is.

## Context

- All source code for the app should be declared under `src/`.

## Constraints

- Only modify `package.json`'s `serve` dependency, scripts, configuration files, and the `src/` directory.
- Limit to adding `serve` as a dependency and using it to locally host the website 
- All test files must pass on first execution.

## Tasks

- [x] Update Playwright configuration. Modify `playwright.config.ts` so that it spins up a `webServer` using the command `npm start` which is being served at the URL `http://localhost:3000`. The `npm start` script is not available yet, but the configuration should be ready to use it for once its declared. `[test: npx jest tests/unit/playwright.config.test.ts]`

- [x] Serve a static HTML website. Create a page called `src/index.html` which just says "Hello World". Add a stylesheet CSS declaration which can is used for `index.html`, and possibily other pages added in the future. In `package.json`, add a `start` script which calls `serve` to host the static website locally at `http://localhost:3000` using `src/index.html` as a homepage. `[test: npx playwright test tests/e2e/homepage.spec.ts]`
