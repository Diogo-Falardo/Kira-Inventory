import AuthPage from "@/pages/AuthPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

import type { RouterContext } from "@/core/main";

export const Route = createFileRoute("/auth")({
  beforeLoad: ({ context }: { context: RouterContext }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: "/userpanel" });
    }
  },
  component: AuthPage,
});
