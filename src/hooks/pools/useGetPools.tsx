import axiosInstance from "@/integrations/axios";
import { useQuery } from "@tanstack/react-query";
import { endpoint } from "@/integrations/axios/endpoint";
import { useTokenManager } from "../authentication/useTokenManager";
import { AxiosError } from "axios";

export interface IPool {
  id: string;
  requiredNftCount: number;
  name: string;
  description: string;
  isActive: boolean;
  canJoin: true;
  isJoined: boolean;
  resourceUrl: string;
}

export const useGetStakingPools = () => {
  const { headerBuilder, accessToken, AuthenticationErrorHandler } =
    useTokenManager();
  const currentQueryKey = [endpoint.staking.getStakingPools, accessToken];
  return useQuery({
    queryKey: currentQueryKey,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<IPool[]>(
          endpoint.staking.getStakingPools,
          {
            headers: headerBuilder,
          }
        );
        return response.data;
      } catch (error) {
        AuthenticationErrorHandler(error as AxiosError);
        throw error;
      }
    },
  });
};
