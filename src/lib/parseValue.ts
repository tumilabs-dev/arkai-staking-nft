type RewardValueLike = number | string | { amount?: number | string };

export function parseValueToDisplay(value: RewardValueLike) {
  if (typeof value === "object" && value !== null) {
    const amount = value.amount;
    return Number(amount ?? 0);
  }

  return Number(value ?? 0);
}
