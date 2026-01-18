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