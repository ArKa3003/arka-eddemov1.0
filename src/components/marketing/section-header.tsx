"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} SectionHeaderProps
 * @property {string} [badge] - Optional badge text above headline
 * @property {LucideIcon} [badgeIcon] - Optional icon for badge
 * @property {"default" | "success" | "warning" | "danger" | "info"} [badgeVariant] - Badge color variant
 * @property {string} headline - Main headline
 * @property {string} [subtitle] - Supporting subtitle text
 * @property {"left" | "center" | "right"} [align] - Text alignment
 * @property {"sm" | "md" | "lg"} [size] - Text size
 * @property {"light" | "dark"} [theme] - Color theme
 * @property {string} [className] - Additional CSS classes
 */
export interface SectionHeaderProps {
  badge?: string;
  badgeIcon?: LucideIcon;
  badgeVariant?: "default" | "success" | "warning" | "danger" | "info";
  headline: string;
  subtitle?: string;
  align?: "left" | "center" | "right";
  size?: "sm" | "md" | "lg";
  theme?: "light" | "dark";
  className?: string;
}

const badgeVariantClasses = {
  default: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  danger: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

const alignClasses = {
  left: "text-left",
  center: "text-center mx-auto",
  right: "text-right ml-auto",
};

const sizeClasses = {
  sm: {
    headline: "text-2xl md:text-3xl",
    subtitle: "text-base",
    maxWidth: "max-w-xl",
  },
  md: {
    headline: "text-3xl md:text-4xl",
    subtitle: "text-lg",
    maxWidth: "max-w-2xl",
  },
  lg: {
    headline: "text-4xl md:text-5xl lg:text-6xl",
    subtitle: "text-xl",
    maxWidth: "max-w-3xl",
  },
};

/**
 * Reusable section header with badge, headline, and subtitle.
 * Consistent pattern for marketing page sections.
 */
export function SectionHeader({
  badge,
  badgeIcon: BadgeIcon,
  badgeVariant = "default",
  headline,
  subtitle,
  align = "center",
  size = "md",
  theme = "dark",
  className,
}: SectionHeaderProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const sizes = sizeClasses[size];
  const isLight = theme === "light";

  return (
    <div
      ref={ref}
      className={cn(
        "mb-12 md:mb-16",
        alignClasses[align],
        sizes.maxWidth,
        className
      )}
    >
      {/* Badge */}
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
          className={cn(
            "mb-4",
            align === "center" && "flex justify-center",
            align === "right" && "flex justify-end"
          )}
        >
          <Badge
            variant="secondary"
            className={cn("px-3 py-1", badgeVariantClasses[badgeVariant])}
          >
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 mr-1.5" />}
            {badge}
          </Badge>
        </motion.div>
      )}

      {/* Headline */}
      <motion.h2
        className={cn(
          "font-display font-bold leading-tight",
          sizes.headline,
          isLight ? "text-slate-900" : "text-white"
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {headline}
      </motion.h2>

      {/* Subtitle */}
      {subtitle && (
        <motion.p
          className={cn(
            "mt-4 leading-relaxed",
            sizes.subtitle,
            isLight ? "text-slate-600" : "text-slate-400"
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/**
 * Section wrapper with consistent padding and max-width
 */
export interface SectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  containerClassName?: string;
}

export function Section({
  children,
  id,
  className,
  containerClassName,
}: SectionProps) {
  return (
    <section id={id} className={cn("py-16 md:py-24 px-4", className)}>
      <div className={cn("max-w-7xl mx-auto", containerClassName)}>
        {children}
      </div>
    </section>
  );
}
