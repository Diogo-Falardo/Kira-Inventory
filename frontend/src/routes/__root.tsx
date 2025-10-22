import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import ErrorPage from "@/pages/ErrorPage";

import type { RouterContext } from "@/core/main";

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools position="bottom-right" />
      </>
    );
  },
  notFoundComponent: () => <ErrorPage />,
});
