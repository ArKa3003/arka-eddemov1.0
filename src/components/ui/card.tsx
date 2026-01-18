// @ts-nocheck
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground",
  {
    variants: {
      variant: {
        default: "shadow-card",
        elevated: "shadow-card-hover",
        outlined: "border-2 shadow-none",
        interactive: "shadow-card cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1",
        glass: "glass border-transparent shadow-soft",
      },
      accent: {
        none: "",
        primary: "border-l-4 border-l-primary-900",
        accent: "border-l-4 border-l-accent-500",
        appropriate: "border-l-4 border-l-appropriate-500",
        maybe: "border-l-4 border-l-maybe-500",
        inappropriate: "border-l-4 border-l-inappropriate-500",
      },
    },
    defaultVariants: {
      variant: "default",
      accent: "none",
    },
  }
);

const paddingVariants = cva("", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-6",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Padding size for the card container
   */
  padding?: VariantProps<typeof paddingVariants>["padding"];
}

/**
 * Card component with multiple variants and styling options.
 * Supports elevated, outlined, interactive, and glass morphism variants.
 * 
 * @example
 * ```tsx
 * <Card variant="elevated" accent="primary">
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 *   <CardContent>Content</CardContent>
 * </Card>
 * ```
 */
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, accent, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, accent }), paddingVariants({ padding }), className)}
        {...props}
      />
    );
  }
);
Card.displayName = "Card";

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Padding size override for header
   */
  padding?: VariantProps<typeof paddingVariants>["padding"];
}

/**
 * Card header component with optional padding control.
 */
const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          paddingVariants({ padding: padding || "lg" }),
          "flex flex-col space-y-1.5",
          className
        )}
        {...props}
      />
    );
  }
);
CardHeader.displayName = "CardHeader";

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

/**
 * Card title component for heading text.
 */
const CardTitle = React.forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <h3
        ref={ref}
        className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
        {...props}
      />
    );
  }
);
CardTitle.displayName = "CardTitle";

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

/**
 * Card description component for subtitle or description text.
 */
const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);
CardDescription.displayName = "CardDescription";

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Padding size override for content
   */
  padding?: VariantProps<typeof paddingVariants>["padding"];
}

/**
 * Card content component with optional padding control.
 */
const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(paddingVariants({ padding: padding || "lg" }), "pt-0", className)}
        {...props}
      />
    );
  }
);
CardContent.displayName = "CardContent";

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Padding size override for footer
   */
  padding?: VariantProps<typeof paddingVariants>["padding"];
}

/**
 * Card footer component with optional padding control.
 */
const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          paddingVariants({ padding: padding || "lg" }),
          "flex items-center pt-0",
          className
        )}
        {...props}
      />
    );
  }
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, cardVariants };