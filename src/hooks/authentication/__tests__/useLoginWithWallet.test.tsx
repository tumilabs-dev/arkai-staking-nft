import { renderHook, act, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { createWrapper } from "@/test/utils";

// --- Hoisted mock fns ---
const { mockNavigate, mockAxiosPost, mockSignMessage, mockDisconnect } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockAxiosPost: vi.fn(),
  mockSignMessage: vi.fn(),
  mockDisconnect: vi.fn(),
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


vi.mock("@razorlabs/razorkit", () => ({
  useWallet: () => ({
    connected: true,
    address: "0xTestWalletAddress",
    signMessage: mockSignMessage,
    account: {
      publicKey: new Uint8Array([1, 2, 3, 4, 5]),
    },
    disconnect: mockDisconnect,
  }),
}));

// Import AFTER mocks
import { useLoginWithWallet } from "../useLoginWithWallet";

const WALLET_LOGIN_KEY = "arkai-wallet-login";
const REFRESH_KEY = "arkai_token_manager_refresh_token";
const ACCESS_KEY = "arkai_token_manager_access_token";

const mockSignedMessage = {
  status: "Approved",
  args: {
    signature: "sig-hex-string",
    fullMessage: "Login with wallet at 12345",
  },
};

const mockLoginResponse = {
  linked: true,
  discordId: "disc-123",
  discordUsername: "testUser#0001",
  walletAddress: "0xTestWalletAddress",
  nftCount: 3,
  roleTier: 1,
  lastSyncedAt: "2024-01-01T00:00:00Z",
  accessToken: "access-from-login",
  refreshToken: "refresh-from-login",
};

describe("useLoginWithWallet", () => {
  describe("mutate (wallet login flow)", () => {
    it("calls POST /auth/wallet-login with correct payload on Approved signature", async () => {
      mockSignMessage.mockResolvedValueOnce(mockSignedMessage);
      mockAxiosPost.mockResolvedValueOnce({
        status: 201,
        data: mockLoginResponse,
      });

      const { result } = renderHook(() => useLoginWithWallet(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync();
      });

      expect(mockAxiosPost).toHaveBeenCalledWith(
        "/auth/wallet-login",
        expect.objectContaining({
          walletAddress: "0xTestWalletAddress",
          signature: "sig-hex-string",
          message: "Login with wallet at 12345",
        })
      );
    });

    it("stores tokens and login data on 201 response", async () => {
      mockSignMessage.mockResolvedValueOnce(mockSignedMessage);
      mockAxiosPost.mockResolvedValueOnce({
        status: 201,
        data: mockLoginResponse,
      });

      const { result } = renderHook(() => useLoginWithWallet(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync();
      });

      await waitFor(() => {
        expect(result.current.storageData).toEqual(mockLoginResponse);
      });

      expect(JSON.parse(sessionStorage.getItem(ACCESS_KEY)!)).toBe(
        "access-from-login"
      );
      expect(JSON.parse(localStorage.getItem(REFRESH_KEY)!)).toBe(
        "refresh-from-login"
      );
    });

    it("does nothing if signMessage returns non-Approved status", async () => {
      mockSignMessage.mockResolvedValueOnce({
        status: "Rejected",
        args: {},
      });

      const { result } = renderHook(() => useLoginWithWallet(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync();
      });

      expect(mockAxiosPost).not.toHaveBeenCalled();
      expect(result.current.storageData).toBeNull();
    });

    it("does not store data if response status is not 201", async () => {
      mockSignMessage.mockResolvedValueOnce(mockSignedMessage);
      mockAxiosPost.mockResolvedValueOnce({
        status: 200,
        data: mockLoginResponse,
      });

      const { result } = renderHook(() => useLoginWithWallet(), {
        wrapper: createWrapper(),
      });

      await act(async () => {
        await result.current.mutateAsync();
      });

      expect(result.current.storageData).toBeNull();
    });
  });

  describe("logout", () => {
    it("calls disconnect, clears storage data, and navigates to /", async () => {
      localStorage.setItem(WALLET_LOGIN_KEY, JSON.stringify(mockLoginResponse));
      sessionStorage.setItem(ACCESS_KEY, JSON.stringify("access-tok"));
      localStorage.setItem(REFRESH_KEY, JSON.stringify("refresh-tok"));

      const { result } = renderHook(() => useLoginWithWallet(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.logout();
      });

      expect(mockDisconnect).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });

      await waitFor(() => {
        expect(result.current.storageData).toBeNull();
      });
    });
  });
});
