// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  GraduationCap,
  FileText,
  ClipboardList,
  TrendingUp,
  Award,
  Settings,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/providers/auth-provider";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  section?: string;
}

/**
 * Dashboard sidebar component with collapsible sections, active states, and user profile.
 * Supports desktop collapse and mobile drawer.
 * 
 * @example
 * ```tsx
 * <DashboardSidebar />
 * ```
 */
export function DashboardSidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  const isAdmin = user?.role === "admin";

  const navItems: NavItem[] = [
    // LEARN section
    { href: "/cases", label: "Cases", icon: <BookOpen className="h-5 w-5" />, section: "LEARN" },
    { href: "/specialty", label: "Specialty Tracks", icon: <GraduationCap className="h-5 w-5" />, section: "LEARN" },
    // ASSESS section
    { href: "/assessments", label: "Assessments", icon: <ClipboardList className="h-5 w-5" />, section: "ASSESS" },
    { href: "/assessments/create", label: "Quizzes", icon: <FileText className="h-5 w-5" />, section: "ASSESS" },
    // TRACK section
    { href: "/progress", label: "Progress", icon: <TrendingUp className="h-5 w-5" />, section: "TRACK" },
    { href: "/achievements", label: "Achievements", icon: <Award className="h-5 w-5" />, section: "TRACK" },
    // Admin section
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", icon: <Settings className="h-5 w-5" />, section: "ADMIN" }]
      : []),
  ];

  const sections = Array.from(new Set(navItems.map((item) => item.section)));

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className={cn("flex items-center gap-2 px-4 py-6", isCollapsed && "justify-center")}>
        {!isCollapsed && (
          <>
            <span className="text-xl font-bold text-accent-500">ARKA</span>
            <span className="text-xl font-bold text-primary-900">-ED</span>
          </>
        )}
        {isCollapsed && (
          <span className="text-xl font-bold text-accent-500">A</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6 px-3">
        {sections.map((section) => {
          const sectionItems = navItems.filter((item) => item.section === section);
          return (
            <div key={section}>
              {!isCollapsed && (
                <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {section}
                </div>
              )}
              <div className="space-y-1">
                {sectionItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-accent-50 text-accent-700 border-l-4 border-l-accent-500"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        isCollapsed && "justify-center"
                      )}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={cn(active && "text-accent-600")}>{item.icon}</span>
                      {!isCollapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="border-t p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-muted",
                isCollapsed && "justify-center"
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-500 text-white">
                <User className="h-4 w-4" />
              </div>
              {!isCollapsed && (
                <div className="flex-1 overflow-hidden">
                  <div className="text-sm font-medium truncate">{user?.email || "User"}</div>
                  <div className="text-xs text-muted-foreground truncate">View profile</div>
                </div>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
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

      {/* Collapse Toggle (Desktop) */}
      <div className="hidden lg:block border-t p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col h-screen border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r bg-background lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between border-b p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-accent-500">ARKA</span>
                    <span className="text-xl font-bold text-primary-900">-ED</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <SidebarContent />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-30 p-2 rounded-md bg-background border shadow-sm"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>
    </>
  );
}