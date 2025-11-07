import { PixiPlayground } from "@/components/playground/PixiPlayground";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/pool/$poolId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <PixiPlayground />
    </div>
  );
}
