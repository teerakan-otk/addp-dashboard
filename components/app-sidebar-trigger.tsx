"use client";

import { useSidebar } from "./ui/sidebar";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppSidebarTrigger({ className }: { className?: string }) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      className={cn("cursor-pointer", className)}
      variant="ghost"
      size="icon"
      onClick={toggleSidebar}
    >
      <Menu />
    </Button>
  );
}
