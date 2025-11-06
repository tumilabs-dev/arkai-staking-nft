import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_common/support")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_common/support"!</div>;
}
