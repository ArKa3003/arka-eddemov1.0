// @ts-nocheck
"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} ComparisonRow
 * @property {string} wrong - What others teach (wrong approach)
 * @property {string} right - What you need (right approach)
 */
export interface ComparisonRow {
  wrong: string;
  right: string;
}

/**
 * @typedef {Object} ComparisonTableProps
 * @property {ComparisonRow[]} rows - Comparison rows
 * @property {string} [leftHeader] - Left column header
 * @property {string} [rightHeader] - Right column header
 * @property {string} [className] - Additional CSS classes
 */
export interface ComparisonTableProps {
  rows: ComparisonRow[];
  leftHeader?: string;
  rightHeader?: string;
  className?: string;
}

/**
 * Two-column comparison table showing wrong vs right approaches.
 */
export function ComparisonTable({
  rows,
  leftHeader = "What Others Teach",
  rightHeader = "What You Need",
  className,
}: ComparisonTableProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className={cn(
        "w-full max-w-4xl mx-auto rounded-2xl overflow-hidden",
        "border border-slate-800 bg-slate-900/50 backdrop-blur-sm",
        className
      )}
    >
      {/* Headers */}
      <div className="grid grid-cols-2 border-b border-slate-800">
        <div className="p-4 md:p-6 bg-rose-500/10 border-r border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-rose-500/20 flex items-center justify-center">
              <X className="w-3.5 h-3.5 text-rose-400" />
            </div>
            <span className="font-semibold text-rose-400">{leftHeader}</span>
          </div>
        </div>
        <div className="p-4 md:p-6 bg-emerald-500/10">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-semibold text-emerald-400">{rightHeader}</span>
          </div>
        </div>
      </div>

      {/* Rows */}
      {rows.map((row, index) => (
        <motion.div
          key={index}
          className={cn(
            "grid grid-cols-2",
            index < rows.length - 1 && "border-b border-slate-800/50"
          )}
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          {/* Wrong */}
          <div className="p-4 md:p-6 border-r border-slate-800/50 flex items-center">
            <span className="text-slate-400 text-sm md:text-base">
              {row.wrong}
            </span>
          </div>
          {/* Right */}
          <div className="p-4 md:p-6 flex items-center">
            <span className="text-white text-sm md:text-base font-medium">
              {row.right}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/**
 * Alternative visual comparison with cards
 */
export function ComparisonCards({
  rows,
  leftHeader = "What Others Teach",
  rightHeader = "What You Need",
  className,
}: ComparisonTableProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div
      ref={ref}
      className={cn("grid md:grid-cols-2 gap-6", className)}
    >
      {/* Wrong column */}
      <motion.div
        className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20"
        initial={{ opacity: 0, x: -20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-rose-500/20 flex items-center justify-center">
            <X className="w-4 h-4 text-rose-400" />
          </div>
          <h4 className="font-semibold text-rose-400">{leftHeader}</h4>
        </div>
        <ul className="space-y-4">
          {rows.map((row, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3 text-slate-400"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <X className="w-4 h-4 text-rose-500/50 mt-0.5 flex-shrink-0" />
              <span>{row.wrong}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Right column */}
      <motion.div
        className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20"
        initial={{ opacity: 0, x: 20 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <Check className="w-4 h-4 text-emerald-400" />
          </div>
          <h4 className="font-semibold text-emerald-400">{rightHeader}</h4>
        </div>
        <ul className="space-y-4">
          {rows.map((row, index) => (
            <motion.li
              key={index}
              className="flex items-start gap-3 text-white"
              initial={{ opacity: 0, x: 10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <Check className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
              <span>{row.right}</span>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
