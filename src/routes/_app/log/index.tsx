import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/log/")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_app/log/"!</div>;
}
