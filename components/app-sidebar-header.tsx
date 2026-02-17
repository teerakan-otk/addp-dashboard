"use client";

import { AppSidebarTrigger } from "./app-sidebar-trigger";
import { ModeToggle } from "./mode-toggle";
import { AvatarDropdown } from "./avatar-dropdown";
import { Separator } from "./ui/separator";
import { AppSidebarBreadcrumb } from "./app-sidebar-breadcrumb";

export function AppSidebarHeader() {
  return (
    <header className="flex h-16 bg-background sticky top-0 z-30 border-b shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <AppSidebarTrigger className="-ml-1" />
        <div className="hidden md:flex">
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <AppSidebarBreadcrumb />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2 px-4">
        <ModeToggle variant="ghost" />
        <AvatarDropdown />
      </div>
    </header>
  );
}
