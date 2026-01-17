"use client";

import * as React from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Checkbox.CheckboxProps {
  /**
   * Label text displayed next to the checkbox
   */
  label?: string;
  /**
   * Error message to display
   */
  error?: string;
  /**
   * Helper text displayed below the checkbox
   */
  helperText?: string;
}

/**
 * Checkbox component with animated checkmark draw effect.
 * Supports label, error, disabled, and indeterminate states.
 * 
 * @example
 * ```tsx
 * <Checkbox
 *   checked={checked}
 *   onCheckedChange={setChecked}
 *   label="Accept terms"
 *   error={errors.terms}
 * />
 * ```
 */
export const CheckboxComponent = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, label, error, helperText, id, disabled, ...props }, ref) => {
    const checkboxId = id || React.useId();
    const errorId = `${checkboxId}-error`;
    const helperId = `${checkboxId}-helper`;

    return (
      <div className="w-full">
        <div className="flex items-start space-x-2">
          <Checkbox.Root
            ref={ref}
            id={checkboxId}
            className={cn(
              "peer h-4 w-4 shrink-0 rounded-sm border border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary-900 data-[state=checked]:text-white data-[state=indeterminate]:bg-primary-900 data-[state=indeterminate]:text-white",
              error && "border-inappropriate-500 focus-visible:ring-inappropriate-500",
              className
            )}
            disabled={disabled}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            {...props}
          >
            <Checkbox.Indicator className="flex items-center justify-center text-current">
              {props.checked === "indeterminate" ? (
                <Minus className="h-4 w-4" strokeWidth={3} />
              ) : (
                <Check className="h-4 w-4 animate-draw-check" strokeWidth={3} />
              )}
            </Checkbox.Indicator>
          </Checkbox.Root>
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
                error && "text-inappropriate-600"
              )}
            >
              {label}
            </label>
          )}
        </div>
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-inappropriate-600"
            role="alert"
            aria-live="polite"
          >
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={helperId} className="mt-1.5 text-sm text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);
CheckboxComponent.displayName = "Checkbox";

// Export with multiple names for compatibility
export { CheckboxComponent as Checkbox };