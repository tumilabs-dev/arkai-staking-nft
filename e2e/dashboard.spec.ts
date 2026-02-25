import { test, expect, seedAuthState, mockStakingAPIs } from "./fixtures";

test.describe("Dashboard Page", () => {
  test.describe("no pool joined", () => {
    test.beforeEach(async ({ page }) => {
      await seedAuthState(page);
      await mockStakingAPIs(page, { noCurrentPool: true });
    });

    test("shows join pool call-to-action when no pool joined", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(
        page.getByText(/join a pool to start staking/i)
      ).toBeVisible();
    });

    test("Join a Pool button navigates to /pool", async ({ page }) => {
      await page.goto("/dashboard");
      // InkButton renders as <button>, not <a> link
      await page.getByRole("button", { name: /join a pool/i }).click();
      await expect(page).toHaveURL(/\/pool/);
    });
  });

  test.describe("with active pool", () => {
    test.beforeEach(async ({ page }) => {
      await seedAuthState(page);
      await mockStakingAPIs(page);
    });

    test("shows staking progress heading", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(
        page.getByText(/staking progress/i)
      ).toBeVisible();
    });

    test("shows current pool name", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page.getByText("Whispering Woods")).toBeVisible();
    });

    test("shows weeks staked progress", async ({ page }) => {
      await page.goto("/dashboard");
      // weekHeld: 2, requiredWeeks: 4 — rendered as a "2 / 4" span
      await expect(page.getByText("2 / 4")).toBeVisible();
    });

    test("shows pool rewards section", async ({ page }) => {
      await page.goto("/dashboard");
      await expect(page.getByText(/pool rewards/i)).toBeVisible();
    });
  });
});
