import { IPoolReward } from "@/hooks/pools/useGetPoolRewards";
import { create } from "zustand";

export type IRewardVisibilityStore = {
  id: string;
  reward: IPoolReward["rewards"] | null;
  setReward: (
    reward: IPoolReward["rewards"] | null,
    id: string,
    position: { x: number; y: number } | null
  ) => void;
  clear: () => void;
  position: { x: number; y: number } | null;
};

export const useRewardVisibilityStore = create<IRewardVisibilityStore>(
  (set) => ({
    id: "",
    reward: null,
    setReward: (reward, id, position) => set({ reward, id, position }),
    clear: () => set({ reward: null, id: "" }),
    position: null,
  })
);
