import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_common")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
