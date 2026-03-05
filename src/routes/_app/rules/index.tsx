import SpiralPadPattern from "@/components/ui/SpiralPadPattern";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/rules/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="bg-background min-h-[calc(100vh-10rem)]">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center py-8 text-muted-foreground">
          Rules
        </h1>

        <div className="w-full">
          <SpiralPadPattern />
          <div className="bg-white p-12 text-center text-muted-foreground text-xl">
            Rules & guidelines are coming soon. Stay tuned!
          </div>
          <SpiralPadPattern />
        </div>
      </div>
    </div>
  );
}
