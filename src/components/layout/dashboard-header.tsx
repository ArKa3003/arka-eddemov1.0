"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Bell, User, Settings, LogOut, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthContext } from "@/providers/auth-provider";

export interface DashboardHeaderProps {
  /**
   * Dynamic page title
   */
  title?: string;
  /**
   * Show breadcrumbs
   */
  showBreadcrumbs?: boolean;
  /**
   * Breadcrumb items
   */
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

/**
 * Dashboard header component with page title, breadcrumbs, search, notifications, and user dropdown.
 * 
 * @example
 * ```tsx
 * <DashboardHeader title="Cases" showBreadcrumbs breadcrumbs={[{ label: "Home", href: "/" }, { label: "Cases" }]} />
 * ```
 */
export function DashboardHeader({
  title,
  showBreadcrumbs = false,
  breadcrumbs,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user, signOut } = useAuthContext();
  const [notifications, setNotifications] = React.useState(3); // Mock notification count

  // Generate breadcrumbs from pathname if not provided
  const generatedBreadcrumbs = React.useMemo(() => {
    if (breadcrumbs) return breadcrumbs;
    if (!showBreadcrumbs) return [];

    const segments = pathname.split("/").filter(Boolean);
    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");
      const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
      return { label, href: index < segments.length - 1 ? href : undefined };
    });
  }, [pathname, showBreadcrumbs, breadcrumbs]);

  // Get page title from pathname if not provided
  const pageTitle = title || React.useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "Dashboard";
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1).replace(/-/g, " ");
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {/* Title and Breadcrumbs */}
        <div className="flex flex-1 flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight">{pageTitle}</h1>
          {showBreadcrumbs && generatedBreadcrumbs.length > 0 && (
            <nav className="flex items-center gap-1 text-sm text-muted-foreground" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-foreground transition-colors">
                Home
              </Link>
              {generatedBreadcrumbs.map((crumb, index) => (
                <React.Fragment key={index}>
                  <ChevronRight className="h-4 w-4" />
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-foreground transition-colors">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-foreground font-medium">{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search cases, assessments..."
              className="pl-9"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Search Button (Mobile) */}
          <Button variant="ghost" size="sm" className="md:hidden">
            <Search className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                {notifications > 0 && (
                  <Badge
                    variant="danger"
                    size="sm"
                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                  >
                    {notifications > 9 ? "9+" : notifications}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Notifications</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNotifications(0)}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notifications > 0 ? (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    You have {notifications} new notification{notifications > 1 ? "s" : ""}
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No new notifications
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Avatar Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="relative h-9 w-9 rounded-full">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-500 text-white">
                  <User className="h-5 w-5" />
                </div>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.email || "User"}</p>
                <p className="text-xs text-muted-foreground">{user?.role || "Student"}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}