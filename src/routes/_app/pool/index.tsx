import SplashInkTitle from "@/assets/objects/splash-ink.png";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/animate-ui/components/radix/alert-dialog";
import { RewardIcon } from "@/components/icons/reward.icon";
import { UserIcon } from "@/components/icons/user.icon";
import InkButton from "@/components/ui/InkButton";
import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { rolesMap } from "@/constants/rolesMap";
import { IPool, useGetStakingPools } from "@/hooks/pools/useGetPools";
import { useJoinPool } from "@/hooks/pools/useJoinPool";
import { resolveAsset } from "@/lib/resolveAsset";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check, Loader2, XIcon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/_app/pool/")({
  component: RouteComponent,
});

function formatRewardTokens(value: string): string {
  const n = Number(value);
  if (n >= 1_000_000) return `${n / 1_000_000}M`;
  if (n >= 1_000) return `${n / 1_000}K`;
  return n.toLocaleString();
}


function RouteComponent() {
  const { data, isLoading } = useGetStakingPools();
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 relative py-6 space-y-6">
        {/* Title */}
        <div className="relative w-fit mx-auto z-10">
          <img
            src={SplashInkTitle}
            alt="Slash Ink Title"
            className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-[45%] min-w-[140%] h-[120%] -z-10"
          />
          <span className="text-white text-4xl font-medium">
            Arkai NFT Rewards Pools
          </span>
        </div>
        {/* Pools */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <div className="flex items-center justify-center col-span-full h-screen">
              <Loader2 className="w-6 h-6 text-primary-900 animate-spin" />
            </div>
          ) : (
            data?.map((pool) => <PoolCard key={pool.id} pool={pool} />)
          )}
        </div>
      </div>
    </div>
  );
}

function PoolCard({ pool }: { pool: IPool }) {
  const navigate = useNavigate();
  const { mutateAsync: joinPool } = useJoinPool();
  const { data: pools } = useGetStakingPools();
  const [isOpen, setIsOpen] = useState(false);

  // Is the first pool to join
  const anyPoolJoined = pools?.some((p) => p.isJoined) ?? false;

  const PoolActionButton = () => {
    if (pool.isJoined) {
      return (
        <InkButton
          className="w-full text-white hover:text-primary-900 transition-all duration-300"
          fillColor="#dd993e"
          onClick={async () => {
            await navigate({
              to: "/pool/my-pool",
            });
          }}
        >
          Detail
        </InkButton>
      );
    }
    if (!pool.canJoin) {
      return (
        <InkButton
          className="w-full text-black hover:text-primary-900 transition-all duration-300"
          fillColor="#f3e0cb"
          disabled
        >
          Not Available
        </InkButton>
      );
    }
    return (
      <InkButton
        className="w-full text-white hover:text-primary-900 transition-all duration-300"
        fillColor="#afc1b1"
        onClick={async () => {
          setIsOpen(true);
        }}
      >
        {anyPoolJoined ? "Switch Pool" : "Join Pool"}
      </InkButton>
    );
  };
  return (
    <div className="relative">
      {/* Decord */}
      <SpiralPadPattern color="#A46A37" size={30} className="w-full mb-1" />
      {/* Image */}
      <img
        src={resolveAsset(pool.resourceUrl)}
        alt={pool.name}
        loading="lazy"
      />

      {/* Content */}
      <div className="bg-white w-full p-6 space-y-6">
        <h3 className="text-primary text-2xl font-medium text-center">
          {pool.name}
        </h3>
        <p className="text-muted-foreground text-sm text-center">
          {pool.description}
        </p>
        {/* Required Role */}
        <div className="flex items-center justify-between">
          <span className=" flex items-center gap-2">
            <UserIcon />
            Required Role:
          </span>
          <span className="text-muted-foreground max-w-[60%] text-right">
            {
              rolesMap[
                pool.requiredNftCount.toString() as keyof typeof rolesMap
              ]
            }
          </span>
        </div>
        {/* Total Reward */}
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <RewardIcon />
            Total Reward:
          </span>
          <span className="text-muted-foreground max-w-[60%] text-right">
            {formatRewardTokens(pool.totalRewardTokens)} $MOVERZ
          </span>
        </div>


        {/* Join pool */}
        <PoolActionButton />
        {/* Pool Join  */}
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {anyPoolJoined
                  ? "Switch Pool Confirmation"
                  : "Join Pool Confirmation"}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogDescription className="text-center">
              {anyPoolJoined
                ? "Are you sure you want to switch to this pool? Other pools will be disabled."
                : "Are you sure you want to join this pool? Other pools will be disabled."}
              {anyPoolJoined && (
                <span className="text-destructive text-sm">
                  <br />
                  You will be switched to the new pool. Your current pool
                  progress will be lost.
                </span>
              )}
            </AlertDialogDescription>
            <AlertDialogFooter>
              <InkButton
                className="size-10 text-white hover:text-primary-900 transition-all duration-300"
                fillColor="#E49C85"
                variant="icon"
                onClick={() => setIsOpen(false)}
              >
                <XIcon className="w-4 h-4" />
              </InkButton>
              <InkButton
                className="size-10 text-white hover:text-primary-900 transition-all duration-300"
                fillColor="#afc1b1"
                variant="icon"
                onClick={async () => {
                  await joinPool(pool.id);
                  setIsOpen(false);
                  navigate({
                    to: "/pool/my-pool",
                  });
                }}
              >
                <Check className="w-4 h-4" />
              </InkButton>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <SpiralPadPattern color="#A46A37" size={30} className="w-full mt-1" />
    </div>
  );
}
