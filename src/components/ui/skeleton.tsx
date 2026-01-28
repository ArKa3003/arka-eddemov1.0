// @ts-nocheck
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const skeletonVariants = cva(
  "animate-shimmer bg-muted rounded-md",
  {
    variants: {
      variant: {
        text: "h-4 w-full",
        circle: "rounded-full",
        rectangle: "w-full",
        card: "rounded-lg border shadow-sm",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
);

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  /**
   * Width of the skeleton (e.g., "100%", "200px", "w-1/2")
   */
  width?: string | number;
  /**
   * Height of the skeleton (e.g., "100%", "40px", "h-10")
   */
  height?: string | number;
}

/**
 * Skeleton loader component with shimmer animation.
 * Supports multiple variants for different content types.
 * 
 * @example
 * ```tsx
 * <Skeleton variant="text" width="80%" />
 * <Skeleton variant="circle" width={40} height={40} />
 * <Skeleton variant="card" width="100%" height={200} />
 * ```
 */
export function Skeleton({
  className,
  variant,
  width,
  height,
  style,
  ...props
}: SkeletonProps) {
  const computedStyle = React.useMemo(() => {
    const styles: React.CSSProperties = { ...style };
    
    if (width) {
      styles.width = typeof width === "number" ? `${width}px` : width;
    }
    
    if (height) {
      styles.height = typeof height === "number" ? `${height}px` : height;
    }
    
    return styles;
  }, [width, height, style]);

  return (
    <div
      className={cn(skeletonVariants({ variant }), className)}
      style={computedStyle}
      aria-busy="true"
      aria-live="polite"
      {...props}
    />
  );
}

// ============================================================================
// Specific Skeleton Components
// ============================================================================

/**
 * CaseCardSkeleton - Skeleton for case cards
 */
export function CaseCardSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 space-y-4"
        >
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex gap-2 pt-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-8 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * DashboardStatsSkeleton - Skeleton for dashboard stats cards
 */
export function DashboardStatsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
        >
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-5 rounded" />
          </div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-3 w-20" />
        </div>
      ))}
    </div>
  );
}

/**
 * ChartSkeleton - Skeleton for chart components
 */
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="p-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
      style={{ height: `${height}px` }}
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-8 w-32 rounded-md" />
      </div>
      <div className="flex items-end justify-between gap-2 h-[calc(100%-60px)]">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t"
            style={{
              height: `${Math.random() * 60 + 20}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * TableRowSkeleton - Skeleton for table rows
 */
export function TableRowSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex gap-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="flex gap-4 p-3 border-b border-slate-100 dark:border-slate-800"
        >
          {Array.from({ length: columns }).map((_, j) => (
            <Skeleton key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}