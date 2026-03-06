const POOL_TOTAL_REWARDS: Record<number, number> = {
  1: 3_000_000,
  2: 9_000_000,
  3: 18_000_000,
  4: 45_000_000,
  5: 75_000_000,
};

export function getPoolTotalReward(requiredNftCount: number): string {
  const total = POOL_TOTAL_REWARDS[requiredNftCount];
  if (total === undefined) return "—";
  if (total >= 1_000_000) return `${total / 1_000_000}M`;
  if (total >= 1_000) return `${total / 1_000}K`;
  return total.toLocaleString();
}
