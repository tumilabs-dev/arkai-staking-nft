import { customToast } from "@/components/ui/customToast";
import axiosInstance from "@/integrations/axios";
import { endpoint } from "@/integrations/axios/endpoint";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useTokenManager } from "../authentication/useTokenManager";

export const useClaimRewards = ({
  poolId,
  onSuccess,
}: {
  poolId: string;
  onSuccess?: () => void;
}) => {
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
      const axiosError = error as AxiosError<{ message?: string }>;
      if (axiosError.response?.status === 401) {
        AuthenticationErrorHandler(axiosError);
      } else {
        customToast(
          axiosError.response?.data?.message ??
            axiosError.message ??
            "Claim failed. Please try again.",
          "error"
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [endpoint.staking.rewards.getAvailableRewards],
      });
      queryClient.invalidateQueries({
        queryKey: [endpoint.staking.rewards.getAvailableRewards],
      });

      customToast("Claim request submitted. Payout processing...", "success");
      onSuccess?.();
    },
  });
};
