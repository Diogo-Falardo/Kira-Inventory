import { createFileRoute } from "@tanstack/react-router";
import UserProductsPage from "@/features/User/UserProductsPage";

export const Route = createFileRoute("/userpanel/userProduct")({
  component: UserProductsPage,
});
