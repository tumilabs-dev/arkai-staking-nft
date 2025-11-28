import { appConfig } from "@/constants/appConfig";
import axiosInstance from "@/integrations/axios";
import { endpoint } from "@/integrations/axios/endpoint";
import { useWallet } from "@razorlabs/razorkit";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearch } from "@tanstack/react-router";
import { useLocalStorage } from "@uidotdev/usehooks";
import { useEffect } from "react";

interface DiscordUser {
  id: string;
  global_name: string;
  username: string;
}

export const useConnectDiscord = () => {
  const { connected, address } = useWallet();
  const [tokenRedirect, setTokenRedirect] = useLocalStorage<string | null>(
    "arkai_token_redirect",
    null
  );
  const queryKey = ["discordId", tokenRedirect];
  const queryClient = useQueryClient();

  //   Connect Discord function
  const loginDiscord = async () => {
    if (!connected || !address) return;
    window.location.href = appConfig.api.url + endpoint.auth.discordLogin;
  };

  //   Search Param handle after return
  const { token } = useSearch({
    from: "/_onboarding/connect",
  });
  //    After redirect and get return param tokenId, check if it is valid
  useEffect(() => {
    if (token) {
      setTokenRedirect(token);
    } else {
      setTokenRedirect(null);
    }
  }, [token]);

  //   Get discordId through tokenRedirect
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      if (!tokenRedirect) return null;
      const response = await axiosInstance.get<DiscordUser>(
        `https://discord.com/api/users/@me`,
        {
          headers: { Authorization: `Bearer ${tokenRedirect}` },
        }
      );
      return response.data as DiscordUser;
    },

    enabled: !!tokenRedirect,
  });

  // Handle disconnect discord
  const disconnectDiscord = async () => {
    if (!connected || !address) return;
    setTokenRedirect(null);
    queryClient.invalidateQueries({ queryKey });
    window.location.search = "";
  };

  return { loginDiscord, discord: data, isLoading, disconnectDiscord };
};
