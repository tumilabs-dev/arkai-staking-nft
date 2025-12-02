import { useWallet } from "@razorlabs/razorkit";

import axiosInstance from "@/integrations/axios";
import convertUint8ToHexString from "@/lib/convertUint8ArrayToHex";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AxiosResponse } from "axios";
import { endpoint } from "@/integrations/axios/endpoint";
import { useTokenManager } from "./useTokenManager";
import { useNavigate } from "@tanstack/react-router";

interface WalletLogin {
  walletAddress: string;
  walletPublicKey: string;
  signature: string;
  message: string;
}

export interface WalletLoginResponse {
  linked: boolean;

  discordId: string | null;
  discordUsername: string;
  walletAddress: string;

  nftCount: number;
  roleTier: number;

  lastSyncedAt: string;

  accessToken: string;
  refreshToken: string;
}

export const useLoginWithWallet = () => {
  const navigate = useNavigate();
  const { connected, address, signMessage, account, disconnect } = useWallet();

  const { setTokenAfterLogin, clearToken } = useTokenManager();

  const [loginData, setLoginData] = useLocalStorage<WalletLoginResponse | null>(
    "arkai-wallet-login",
    null
  );

  const mutateHook = useMutation({
    mutationFn: async () => {
      if (!connected || !address) return;
      //   const nonce = await provider.getAccountTransactionsCount({
      //     accountAddress: address,
      //   });
      //   const encoder = new TextEncoder();

      setLoginData(null);
      const message = `Login with wallet at ${Date.now()}`;
      //   const messageBytes = encoder.encode(message);
      const signedMessage = await signMessage({
        message,
        nonce: Math.random().toString(36).substring(2, 15),
        application: true,
        chainId: true,
        address: true,
      });
      if (signedMessage.status !== "Approved") return;

      if (!account) return;

      const response = await axiosInstance.post<
        WalletLogin,
        AxiosResponse<WalletLoginResponse>
      >(endpoint.auth.walletLogin, {
        walletAddress: address,
        walletPublicKey: convertUint8ToHexString(
          Uint8Array.from(account.publicKey)
        ),
        signature: signedMessage.args.signature.toString(),
        message: signedMessage.args.fullMessage,
      });

      if (response.status !== 201) return;
      setTokenAfterLogin(response.data.accessToken, response.data.refreshToken);

      setLoginData(response.data);
      return response.data;
    },
  });

  const logout = () => {
    disconnect();
    setLoginData(null);
    clearToken();
    navigate({ to: "/" });
  };

  return { ...mutateHook, storageData: loginData, logout };
};
