import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/notification/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_app/notification/"!</div>
}
