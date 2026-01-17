"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} FeatureCardProps
 * @property {LucideIcon} icon - Lucide icon component
 * @property {string} title - Feature title
 * @property {string} description - Feature description
 * @property {string} [color] - Color theme (cyan, emerald, amber, violet, blue, rose)
 * @property {string} [href] - Optional link
 * @property {string} [className] - Additional CSS classes
 */
export interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  color?: "cyan" | "emerald" | "amber" | "violet" | "blue" | "rose";
  href?: string;
  className?: string;
}

const colorVariants = {
  cyan: {
    bg: "bg-cyan-500/10",
    icon: "text-cyan-500",
    border: "group-hover:border-cyan-500/30",
    glow: "group-hover:shadow-cyan-500/10",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    icon: "text-emerald-500",
    border: "group-hover:border-emerald-500/30",
    glow: "group-hover:shadow-emerald-500/10",
  },
  amber: {
    bg: "bg-amber-500/10",
    icon: "text-amber-500",
    border: "group-hover:border-amber-500/30",
    glow: "group-hover:shadow-amber-500/10",
  },
  violet: {
    bg: "bg-violet-500/10",
    icon: "text-violet-500",
    border: "group-hover:border-violet-500/30",
    glow: "group-hover:shadow-violet-500/10",
  },
  blue: {
    bg: "bg-blue-500/10",
    icon: "text-blue-500",
    border: "group-hover:border-blue-500/30",
    glow: "group-hover:shadow-blue-500/10",
  },
  rose: {
    bg: "bg-rose-500/10",
    icon: "text-rose-500",
    border: "group-hover:border-rose-500/30",
    glow: "group-hover:shadow-rose-500/10",
  },
};

/**
 * Feature card with icon, title, description, and hover animations.
 * Used in feature grids on marketing pages.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  color = "cyan",
  href,
  className,
}: FeatureCardProps) {
  const colors = colorVariants[color];

  const CardWrapper = href ? motion.a : motion.div;
  const wrapperProps = href ? { href } : {};

  return (
    <CardWrapper
      {...wrapperProps}
      className={cn(
        "group relative p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-sm",
        "transition-all duration-300",
        colors.border,
        colors.glow,
        "hover:shadow-xl hover:-translate-y-1",
        href && "cursor-pointer",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon container */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
          colors.bg
        )}
      >
        <Icon className={cn("w-6 h-6", colors.icon)} />
      </div>

      {/* Content */}
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>

      {/* Hover gradient overlay */}
      <div
        className={cn(
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
          "bg-gradient-to-br from-transparent via-transparent to-slate-800/20"
        )}
      />
    </CardWrapper>
  );
}

/**
 * @typedef {Object} FeatureGridProps
 * @property {React.ReactNode} children - FeatureCard components
 * @property {2 | 3 | 4} [columns] - Number of columns
 * @property {string} [className] - Additional CSS classes
 */
export interface FeatureGridProps {
  children: React.ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * Grid container for FeatureCard components with stagger animation.
 */
export function FeatureGrid({
  children,
  columns = 3,
  className,
}: FeatureGridProps) {
  const columnClasses = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-2 lg:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <motion.div
      className={cn(
        "grid grid-cols-1 gap-6",
        columnClasses[columns],
        className
      )}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.5 }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}
