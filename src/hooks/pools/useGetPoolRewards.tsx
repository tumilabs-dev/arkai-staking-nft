import axiosInstance from "@/integrations/axios";
import { useQuery } from "@tanstack/react-query";
import { endpoint } from "@/integrations/axios/endpoint";
import { useTokenManager } from "../authentication/useTokenManager";
import { AxiosError } from "axios";

export enum ERewardType {
  TOKEN = "TOKEN",
  NFT = "NFT",
  ROLE = "ROLE",
  CUSTOM = "CUSTOM",
}
export interface IPoolReward {
  poolId: string;
  poolName: string;
  requiredWeeks: number;
  rewards: {
    id: string;
    poolId: string;
    weekNumber: number;
    rewardType: ERewardType;
    rewardValue: number;
    canClaim: boolean;
  }[];
  weekHeld: number;
}

export const useGetPoolRewards = ({ poolId }: { poolId?: string }) => {
  const { headerBuilder, accessToken, AuthenticationErrorHandler } =
    useTokenManager();
  const currentQueryKey = [
    endpoint.staking.rewards.getAvailableRewards,
    accessToken,
    poolId,
  ];
  const hookQuery = useQuery({
    queryKey: currentQueryKey,
    queryFn: async () => {
      if (!poolId) {
        return {
          rewards: [],
          weekHeld: 0,
        };
      }
      try {
        const response = await axiosInstance.get<IPoolReward>(
          endpoint.staking.rewards.getAvailableRewards,
          {
            headers: headerBuilder,
            params: {
              poolId,
            },
          }
        );
        return response.data;
      } catch (error) {
        AuthenticationErrorHandler(error as AxiosError);
        throw error;
      }
    },
    enabled: !!poolId,
  });

  return {
    ...hookQuery,
    queryKey: currentQueryKey,
  };
};
