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

  test("shows coming soon message", async ({ page }) => {
    await page.goto("/rules");
    await expect(
      page.getByText(/Rules & guidelines are coming soon/i)
    ).toBeVisible();
  });
});
