import { appConfig } from "@/constants/appConfig";
import { useProvider, useWallet } from "@razorlabs/razorkit";
import { useQuery } from "@tanstack/react-query";

export const useGetNFTBalance = () => {
  const { address } = useWallet();
  const provider = useProvider(
    appConfig.movement.rpcUrl,
    appConfig.movement.indexerUrl
  );

  return useQuery({
    queryKey: ["nft-balance", address],
    queryFn: async () => {
      if (!address) return 0;
      const balance = await provider.getAccountOwnedTokensFromCollectionAddress(
        {
          accountAddress: address,
          collectionAddress: appConfig.nfts.collectionAddress,
        }
      );
      return balance.length;
    },
    enabled: !!address,
  });
};
