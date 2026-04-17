import { expect, test } from "@playwright/test";

test.describe("index.html markup", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("renders todo-app skeleton with required landmarks and controls", async ({ page }) => {
    await expect(page).toHaveTitle("To-Do");

    const app = page.getByTestId("todo-app");
    await expect(app).toBeVisible();
    await expect(app.locator("h1")).toHaveText("Todo");

    const input = page.getByTestId("todo-input");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("placeholder", /.+/);
    await expect(input).toHaveAttribute("autocomplete", "off");
    await expect(input).toHaveAttribute("maxlength", "240");

    await expect(page.getByTestId("todo-submit")).toBeVisible();
    await expect(page.getByTestId("filter-all")).toBeVisible();
    await expect(page.getByTestId("filter-active")).toBeVisible();
    await expect(page.getByTestId("filter-completed")).toBeVisible();

    const list = page.getByTestId("todo-list");
    await expect(list).toHaveCount(1);
    await expect(list.locator("li")).toHaveCount(0);

    await expect(page.getByTestId("empty-state")).toBeVisible();
    await expect(page.getByTestId("todo-count")).toBeVisible();
  });

  test("includes module script and preserves stylesheet link", async ({ page }) => {
    const moduleScript = await page.locator('script[type="module"][src="app.js"]').count();
    expect(moduleScript).toBe(1);

    const styleLink = await page.locator('link[rel="stylesheet"]').count();
    expect(styleLink).toBeGreaterThanOrEqual(1);

    const oldHeading = await page.locator("body > h1").count();
    expect(oldHeading).toBe(0);
  });
});
