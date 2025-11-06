import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_common/policy')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_common/policy"!</div>
}
