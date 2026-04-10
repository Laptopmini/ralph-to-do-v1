import { expect, test } from "@playwright/test";

test.describe("DOM Wiring - app.ts", () => {
  test.beforeEach(async ({ page }) => {
    // Clear localStorage before each test
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("shows empty state when no todos exist", async ({ page }) => {
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveText("No tasks yet. Add one above!");

    // Todo list container should exist but be empty of items
    const todoList = page.getByTestId("todo-list");
    await expect(todoList).toBeVisible();
  });

  test("adds a new todo via button click", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    // Type a task and click add
    await input.fill("Buy groceries");
    await addBtn.click();

    // Empty state should be hidden
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeHidden();

    // A todo item should appear with the correct text
    const todoText = page.locator('[data-testid^="todo-text-"]').first();
    await expect(todoText).toBeVisible();
    await expect(todoText).toHaveText("Buy groceries");

    // Input should be cleared after adding
    await expect(input).toHaveValue("");
  });

  test("adds a new todo via Enter key", async ({ page }) => {
    const input = page.getByTestId("todo-input");

    await input.fill("Walk the dog");
    await input.press("Enter");

    // Todo item should appear
    const todoText = page.locator('[data-testid^="todo-text-"]').first();
    await expect(todoText).toBeVisible();
    await expect(todoText).toHaveText("Walk the dog");

    // Input should be cleared
    await expect(input).toHaveValue("");
  });

  test("toggles a todo completed state", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    // Add a todo
    await input.fill("Read a book");
    await addBtn.click();

    // Find the checkbox and click it
    const checkbox = page.locator('[data-testid^="todo-checkbox-"]').first();
    await checkbox.click();

    // Text should have .completed class
    const todoText = page.locator('[data-testid^="todo-text-"]').first();
    await expect(todoText).toHaveClass(/completed/);

    // Toggle back
    await checkbox.click();
    await expect(todoText).not.toHaveClass(/completed/);
  });

  test("deletes a todo", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    // Add a todo
    await input.fill("Clean the house");
    await addBtn.click();

    // Verify it exists
    const todoText = page.locator('[data-testid^="todo-text-"]').first();
    await expect(todoText).toBeVisible();

    // Click delete
    const deleteBtn = page.locator('[data-testid^="todo-delete-"]').first();
    await expect(deleteBtn).toHaveText("Delete");
    await deleteBtn.click();

    // Todo should be gone, empty state should return
    await expect(page.locator('[data-testid^="todo-text-"]')).toHaveCount(0);
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
  });

  test("persists todos in localStorage across page reloads", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    // Add a todo
    await input.fill("Persistent task");
    await addBtn.click();

    // Reload the page
    await page.reload();

    // The todo should still be visible
    const todoText = page.locator('[data-testid^="todo-text-"]').first();
    await expect(todoText).toBeVisible();
    await expect(todoText).toHaveText("Persistent task");
  });

  test("todo items have correct data-testid structure", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    // Add a todo
    await input.fill("Test structure");
    await addBtn.click();

    // Get the id from the todo item
    const todoItem = page.locator('[data-testid^="todo-item-"]').first();
    await expect(todoItem).toBeVisible();
    const testId = await todoItem.getAttribute("data-testid");
    expect(testId).not.toBeNull();
    const id = (testId as string).replace("todo-item-", "");

    // Verify all sub-elements use the same id
    await expect(page.getByTestId(`todo-checkbox-${id}`)).toBeVisible();
    await expect(page.getByTestId(`todo-text-${id}`)).toBeVisible();
    await expect(page.getByTestId(`todo-delete-${id}`)).toBeVisible();
  });

  test("does not add empty or whitespace-only todos", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");

    // Try adding empty text
    await input.fill("");
    await addBtn.click();

    // Try adding whitespace
    await input.fill("   ");
    await addBtn.click();

    // Empty state should still be visible
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
    await expect(page.locator('[data-testid^="todo-item-"]')).toHaveCount(0);
  });
});
