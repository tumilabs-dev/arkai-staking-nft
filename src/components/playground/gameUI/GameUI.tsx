import ScrollBg from "@/assets/objects/paper-scroll.png";
import PoolImage from "@/assets/pool/pool-1-image.png";
import { ArrowIcon } from "@/components/icons/arrow.icon";
import InkButton from "@/components/ui/InkButton";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { useGetNFTBalance } from "@/hooks/nfts/useGetNFTBalance";
import { useClaimRewards } from "@/hooks/pools/useClaimRewards";
import { useGetCurrentPool } from "@/hooks/pools/useGetCurrentPool";
import { useGetPoolRewards } from "@/hooks/pools/useGetPoolRewards";
import { useGSAP } from "@gsap/react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import gsap from "gsap";
import { useRef } from "react";

export default function GameUI({ poolId }: { poolId: string }) {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const timeline = gsap.timeline();
      const elements = gsap.utils.toArray(".el");
      timeline.from(elements, {
        opacity: 0,
        scale: 1.3,
        duration: 1,
        stagger: 0.5,
        ease: "power2.inOut",
      });
    },
    {
      scope: containerRef,
    }
  );

  const { mutateAsync: claimRewards } = useClaimRewards({
    poolId,
  });

  const { data: currentPool } = useGetCurrentPool();

  const { data: poolReward } = useGetPoolRewards({
    poolId: currentPool?.poolId,
  });

  const { data: totalHolded } = useGetNFTBalance();

  const totalWeeksHolded = poolReward?.weekHeld ?? 0;
  const totalWeeks = poolReward?.rewards.at(-1)?.weekNumber ?? 0;
  const rewardClaimed =
    poolReward?.rewards.filter((reward) => reward.canClaim).length ?? 0;

  return (
    <>
      <div className="absolute top-0 left-0 w-full grid grid-cols-5 items-center mt-4 px-4">
        <InkButton
          variant="icon-outlined"
          className="p-4 z-10 w-fit"
          fillColor="#A4C3AF"
          onClick={() => {
            const isNavigable = router.history.canGoBack();
            if (isNavigable) {
              router.history.back({});
            } else {
              router.navigate({
                to: "/pool",
              });
            }
          }}
        >
          <ArrowIcon className="text-secondary-500 rotate-180" />
        </InkButton>
        <h1 className="inline-block text-4xl font-bold text-right md:text-center px-8 text-muted-foreground col-span-4 md:col-span-3">
          Your Staking Adventure Map
        </h1>
      </div>

      {/* Pool Image */}
      <div className="absolute top-32 left-0 el w-[200px] flex flex-col items-center justify-center mt-28">
        <img
          src={PoolImage}
          alt="Pool Image"
          className="w-[80%] object-contain absolute -top-[40%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
        />
        <img
          src={ScrollBg}
          alt="Scroll BG"
          className="w-full h-full object-contain z-10"
        />
        <span className="text-center text-xl max-w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 z-20">
          Whispering Woods
        </span>
      </div>

      {/* Staking informations */}
      <div className="el absolute top-32 right-0 w-[300px]">
        <SpiralPadPattern />
        <div className="bg-white p-4 space-y-2">
          <h3 className="text-lg text-center md:text-xl font-medium">
            Your Staking Overview
          </h3>
          <div className="flex items-center justify-between">
            <span>Total Weeks Holded:</span>
            <span>
              {totalWeeksHolded?.toLocaleString()} /{" "}
              {totalWeeks?.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span>Arkai NFTs Owned:</span>
            <span>{totalHolded?.toLocaleString()} NFTs</span>
          </div>

          <div className="flex items-center justify-between">
            <span>Rewards:</span>
            <span>
              {rewardClaimed?.toLocaleString()} /{" "}
              {poolReward?.rewards.length?.toLocaleString() ?? 0}
            </span>
          </div>
        </div>
        <SpiralPadPattern />
      </div>

      <div className="el absolute bottom-24 left-0 w-full flex justify-center">
        <InkButton
          className="w-fit px-4 md:px-12 text-white text-xl hover:brightness-150 transition-all duration-300"
          fillColor="#50352C"
          onClick={() => {
            claimRewards();
          }}
        >
          Claim all gifts
        </InkButton>
      </div>
    </>
  );
}
