import Header from "@/components/layouts/Header";
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main>
      <Header />
      <Outlet />
    </main>
  );
}
