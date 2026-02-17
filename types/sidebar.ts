import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  type: "item";
  label: string;
  href: string;
  icon?: LucideIcon;
};

export type SidebarGroup = {
  type: "group";
  title: string;
  icon?: LucideIcon;
  children: SidebarItem[];
};

export type MenuItem = SidebarItem | SidebarGroup;
