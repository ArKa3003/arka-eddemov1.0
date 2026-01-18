"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

// ============================================================================
// Types
// ============================================================================

export interface PageTransitionProps {
  children: React.ReactNode;
  /** Transition mode */
  mode?: "fade" | "slide" | "scale" | "slideUp";
  /** Animation duration in seconds */
  duration?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Custom class name */
  className?: string;
}

// ============================================================================
// Animation Variants
// ============================================================================

const variants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
  },
};

// ============================================================================
// PageTransition Component
// ============================================================================

/**
 * Page transition wrapper component.
 * Wraps page content to provide animated transitions between routes.
 *
 * @example
 * ```tsx
 * <PageTransition>
 *   <YourPageContent />
 * </PageTransition>
 * ```
 */
export function PageTransition({
  children,
  mode = "slideUp",
  duration = 0.3,
  delay = 0,
  className,
}: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants[mode]}
        transition={{
          duration,
          delay,
          ease: [0.25, 0.1, 0.25, 1], // Custom easing
        }}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ============================================================================
// PageWrapper - Simplified version for layouts
// ============================================================================

export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Simplified page wrapper with default fade + slide up animation.
 */
export function PageWrapper({ children, className }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// RouteTransition - For layout-level transitions
// ============================================================================

export interface RouteTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Route transition for wrapping entire layouts.
 * Uses AnimatePresence for proper exit animations.
 */
export function RouteTransition({ children, className }: RouteTransitionProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className={className}
      >
        {children}
      </motion.main>
    </AnimatePresence>
  );
}
