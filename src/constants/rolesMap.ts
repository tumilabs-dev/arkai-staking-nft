export const rolesMap = {
  "3": "Tier 1",
  "6": "Tier 2",
  "9": "Tier 3",
  "12": "Tier 4",
  "15": "Tier 5",
};

export const rolesIndex = [3, 6, 9, 12, 15];

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
