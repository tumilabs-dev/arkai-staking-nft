import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createWrapper, createTestQueryClient } from "@/test/utils";

// --- Hoisted mock fns ---
const { mockNavigate, mockAxiosPost, mockAxiosGet } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockAxiosPost: vi.fn(),
  mockAxiosGet: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/integrations/axios", () => ({
  default: {
    get: mockAxiosGet,
    post: mockAxiosPost,
  },
}));

// Import AFTER mocks
import { useJoinPool } from "../useJoinPool";

const ACCESS_KEY = "arkai_token_manager_access_token";

describe("useJoinPool", () => {
  it("calls POST /staking/pools/join with the correct poolId", async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useJoinPool(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("pool-abc");
    });

    expect(mockAxiosPost).toHaveBeenCalledWith(
      "/staking/pools/join",
      { poolId: "pool-abc" },
      expect.objectContaining({ headers: undefined })
    );
  });

  it("passes Authorization header when access token is stored", async () => {
    sessionStorage.setItem(ACCESS_KEY, JSON.stringify("join-access-token"));
    mockAxiosPost.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useJoinPool(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync("pool-xyz");
    });

    expect(mockAxiosPost).toHaveBeenCalledWith(
      "/staking/pools/join",
      { poolId: "pool-xyz" },
      expect.objectContaining({
        headers: { Authorization: "Bearer join-access-token" },
      })
    );
  });

  it("invalidates getStakingPools query on success", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    mockAxiosPost.mockResolvedValueOnce({ data: {} });
    // Prime a stale query so invalidation can target it
    mockAxiosGet.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useJoinPool(), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync("pool-1");
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["/staking/pools"],
        })
      );
    });
  });

  it("calls AuthenticationErrorHandler on axios error (401 → navigate to /)", async () => {
    const axiosError = Object.assign(new Error("Unauthorized"), {
      isAxiosError: true,
      response: { status: 401 },
    });
    mockAxiosPost.mockRejectedValueOnce(axiosError);

    const { result } = renderHook(() => useJoinPool(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      try {
        await result.current.mutateAsync("pool-fail");
      } catch {
        // mutation throws - expected
      }
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });
  });
});
