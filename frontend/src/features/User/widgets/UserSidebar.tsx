// page
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Package, LayoutDashboard } from "lucide-react";

// auth -> context
import { useAuth } from "@/core/authContext";

// navigate
import { Link } from "@tanstack/react-router";

// navbar free items
const items = [
  {
    name: "Dashboard",
    url: "/userpanel/userDashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    url: "/userpanel/userProduct",
    icon: Package,
  },
];

export function UserSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  if (!user) {
    return null;
  }

  // userinfo
  const userInfo = {
    email: user.email,
    name: user.username,
    avatar: user.avatar,
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <Link
          to="/"
          className="flex items-center px-3 py-2 hover:opacity-80 transition-opacity cursor-pointer"
        >
          <h1 className="text-xl font-extrabold tracking-tight">
            KIRA <span className="text-slate-400">Inventory</span>
          </h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Free</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
