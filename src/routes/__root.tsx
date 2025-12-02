import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";

import { Toaster } from "@/components/ui/sonner";
import Footer from "@/components/layouts/Footer";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

gsap.registerPlugin(useGSAP);

function RootComponent() {
  return (
    <div className="main-content">
      <Outlet />
      <Footer />
      <Toaster />
    </div>
  );
}
