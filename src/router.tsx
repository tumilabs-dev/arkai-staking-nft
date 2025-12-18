import { createRouter as createTanstackRouter } from "@tanstack/react-router";
import * as TanstackQuery from "./integrations/tanstack-query/root-provider";
import { WalletProvider } from "@razorlabs/razorkit";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const rqContext = TanstackQuery.getContext();

export const router = createTanstackRouter({
  routeTree,
  context: { ...rqContext },
  defaultPreload: "intent",
  defaultStaleTime: 5000,
  defaultViewTransition: { types: ["slide-left"] },
  Wrap: (props: { children: React.ReactNode }) => {
    return (
      <TanstackQuery.Provider {...rqContext}>
        <WalletProvider autoConnect={true}>{props.children}</WalletProvider>
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
