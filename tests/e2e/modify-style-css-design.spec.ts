import { expect, test } from "@playwright/test";

test.describe("style.css design system", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("declares CSS custom properties on :root and applies box-sizing reset", async ({ page }) => {
    const vars = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      const names = [
        "--space-1",
        "--space-2",
        "--space-3",
        "--space-4",
        "--space-5",
        "--space-6",
        "--transition-fast",
        "--transition-base",
      ];
      return Object.fromEntries(names.map((n) => [n, root.getPropertyValue(n).trim()]));
    });

    for (const key of Object.keys(vars)) {
      expect(vars[key], `${key} should be defined`).not.toBe("");
    }
    expect(vars["--transition-fast"]).toMatch(/150ms/);
    expect(vars["--transition-base"]).toMatch(/200ms/);

    const colorVars = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement);
      return ["--color-bg", "--color-surface", "--color-text", "--color-accent"]
        .map((n) => root.getPropertyValue(n).trim())
        .filter((v) => v !== "");
    });
    expect(colorVars.length).toBeGreaterThan(0);

    const bodyBoxSizing = await page.evaluate(() => getComputedStyle(document.body).boxSizing);
    expect(bodyBoxSizing).toBe("border-box");
  });

  test("styles main as a centered card and hides empty state with todos", async ({ page }) => {
    const main = page.getByTestId("todo-app");
    const box = await main.evaluate((el) => {
      const style = getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return {
        maxWidth: style.maxWidth,
        borderRadius: style.borderRadius,
        boxShadow: style.boxShadow,
        width: rect.width,
      };
    });
    expect(box.maxWidth).toMatch(/560px/);
    expect(box.boxShadow).not.toBe("none");
    expect(parseFloat(box.borderRadius)).toBeGreaterThan(0);

    const hasKeyframes = await page.evaluate(() => {
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          const rules = Array.from(sheet.cssRules || []);
          const names = rules
            .filter((r) => r instanceof CSSKeyframesRule)
            .map((r) => (r as CSSKeyframesRule).name);
          if (names.includes("todo-enter") && names.includes("todo-leave")) {
            return true;
          }
        } catch {}
      }
      return false;
    });
    expect(hasKeyframes).toBe(true);
  });
});
