import { createFileRoute } from "@tanstack/react-router";
import { UserDashboardPage } from "@/features/User/UserDashboardPage";

export const Route = createFileRoute("/userpanel/userDashboard")({
  component: UserDashboardPage,
});
