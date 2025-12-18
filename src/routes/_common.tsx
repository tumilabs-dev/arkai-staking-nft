import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_common")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <main className="min-h-[calc(100vh-5rem)]">
      <Outlet />
    </main>
  );
}
