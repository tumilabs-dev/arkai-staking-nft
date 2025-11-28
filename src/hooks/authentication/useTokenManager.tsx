import axiosInstance from "@/integrations/axios";
import { endpoint } from "@/integrations/axios/endpoint";
import { useLocalStorage, useSessionStorage } from "@uidotdev/usehooks";
import { AxiosError, AxiosRequestHeaders } from "axios";
import { useNavigate } from "@tanstack/react-router";

const TOKEN_MANAGER_KEY_PREFIX = "arkai_token_manager";
const REFRESH_TOKEN_KEY = `${TOKEN_MANAGER_KEY_PREFIX}_refresh_token`;
const ACCESS_TOKEN_KEY = `${TOKEN_MANAGER_KEY_PREFIX}_access_token`;

export const useTokenManager = () => {
  const [refreshToken, setRefreshToken] = useLocalStorage<string | null>(
    REFRESH_TOKEN_KEY,
    null
  );
  const [accessToken, setAccessToken] = useSessionStorage<string | null>(
    ACCESS_TOKEN_KEY,
    null
  );
  const navigate = useNavigate();

  const setTokenAfterLogin = (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const clearToken = () => {
    setAccessToken(null);
    setRefreshToken(null);
  };

  const refreshNewToken = async () => {
    setAccessToken(null);

    if (!refreshToken) {
      navigate({ to: "/" });
      return;
    }

    try {
      const response = await axiosInstance.post<{
        accessToken: string;
        refreshToken: string;
      }>(endpoint.auth.refreshToken, {
        refreshToken,
      });
      setTokenAfterLogin(response.data.accessToken, response.data.refreshToken);
    } catch (error) {
      clearToken();
      navigate({ to: "/" });
      return;
    }
  };

  const AuthenticationErrorHandler = (error: AxiosError) => {
    if (error.response?.status === 401 && !accessToken && !refreshToken) {
      navigate({ to: "/" });
      return;
    }
    if (error.response?.status === 401) {
      refreshNewToken();
      return;
    }
  };

  const headerBuilder = accessToken
    ? ({ Authorization: `Bearer ${accessToken}` } as AxiosRequestHeaders)
    : undefined;

  return {
    accessToken,
    refreshToken,
    setTokenAfterLogin,
    clearToken,
    headerBuilder,
    AuthenticationErrorHandler,
  };
};
