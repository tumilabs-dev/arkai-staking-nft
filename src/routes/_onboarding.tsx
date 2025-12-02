import { createFileRoute, Outlet } from "@tanstack/react-router";
import OnboardingBG from "@/assets/onboarding/background.png";

export const Route = createFileRoute("/_onboarding")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      className="h-[calc(100vh-80px)] relative"
      style={{
        backgroundImage: `url(${OnboardingBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gray-900/60 z-0" />
      <div className="z-10 relative h-full ">
        <Outlet />
      </div>
    </div>
  );
}
