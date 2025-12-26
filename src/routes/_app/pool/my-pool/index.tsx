import PoolBG from "@/assets/pool/bg.png";
import GameUI from "@/components/playground/gameUI/GameUI";
import { PixiPlayground } from "@/components/playground/PixiPlayground";
import { Loader } from "@/components/ui/loader";
import { useGetCurrentPool } from "@/hooks/pools/useGetCurrentPool";
import { resolveAsset } from "@/lib/resolveAsset";
import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";

export const Route = createFileRoute("/_app/pool/my-pool/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentPool, isLoading: isCurrentPoolLoading } =
    useGetCurrentPool();

  if (isCurrentPoolLoading)
    return (
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary-900/80">
        <Loader />
      </div>
    );

  return (
    <div
      className=""
      style={{
        backgroundImage:
          `url(` +
          resolveAsset("/backgrounds/" + currentPool?.poolId) +
          `.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center -10rem",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute top-0 left-0 w-full h-full bg-black/23 z-0" />
      <div className="relative mx-auto container min-h-[calc(100vh-10rem)]">
        <Suspense
          fallback={
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-primary-900/80">
              <Loader />
            </div>
          }
        >
          <PixiPlayground poolId={currentPool?.poolId ?? ""} />
        </Suspense>
        <GameUI poolId={currentPool?.poolId ?? ""} />
      </div>
    </div>
  );
}
