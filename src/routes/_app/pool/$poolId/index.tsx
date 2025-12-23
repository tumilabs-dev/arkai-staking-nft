import GameUI from "@/components/playground/gameUI/GameUI";
import { PixiPlayground } from "@/components/playground/PixiPlayground";
import { Loader } from "@/components/ui/loader";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { Suspense } from "react";
import PoolBG from "@/assets/pool/bg.png";

export const Route = createFileRoute("/_app/pool/$poolId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { poolId } = useParams({
    from: "/_app/pool/$poolId/",
  });

  return (
    <div
      className=""
      style={{
        backgroundImage: `url(` + PoolBG + `)`,
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
          <PixiPlayground poolId={poolId} />
        </Suspense>
        <GameUI poolId={poolId} />
      </div>
    </div>
  );
}
