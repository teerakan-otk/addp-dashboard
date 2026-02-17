"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { AppSidebarItem } from "./app-sidebar-item";
import { AppSidebarGroup } from "./app-sidebar-group";
import { Rocket } from "lucide-react";
import { sidebarMenu } from "@/lib/constants/sidebar";

export function AppSidebar({ role }: { role: string }) {
  const pathname = usePathname();
  const { isMobile, toggleSidebar, state } = useSidebar();

  // If mobile then toggle sidebar
  function handleToggleSidebar() {
    if (isMobile) {
      toggleSidebar();
    }
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild onClick={handleToggleSidebar}>
              <Link
                href={`/${role}/dashboard`}
                className="flex items-center justify-center gap-2 text-xl font-bold"
              >
                {state === "collapsed" ? (
                  <Rocket />
                ) : (
                  <>
                    <Rocket />
                    <span className="truncate">Adocs</span>
                  </>
                )}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {sidebarMenu[role].map((item) => {
              if (item.type === "item") {
                return (
                  <AppSidebarItem
                    key={item.href}
                    item={item}
                    pathname={pathname}
                  />
                );
              }

              return (
                <AppSidebarGroup
                  key={item.title}
                  group={item}
                  pathname={pathname}
                />
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
