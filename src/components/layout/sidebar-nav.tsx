"use client";

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Home,
  DollarSign,
  Briefcase,
  Users,
  Image as ImageIcon,
  Settings,
  Heart,
  ListChecks,
  FileUp,
  BookOpen,
  LayoutGrid,
  Handshake,
  FileText,
} from "lucide-react";
import type { Role } from "@/lib/types";
import { Separator } from "../ui/separator";

const navItemsByRole: Record<Role, { href: string; icon: React.ReactNode; label: string }[]> = {
  Admin: [
    { href: "/dashboard", icon: <LayoutGrid />, label: "Dashboard" },
    { href: "/donations", icon: <DollarSign />, label: "Donations" },
    { href: "/projects", icon: <Briefcase />, label: "Projects" },
    { href: "/users", icon: <Users />, label: "Users" },
    { href: "/media", icon: <ImageIcon />, label: "Media" },
    { href: "/settings", icon: <Settings />, label: "Settings" },
  ],
  Manager: [
    { href: "/dashboard", icon: <LayoutGrid />, label: "Dashboard" },
    { href: "/donations", icon: <DollarSign />, label: "Donations" },
    { href: "/projects", icon: <Briefcase />, label: "Projects" },
    { href: "/media", icon: <ImageIcon />, label: "Media" },
  ],
  Volunteer: [
    { href: "/dashboard", icon: <LayoutGrid />, label: "Dashboard" },
    { href: "/media", icon: <ImageIcon />, label: "Media" },
  ],
  Intern: [
    { href: "/dashboard", icon: <LayoutGrid />, label: "Dashboard" },
    { href: "/media", icon: <ImageIcon />, label: "Media" },
  ],
  Donor: [
    { href: "/dashboard", icon: <LayoutGrid />, label: "Dashboard" },
  ],
};

const Logo = () => (
    <div className="flex items-center gap-2 p-4">
        <Handshake className="h-8 w-8 text-primary" />
        <h1 className="text-xl font-bold text-sidebar-foreground">NGO Hub</h1>
    </div>
)

export function SidebarNav({ role }: { role: Role }) {
  const pathname = usePathname();
  const navItems = navItemsByRole[role] || [];

  return (
    <>
      <SidebarHeader>
        <Logo/>
      </SidebarHeader>
      <Separator className="bg-sidebar-border" />
      <SidebarMenu className="flex-1 p-4">
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton
                isActive={pathname === item.href}
                tooltip={item.label}
              >
                {item.icon}
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </>
  );
}
