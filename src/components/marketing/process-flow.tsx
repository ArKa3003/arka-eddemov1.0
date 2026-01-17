"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} ProcessStep
 * @property {number} step - Step number
 * @property {string} title - Step title
 * @property {string} [description] - Step description
 * @property {LucideIcon} icon - Lucide icon component
 */
export interface ProcessStep {
  step: number;
  title: string;
  description?: string;
  icon: LucideIcon;
}

/**
 * @typedef {Object} ProcessFlowProps
 * @property {ProcessStep[]} steps - Array of process steps
 * @property {"horizontal" | "vertical"} [layout] - Layout direction
 * @property {string} [className] - Additional CSS classes
 */
export interface ProcessFlowProps {
  steps: ProcessStep[];
  layout?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Process flow visualization with numbered steps, connecting lines, and stagger animation.
 */
export function ProcessFlow({
  steps,
  layout = "horizontal",
  className,
}: ProcessFlowProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const isHorizontal = layout === "horizontal";

  return (
    <div
      ref={ref}
      className={cn(
        "w-full",
        isHorizontal
          ? "flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-4"
          : "flex flex-col gap-6",
        className
      )}
    >
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.step}>
            {/* Step item */}
            <motion.div
              className={cn(
                "flex items-start gap-4",
                isHorizontal
                  ? "flex-col items-center text-center md:flex-1"
                  : "flex-row"
              )}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.5,
                delay: index * 0.15,
              }}
            >
              {/* Icon container with number */}
              <div className="relative">
                <motion.div
                  className={cn(
                    "w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20",
                    "border border-cyan-500/30 flex items-center justify-center",
                    "shadow-lg shadow-cyan-500/10"
                  )}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Icon className="w-7 h-7 text-cyan-400" />
                </motion.div>
                {/* Step number badge */}
                <div
                  className={cn(
                    "absolute -top-2 -right-2 w-6 h-6 rounded-full",
                    "bg-cyan-500 text-white text-xs font-bold",
                    "flex items-center justify-center shadow-lg"
                  )}
                >
                  {step.step}
                </div>
              </div>

              {/* Content */}
              <div className={cn(isHorizontal ? "mt-4" : "pt-1")}>
                <h4 className="text-lg font-semibold text-white mb-1">
                  {step.title}
                </h4>
                {step.description && (
                  <p className="text-sm text-slate-400 max-w-[200px]">
                    {step.description}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Connector line */}
            {!isLast && (
              <motion.div
                className={cn(
                  isHorizontal
                    ? "hidden md:block flex-1 max-w-[100px] h-[2px]"
                    : "ml-8 w-[2px] h-12"
                )}
                initial={{ scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }}
                animate={
                  isInView
                    ? { scaleX: 1, scaleY: 1 }
                    : { scaleX: isHorizontal ? 0 : 1, scaleY: isHorizontal ? 1 : 0 }
                }
                transition={{
                  duration: 0.4,
                  delay: index * 0.15 + 0.3,
                }}
                style={{
                  background: "linear-gradient(90deg, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.1) 100%)",
                  transformOrigin: "left center",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

/**
 * Compact process flow for smaller spaces
 */
export function ProcessFlowCompact({
  steps,
  className,
}: Omit<ProcessFlowProps, "layout">) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div ref={ref} className={cn("flex items-center justify-center gap-2", className)}>
      {steps.map((step, index) => {
        const Icon = step.icon;
        const isLast = index === steps.length - 1;

        return (
          <React.Fragment key={step.step}>
            <motion.div
              className="flex items-center gap-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg bg-slate-800 border border-slate-700",
                  "flex items-center justify-center"
                )}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
              </div>
              <span className="text-sm font-medium text-slate-300 hidden sm:block">
                {step.title}
              </span>
            </motion.div>

            {!isLast && (
              <motion.div
                className="w-8 h-[2px] bg-gradient-to-r from-slate-700 to-slate-800"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.3, delay: index * 0.1 + 0.15 }}
                style={{ transformOrigin: "left" }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
