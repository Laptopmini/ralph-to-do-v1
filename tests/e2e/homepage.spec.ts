import { expect, test } from "@playwright/test";

test.describe("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("displays Hello World text", async ({ page }) => {
    await expect(page.getByText("Hello World")).toBeVisible();
  });

  test("has a stylesheet linked", async ({ page }) => {
    const count = await page.locator('link[rel="stylesheet"]').count();
    expect(count).toBeGreaterThan(0);
  });
});
