import { createFileRoute, redirect } from "@tanstack/react-router";
import { UserPanel } from "@/features/User/UserPanel";

import type { RouterContext } from "@/core/main";

export const Route = createFileRoute("/userpanel")({
  beforeLoad: ({ context }: { context: RouterContext }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({ to: "/auth" });
    }
  },
  component: UserPanel,
});
