import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const rqContext = TanstackQuery.getContext();

export const router = createTanstackRouter({
  routeTree,
  context: { ...rqContext },
  defaultPreload: "intent",
  Wrap: (props: { children: React.ReactNode }) => {
    return (
      <TanstackQuery.Provider {...rqContext}>
        {props.children}
      </TanstackQuery.Provider>
    );
  },
  defaultNotFoundComponent: () => <div>Not Found</div>,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
