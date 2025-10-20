import { createFileRoute } from "@tanstack/react-router";
import { UserProfilePage } from "@/features/User/UserProfilePage";

export const Route = createFileRoute("/userpanel/userProfile")({
  component: UserProfilePage,
});
