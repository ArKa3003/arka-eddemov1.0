// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { cn } from "@/lib/utils";

export interface DashboardShellProps {
  /**
   * Main content to render
   */
  children: React.ReactNode;
  /**
   * Page title for header
   */
  title?: string;
  /**
   * Show breadcrumbs in header
   */
  showBreadcrumbs?: boolean;
  /**
   * Breadcrumb items
   */
  breadcrumbs?: Array<{ label: string; href?: string }>;
  /**
   * Custom className for main content area
   */
  className?: string;
}

/**
 * Dashboard shell component that combines sidebar, header, and main content.
 * Provides responsive layout with page transitions.
 * 
 * @example
 * ```tsx
 * <DashboardShell title="Cases" showBreadcrumbs>
 *   <CasesList />
 * </DashboardShell>
 * ```
 */
export function DashboardShell({
  children,
  title,
  showBreadcrumbs,
  breadcrumbs,
  className,
}: DashboardShellProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <DashboardHeader
          title={title}
          showBreadcrumbs={showBreadcrumbs}
          breadcrumbs={breadcrumbs}
        />

        {/* Main Content with Page Transition */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex-1 overflow-y-auto",
            "p-4 lg:p-6",
            "bg-muted/30",
            className
          )}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}