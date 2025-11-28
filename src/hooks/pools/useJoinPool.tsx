import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenManager } from "../authentication/useTokenManager";
import axiosInstance from "@/integrations/axios";
import { endpoint } from "@/integrations/axios/endpoint";
import { AxiosError } from "axios";

export const useJoinPool = () => {
  const { headerBuilder, AuthenticationErrorHandler } = useTokenManager();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (poolId: string) => {
      const response = await axiosInstance.post(
        endpoint.staking.joinPool,
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
        queryKey: [endpoint.staking.getStakingPools],
      });
    },
  });
};
