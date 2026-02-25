import { test, expect, seedAuthState, mockStakingAPIs } from "./fixtures";

test.describe("Rules Page", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthState(page);
    await mockStakingAPIs(page);
  });

  test("shows Rules heading", async ({ page }) => {
    await page.goto("/rules");
    await expect(page.getByRole("heading", { name: /rules/i })).toBeVisible();
  });

  test("shows all 4 accordion items", async ({ page }) => {
    await page.goto("/rules");
    for (let i = 1; i <= 4; i++) {
      await expect(
        page.getByText(new RegExp(`potential reward overview.*${i}`, "i"))
      ).toBeVisible();
    }
  });

  test("first accordion item is expanded by default", async ({ page }) => {
    await page.goto("/rules");
    // The first accordion content should be visible
    const firstTrigger = page.getByText(/potential reward overview.*1/i);
    await expect(firstTrigger).toBeVisible();
    // Check the first accordion panel is open (aria-expanded="true")
    await expect(firstTrigger.locator("..")).toHaveAttribute("data-state", "open");
  });

  test("clicking a collapsed accordion item expands it", async ({ page }) => {
    await page.goto("/rules");
    // Click the second accordion item
    const secondTrigger = page.getByText(/potential reward overview.*2/i);
    await secondTrigger.click();
    await expect(secondTrigger.locator("..")).toHaveAttribute("data-state", "open");
  });
});
