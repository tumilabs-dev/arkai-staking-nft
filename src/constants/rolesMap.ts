export const rolesMap = {
  "1": "Tier 1",
  "2": "Tier 2",
  "3": "Tier 3",
  "4": "Tier 4",
  "5": "Tier 5",
};

export const rolesIndex = [1, 2, 3, 4, 5];

export const getRoleDueToNFTCount = (nftCount: number) => {
  if (nftCount < 3) return "No Role Required";
  for (const index of rolesIndex) {
    if (nftCount >= rolesIndex[index] && nftCount < rolesIndex[index + 1]) {
      return rolesMap[index.toString() as keyof typeof rolesMap];
    }
  }

  return rolesMap[rolesIndex.at(-1)?.toString() as keyof typeof rolesMap];
};

export const getAvailableRoles = (nftCount: number) => {
  return rolesIndex
    .filter((index) => nftCount >= index)
    .map((index) => rolesMap[index.toString() as keyof typeof rolesMap]);
};
