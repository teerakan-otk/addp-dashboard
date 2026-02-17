import { MenuItem } from "@/types/sidebar";
import { Briefcase, History, LayoutDashboard } from "lucide-react";

export const sidebarMenu: Record<string, MenuItem[]> = {
  admin: [
    {
      type: "item",
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      type: "group",
      title: "Management",
      icon: Briefcase,
      children: [
        { type: "item", label: "Users", href: "/admin/management/users" },
        { type: "item", label: "Projects", href: "/admin/management/projects" },
      ],
    },
    {
      type: "item",
      label: "History",
      href: "/admin/history",
      icon: History,
    },
  ],

  user: [
    {
      type: "item",
      label: "Dashboard",
      href: "/user/dashboard",
      icon: LayoutDashboard,
    },
    {
      type: "group",
      title: "Management",
      icon: Briefcase,
      children: [
        { type: "item", label: "Projects", href: "/user/management/projects" },
        { type: "item", label: "DNS", href: "/user/management/dns" },
      ],
    },
    {
      type: "item",
      label: "History",
      href: "/user/history",
      icon: History,
    },
  ],
};
