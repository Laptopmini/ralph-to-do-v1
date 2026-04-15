import { expect, test } from "@playwright/test";

test.describe("To-Do List HTML Structure", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("page has correct title", async ({ page }) => {
    await expect(page).toHaveTitle("To-Do List");
  });

  test("displays app title heading", async ({ page }) => {
    const heading = page.getByTestId("app-title");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText("To-Do List");
  });

  test("has a text input for adding tasks", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute("type", "text");
    await expect(input).toHaveAttribute("placeholder", "Add a new task...");
  });

  test("has an add task button", async ({ page }) => {
    const button = page.getByTestId("add-task-btn");
    await expect(button).toBeVisible();
    await expect(button).toHaveText(/add/i);
  });

  test("has a todo list container", async ({ page }) => {
    const list = page.getByTestId("todo-list");
    await expect(list).toBeVisible();
  });

  test("displays empty state message when no tasks exist", async ({ page }) => {
    const emptyState = page.getByTestId("empty-state");
    await expect(emptyState).toBeVisible();
    await expect(emptyState).toHaveText("No tasks yet. Add one above!");
  });

  test("loads app.js as a module script", async ({ page }) => {
    const script = page.locator('script[type="module"][src="app.js"]');
    await expect(script).toBeAttached();
  });

  test("input is focusable via keyboard", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    await input.focus();
    await expect(input).toBeFocused();
  });
});
