import Stamp from "@/assets/objects/stamp-border.png";
import {
  Progress,
  ProgressTrack,
} from "@/components/animate-ui/components/base/progress";
import { DiamondIcon } from "@/components/icons/diamond.icon";
import { ForwardIcon } from "@/components/icons/forward.icon";
import { ScrollIcon } from "@/components/icons/scroll.icon";
import { StarIcon } from "@/components/icons/star.icon";
import { TimerIcon } from "@/components/icons/timer.icon";
import { Button } from "@/components/ui/button";
import InkButton from "@/components/ui/InkButton";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { getRoleDueToNFTCount } from "@/constants/rolesMap";
import { useGetCurrentPool } from "@/hooks/pools/useGetCurrentPool";
import { useGetPoolRewards } from "@/hooks/pools/useGetPoolRewards";
import { resolveAsset } from "@/lib/resolveAsset";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ShieldCheck, Sword } from "lucide-react";

export const Route = createFileRoute("/_app/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const { data: currentPool } = useGetCurrentPool();

  const { data: poolRewards } = useGetPoolRewards({
    poolId: currentPool?.poolId,
  });

  const currentWeek = poolRewards?.weekHeld ?? 0;
  const maxWeeks = poolRewards?.rewards.at(-1)?.weekNumber ?? 0;
  const progress = (currentWeek / maxWeeks) * 100;

  if (!currentPool) {
    return (
      <div className="bg-background min-h-[calc(100vh-10rem)]">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center py-8 text-muted-foreground">
            Join a pool to start staking
          </h1>
          <InkButton
            className="w-full text-xl text-white hover:brightness-95 transition-all duration-300"
            fillColor="#A4C3AF"
            onClick={() => {
              navigate({
                to: "/pool",
              });
            }}
          >
            Join a Pool
          </InkButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center py-8 text-muted-foreground">
          Staking Progress & Pool Rewards
        </h1>

        <div className="w-full">
          <SpiralPadPattern />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 ">
            {/* Pool details */}
            <div className="bg-white p-8 md:col-span-2 flex items-stretch justify-between">
              <div className="space-y-4">
                <h2 className="text-primary-900 text-2xl font-medium">
                  Your Current Staking Status
                </h2>
                {/* Current pools */}
                <div className="flex items-center gap-4 text-xl">
                  <ShieldCheck className="w-6 h-6 text-secondary-400" />
                  <div className="flex flex-col">
                    <span className="text-primary-900">Current Pool:</span>
                    <span className="text-accent font-medium">
                      {currentPool?.pool.name}
                    </span>
                  </div>
                </div>
                {/* Discords roles */}
                <div className="flex items-center gap-4 text-xl">
                  <Sword className="w-6 h-6 text-secondary-400" />
                  <div className="flex flex-col">
                    <span className="text-primary-900">Discord Role:</span>
                    <span className="text-accent font-medium">
                      {getRoleDueToNFTCount(
                        currentPool?.pool.requiredNftCount ?? 0
                      )}
                    </span>
                  </div>
                </div>
                {/* Details */}
                <Button
                  className="flex items-center gap-4 text-xl rounded-none"
                  variant="ghost"
                >
                  <span className="">Pool Details</span>
                  <ForwardIcon className="text-primary-400" />
                </Button>
              </div>

              {/* Current pools information */}
              <div className="gap-4 relative size-52">
                <img src={Stamp} className="size-full object-cover" />
                <img
                  src={resolveAsset(currentPool?.pool.resourceUrl ?? "")}
                  loading="eager"
                  className="size-[78%] object-cover absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
                />
              </div>
            </div>

            {/* Staking journey */}
            <div className="bg-white p-8 space-y-4">
              <h2 className="text-primary-900 text-2xl font-medium text-center">
                Your Staking Journey
              </h2>
              <div className="flex items-center gap-4 text-xl justify-between ">
                <span>Weeks Staked: </span>
                <span className="text-accent font-medium">
                  {currentWeek} / {maxWeeks}
                </span>
              </div>
              <Progress value={progress}>
                <ProgressTrack className={"h-4"} />
              </Progress>

              <div className="text-muted-foreground text-center">
                Keep staking to unlock maximum potential rewards!
              </div>
            </div>

            {/* Campaign remaining time */}
            <div className="bg-white p-8 space-y-4 flex flex-col items-center justify-around">
              <div className="flex items-center flex-col gap-4 ">
                <TimerIcon className="text-accent" />
                <span className="text-2xl font-medium">Campaign Ends In</span>
                <span className="flex items-center gap-2 text-xl text-accent">
                  <span>12 days</span>
                </span>
                <span className="text-center w-full text-muted-foreground">
                  Don't miss out on your Arkai rewards!
                </span>
              </div>
            </div>

            {/* Potential Rewards Overview */}
            <div className="bg-white p-8 pb-4 space-y-4 md:col-span-2">
              <h3 className="text-primary-900 text-2xl font-medium">
                Potential Rewards Overview
              </h3>

              <div className="flex items-center gap-4 text-xl justify-between ">
                <span>
                  <DiamondIcon className="text-accent inline mr-2" />
                  Arkai Tokens
                </span>
                <span className="text-accent font-medium">1,000 ARK</span>
              </div>
              <div className="flex items-center gap-4 text-xl justify-between ">
                <span>
                  <ScrollIcon className="text-accent inline mr-2" />
                  Exclusive NFT Fragment
                </span>
                <span className="text-accent font-medium">1/5 Pieces</span>
              </div>
              <div className="flex items-center gap-4 text-xl justify-between ">
                <span>
                  <StarIcon className="text-accent inline mr-2" />
                  Mystic Aura Bonus
                </span>
              </div>

              <hr />

              <div className="flex justify-end ">
                <Button
                  className="flex items-center gap-4 text-xl rounded-none hover:bg-primary-50"
                  variant="ghost"
                >
                  <span className="">Pool Details</span>
                  <ForwardIcon className="text-primary-400" />
                </Button>
              </div>
            </div>

            <div className="bg-white py-8 px-16 flex flex-col items-center justify-center gap-4 md:col-span-2">
              <h3 className="text-primary-900 text-2xl font-medium">
                Ready for Action?
              </h3>

              <InkButton
                className="w-full text-xl text-white hover:brightness-95 transition-all duration-300"
                fillColor="#A4C3AF"
              >
                Get more NFT
              </InkButton>
              <InkButton
                className="w-full text-xl text-white hover:brightness-95 transition-all duration-300"
                fillColor="#E8A849"
                onClick={() => {
                  navigate({
                    to: "/pool/$poolId",
                    params: { poolId: currentPool?.poolId ?? "" },
                  });
                }}
              >
                Claim Rewards
              </InkButton>
            </div>
          </div>
          <SpiralPadPattern />
        </div>
      </div>
    </div>
  );
}
