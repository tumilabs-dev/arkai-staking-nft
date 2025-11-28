export const appConfig = {
  movement: {
    rpcUrl: import.meta.env.VITE_MAINNET_RPC as string,
    chainId: Number(import.meta.env.VITE_MAINNET_CHAINID) as number,
    indexerUrl: import.meta.env.VITE_MAINNET_INDEXER as string,
  },
  api: {
    url: import.meta.env.VITE_API_URL as string,
    assetsUrl: import.meta.env.VITE_ASSETS_BASE_URL as string,
  },
  nfts: {
    collectionAddress: import.meta.env.VITE_NFT_COLLECTION_ADDRESS as string,
  },
};
