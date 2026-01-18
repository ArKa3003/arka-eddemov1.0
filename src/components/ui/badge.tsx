// @ts-nocheck
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary-100 text-primary-800 border-primary-200",
        primary: "bg-primary-900 text-white border-primary-950",
        success: "bg-appropriate-50 text-appropriate-700 border-appropriate-200",
        warning: "bg-maybe-50 text-maybe-700 border-maybe-200",
        danger: "bg-inappropriate-50 text-inappropriate-700 border-inappropriate-200",
        info: "bg-accent-50 text-accent-700 border-accent-200",
        em: "bg-specialty-em/10 text-red-700 border-red-200",
        im: "bg-blue-50 text-blue-700 border-blue-200",
        fm: "bg-appropriate-50 text-appropriate-700 border-appropriate-200",
        surgery: "bg-purple-50 text-purple-700 border-purple-200",
        peds: "bg-teal-50 text-teal-700 border-teal-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
      shape: {
        default: "rounded-md",
        pill: "rounded-full",
      },
      outline: {
        true: "bg-transparent border-2",
        false: "border",
      },
    },
    compoundVariants: [
      {
        variant: "default",
        outline: true,
        class: "text-primary-800 border-primary-300",
      },
      {
        variant: "primary",
        outline: true,
        class: "text-primary-900 border-primary-400",
      },
      {
        variant: "success",
        outline: true,
        class: "text-appropriate-700 border-appropriate-300",
      },
      {
        variant: "warning",
        outline: true,
        class: "text-maybe-700 border-maybe-300",
      },
      {
        variant: "danger",
        outline: true,
        class: "text-inappropriate-700 border-inappropriate-300",
      },
      {
        variant: "info",
        outline: true,
        class: "text-accent-700 border-accent-300",
      },
      {
        variant: "em",
        outline: true,
        class: "text-red-700 border-red-300",
      },
      {
        variant: "im",
        outline: true,
        class: "text-blue-700 border-blue-300",
      },
      {
        variant: "fm",
        outline: true,
        class: "text-appropriate-700 border-appropriate-300",
      },
      {
        variant: "surgery",
        outline: true,
        class: "text-purple-700 border-purple-300",
      },
      {
        variant: "peds",
        outline: true,
        class: "text-teal-700 border-teal-300",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "md",
      shape: "pill",
      outline: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  /**
   * Show a dot indicator before the badge content
   */
  dot?: boolean;
  /**
   * Icon to display before the badge content
   */
  icon?: React.ReactNode;
}

/**
 * Badge component with multiple variants, sizes, and customization options.
 * Supports specialty colors, dot indicators, icons, and outline style.
 * 
 * @example
 * ```tsx
 * <Badge variant="success" size="md" dot>Completed</Badge>
 * <Badge variant="em" outline icon={<Icon />}>Emergency Medicine</Badge>
 * <Badge variant="primary" shape="default">Primary Badge</Badge>
 * ```
 */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, shape, outline, dot, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, shape, outline }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              "mr-1.5 h-2 w-2 rounded-full",
              size === "sm" && "h-1.5 w-1.5 mr-1",
              size === "lg" && "h-2.5 w-2.5 mr-2"
            )}
            aria-hidden="true"
          />
        )}
        {icon && !dot && (
          <span
            className={cn(
              "mr-1.5 flex-shrink-0",
              size === "sm" && "mr-1 h-3 w-3",
              size === "md" && "h-3.5 w-3.5",
              size === "lg" && "h-4 w-4 mr-2"
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
        {children}
      </div>
    );
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };