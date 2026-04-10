import { expect, test } from "@playwright/test";

test.describe("To-Do App Styling & Responsive Design", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("app container is centered with max-width and box-shadow", async ({ page }) => {
    // Find the main app container (parent of app-title)
    const heading = page.getByTestId("app-title");
    const container = heading.locator("..");

    // Check max-width is 600px
    const maxWidth = await container.evaluate((el) => getComputedStyle(el).maxWidth);
    expect(maxWidth).toBe("600px");

    // Check auto margins for centering
    const marginLeft = await container.evaluate((el) => getComputedStyle(el).marginLeft);
    const marginRight = await container.evaluate((el) => getComputedStyle(el).marginRight);
    expect(marginLeft).toBe(marginRight);

    // Check box-shadow is present (not "none")
    const boxShadow = await container.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(boxShadow).not.toBe("none");
  });

  test("input field has correct styling", async ({ page }) => {
    const input = page.getByTestId("todo-input");

    // Check padding (12px)
    const padding = await input.evaluate((el) => getComputedStyle(el).padding);
    expect(padding).toContain("12px");

    // Check border-radius (8px)
    const borderRadius = await input.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBe("8px");

    // Check border includes #ddd (rgb(221, 221, 221))
    const border = await input.evaluate((el) => getComputedStyle(el).borderColor);
    expect(border).toContain("rgb(221, 221, 221)");
  });

  test("add button has correct colors and styling", async ({ page }) => {
    const addBtn = page.getByTestId("add-task-btn");

    // Background color #2563eb = rgb(37, 99, 235)
    const bgColor = await addBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe("rgb(37, 99, 235)");

    // White text
    const color = await addBtn.evaluate((el) => getComputedStyle(el).color);
    expect(color).toBe("rgb(255, 255, 255)");

    // Border-radius 8px
    const borderRadius = await addBtn.evaluate((el) => getComputedStyle(el).borderRadius);
    expect(borderRadius).toBe("8px");
  });

  test("font family uses system-ui, sans-serif and transitions are applied", async ({ page }) => {
    const fontFamily = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
    expect(fontFamily).toMatch(/system-ui/i);

    // Also verify transitions exist on interactive elements (requires full styling)
    const addBtn = page.getByTestId("add-task-btn");
    await expect(addBtn).toBeVisible();
    const transition = await addBtn.evaluate((el) => getComputedStyle(el).transition);
    expect(transition).not.toBe("");
  });

  test("responsive layout adapts for narrow screens", async ({ page }) => {
    // Set viewport to mobile width
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto("/");

    // The page should still render without horizontal overflow
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);

    // Input and button should still be visible
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");
    await expect(input).toBeVisible();
    await expect(addBtn).toBeVisible();
  });
});
