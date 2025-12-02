import ScrollBg from "@/assets/objects/paper-scroll.png";
import PoolImage from "@/assets/pool/pool-1-image.png";
import InkButton from "@/components/ui/InkButton";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { useGetNFTBalance } from "@/hooks/nfts/useGetNFTBalance";
import { useClaimRewards } from "@/hooks/pools/useClaimRewards";
import { useGetCurrentPool } from "@/hooks/pools/useGetCurrentPool";
import { useGetPoolRewards } from "@/hooks/pools/useGetPoolRewards";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

export default function GameUI({ poolId }: { poolId: string }) {
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

  const { data: totalHolded, isLoading } = useGetNFTBalance();

  const totalWeeksHolded = poolReward?.weekHeld ?? 0;
  const totalWeeks = poolReward?.rewards.at(-1)?.weekNumber ?? 0;
  const rewardClaimed =
    poolReward?.rewards.filter((reward) => reward.canClaim).length ?? 0;

  return (
    <>
      <h1 className="absolute top-0 left-0 w-full el text-4xl font-bold text-center py-8 text-muted-foreground">
        Your Staking Adventure Map
      </h1>

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
      <div className="el absolute top-32 right-0 w-[350px]">
        <SpiralPadPattern />
        <div className="bg-white p-4 space-y-2">
          <h3 className="text-xl text-center md:text-2xl font-medium">
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
          className="w-1/2 text-white text-xl hover:brightness-150 transition-all duration-300"
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
