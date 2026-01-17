"use client";

import * as React from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

/**
 * Tooltip provider component.
 * Must wrap the application or tooltip sections.
 * 
 * @example
 * ```tsx
 * <TooltipProvider delayDuration={300}>
 *   <TooltipRoot>
 *     <TooltipTrigger>Hover me</TooltipTrigger>
 *     <TooltipContent side="top" showArrow>
 *       Tooltip content
 *     </TooltipContent>
 *   </TooltipRoot>
 * </TooltipProvider>
 * ```
 */
export const TooltipProvider = Tooltip.Provider;

export interface TooltipRootProps extends Tooltip.TooltipProps {
  /**
   * Delay before showing tooltip (ms)
   */
  delayDuration?: number;
  /**
   * Delay before hiding tooltip (ms)
   */
  skipDelayDuration?: number;
}

/**
 * Tooltip root component managing open/close state.
 */
export const TooltipRoot = Tooltip.Root;

/**
 * Element that triggers the tooltip on hover or focus.
 */
export const TooltipTrigger = Tooltip.Trigger;

export interface TooltipContentProps extends Tooltip.TooltipContentProps {
  /**
   * Show arrow pointer
   */
  showArrow?: boolean;
  /**
   * Position of the tooltip
   */
  side?: "top" | "right" | "bottom" | "left";
  /**
   * Alignment of the tooltip
   */
  align?: "start" | "center" | "end";
  /**
   * Additional side offset in pixels
   */
  sideOffset?: number;
}

/**
 * Tooltip content with arrow support and positioning.
 * Includes fade animations and arrow pointer.
 */
export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  ({ className, showArrow = false, side = "top", align = "center", sideOffset = 4, ...props }, ref) => {
    return (
      <Tooltip.Portal>
        <Tooltip.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        >
          {props.children}
          {showArrow && (
            <Tooltip.Arrow className="fill-popover" width={11} height={5} />
          )}
        </Tooltip.Content>
      </Tooltip.Portal>
    );
  }
);
TooltipContent.displayName = "TooltipContent";
/**
 * Simple Tooltip component for basic usage
 */
export function Tooltip({
  children,
  content,
  side = "top",
  delayDuration = 200,
}: {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  delayDuration?: number;
}) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <TooltipRoot>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} showArrow>
          {content}
        </TooltipContent>
      </TooltipRoot>
    </TooltipProvider>
  );
}
