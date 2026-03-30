Task: "Wire up a root test script" — already complete before this cycle began.

The `package.json` `"test"` script already reads `"npm run test:unit && npm run test:e2e"` as of the previous Playwright configuration cycle. No changes were needed.

If the orchestrator marks this task as failing, the issue is likely with the underlying test suites (Jest or Playwright), not the root script wiring. Specifically:
- Playwright's `setup.spec.ts` navigates to `about:blank` — if browser binaries aren't installed, Playwright will fail. That's an environment issue outside our scope.
- Jest should pass cleanly with the existing `setup.test.ts`.

No code changes made this cycle.
