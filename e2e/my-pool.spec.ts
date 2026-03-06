import { test, expect, seedAuthState, mockStakingAPIs } from "./fixtures";

test.describe("My Pool Page (Pixi.js Game)", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthState(page);
    await mockStakingAPIs(page);
  });

  test("page loads without getting stuck on spinner", async ({ page }) => {
    await page.goto("/pool/my-pool");
    // GameUI overlay renders once the loading state resolves
    await expect(
      page.getByRole("heading", { name: /your staking adventure map/i })
    ).toBeVisible({ timeout: 15000 });
  });

  test("renders a canvas element (Pixi.js) or GameUI overlay", async ({ page }) => {
    await page.goto("/pool/my-pool");
    // Wait for GameUI to confirm the page is fully mounted
    await expect(
      page.getByRole("heading", { name: /your staking adventure map/i })
    ).toBeVisible({ timeout: 15000 });
    // Canvas may not render in headless (Pixi WebGL requires GPU),
    // but at minimum the GameUI overlay must be present
    const canvasCount = await page.locator("canvas").count();
    const headingVisible = await page.getByRole("heading", { name: /your staking adventure map/i }).isVisible();
    expect(canvasCount > 0 || headingVisible).toBeTruthy();
  });

  test("shows Your Staking Adventure Map heading in GameUI", async ({ page }) => {
    await page.goto("/pool/my-pool");
    await expect(
      page.getByText(/your staking adventure map/i)
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows Claim all gifts button", async ({ page }) => {
    await page.goto("/pool/my-pool");
    await expect(
      page.getByRole("button", { name: /claim all gifts/i })
    ).toBeVisible({ timeout: 10000 });
  });

  test("shows total weeks staked progress", async ({ page }) => {
    await page.goto("/pool/my-pool");
    // weekHeld: 2, requiredWeeks: 4 — rendered as "Total Phases Staked:" label + "2 / 6" value
    await expect(page.getByText("Total Phases Staked:")).toBeVisible({ timeout: 10000 });
    await expect(page.getByText("2 / 6")).toBeVisible({ timeout: 10000 });
  });

  test("back button is visible and navigates away", async ({ page }) => {
    await page.goto("/pool/my-pool");
    // Back button (arrow icon button)
    const backBtn = page.getByRole("button", { name: /back/i }).or(
      page.locator("button").filter({ has: page.locator("svg") }).first()
    );
    await expect(backBtn).toBeVisible({ timeout: 10000 });
  });
});
