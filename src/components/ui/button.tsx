import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary-900 text-white hover:bg-primary-800 active:bg-primary-950",
        secondary: "bg-accent-500 text-white hover:bg-accent-600 active:bg-accent-700",
        outline: "border-2 border-primary-900 bg-transparent text-primary-900 hover:bg-primary-50 active:bg-primary-100",
        ghost: "bg-transparent text-primary-900 hover:bg-primary-100 active:bg-primary-200",
        danger: "bg-inappropriate-500 text-white hover:bg-inappropriate-600 active:bg-inappropriate-700",
        success: "bg-appropriate-500 text-white hover:bg-appropriate-600 active:bg-appropriate-700",
      },
      size: {
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<"button">, "variants" | "size">,
    VariantProps<typeof buttonVariants> {
  /**
   * Show loading spinner and disable interaction
   */
  loading?: boolean;
  /**
   * Icon to display on the left side of the button
   */
  leftIcon?: React.ReactNode;
  /**
   * Icon to display on the right side of the button
   */
  rightIcon?: React.ReactNode;
  /**
   * Make button full width of its container
   */
  fullWidth?: boolean;
  /**
   * Override the default button element
   */
  asChild?: boolean;
}

/**
 * Button component with multiple variants, sizes, and states.
 * Includes loading state, icon support, and Framer Motion animations.
 * 
 * @example
 * ```tsx
 * <Button variant="primary" size="md" loading={isLoading}>
 *   Submit
 * </Button>
 * 
 * <Button variant="outline" leftIcon={<Icon />} rightIcon={<Arrow />}>
 *   Continue
 * </Button>
 * ```
 */
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      loading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && "w-full",
          className
        )}
        disabled={isDisabled}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        transition={{ duration: 0.1 }}
        aria-busy={loading}
        aria-disabled={isDisabled}
        {...props}
      >
        {loading && (
          <Loader2
            className={cn(
              "mr-2 h-4 w-4 animate-spin",
              size === "xs" && "h-3 w-3 mr-1.5",
              size === "sm" && "h-3.5 w-3.5 mr-1.5",
              size === "lg" && "h-5 w-5 mr-2.5",
              size === "xl" && "h-6 w-6 mr-3"
            )}
            aria-hidden="true"
          />
        )}
        {!loading && leftIcon && (
          <span
            className={cn(
              "mr-2",
              size === "xs" && "mr-1.5",
              size === "sm" && "mr-1.5",
              size === "lg" && "mr-2.5",
              size === "xl" && "mr-3"
            )}
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}
        {children && <span>{children}</span>}
        {!loading && rightIcon && (
          <span
            className={cn(
              "ml-2",
              size === "xs" && "ml-1.5",
              size === "sm" && "ml-1.5",
              size === "lg" && "ml-2.5",
              size === "xl" && "ml-3"
            )}
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };