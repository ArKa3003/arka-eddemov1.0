"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} StatItem
 * @property {string} value - The stat value (can include symbols like $, %, +)
 * @property {string} label - Description of the stat
 * @property {LucideIcon} [icon] - Optional icon
 * @property {string} [prefix] - Prefix before number (e.g., "$")
 * @property {string} [suffix] - Suffix after number (e.g., "%", "+", "B")
 */
export interface StatItem {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  prefix?: string;
  suffix?: string;
}

/**
 * @typedef {Object} StatsBarProps
 * @property {StatItem[]} stats - Array of stat items
 * @property {"light" | "dark"} [variant] - Color variant
 * @property {string} [className] - Additional CSS classes
 */
export interface StatsBarProps {
  stats: StatItem[];
  variant?: "light" | "dark";
  className?: string;
}

/**
 * Hook for animated count-up effect
 */
function useCountUp(end: number, duration: number = 2000, start: boolean = true) {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!start) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function (ease-out)
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

/**
 * Individual stat display with count-up animation
 */
function StatDisplay({
  stat,
  variant,
  isVisible,
}: {
  stat: StatItem;
  variant: "light" | "dark";
  isVisible: boolean;
}) {
  const Icon = stat.icon;
  
  // Extract numeric value
  const numericValue = typeof stat.value === "number" 
    ? stat.value 
    : parseFloat(stat.value.toString().replace(/[^0-9.]/g, ""));
  
  const count = useCountUp(numericValue, 2000, isVisible);

  return (
    <div className="flex flex-col items-center text-center px-4 py-2">
      {Icon && (
        <div
          className={cn(
            "w-10 h-10 rounded-lg flex items-center justify-center mb-2",
            variant === "dark" ? "bg-slate-800" : "bg-slate-100"
          )}
        >
          <Icon
            className={cn(
              "w-5 h-5",
              variant === "dark" ? "text-cyan-400" : "text-cyan-600"
            )}
          />
        </div>
      )}
      <div
        className={cn(
          "text-2xl sm:text-3xl md:text-4xl font-bold tabular-nums",
          variant === "dark" ? "text-white" : "text-slate-900"
        )}
      >
        {stat.prefix}
        {count}
        {stat.suffix}
      </div>
      <div
        className={cn(
          "text-sm mt-1",
          variant === "dark" ? "text-slate-400" : "text-slate-600"
        )}
      >
        {stat.label}
      </div>
    </div>
  );
}

/**
 * Horizontal stats bar with count-up animation and responsive layout.
 */
export function StatsBar({ stats, variant = "dark", className }: StatsBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "rounded-2xl border backdrop-blur-sm",
        variant === "dark"
          ? "bg-slate-900/80 border-slate-800"
          : "bg-white/80 border-slate-200",
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 md:p-8">
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <StatDisplay stat={stat} variant={variant} isVisible={isInView} />
            {index < stats.length - 1 && (
              <div
                className={cn(
                  "hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12",
                  variant === "dark" ? "bg-slate-700" : "bg-slate-200"
                )}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * Inline stats bar variant for compact displays
 */
export function StatsBarInline({
  stats,
  variant = "dark",
  className,
}: StatsBarProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "flex flex-wrap items-center justify-center gap-6 md:gap-12",
        className
      )}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5 }}
    >
      {stats.map((stat, index) => (
        <div key={index} className="flex items-center gap-2">
          {stat.icon && (
            <stat.icon
              className={cn(
                "w-5 h-5",
                variant === "dark" ? "text-cyan-400" : "text-cyan-600"
              )}
            />
          )}
          <span
            className={cn(
              "text-lg font-bold",
              variant === "dark" ? "text-white" : "text-slate-900"
            )}
          >
            {stat.prefix}
            {stat.value}
            {stat.suffix}
          </span>
          <span
            className={cn(
              "text-sm",
              variant === "dark" ? "text-slate-400" : "text-slate-600"
            )}
          >
            {stat.label}
          </span>
        </div>
      ))}
    </motion.div>
  );
}
