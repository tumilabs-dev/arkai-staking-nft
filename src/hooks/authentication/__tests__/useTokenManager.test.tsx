import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createWrapper } from "@/test/utils";

// --- Hoisted mock fns ---
const { mockNavigate, mockAxiosPost } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockAxiosPost: vi.fn(),
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

// Import AFTER mocks
import { useTokenManager } from "../useTokenManager";

const REFRESH_KEY = "arkai_token_manager_refresh_token";
const ACCESS_KEY = "arkai_token_manager_access_token";

describe("useTokenManager", () => {
  describe("initial state", () => {
    it("returns null tokens when storage is empty", () => {
      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });
      expect(result.current.accessToken).toBeNull();
      expect(result.current.refreshToken).toBeNull();
    });

    it("headerBuilder is undefined when no access token", () => {
      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });
      expect(result.current.headerBuilder).toBeUndefined();
    });

    it("reads tokens from storage on init", () => {
      localStorage.setItem(REFRESH_KEY, JSON.stringify("my-refresh"));
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("my-access"));

      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });
      expect(result.current.refreshToken).toBe("my-refresh");
      expect(result.current.accessToken).toBe("my-access");
    });
  });

  describe("setTokenAfterLogin", () => {
    it("stores both tokens", async () => {
      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTokenAfterLogin("access-123", "refresh-456");
      });

      await waitFor(() => {
        expect(result.current.accessToken).toBe("access-123");
        expect(result.current.refreshToken).toBe("refresh-456");
      });
    });
  });

  describe("headerBuilder", () => {
    it("returns Authorization header when access token is set", async () => {
      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.setTokenAfterLogin("my-access-token", "my-refresh");
      });

      await waitFor(() => {
        expect(result.current.headerBuilder).toEqual({
          Authorization: "Bearer my-access-token",
        });
      });
    });
  });

  describe("clearToken", () => {
    it("nullifies both tokens", async () => {
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("some-access"));
      localStorage.setItem(REFRESH_KEY, JSON.stringify("some-refresh"));

      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.clearToken();
      });

      await waitFor(() => {
        expect(result.current.accessToken).toBeNull();
        expect(result.current.refreshToken).toBeNull();
      });
    });
  });

  describe("refreshNewToken (triggered via AuthenticationErrorHandler on 401 with tokens)", () => {
    it("navigates to / when triggered with no refresh token in storage", async () => {
      // No tokens → 401 handler should navigate directly to /
      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      const error = {
        response: { status: 401 },
        isAxiosError: true,
      } as any;

      act(() => {
        result.current.AuthenticationErrorHandler(error);
      });

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });

    it("calls POST /auth/refresh and updates tokens when refresh token exists", async () => {
      localStorage.setItem(REFRESH_KEY, JSON.stringify("valid-refresh"));
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("old-access"));

      mockAxiosPost.mockResolvedValueOnce({
        data: { accessToken: "new-access", refreshToken: "new-refresh" },
      });

      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      const error = {
        response: { status: 401 },
        isAxiosError: true,
      } as any;

      act(() => {
        result.current.AuthenticationErrorHandler(error);
      });

      await waitFor(() => {
        expect(mockAxiosPost).toHaveBeenCalledWith("/auth/refresh", {
          refreshToken: "valid-refresh",
        });
      });

      await waitFor(() => {
        expect(result.current.accessToken).toBe("new-access");
        expect(result.current.refreshToken).toBe("new-refresh");
      });
    });

    it("clears tokens and navigates to / when refresh API call fails", async () => {
      localStorage.setItem(REFRESH_KEY, JSON.stringify("expired-refresh"));
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("old-access"));

      mockAxiosPost.mockRejectedValueOnce(new Error("Unauthorized"));

      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      const error = {
        response: { status: 401 },
        isAxiosError: true,
      } as any;

      act(() => {
        result.current.AuthenticationErrorHandler(error);
      });

      await waitFor(() => {
        expect(result.current.accessToken).toBeNull();
        expect(result.current.refreshToken).toBeNull();
      });
      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
      });
    });
  });

  describe("AuthenticationErrorHandler", () => {
    it("navigates to / on 401 when no tokens present", async () => {
      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      const error = {
        response: { status: 401 },
        isAxiosError: true,
      } as any;

      act(() => {
        result.current.AuthenticationErrorHandler(error);
      });

      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });

    it("calls refreshNewToken on 401 when tokens exist", async () => {
      localStorage.setItem(REFRESH_KEY, JSON.stringify("refresh-tok"));
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("access-tok"));

      mockAxiosPost.mockResolvedValueOnce({
        data: { accessToken: "new-access", refreshToken: "new-refresh" },
      });

      const { result } = renderHook(() => useTokenManager(), {
        wrapper: createWrapper(),
      });

      const error = {
        response: { status: 401 },
        isAxiosError: true,
      } as any;

      act(() => {
        result.current.AuthenticationErrorHandler(error);
      });

      await waitFor(() => {
        expect(mockAxiosPost).toHaveBeenCalledWith("/auth/refresh", {
          refreshToken: "refresh-tok",
        });
      });
    });
  });
});
