"use client";

import { useLayout } from "@/context/layout-provider";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

import { sidebarData } from "@/config/sidebar-data";
import { RiShoppingBasket2Line } from "@remixicon/react";
import { NavGroup } from "./nav-group";
import { NavUser } from "./nav-user";
import { authClient } from "@/lib/auth-client";

export function AppSidebar() {
  const { collapsible, variant } = useLayout();
  const { data: session } = authClient.useSession();

  // Filter nav groups based on role
  const filteredNavGroups = sidebarData.navGroups
    .map((group) => {
      // If user is not admin, filter out 'Users' item
      if (session?.user.role !== "admin") {
        return {
          ...group,
          items: group.items.filter(
            (item) => item.title !== "Pengguna" && item.url !== "/users",
          ),
        };
      }
      return group;
    })
    .filter((group) => group.items.length > 0); // Remove empty groups

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      {/* ================= HEADER ================= */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <RiShoppingBasket2Line className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Documentation</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ================= CONTENT ================= */}
      <SidebarContent>
        {filteredNavGroups.map((group) => (
          <NavGroup key={group.title} {...group} />
        ))}
      </SidebarContent>

      {/* ================= FOOTER ================= */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      {/* ================= COLLAPSE RAIL ================= */}
      <SidebarRail />
    </Sidebar>
  );
}
