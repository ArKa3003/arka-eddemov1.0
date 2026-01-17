"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BookOpen, BarChart3, Settings, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface AdminNavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

/**
 * Admin sidebar component with darker theme and admin-specific navigation.
 * Includes "Back to App" link to return to main dashboard.
 * 
 * @example
 * ```tsx
 * <AdminSidebar />
 * ```
 */
export function AdminSidebar() {
  const pathname = usePathname();

  const navItems: AdminNavItem[] = [
    { href: "/admin", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
    { href: "/admin/users", label: "Users", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/cases", label: "Cases", icon: <BookOpen className="h-5 w-5" /> },
    { href: "/admin/analytics", label: "Analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-64 border-r bg-primary-900 text-primary-foreground h-screen flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-6 py-6 border-b border-primary-800">
        <span className="text-xl font-bold text-accent-500">ARKA</span>
        <span className="text-xl font-bold text-white">-ED</span>
        <span className="ml-2 text-xs font-medium text-primary-400 uppercase tracking-wider">
          Admin
        </span>
      </div>

      {/* Back to App Link */}
      <div className="px-4 py-4 border-b border-primary-800">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-primary-200 hover:text-white hover:bg-primary-800"
          asChild
        >
          <Link href="/cases">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to App
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-accent-500 text-white border-l-4 border-l-accent-400"
                  : "text-primary-200 hover:bg-primary-800 hover:text-white"
              )}
            >
              <span className={cn(active && "text-white")}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-primary-800">
        <p className="text-xs text-primary-400">
          Admin Panel v1.0
        </p>
      </div>
    </aside>
  );
}