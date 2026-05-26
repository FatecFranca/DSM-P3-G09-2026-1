"use client";

import { usePathname } from "next/navigation";

import {
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { AppSidebar } from "@/components/app-sidebar";

export function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {

  const pathname = usePathname();

  const isLogin = pathname === "/login";

  if (isLogin) {
    return (
      <main className="
        background-login
        min-h-screen
        w-full
      ">
        {children}
      </main>
    );
  }

  return (
    <SidebarProvider>

      <AppSidebar />

      <main className="
        background-main
        w-full
        overflow-x-hidden
      ">

        <SidebarTrigger />

        {children}

      </main>

    </SidebarProvider>
  );
}