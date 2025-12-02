import { customToast } from "@/components/ui/customToast";
import axiosInstance from "@/integrations/axios";
import { endpoint } from "@/integrations/axios/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTokenManager } from "../authentication/useTokenManager";

export const useClaimRewards = ({ poolId }: { poolId: string }) => {
  const { headerBuilder, AuthenticationErrorHandler } = useTokenManager();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const response = await axiosInstance.post(
        endpoint.staking.rewards.claimReward,
        {
          poolId,
        },
        {
          headers: headerBuilder,
        }
      );
      return response.data;
    },
    onError: (error) => {
      AuthenticationErrorHandler(error as AxiosError);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoint.staking.rewards.getAvailableRewards],
      });
      queryClient.invalidateQueries({
        queryKey: [endpoint.staking.rewards.getAvailableRewards],
      });

      customToast("All rewards claimed successfully", "success");
    },
  });
};
