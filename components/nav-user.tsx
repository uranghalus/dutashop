'use client'

import Link from 'next/link'
import {
    RiVipCrownLine,
    RiShieldCheckLine,
    RiNotification3Line,
    RiBankCardLine,
    RiLogoutBoxRLine,
    RiArrowUpDownLine,
} from '@remixicon/react'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar'

import { authClient } from '@/lib/auth-client'
import { Skeleton } from './ui/skeleton'
import { SignOutDialog } from './signout-dialog'


export function NavUser() {
    const { isMobile } = useSidebar()
    const [open, setOpen] = useState(false)

    const { data: session, isPending, refetch } = authClient.useSession()
    const user = session?.user

    useEffect(() => {
        const handler = () => refetch()
        window.addEventListener('better-auth:refresh-session', handler)
        return () =>
            window.removeEventListener('better-auth:refresh-session', handler)
    }, [refetch])

    return (
        <>
            <SidebarMenu>
                <SidebarMenuItem>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={isPending}>
                            <SidebarMenuButton
                                size="lg"
                                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                            >
                                {isPending ? (
                                    <div className="flex items-center space-x-4">
                                        <Skeleton className="h-8 w-8 rounded-full" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-[180px]" />
                                            <Skeleton className="h-4 w-[150px]" />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <Avatar className="h-8 w-8 rounded-lg">
                                            <AvatarImage
                                                src={user?.image ?? ''}
                                                alt={user?.name ?? ''}
                                            />
                                            <AvatarFallback className="rounded-lg">
                                                {user?.name?.[0]?.toUpperCase() ?? 'U'}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="grid flex-1 text-start text-sm leading-tight">
                                            <span className="truncate font-semibold">
                                                {user?.name}
                                            </span>
                                            <span className="truncate text-xs">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </>
                                )}

                                <RiArrowUpDownLine className="ms-auto size-4" />
                            </SidebarMenuButton>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent
                            className="min-w-56 rounded-lg"
                            side={isMobile ? 'bottom' : 'right'}
                            align="end"
                            sideOffset={4}
                        >
                            <DropdownMenuLabel className="p-0 font-normal">
                                <div className="flex items-center gap-2 px-1 py-1.5 text-start text-sm">
                                    <Avatar className="h-8 w-8 rounded-lg">
                                        <AvatarImage
                                            src={user?.image ?? ''}
                                            alt={user?.name ?? ''}
                                        />
                                        <AvatarFallback className="rounded-lg">
                                            {user?.name?.[0]?.toUpperCase() ?? 'U'}
                                        </AvatarFallback>
                                    </Avatar>

                                    <div className="grid flex-1 text-start text-sm leading-tight">
                                        <span className="truncate font-semibold">
                                            {user?.name}
                                        </span>
                                        <span className="truncate text-xs">
                                            {user?.email}
                                        </span>
                                    </div>
                                </div>
                            </DropdownMenuLabel>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem>
                                    <RiVipCrownLine className="mr-2 size-4" />
                                    Upgrade to Pro
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/settings/account"
                                        className="flex items-center gap-2"
                                    >
                                        <RiShieldCheckLine className="size-4" />
                                        Account
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/settings"
                                        className="flex items-center gap-2"
                                    >
                                        <RiBankCardLine className="size-4" />
                                        Billing
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/settings/notifications"
                                        className="flex items-center gap-2"
                                    >
                                        <RiNotification3Line className="size-4" />
                                        Notifications
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                                onClick={() => setOpen(true)}
                                className="flex items-center gap-2"
                            >
                                <RiLogoutBoxRLine className="size-4" />
                                Sign out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </SidebarMenuItem>
            </SidebarMenu>

            <SignOutDialog open={open} onOpenChange={setOpen} />
        </>
    )
}
