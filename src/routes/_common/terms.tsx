import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_common/terms')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_common/terms"!</div>
}
