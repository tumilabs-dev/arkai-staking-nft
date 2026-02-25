import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createWrapper } from "@/test/utils";

// --- Hoisted mock fns ---
const { mockNavigate, mockAxiosGet } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockAxiosGet: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/integrations/axios", () => ({
  default: {
    get: mockAxiosGet,
    post: vi.fn(),
  },
}));

// Import AFTER mocks
import { useGetPoolRewards, ERewardType, IPoolReward } from "../useGetPoolRewards";

const ACCESS_KEY = "arkai_token_manager_access_token";

const mockRewardData: IPoolReward = {
  poolId: "pool-1",
  poolName: "Whispering Woods",
  requiredWeeks: 4,
  rewards: [
    {
      id: "reward-1",
      poolId: "pool-1",
      weekNumber: 1,
      rewardType: ERewardType.TOKEN,
      rewardValue: 100,
      rewardName: "MOVE Token",
      canClaim: true,
    },
  ],
  weekHeld: 2,
  startedAt: new Date("2024-01-01"),
};

describe("useGetPoolRewards", () => {
  describe("when no poolId is provided", () => {
    it("query is disabled (does not call axios)", () => {
      const { result } = renderHook(() => useGetPoolRewards({}), {
        wrapper: createWrapper(),
      });

      // disabled query → fetchStatus is idle, status is pending
      expect(result.current.fetchStatus).toBe("idle");
      expect(mockAxiosGet).not.toHaveBeenCalled();
    });

    it("queryKey includes endpoint and accessToken but undefined poolId", () => {
      const { result } = renderHook(() => useGetPoolRewards({}), {
        wrapper: createWrapper(),
      });

      expect(result.current.queryKey).toContain(
        "/staking/rewards/available"
      );
      expect(result.current.queryKey).toContain(undefined);
    });
  });

  describe("when poolId is provided", () => {
    it("fetches reward data with the correct poolId param", async () => {
      mockAxiosGet.mockResolvedValueOnce({ data: mockRewardData });

      const { result } = renderHook(
        () => useGetPoolRewards({ poolId: "pool-1" }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAxiosGet).toHaveBeenCalledWith(
        "/staking/rewards/available",
        expect.objectContaining({
          params: { poolId: "pool-1" },
        })
      );
      expect(result.current.data).toEqual(mockRewardData);
    });

    it("passes Authorization header when access token is stored", async () => {
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("rewards-token"));
      mockAxiosGet.mockResolvedValueOnce({ data: mockRewardData });

      const { result } = renderHook(
        () => useGetPoolRewards({ poolId: "pool-2" }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(mockAxiosGet).toHaveBeenCalledWith(
        "/staking/rewards/available",
        expect.objectContaining({
          headers: { Authorization: "Bearer rewards-token" },
        })
      );
    });

    it("queryKey includes endpoint, accessToken, and poolId", () => {
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("tok-123"));
      mockAxiosGet.mockResolvedValueOnce({ data: mockRewardData });

      const { result } = renderHook(
        () => useGetPoolRewards({ poolId: "pool-key-test" }),
        { wrapper: createWrapper() }
      );

      expect(result.current.queryKey).toContain("/staking/rewards/available");
      expect(result.current.queryKey).toContain("tok-123");
      expect(result.current.queryKey).toContain("pool-key-test");
    });

    it("calls AuthenticationErrorHandler on 401 error → navigates to /", async () => {
      const axiosError = Object.assign(new Error("Unauthorized"), {
        isAxiosError: true,
        response: { status: 401 },
      });
      mockAxiosGet.mockRejectedValueOnce(axiosError);

      const { result } = renderHook(
        () => useGetPoolRewards({ poolId: "pool-fail" }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isError).toBe(true));
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });
  });
});
