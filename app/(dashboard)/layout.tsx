import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getRole } from "./_actions";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { AppSidebarHeader } from "@/components/app-sidebar-header";
import NextTopLoader from "nextjs-toploader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const data = await getRole();
  if (!data) {
    notFound();
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar role={data.role} />
      <SidebarInset>
        <AppSidebarHeader />
        <div className="flex flex-1 flex-col gap-6 p-6">
          <NextTopLoader showSpinner={false} />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
