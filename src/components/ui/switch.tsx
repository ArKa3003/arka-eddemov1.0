"use client";

import * as React from "react";
import * as Switch from "@radix-ui/react-switch";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const switchVariants = cva(
  "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-accent-500 data-[state=unchecked]:bg-input",
  {
    variants: {
      size: {
        sm: "h-5 w-9",
        md: "h-6 w-11",
        lg: "h-7 w-14",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const switchThumbVariants = cva(
  "pointer-events-none block rounded-full bg-white shadow-lg ring-0 transition-transform",
  {
    variants: {
      size: {
        sm: "h-4 w-4 data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0",
        md: "h-5 w-5 data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0",
        lg: "h-6 w-6 data-[state=checked]:translate-x-7 data-[state=unchecked]:translate-x-0",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface SwitchComponentProps
  extends Switch.SwitchProps,
    VariantProps<typeof switchVariants> {
  /**
   * Label text displayed next to the switch
   */
  label?: string;
  /**
   * Helper text displayed below the switch
   */
  helperText?: string;
}

/**
 * Switch component with smooth transitions and size variants.
 * Supports label and helper text.
 * 
 * @example
 * ```tsx
 * <SwitchComponent
 *   checked={enabled}
 *   onCheckedChange={setEnabled}
 *   size="lg"
 *   label="Enable notifications"
 *   helperText="Receive email updates"
 * />
 * ```
 */
export const SwitchComponent = React.forwardRef<HTMLButtonElement, SwitchComponentProps>(
  ({ className, size, label, helperText, id, disabled, ...props }, ref) => {
    const switchId = id || React.useId();
    const helperId = `${switchId}-helper`;

    return (
      <div className="w-full">
        <div className="flex items-center space-x-3">
          <Switch.Root
            ref={ref}
            id={switchId}
            className={cn(switchVariants({ size }), className)}
            disabled={disabled}
            aria-describedby={helperText ? helperId : undefined}
            {...props}
          >
            <Switch.Thumb className={switchThumbVariants({ size })} />
          </Switch.Root>
          {label && (
            <label
              htmlFor={switchId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {helperText && (
          <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
SwitchComponent.displayName = "Switch";

// Export with multiple names for compatibility
export { SwitchComponent as Switch };