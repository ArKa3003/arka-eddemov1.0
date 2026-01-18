// @ts-nocheck
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * @typedef {Object} AuthFormProps
 * @property {string} title - Form title
 * @property {string} [subtitle] - Form subtitle/description
 * @property {React.ReactNode} children - Form content
 * @property {React.ReactNode} [footer] - Footer content (links, etc.)
 * @property {string} [className] - Additional CSS classes
 */
export interface AuthFormProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

/**
 * Consistent wrapper for authentication forms.
 * Provides title, subtitle, and footer areas.
 */
export function AuthForm({
  title,
  subtitle,
  children,
  footer,
  className,
}: AuthFormProps) {
  return (
    <motion.div
      className={cn("w-full", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-display font-bold text-slate-900 mb-2">
          {title}
        </h1>
        {subtitle && <p className="text-slate-600">{subtitle}</p>}
      </div>

      {/* Form content */}
      <div className="space-y-6">{children}</div>

      {/* Footer */}
      {footer && <div className="mt-8 text-center">{footer}</div>}
    </motion.div>
  );
}

/**
 * Divider with text (e.g., "or continue with")
 */
export function AuthDivider({ text = "or continue with" }: { text?: string }) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-slate-200" />
      </div>
      <div className="relative flex justify-center text-sm">
        <span className="px-4 bg-white text-slate-500">{text}</span>
      </div>
    </div>
  );
}

/**
 * Form error message display
 */
export function AuthError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <motion.div
      className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {message}
    </motion.div>
  );
}

/**
 * Form success message display
 */
export function AuthSuccess({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <motion.div
      className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {message}
    </motion.div>
  );
}
