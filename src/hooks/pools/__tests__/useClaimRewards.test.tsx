import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createWrapper, createTestQueryClient } from "@/test/utils";

// --- Hoisted mock fns ---
const { mockNavigate, mockAxiosPost, mockCustomToast } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockAxiosPost: vi.fn(),
  mockCustomToast: vi.fn(),
}));

vi.mock("@tanstack/react-router", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("@/integrations/axios", () => ({
  default: {
    get: vi.fn(),
    post: mockAxiosPost,
  },
}));

vi.mock("@/components/ui/customToast", () => ({
  customToast: (...args: unknown[]) => mockCustomToast(...args),
}));

// Import AFTER mocks
import { useClaimRewards } from "../useClaimRewards";

const ACCESS_KEY = "arkai_token_manager_access_token";

describe("useClaimRewards", () => {
  it("calls POST /staking/rewards/claim with the correct poolId", async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useClaimRewards({ poolId: "pool-1" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mockAxiosPost).toHaveBeenCalledWith(
      "/staking/rewards/claim",
      { poolId: "pool-1" },
      expect.objectContaining({ headers: undefined })
    );
  });

  it("passes Authorization header when access token is stored", async () => {
    sessionStorage.setItem(ACCESS_KEY, JSON.stringify("claim-token"));
    mockAxiosPost.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useClaimRewards({ poolId: "pool-2" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    expect(mockAxiosPost).toHaveBeenCalledWith(
      "/staking/rewards/claim",
      { poolId: "pool-2" },
      expect.objectContaining({
        headers: { Authorization: "Bearer claim-token" },
      })
    );
  });

  it("shows success toast on successful claim", async () => {
    mockAxiosPost.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useClaimRewards({ poolId: "pool-3" }), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => {
      expect(mockCustomToast).toHaveBeenCalledWith(
        "All rewards claimed successfully",
        "success"
      );
    });
  });

  it("invalidates rewards query on success", async () => {
    const queryClient = createTestQueryClient();
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");
    mockAxiosPost.mockResolvedValueOnce({ data: {} });

    const { result } = renderHook(() => useClaimRewards({ poolId: "pool-4" }), {
      wrapper: createWrapper(queryClient),
    });

    await act(async () => {
      await result.current.mutateAsync();
    });

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          queryKey: ["/staking/rewards/available"],
        })
      );
    });
  });

  it("calls AuthenticationErrorHandler on 401 → navigates to /", async () => {
    const axiosError = Object.assign(new Error("Unauthorized"), {
      isAxiosError: true,
      response: { status: 401 },
    });
    mockAxiosPost.mockRejectedValueOnce(axiosError);

    const { result } = renderHook(
      () => useClaimRewards({ poolId: "pool-fail" }),
      { wrapper: createWrapper() }
    );

    await act(async () => {
      try {
        await result.current.mutateAsync();
      } catch {
        // mutation re-throws - expected
      }
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });
  });
});
