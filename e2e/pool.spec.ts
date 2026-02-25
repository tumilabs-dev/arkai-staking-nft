import { test, expect, seedAuthState, mockStakingAPIs } from "./fixtures";

test.describe("Pool Selection Page", () => {
  test.beforeEach(async ({ page }) => {
    await seedAuthState(page);
    await mockStakingAPIs(page);
  });

  test("shows page heading", async ({ page }) => {
    await page.goto("/pool");
    // Heading is a <span>, not a semantic heading element
    await expect(page.getByText("Arkai NFT Rewards Pools")).toBeVisible();
  });

  test("renders pool cards with pool names", async ({ page }) => {
    await page.goto("/pool");
    await expect(page.getByText("Whispering Woods")).toBeVisible();
    await expect(page.getByText("Crimson Caverns")).toBeVisible();
    await expect(page.getByText("Golden Fields")).toBeVisible();
  });

  test("joined pool shows Detail button", async ({ page }) => {
    await page.goto("/pool");
    // Golden Fields has isJoined: true
    const goldenFieldsCard = page.getByText("Golden Fields").locator("..").locator("..");
    await expect(goldenFieldsCard.getByRole("button", { name: /detail/i })).toBeVisible();
  });

  test("unavailable pool shows disabled Not Available button", async ({ page }) => {
    await page.goto("/pool");
    // Crimson Caverns has canJoin: false
    const crimsonCard = page.getByText("Crimson Caverns").locator("..").locator("..");
    const notAvailableBtn = crimsonCard.getByRole("button", { name: /not available/i });
    await expect(notAvailableBtn).toBeVisible();
    await expect(notAvailableBtn).toBeDisabled();
  });

  test("available pool shows Switch Pool button when another is already joined", async ({ page }) => {
    await page.goto("/pool");
    // Whispering Woods has canJoin: true, isJoined: false, but Golden Fields isJoined: true
    // So it should show "Switch Pool"
    const whisperingCard = page.getByText("Whispering Woods").locator("..").locator("..");
    await expect(
      whisperingCard.getByRole("button", { name: /switch pool/i })
    ).toBeVisible();
  });

  test("clicking join/switch opens AlertDialog confirmation", async ({ page }) => {
    await page.goto("/pool");
    const whisperingCard = page.getByText("Whispering Woods").locator("..").locator("..");
    const joinBtn = whisperingCard.getByRole("button", { name: /switch pool|join pool/i });
    await joinBtn.click();
    // AlertDialog should appear with a confirmation title
    await expect(
      page.getByText(/switch pool confirmation|join pool confirmation/i)
    ).toBeVisible();
  });

  test("confirming join navigates to my-pool page", async ({ page }) => {
    await page.goto("/pool");
    const whisperingCard = page.getByText("Whispering Woods").locator("..").locator("..");
    const joinBtn = whisperingCard.getByRole("button", { name: /switch pool|join pool/i });
    await joinBtn.click();
    // Wait for dialog to open
    await expect(page.getByText(/switch pool confirmation|join pool confirmation/i)).toBeVisible();
    // Confirm button is an icon-only button (Check icon) — second button in the dialog footer
    const dialogBtns = page.getByRole("alertdialog").getByRole("button");
    await dialogBtns.nth(1).click();
    await expect(page).toHaveURL(/\/pool\/my-pool/);
  });

  test("clicking Detail on joined pool navigates to my-pool", async ({ page }) => {
    await page.goto("/pool");
    const goldenFieldsCard = page.getByText("Golden Fields").locator("..").locator("..");
    await goldenFieldsCard.getByRole("button", { name: /detail/i }).click();
    await expect(page).toHaveURL(/\/pool\/my-pool/);
  });
});
