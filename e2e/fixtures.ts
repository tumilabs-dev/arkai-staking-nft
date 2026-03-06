import { test as base, type Page } from "@playwright/test";

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const mockPools = [
  {
    id: "pool-1",
    requiredNftCount: 1,
    name: "Whispering Woods",
    description: "A peaceful forest pool for beginners",
    isActive: true,
    canJoin: true,
    isJoined: false,
    resourceUrl: "/pool/pool-1.png",
  },
  {
    id: "pool-2",
    requiredNftCount: 2,
    name: "Crimson Caverns",
    description: "Deep underground pool requiring 2 NFTs",
    isActive: true,
    canJoin: false,
    isJoined: false,
    resourceUrl: "/pool/pool-2.png",
  },
  {
    id: "pool-3",
    requiredNftCount: 3,
    name: "Golden Fields",
    description: "A radiant pool for advanced stakers",
    isActive: true,
    canJoin: true,
    isJoined: true,
    resourceUrl: "/pool/pool-3.png",
  },
];

export const mockCurrentPool = {
  id: "cp-1",
  poolId: "pool-1",
  isActive: true,
  pool: {
    id: "pool-1",
    requiredNftCount: 1,
    name: "Whispering Woods",
    description: "A peaceful forest pool for beginners",
    isActive: true,
    canJoin: true,
    isJoined: true,
    resourceUrl: "/pool/pool-1.png",
  },
};

export const mockPoolRewards = {
  poolId: "pool-1",
  poolName: "Whispering Woods",
  requiredWeeks: 6,
  rewards: [
    {
      id: "r1",
      poolId: "pool-1",
      weekNumber: 1,
      rewardType: "TOKEN",
      rewardValue: 100,
      rewardName: "MOVERZ",
      canClaim: false,
    },
    {
      id: "r2",
      poolId: "pool-1",
      weekNumber: 2,
      rewardType: "TOKEN",
      rewardValue: 150,
      rewardName: "MOVERZ",
      canClaim: false,
    },
    {
      id: "r3",
      poolId: "pool-1",
      weekNumber: 3,
      rewardType: "TOKEN",
      rewardValue: 200,
      rewardName: "MOVERZ",
      canClaim: false,
    },
    {
      id: "r4",
      poolId: "pool-1",
      weekNumber: 4,
      rewardType: "TOKEN",
      rewardValue: 250,
      rewardName: "MOVERZ",
      canClaim: false,
    },
    {
      id: "r5",
      poolId: "pool-1",
      weekNumber: 5,
      rewardType: "TOKEN",
      rewardValue: 300,
      rewardName: "MOVERZ",
      canClaim: false,
    },
    {
      id: "r6",
      poolId: "pool-1",
      weekNumber: 6,
      rewardType: "TOKEN",
      rewardValue: 500,
      rewardName: "MOVERZ",
      canClaim: false,
    },
  ],
  weekHeld: 2,
  startedAt: "2024-01-01T00:00:00.000Z",
};

// ─── Auth State Seeder ────────────────────────────────────────────────────────

export async function seedAuthState(page: Page) {
  await page.addInitScript(() => {
    sessionStorage.setItem(
      "arkai_token_manager_access_token",
      JSON.stringify("mock-access-token")
    );
    localStorage.setItem(
      "arkai_token_manager_refresh_token",
      JSON.stringify("mock-refresh-token")
    );
  });
}

// ─── API Route Mocker ─────────────────────────────────────────────────────────

export interface MockAPIOptions {
  /** If true, /staking/pools/my-pool returns 404 */
  noCurrentPool?: boolean;
}

export async function mockStakingAPIs(page: Page, opts?: MockAPIOptions) {
  // Auth refresh — always intercept
  await page.route("**/auth/refresh", async (route) => {
    await route.fulfill({ json: { accessToken: "new-mock-token" } });
  });

  // Single handler for all staking endpoints — order matters: specific before general
  await page.route("**/staking/**", async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes("/staking/pools/my-pool")) {
      if (opts?.noCurrentPool) {
        return route.fulfill({
          status: 404,
          contentType: "application/json",
          body: JSON.stringify({ message: "Not found" }),
        });
      }
      return route.fulfill({ json: mockCurrentPool });
    }

    if (url.includes("/staking/pools/join") && method === "POST") {
      return route.fulfill({ json: { success: true } });
    }

    if (url.includes("/staking/pools")) {
      return route.fulfill({ json: mockPools });
    }

    if (url.includes("/staking/rewards")) {
      return route.fulfill({ json: mockPoolRewards });
    }

    return route.continue();
  });
}

// ─── Re-exports ───────────────────────────────────────────────────────────────

export { expect } from "@playwright/test";
export { base as test };
