import { expect, test } from "@playwright/test";

test.describe("To-Do App HTML Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("has correct page title and heading", async ({ page }) => {
    // Page title must be "To-Do List"
    await expect(page).toHaveTitle("To-Do List");

    // h1 heading with data-testid="app-title" reading "To-Do List"
    const heading = page.getByTestId("app-title");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("To-Do List");
  });

  test("has input field, add button, todo list container, and empty state", async ({ page }) => {
    // Input field with correct attributes
    const input = page.getByTestId("todo-input");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveAttribute("placeholder", "Add a new task...");

    // Add Task button
    const addBtn = page.getByTestId("add-task-btn");
    await expect(addBtn).toBeVisible();
    await expect(addBtn).toHaveText("Add Task");

    // Todo list container exists
    const todoList = page.getByTestId("todo-list");
    await expect(todoList).toBeVisible();

    // Empty state message visible when no tasks
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveText("No tasks yet. Add one above!");
  });

  test("has proper meta tags, stylesheet link, and module script", async ({ page }) => {
    // Check meta charset
    const charset = page.locator('meta[charset="UTF-8"]');
    await expect(charset).toHaveCount(1);

    // Check meta viewport
    const viewport = page.locator('meta[name="viewport"]');
    await expect(viewport).toHaveCount(1);

    // Check stylesheet link
    const stylesheet = page.locator('link[rel="stylesheet"][href="style.css"]');
    await expect(stylesheet).toHaveCount(1);

    // Check script tag with type="module" and src="app.js"
    const script = page.locator('script[type="module"][src="app.js"]');
    await expect(script).toHaveCount(1);
  });
});
