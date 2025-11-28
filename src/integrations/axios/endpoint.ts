export const endpoint = {
  auth: {
    walletLogin: "/auth/wallet-login",
    verify: "/auth/verify",
    discordLogin: "/auth/login",
    refreshToken: "/auth/refresh",
  },
  staking: {
    getStakingPools: "/staking/pools",
    getCurrentPool: "/staking/pools/my-pool",
    joinPool: "/staking/pools/join",

    rewards: {
      getAvailableRewards: "/staking/rewards/available",
      claimReward: "/staking/rewards/claim",
    },
  },
};
