import { resolveAsset } from "@/lib/resolveAsset";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/integrations/axios";

export interface MapDefineElement {
  asset: string;
  x: number;
  y: number;
  index: number;
  initAnimation: string | null;
  idleAnimation: string | null;
  isInteractable: boolean | null;
  scale: number;
}

export function useGetMap(poolId: string = "default") {
  const queryKey = [resolveAsset(`/map-defines/${poolId}.json`)];
  const hookQuery = useQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const response = await axiosInstance.get<MapDefineElement[]>(
        resolveAsset(`/map-defines/${poolId}.json`)
      );
      return response.data;
    },
  });

  return {
    ...hookQuery,
    queryKey,
  };
}
