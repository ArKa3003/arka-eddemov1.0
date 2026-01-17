"use client";

import * as React from "react";
import * as Select from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Select root component using Radix UI.
 * Manages select state and open/close behavior.
 * 
 * @example
 * ```tsx
 * <SelectRoot value={value} onValueChange={setValue}>
 *   <SelectTrigger placeholder="Select option" />
 *   <SelectContent>
 *     <SelectItem value="option1">Option 1</SelectItem>
 *     <SelectItem value="option2">Option 2</SelectItem>
 *   </SelectContent>
 * </SelectRoot>
 * ```
 */
export const SelectRoot = Select.Root;

export interface SelectTriggerProps extends Select.SelectTriggerProps {
  /**
   * Show search input in trigger (for searchable select)
   */
  searchable?: boolean;
  /**
   * Search placeholder text
   */
  searchPlaceholder?: string;
  /**
   * Current search query
   */
  searchQuery?: string;
  /**
   * Search query change handler
   */
  onSearchChange?: (query: string) => void;
}

/**
 * Select trigger button matching Input component styling.
 * Supports search functionality for filterable selects.
 */
export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, searchable, searchPlaceholder, searchQuery, onSearchChange, ...props }, ref) => {
    if (searchable) {
      return (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder={searchPlaceholder || "Search..."}
            value={searchQuery || ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-9 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            onClick={(e) => {
              // Prevent default select behavior when clicking search
              e.stopPropagation();
            }}
          />
          <Select.Trigger
            ref={ref}
            className="absolute inset-0 opacity-0"
            {...props}
          />
        </div>
      );
    }

    return (
      <Select.Trigger
        ref={ref}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
          className
        )}
        {...props}
      >
        {children}
        <Select.Icon asChild>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Select.Icon>
      </Select.Trigger>
    );
  }
);
SelectTrigger.displayName = "SelectTrigger";

/**
 * Select value display component.
 */
export const SelectValue = Select.Value;

export interface SelectContentProps extends Select.SelectContentProps {
  /**
   * Enable search/filter functionality
   */
  searchable?: boolean;
  /**
   * Search placeholder
   */
  searchPlaceholder?: string;
}

/**
 * Select dropdown content with animated entry.
 * Supports search/filter functionality and option groups.
 */
export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, position = "popper", searchable, searchPlaceholder, ...props }, ref) => {
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredChildren = React.useMemo(() => {
      if (!searchable || !searchQuery) return children;

      // Filter children based on search query
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === SelectItem) {
          const text = typeof child.props.children === "string" 
            ? child.props.children 
            : String(child.props.children);
          if (text.toLowerCase().includes(searchQuery.toLowerCase())) {
            return child;
          }
          return null;
        }
        return child;
      });
    }, [children, searchQuery, searchable]);

    return (
      <Select.Portal>
        <AnimatePresence>
          <Select.Content
            ref={ref}
            position={position}
            className={cn(
              "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md",
              position === "popper" &&
                "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
              className
            )}
            {...props}
          >
            {searchable && (
              <div className="border-b p-2">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder={searchPlaceholder || "Search..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex h-8 w-full rounded-md border border-input bg-background pl-8 pr-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                  />
                </div>
              </div>
            )}
            <Select.Viewport
              className={cn(
                "p-1",
                position === "popper" &&
                  "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
              )}
            >
              {filteredChildren}
            </Select.Viewport>
          </Select.Content>
        </AnimatePresence>
      </Select.Portal>
    );
  }
);
SelectContent.displayName = "SelectContent";

export interface SelectItemProps extends Select.SelectItemProps {}

/**
 * Select item with checkmark indicator.
 * Includes animated selection state.
 */
export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <Select.Item
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Select.ItemIndicator>
            <Check className="h-4 w-4" />
          </Select.ItemIndicator>
        </span>
        <Select.ItemText>{children}</Select.ItemText>
      </Select.Item>
    );
  }
);
SelectItem.displayName = "SelectItem";

/**
 * Select group for organizing items.
 */
export const SelectGroup = Select.Group;

/**
 * Select label for group headings.
 */
export const SelectLabel = React.forwardRef<HTMLDivElement, Select.SelectLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <Select.Label
        ref={ref}
        className={cn("px-2 py-1.5 text-sm font-semibold", className)}
        {...props}
      />
    );
  }
);
SelectLabel.displayName = "SelectLabel";

/**
 * Select separator for visual division.
 */
export const SelectSeparator = React.forwardRef<HTMLDivElement, Select.SelectSeparatorProps>(
  ({ className, ...props }, ref) => {
    return (
      <Select.Separator
        ref={ref}
        className={cn("-mx-1 my-1 h-px bg-muted", className)}
        {...props}
      />
    );
  }
);
SelectSeparator.displayName = "SelectSeparator";