import { expect, test } from "@playwright/test";

test.describe("DOM Wiring in app.ts", () => {
  test.beforeEach(async ({ page }) => {
    await page.evaluate(() => localStorage.clear());
    await page.goto("/");
  });

  test("renders empty state on initial load with no todos", async ({ page }) => {
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
    const list = page.getByTestId("todo-list");
    const items = list.locator('[data-testid^="todo-item-"]');
    await expect(items).toHaveCount(0);
  });

  test("adds a todo via the add button", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("Buy groceries");
    await addBtn.click();

    const items = page.locator('[data-testid^="todo-item-"]');
    await expect(items).toHaveCount(1);
    const textSpan = page.locator('[data-testid^="todo-text-"]').first();
    await expect(textSpan).toHaveText("Buy groceries");
  });

  test("clears input after adding a todo", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("Test task");
    await addBtn.click();

    await expect(input).toHaveValue("");
  });

  test("hides empty state after adding a todo", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("New task");
    await addBtn.click();

    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeHidden();
  });

  test("adds a todo via Enter key", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    await input.fill("Press enter task");
    await input.press("Enter");

    const items = page.locator('[data-testid^="todo-item-"]');
    await expect(items).toHaveCount(1);
    const textSpan = page.locator('[data-testid^="todo-text-"]').first();
    await expect(textSpan).toHaveText("Press enter task");
  });

  test("todo item has checkbox, text, and delete button", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("Check structure");
    await addBtn.click();

    const item = page.locator('[data-testid^="todo-item-"]').first();
    await expect(item).toBeVisible();

    const checkbox = item.locator('[data-testid^="todo-checkbox-"]');
    await expect(checkbox).toBeVisible();

    const text = item.locator('[data-testid^="todo-text-"]');
    await expect(text).toBeVisible();

    const deleteBtn = item.locator('[data-testid^="todo-delete-"]');
    await expect(deleteBtn).toBeVisible();
  });

  test("toggles a todo completed state via checkbox", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("Toggle me");
    await addBtn.click();

    const checkbox = page.locator('[data-testid^="todo-checkbox-"]').first();
    await checkbox.click();

    const checked = await checkbox.isChecked();
    expect(checked).toBe(true);

    await checkbox.click();
    const unchecked = await checkbox.isChecked();
    expect(unchecked).toBe(false);
  });

  test("deletes a todo via delete button", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("Delete me");
    await addBtn.click();
    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(1);

    const deleteBtn = page.locator('[data-testid^="todo-delete-"]').first();
    await deleteBtn.click();

    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(0);
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });

  test("persists todos in localStorage", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("Persistent task");
    await addBtn.click();

    const stored = await page.evaluate(() => localStorage.getItem("todos"));
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored as string);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].text).toBe("Persistent task");
  });

  test("loads todos from localStorage on page load", async ({ page }) => {
    await page.evaluate(() => {
      const todos = [{ id: "test-id-1", text: "Preloaded task", completed: false }];
      localStorage.setItem("todos", JSON.stringify(todos));
    });

    await page.reload();

    const items = page.locator('[data-testid^="todo-item-"]');
    await expect(items).toHaveCount(1);
    const textSpan = page.locator('[data-testid^="todo-text-"]').first();
    await expect(textSpan).toHaveText("Preloaded task");
  });

  test("does not add empty or whitespace-only todos", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    await input.fill("   ");
    await addBtn.click();

    const items = page.locator('[data-testid^="todo-item-"]');
    await expect(items).toHaveCount(0);
    await expect(page.getByTestId("empty-state")).toBeVisible();
  });
});
