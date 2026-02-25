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
import { useGetStakingPools, IPool } from "../useGetPools";

const ACCESS_KEY = "arkai_token_manager_access_token";

const mockPools: IPool[] = [
  {
    id: "pool-1",
    requiredNftCount: 3,
    name: "Whispering Woods",
    description: "For Ranger Guild Members",
    isActive: true,
    canJoin: true,
    isJoined: false,
    resourceUrl: "https://example.com/pool1",
  },
  {
    id: "pool-2",
    requiredNftCount: 6,
    name: "Crimson Caverns",
    description: "For Knight Order Initiates",
    isActive: true,
    canJoin: true,
    isJoined: true,
    resourceUrl: "https://example.com/pool2",
  },
];

describe("useGetStakingPools", () => {
  it("fetches and returns pool list on success", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockPools });

    const { result } = renderHook(() => useGetStakingPools(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockPools);
  });

  it("passes Authorization header when access token is stored", async () => {
    sessionStorage.setItem(ACCESS_KEY, JSON.stringify("my-access-token"));
    mockAxiosGet.mockResolvedValueOnce({ data: mockPools });

    const { result } = renderHook(() => useGetStakingPools(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith(
      "/staking/pools",
      expect.objectContaining({
        headers: { Authorization: "Bearer my-access-token" },
      })
    );
  });

  it("passes no Authorization header when no access token", async () => {
    mockAxiosGet.mockResolvedValueOnce({ data: mockPools });

    const { result } = renderHook(() => useGetStakingPools(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith(
      "/staking/pools",
      expect.objectContaining({
        headers: undefined,
      })
    );
  });

  it("uses accessToken as part of query identity (refetches when token changes)", async () => {
    // With token: fetches with auth header
    sessionStorage.setItem(ACCESS_KEY, JSON.stringify("key-token"));
    mockAxiosGet.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useGetStakingPools(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockAxiosGet).toHaveBeenCalledWith(
      "/staking/pools",
      expect.objectContaining({
        headers: { Authorization: "Bearer key-token" },
      })
    );
  });

  it("calls AuthenticationErrorHandler on axios error", async () => {
    const axiosError = Object.assign(new Error("Forbidden"), {
      isAxiosError: true,
      response: { status: 401 },
    });
    mockAxiosGet.mockRejectedValueOnce(axiosError);

    const { result } = renderHook(() => useGetStakingPools(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    // 401 with no tokens → should navigate to /
    expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
  });
});
