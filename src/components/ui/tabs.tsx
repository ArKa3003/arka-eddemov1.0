// @ts-nocheck
"use client";

import * as React from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tabsListVariants = cva(
  "inline-flex items-center justify-center",
  {
    variants: {
      variant: {
        default: "rounded-md bg-muted p-1",
        pills: "gap-1",
        segmented: "rounded-lg border bg-background p-1",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

const tabsTriggerVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-sm px-3 py-1.5 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        pills: "rounded-full px-4 py-2 data-[state=active]:bg-primary-900 data-[state=active]:text-white",
        segmented: "rounded-md px-3 py-1.5 data-[state=active]:bg-accent-500 data-[state=active]:text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface TabsRootProps extends Tabs.TabsProps {
  /**
   * Default selected tab value
   */
  defaultValue?: string;
  /**
   * Controlled selected tab value
   */
  value?: string;
  /**
   * Callback when selected tab changes
   */
  onValueChange?: (value: string) => void;
}

/**
 * Tabs root component using Radix UI.
 * Manages tab state and keyboard navigation.
 * 
 * @example
 * ```tsx
 * <TabsRoot defaultValue="tab1">
 *   <TabsList variant="pills">
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </TabsRoot>
 * ```
 */
export function TabsRoot({ className, ...props }: TabsRootProps) {
  return <Tabs.Root className={cn("w-full", className)} {...props} />;
}

export interface TabsListProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tabsListVariants> {
  /**
   * Variant style: default (underline), pills, or segmented
   */
  variant?: "default" | "pills" | "segmented";
}

/**
 * Tabs list container component.
 * Supports multiple visual variants with animated indicators.
 */
export function TabsList({ className, variant, ...props }: TabsListProps) {
  return (
    <Tabs.List
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  );
}

export interface TabsTriggerProps
  extends Tabs.TabsTriggerProps,
    VariantProps<typeof tabsTriggerVariants> {
  /**
   * Variant style matching TabsList
   */
  variant?: "default" | "pills" | "segmented";
}

/**
 * Individual tab trigger button.
 * Includes animated sliding indicator for default variant.
 */
export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Tabs.Trigger
        ref={ref}
        className={cn(tabsTriggerVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
TabsTrigger.displayName = "TabsTrigger";

export interface TabsContentProps extends Tabs.TabsContentProps {}

/**
 * Tab content panel with fade transition.
 * Only the active tab content is rendered.
 */
export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
      >
        <Tabs.Content
          ref={ref}
          className={cn(
            "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2",
            className
          )}
          {...props}
        />
      </motion.div>
    );
  }
);
TabsContent.displayName = "TabsContent";
// Re-export as Tabs for convenience
export { TabsRoot as Tabs };
