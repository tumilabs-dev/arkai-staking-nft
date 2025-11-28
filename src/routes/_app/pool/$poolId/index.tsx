import GameUI from "@/components/playground/gameUI/GameUI";
import { PixiPlayground } from "@/components/playground/PixiPlayground";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/pool/$poolId/")({
  component: RouteComponent,
  loader: async ({ params }) => {
    const { poolId } = params;
    return { poolId };
  },
});

function RouteComponent() {
  return (
    <div className="">
      <div className="relative mx-auto container">
        <PixiPlayground />
        <GameUI />
      </div>
    </div>
  );
}
