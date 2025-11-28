import axiosInstance from "@/integrations/axios";
import { endpoint } from "@/integrations/axios/endpoint";
import { AxiosError } from "axios";
import { useTokenManager } from "../authentication/useTokenManager";
import { useQuery } from "@tanstack/react-query";
import { IPool } from "./useGetPools";

export const useGetCurrentPool = () => {
  const { headerBuilder, accessToken, AuthenticationErrorHandler } =
    useTokenManager();
  const currentQueryKey = [endpoint.staking.getCurrentPool, accessToken];
  const hookQuery = useQuery({
    queryKey: currentQueryKey,
    queryFn: async () => {
      try {
        const response = await axiosInstance.get<IPool>(
          endpoint.staking.getCurrentPool,
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

  return {
    ...hookQuery,
    queryKey: currentQueryKey,
  };
};
