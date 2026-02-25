"use client";

import { useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { User2Icon } from "lucide-react";
import Link from "next/link";

export function AppSidebarAvatar() {
  const router = useRouter();
  const pathname = usePathname();

  const profilePath = useMemo(() => {
    if (pathname.startsWith("/admin")) return "/admin/profile";
    if (pathname.startsWith("/user")) return "/user/profile";
    return "/profile";
  }, [pathname]);

  const handleProfileLink = useCallback(() => {
    router.push(profilePath);
  }, [router, profilePath]);

  async function handleLogout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
    });

    if (response.ok) {
      return router.replace("/login");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="cursor-pointer" size="icon">
          <User2Icon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            My Account
          </DropdownMenuLabel>

          <DropdownMenuItem asChild>
            <Link href={profilePath}>Profile</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="text-destructive focus:text-destructive"
        >
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
