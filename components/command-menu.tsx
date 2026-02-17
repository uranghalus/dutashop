"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  RiArrowRightSLine,
  RiArrowRightLine,
  RiComputerLine,
  RiMoonLine,
  RiSunLine,
} from "@remixicon/react"
import { useSearch } from "@/context/search-provider"
import { useTheme } from "@/context/theme-provider"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import { ScrollArea } from "./ui/scroll-area"
import { sidebarData } from "@/config/sidebar-data"

export function CommandMenu() {
  const router = useRouter()
  const { setTheme } = useTheme()
  const { open, setOpen } = useSearch()

  const runCommand = React.useCallback(
    (command: () => unknown) => {
      setOpen(false)
      command()
    },
    [setOpen]
  )

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pe-1">
          <CommandEmpty>No results found.</CommandEmpty>

          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url)
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      onSelect={() => {
                        runCommand(() => router.push(navItem.url))
                      }}
                    >
                      <div className="flex size-4 items-center justify-center">
                        <RiArrowRightLine className="size-3 text-muted-foreground/80" />
                      </div>
                      {navItem.title}
                    </CommandItem>
                  )

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    value={`${navItem.title}-${subItem.url}`}
                    onSelect={() => {
                      runCommand(() => router.push(subItem.url))
                    }}
                  >
                    <div className="flex size-4 items-center justify-center">
                      <RiArrowRightLine className="size-3 text-muted-foreground/80" />
                    </div>
                    {navItem.title}{" "}
                    <RiArrowRightSLine className="mx-1 size-3" />{" "}
                    {subItem.title}
                  </CommandItem>
                ))
              })}
            </CommandGroup>
          ))}

          <CommandSeparator />

          <CommandGroup heading="Theme">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <RiSunLine className="mr-2 size-4" />
              <span>Light</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <RiMoonLine className="mr-2 size-4" />
              <span>Dark</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <RiComputerLine className="mr-2 size-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  )
}
