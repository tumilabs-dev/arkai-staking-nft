import ScrollBg from "@/assets/objects/paper-scroll.png";
import TreasureChestClosed from "@/assets/objects/treasure-close.png";
import TreasureChestOpen from "@/assets/objects/treasure-open.png";
import { resolveAsset } from "@/lib/resolveAsset";
import { ArrowIcon } from "@/components/icons/arrow.icon";
import InkButton from "@/components/ui/InkButton";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { useClaimRewards } from "@/hooks/pools/useClaimRewards";
import { useGetCurrentPool } from "@/hooks/pools/useGetCurrentPool";
import {
  ERewardType,
  useGetPoolRewards,
} from "@/hooks/pools/useGetPoolRewards";
import { parseValueToDisplay } from "@/lib/parseValue";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import { useRouter } from "@tanstack/react-router";
import { addDays, format, formatDistanceToNow } from "date-fns";
import gsap from "gsap";
import { useMemo, useRef } from "react";
import { useRewardVisibilityStore } from "../store/reward.store";

export default function GameUI({ poolId }: { poolId: string }) {
  const PHASE_DAYS = 5;
  const TOTAL_PHASES = 6;

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

  const { reward, clear } = useRewardVisibilityStore();

  const { mutateAsync: claimRewards } = useClaimRewards({
    poolId,
    onSuccess: clear,
  });

  const { data: currentPool } = useGetCurrentPool();

  const { data: poolReward } = useGetPoolRewards({
    poolId: currentPool?.poolId,
  });

  const totalPhasesHeld = Math.min(poolReward?.weekHeld ?? 0, TOTAL_PHASES);
  const totalPhases = TOTAL_PHASES;

  const isClaimable = reward?.every((reward) => reward.canClaim);

  const phaseTokenTotal = useMemo(() => {
    if (!reward?.length) {
      return 0;
    }

    return reward
      .filter((item) => item.rewardType === ERewardType.TOKEN)
      .reduce((total, item) => total + Number(item.rewardValue ?? 0), 0);
  }, [reward]);

  const phaseRoleRewards = useMemo(() => {
    if (!reward?.length) {
      return [];
    }

    return reward.filter((item) => item.rewardType === ERewardType.ROLE);
  }, [reward]);

  const phaseOtherRewards = useMemo(() => {
    if (!reward?.length) {
      return [];
    }

    return reward.filter(
      (item) =>
        item.rewardType !== ERewardType.TOKEN && item.rewardType !== ERewardType.ROLE
    );
  }, [reward]);

  const isClaimed =
    !isClaimable &&
    reward?.every((reward) => reward?.weekNumber <= totalPhasesHeld);

  const safeCurrentPoint = useMemo(() => {
    if (!poolReward?.rewards?.length) return 0;
    if ((poolReward?.weekHeld ?? 0) === 0) return 0;
    for (let i = 0; i < poolReward?.rewards?.length; i++) {
      if (poolReward?.rewards?.[i]?.weekNumber === poolReward?.weekHeld)
        return i;
      if (poolReward?.rewards?.[i]?.weekNumber < (poolReward?.weekHeld ?? 0))
        continue;
    }
    return poolReward?.rewards?.length - 1;
  }, [poolReward?.rewards, poolReward?.weekHeld]);

  const remainingTime = useMemo(() => {
    if (!poolReward?.startedAt || safeCurrentPoint === -1) {
      return "End reached!";
    }

    if (totalPhasesHeld >= TOTAL_PHASES) {
      return "End reached!";
    }

    const nextTime = addDays(
      new Date(poolReward.startedAt),
      (totalPhasesHeld + 1) * PHASE_DAYS
    );

    return formatDistanceToNow(nextTime);
  }, [poolReward?.startedAt, safeCurrentPoint, totalPhasesHeld]);

  const tresureChestRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div className="absolute top-0 left-0 w-full grid grid-cols-5 items-center mt-4 px-4">
        <InkButton
          variant="icon-outlined"
          className="p-4 z-10 w-fit"
          fillColor="#ffffff"
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
          <ArrowIcon className="text-white rotate-180" />
        </InkButton>
        <h1 className="inline-block text-4xl font-bold text-right md:text-center px-8 text-muted-foreground col-span-4 md:col-span-3 stroked-text">
          Your Staking Adventure Map
        </h1>
      </div>

      {/* Pool Image */}
      <div className="absolute top-32 left-0 flex flex-col items-center justify-center">
        <div className="relative el w-[200px] flex flex-col items-center justify-center mt-28">
          <img
            src={resolveAsset(currentPool?.pool?.resourceUrl ?? "")}
            alt="Pool artwork"
            className="w-[80%] object-contain absolute -top-[40%] left-1/2 z-0 -translate-x-1/2 -translate-y-1/2"
          />
          <img
            src={ScrollBg}
            alt="Scroll BG"
            className="w-full h-full object-contain z-10"
          />
          <span className="text-center text-xl max-w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-2/3 z-20">
            {currentPool?.pool?.name}
          </span>
        </div>

        {/* Staking informations */}
        <div className="el w-[350px]">
          <SpiralPadPattern />
          <div className="bg-white p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span>Pool Started:</span>
              <span>
                {poolReward?.poolStartedAt
                  ? format(new Date(poolReward.poolStartedAt), "MMM d, yyyy")
                  : "—"}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span>Total Phases Staked:</span>
              <span>
                {Math.min(totalPhasesHeld, totalPhases)?.toLocaleString()} /{" "}
                {totalPhases?.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between capitalize">
              <span>Upcoming Rewards:</span>
              <span>{remainingTime ?? "No upcoming rewards"}</span>
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
          className="w-full h-auto aspect-510/322 flex flex-col items-center justify-between px-4 pt-12 pb-12 relative"
          style={{
            backgroundImage: `url(${ScrollBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <span>Total Share</span>
          {phaseTokenTotal > 0 && (
            <div className="flex items-center justify-between text-lg ">
              <span className="mr-2">
                {parseValueToDisplay(phaseTokenTotal).toLocaleString()}
              </span>
              <span className="text-primary-500 font-semibold">$MOVERZ</span>

            </div>
          )}

          {phaseRoleRewards.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-lg ">
              <span className="mr-2">{item.rewardName}</span>
              <span className="text-primary-500 font-semibold">Role</span>
            </div>
          ))}

          {phaseOtherRewards.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-lg ">
              <span className="mr-2">{item.rewardName ?? Number(item.rewardValue).toLocaleString()}</span>
              <span className="text-primary-500 font-semibold">{item.rewardType}</span>
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
            fillColor={!isClaimable || isClaimed ? "transparent" : "#50352C"}
            disabled={!isClaimable || isClaimed}
            className="p-3 text-xl text-primary-500 hover:text-primary-900 hover:brightness-150 transition-all duration-300"
            onClick={() => {
              claimRewards();
            }}
          >
            {isClaimable ? "Claim" : isClaimed ? "Processing" : "Upcoming"}
          </InkButton>
        </div>
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
