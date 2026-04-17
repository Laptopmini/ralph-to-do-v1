import { expect, test } from "@playwright/test";

test.describe("app.js module wiring", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        window.localStorage.clear();
      } catch {}
    });
    await page.goto("/");
  });

  test("adds a todo via form submit and updates count", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    await input.fill("Buy milk");
    await page.getByTestId("todo-submit").click();

    const list = page.getByTestId("todo-list");
    const items = list.getByTestId("todo-item");
    await expect(items).toHaveCount(1);
    await expect(items.first().getByTestId("todo-text")).toHaveText("Buy milk");
    await expect(page.getByTestId("todo-count")).toContainText("1");
    await expect(page.getByTestId("empty-state")).toBeHidden();
  });

  test("toggles, filters, and deletes todos", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const submit = page.getByTestId("todo-submit");

    await input.fill("Task A");
    await submit.click();
    await input.fill("Task B");
    await submit.click();

    const items = page.getByTestId("todo-list").getByTestId("todo-item");
    await expect(items).toHaveCount(2);

    await items.first().getByTestId("todo-toggle").click();
    await expect(page.getByTestId("todo-count")).toContainText("1");

    const activeBtn = page.getByTestId("filter-active");
    await activeBtn.click();
    await expect(activeBtn).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("todo-list").getByTestId("todo-item")).toHaveCount(1);

    await page.getByTestId("filter-completed").click();
    await expect(page.getByTestId("todo-list").getByTestId("todo-item")).toHaveCount(1);

    await page.getByTestId("filter-all").click();
    const allItems = page.getByTestId("todo-list").getByTestId("todo-item");
    await expect(allItems).toHaveCount(2);

    await allItems.last().getByTestId("todo-delete").click();
    await page.waitForTimeout(300);
    await expect(page.getByTestId("todo-list").getByTestId("todo-item")).toHaveCount(1);
  });

  test("shows empty state when no todos", async ({ page }) => {
    await expect(page.getByTestId("empty-state")).toBeVisible();
    await expect(page.getByTestId("todo-list").getByTestId("todo-item")).toHaveCount(0);
  });
});
