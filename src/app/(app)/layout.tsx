"use client";

import { SidebarProvider, Sidebar } from "@/components/ui/sidebar";
import { Header } from "@/components/layout/header";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import type { User } from "@/lib/types";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  // Temporary user for development
  const devUser: User = {
    id: "user-admin-dev",
    name: "Dev Admin",
    email: "dev@example.com",
    avatarUrl: "https://picsum.photos/seed/dev/100/100",
    role: "Admin",
    status: "Active"
  };

  const user = devUser;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar collapsible="icon">
          {/* Use the dev user's role for the sidebar */}
          <SidebarNav role={user.role} />
        </Sidebar>
        <div className="flex flex-1 flex-col">
          <Header />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
