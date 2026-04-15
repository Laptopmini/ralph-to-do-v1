import { expect, test } from "@playwright/test";

test.describe("To-Do App CSS Styles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("container is centered with max-width 600px", async ({ page }) => {
    const container = page.locator("body > *").first();
    const box = await container.boundingBox();
    const viewport = page.viewportSize();
    expect(box).not.toBeNull();
    expect(viewport).not.toBeNull();
    const styles = await container.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        maxWidth: cs.maxWidth,
        marginLeft: cs.marginLeft,
        marginRight: cs.marginRight,
      };
    });
    expect(styles.maxWidth).toBe("600px");
    expect(styles.marginLeft).toBe(styles.marginRight);
  });

  test("uses system-ui font family", async ({ page }) => {
    const body = page.locator("body");
    const fontFamily = await body.evaluate((el) => getComputedStyle(el).fontFamily);
    expect(fontFamily).toContain("system-ui");
  });

  test("input field has correct padding and border-radius", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const styles = await input.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        padding: cs.padding,
        borderRadius: cs.borderRadius,
      };
    });
    expect(styles.padding).toBe("12px");
    expect(styles.borderRadius).toBe("8px");
  });

  test("add button has correct blue background and padding", async ({ page }) => {
    const button = page.getByTestId("add-task-btn");
    const styles = await button.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        backgroundColor: cs.backgroundColor,
        paddingTop: cs.paddingTop,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,
        paddingRight: cs.paddingRight,
      };
    });
    expect(styles.backgroundColor).toBe("rgb(37, 99, 235)");
    expect(styles.paddingTop).toBe("12px");
    expect(styles.paddingBottom).toBe("12px");
    expect(styles.paddingLeft).toBe("24px");
    expect(styles.paddingRight).toBe("24px");
  });

  test("add button hover changes background color", async ({ page }) => {
    const button = page.getByTestId("add-task-btn");
    await button.hover();
    const bgColor = await button.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe("rgb(29, 78, 216)");
  });

  test("container has box-shadow", async ({ page }) => {
    const container = page.locator("body > *").first();
    const boxShadow = await container.evaluate((el) => getComputedStyle(el).boxShadow);
    expect(boxShadow).not.toBe("none");
  });

  test("completed task has line-through and reduced opacity", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");
    await input.fill("Test completed style");
    await addBtn.click();

    const todoItem = page.locator('[data-testid^="todo-item-"]').first();
    const checkbox = todoItem.locator('[data-testid^="todo-checkbox-"]');
    await checkbox.click();

    const textSpan = todoItem.locator('[data-testid^="todo-text-"]');
    const styles = await textSpan.evaluate((el) => {
      const cs = getComputedStyle(el);
      return {
        textDecoration: cs.textDecorationLine || cs.textDecoration,
        opacity: cs.opacity,
      };
    });
    expect(styles.textDecoration).toContain("line-through");
    expect(Number.parseFloat(styles.opacity)).toBeLessThanOrEqual(0.6);
  });

  test("delete button has red background", async ({ page }) => {
    const input = page.getByTestId("todo-input");
    const addBtn = page.getByTestId("add-task-btn");
    await input.fill("Test delete style");
    await addBtn.click();

    const deleteBtn = page.locator('[data-testid^="todo-delete-"]').first();
    const bgColor = await deleteBtn.evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(bgColor).toBe("rgb(220, 38, 38)");
  });
});
