// @ts-nocheck
"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "@/lib/utils";

// ============================================================================
// Provider
// ============================================================================

/**
 * Tooltip provider component.
 * Must wrap the application or tooltip sections.
 */
export const TooltipProvider = TooltipPrimitive.Provider;

// ============================================================================
// Root (Tooltip)
// ============================================================================

export interface TooltipProps extends TooltipPrimitive.TooltipProps {
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
 * Use as <Tooltip> wrapper around TooltipTrigger and TooltipContent.
 */
export const Tooltip = TooltipPrimitive.Root;

// ============================================================================
// Trigger
// ============================================================================

/**
 * Element that triggers the tooltip on hover or focus.
 */
export const TooltipTrigger = TooltipPrimitive.Trigger;

// ============================================================================
// Content
// ============================================================================

export interface TooltipContentProps
  extends React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content> {
  /**
   * Show arrow pointer
   */
  showArrow?: boolean;
}

/**
 * Tooltip content with arrow support and positioning.
 */
export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  TooltipContentProps
>(
  (
    {
      className,
      showArrow = false,
      side = "top",
      align = "center",
      sideOffset = 4,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Content
          ref={ref}
          side={side}
          align={align}
          sideOffset={sideOffset}
          className={cn(
            "z-50 overflow-hidden rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-900 shadow-md",
            "animate-in fade-in-0 zoom-in-95",
            "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95",
            "data-[side=bottom]:slide-in-from-top-2",
            "data-[side=left]:slide-in-from-right-2",
            "data-[side=right]:slide-in-from-left-2",
            "data-[side=top]:slide-in-from-bottom-2",
            className
          )}
          {...props}
        >
          {children}
          {showArrow && (
            <TooltipPrimitive.Arrow
              className="fill-white drop-shadow-sm"
              width={11}
              height={5}
            />
          )}
        </TooltipPrimitive.Content>
      </TooltipPrimitive.Portal>
    );
  }
);

TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// ============================================================================
// Simple Tooltip Wrapper
// ============================================================================

export interface SimpleTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  delayDuration?: number;
  showArrow?: boolean;
  asChild?: boolean;
}

/**
 * Simple Tooltip component for basic usage.
 * Wraps everything in a single component for convenience.
 *
 * @example
 * <SimpleTooltip content="Hello!">
 *   <button>Hover me</button>
 * </SimpleTooltip>
 */
export function SimpleTooltip({
  children,
  content,
  side = "top",
  align = "center",
  delayDuration = 200,
  showArrow = true,
  asChild = true,
}: SimpleTooltipProps) {
  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align} showArrow={showArrow}>
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
