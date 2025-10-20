import { createFileRoute } from "@tanstack/react-router";
import { UserPanel } from "@/features/User/UserPanel";

export const Route = createFileRoute("/userpanel")({
  component: UserPanel,
});
