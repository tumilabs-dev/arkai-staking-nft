import { useWallet } from "@razorlabs/razorkit";
import { useConnectDiscord } from "./useConnectDiscord";

import axiosInstance from "@/integrations/axios";
import convertUint8ToHexString from "@/lib/convertUint8ArrayToHex";
import { useMutation } from "@tanstack/react-query";
import { useLocalStorage } from "@uidotdev/usehooks";
import { AxiosResponse, isAxiosError } from "axios";
import { WalletLoginResponse } from "./useLoginWithWallet";
import { endpoint } from "@/integrations/axios/endpoint";
import { toast } from "sonner";
import { customToast } from "@/components/ui/customToast";

interface ConnectWalletDto {
  discordId: string;

  walletAddress: string;

  walletPublicKey: string;

  signature: string;

  message: string;

  nonce?: string;
}

interface VerifyWalletDto {
  discordId: string;
  discordUsername: string;
  walletAddress: string;
  nftCount: number;
  roleTier: number;
  roleId: string | null;
  tokens: string[];
  accessToken: string;
  refreshToken: string;
}

export const useSignAndBindDiscord = () => {
  const { connected, address, signMessage, account } = useWallet();
  const { discord } = useConnectDiscord();

  const [_, setLoginData] = useLocalStorage<WalletLoginResponse | null>(
    "arkai-wallet-login",
    null
  );

  const {
    mutateAsync: signAndBindDiscord,
    data,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      if (!address || !discord || !connected || !account) return;
      const nonce = Math.random().toString(36).substring(2, 15);
      const message = `Verify wallet for Discord ID: ${
        discord?.id
      } at ${Date.now()}`;

      //   Wait to sign
      const signedMessage = await signMessage({
        message,
        application: true,
        chainId: true,
        address: true,
        nonce: nonce.toString(),
      });

      if (signedMessage.status !== "Approved") return;
      if (!signedMessage) return;
      const response = await axiosInstance.post<
        ConnectWalletDto,
        AxiosResponse<VerifyWalletDto>
      >(endpoint.auth.verify, {
        walletAddress: address,
        walletPublicKey: convertUint8ToHexString(
          Uint8Array.from(account.publicKey)
        ),
        signature: signedMessage.args.signature.toString(),
        message: signedMessage.args.fullMessage,
        nonce: nonce.toString(),
        discordId: discord.id,
      });
      if (response.status !== 200) return;
      setLoginData({
        linked: true,
        discordId: discord.id,
        discordUsername: discord.username,
        walletAddress: address,
        nftCount: response.data.nftCount,
        roleTier: response.data.roleTier,
        lastSyncedAt: new Date().toISOString(),
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
      });
      return response.data;
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        customToast(error.response?.data.message, "error");
        return;
      }
      toast.error("An unknown error occurred");
    },
  });

  return { signAndBindDiscord, data, isPending };
};
