import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const createRouter = () => {
  const rqContext = TanstackQuery.getContext();

  const router = createTanstackRouter({
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

  setupRouterSsrQueryIntegration({
    router,
    queryClient: rqContext.queryClient,
  });

  return router;
};

// Cache the router instance
let routerInstance: ReturnType<typeof createRouter> | undefined;

// Export getRouter for TanStack Start
export const getRouter = () => {
  if (!routerInstance) {
    routerInstance = createRouter();
  }
  return routerInstance;
};

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
