'use client'

import { useLayout } from '@/context/layout-provider'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar'




import { sidebarData } from '@/config/sidebar-data'
import { RiShoppingBasket2Line } from '@remixicon/react'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'

export function AppSidebar() {
    const { collapsible, variant } = useLayout()

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
                {sidebarData.navGroups.map((group) => (
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
    )
}
