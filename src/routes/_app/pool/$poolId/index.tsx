import GameUI from "@/components/playground/gameUI/GameUI";
import { PixiPlayground } from "@/components/playground/PixiPlayground";
import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/pool/$poolId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { poolId } = useParams({
    from: "/_app/pool/$poolId/",
  });

  return (
    <div className="">
      <div className="relative mx-auto container min-h-[calc(100vh-10rem)]">
        <PixiPlayground />
        <GameUI poolId={poolId} />
      </div>
    </div>
  );
}
