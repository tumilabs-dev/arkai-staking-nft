import ScrollBg from "@/assets/objects/paper-scroll.png";
import PoolImage from "@/assets/pool/pool-1-image.png";
import { ArrowIcon } from "@/components/icons/arrow.icon";
import { RewardIcon } from "@/components/icons/reward.icon";
import InkButton from "@/components/ui/InkButton";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { useClaimRewards } from "@/hooks/pools/useClaimRewards";
import { useGetCurrentPool } from "@/hooks/pools/useGetCurrentPool";
import {
  ERewardType,
  useGetPoolRewards,
} from "@/hooks/pools/useGetPoolRewards";
import { useGSAP } from "@gsap/react";
import { useRouter } from "@tanstack/react-router";
import gsap from "gsap";
import { useRef } from "react";
import { useRewardVisibilityStore } from "../store/reward.store";
import { parseValueToDisplay } from "@/lib/parseValue";
import { cn } from "@/lib/utils";
import TreasureChestClosed from "@/assets/objects/treasure-close.png";
import TreasureChestOpen from "@/assets/objects/treasure-open.png";

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

  const totalWeeksHolded = poolReward?.weekHeld ?? 0;
  const totalWeeks = poolReward?.rewards?.at(-1)?.weekNumber ?? 0;
  const upcomingRewards =
    poolReward?.rewards
      ?.filter((reward) => reward.canClaim)
      ?.reduce((acc) => acc + 1, 0) ?? 0;

  const { reward, clear } = useRewardVisibilityStore();
  const isClaimable = reward?.every((reward) => reward.canClaim);

  const isClaimed =
    !isClaimable &&
    reward?.every((reward) => reward?.weekNumber <= totalWeeksHolded);

  const tresureChestRef = useRef<HTMLDivElement>(null);

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
      <div className="absolute top-32 left-0 flex flex-col items-center justify-center">
        <div className="relative el w-[200px] flex flex-col items-center justify-center mt-28">
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
        <div className="el w-[300px]">
          <SpiralPadPattern />
          <div className="bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Total Weeks Staked:</span>
              <span>
                {Math.min(totalWeeksHolded, totalWeeks)?.toLocaleString()} /{" "}
                {totalWeeks?.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Upcoming Rewards:</span>
              <span>
                {upcomingRewards}{" "}
                <RewardIcon className="text-accent inline mr-2" />
              </span>
            </div>
          </div>
          <SpiralPadPattern />
        </div>
      </div>

      {/* Rewards details */}
      <div
        className={cn(
          "el w-[300px] absolute top-0 right-0 flex flex-col items-center justify-center h-full transition-all duration-300",
          reward?.length ? "opacity-100 visible" : "opacity-0 invisible"
        )}
      >
        <div
          className="w-full h-auto aspect-510/322 flex flex-col items-center justify-between px-4 pt-6 pb-12 relative"
          style={{
            backgroundImage: `url(${ScrollBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          {reward?.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between text-lg "
            >
              <span className="mr-2">
                {reward.rewardType === ERewardType.TOKEN
                  ? parseValueToDisplay(reward.rewardValue)
                  : reward.rewardType === ERewardType.NFT
                  ? reward.rewardName
                  : reward.rewardType === ERewardType.ROLE
                  ? reward.rewardName
                  : reward.rewardValue.toLocaleString()}
              </span>
              <span className="text-primary-500 font-semibold">
                {reward.rewardType === ERewardType.TOKEN
                  ? "$" + reward.rewardName
                  : reward.rewardType === ERewardType.NFT
                  ? reward.rewardName
                  : reward.rewardType === ERewardType.ROLE
                  ? "Role"
                  : reward.rewardValue.toLocaleString()}
              </span>
            </div>
          ))}

          <div className="absolute top-0 -translate-y-1/2 translate-x-1/3 right-0 size-[30%]">
            <div className="w-full h-full" ref={tresureChestRef}>
              {isClaimable ? (
                <img src={TreasureChestOpen} alt="Treasure Chest Open" />
              ) : (
                <img
                  src={isClaimed ? TreasureChestOpen : TreasureChestClosed}
                  alt="Treasure Chest Closed"
                />
              )}
            </div>
          </div>

          <InkButton
            variant="icon-outlined"
            fillColor="#50352C"
            disabled={!isClaimable}
            className="p-3 text-xl text-primary-500 hover:text-white hover:brightness-150 transition-all duration-300"
            onClick={() => {
              claimRewards();
              clear();
            }}
          >
            {isClaimable ? "Claim" : isClaimed ? "Claimed" : "Upcoming"}
          </InkButton>
        </div>
      </div>

      <div className="el absolute bottom-24 left-0 w-full flex justify-center">
        <InkButton
          className="w-fit px-4 md:px-12 text-white text-xl hover:brightness-150 transition-all duration-300"
          fillColor="#50352C"
          onClick={() => {
            claimRewards();
            clear();
          }}
        >
          Claim all gifts
        </InkButton>
      </div>
    </>
  );
}
