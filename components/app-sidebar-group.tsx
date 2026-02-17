"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  useSidebar,
} from "@/components/ui/sidebar";

import { ChevronDown } from "lucide-react";
import { SidebarGroup } from "@/types/sidebar";

type AppSidebarGroupProps = {
  group: SidebarGroup;
  pathname: string;
};

export function AppSidebarGroup({ group, pathname }: AppSidebarGroupProps) {
  const childPathname = usePathname();
  const { isMobile, toggleSidebar } = useSidebar();

  // If mobile then toggle sidebar
  function handleToggleSidebar() {
    if (isMobile) {
      toggleSidebar();
    }
  }

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton className="cursor-pointer" tooltip={group.title}>
            {group.icon && <group.icon />}
            <span>{group.title}</span>
            <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </SidebarMenuButton>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <SidebarMenuSub>
            {group.children.map((child) => (
              <SidebarMenuItem key={child.href}>
                <SidebarMenuButton
                  asChild
                  isActive={childPathname.startsWith(child.href)}
                  onClick={handleToggleSidebar}
                >
                  <Link href={child.href}>{child.label}</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
