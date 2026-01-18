// @ts-nocheck
"use client";

import * as React from "react";
import { motion, useInView, Variants } from "framer-motion";

// ============================================================================
// Types
// ============================================================================

export interface StaggerChildrenProps {
  children: React.ReactNode;
  /** Delay between each child animation */
  staggerDelay?: number;
  /** Initial delay before first child animates */
  baseDelay?: number;
  /** Animation duration for each child */
  duration?: number;
  /** Animation direction */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance to animate from (pixels) */
  distance?: number;
  /** Use Intersection Observer to trigger */
  triggerOnView?: boolean;
  /** Only animate once when in view */
  once?: boolean;
  /** Intersection threshold (0-1) */
  viewThreshold?: number;
  /** Additional className for container */
  className?: string;
  /** Render as different element */
  as?: "div" | "ul" | "ol" | "section" | "article";
}

export interface StaggerItemProps {
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Custom index (used internally) */
  index?: number;
}

// ============================================================================
// Context
// ============================================================================

interface StaggerContextValue {
  staggerDelay: number;
  baseDelay: number;
  duration: number;
  direction: StaggerChildrenProps["direction"];
  distance: number;
  isInView: boolean;
  shouldAnimate: boolean;
}

const StaggerContext = React.createContext<StaggerContextValue | null>(null);

function useStaggerContext() {
  const context = React.useContext(StaggerContext);
  if (!context) {
    throw new Error("StaggerItem must be used within StaggerChildren");
  }
  return context;
}

// ============================================================================
// Animation Variants
// ============================================================================

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1, // Default, overridden by custom transition
    },
  },
};

const createItemVariants = (
  direction: StaggerChildrenProps["direction"],
  distance: number
): Variants => {
  const offsets = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...offsets[direction || "none"],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};

// ============================================================================
// StaggerChildren Component
// ============================================================================

/**
 * Container for staggered child animations.
 * Children will animate in sequence with configurable delays.
 *
 * @example
 * ```tsx
 * <StaggerChildren staggerDelay={0.1} direction="up">
 *   <StaggerItem>Card 1</StaggerItem>
 *   <StaggerItem>Card 2</StaggerItem>
 *   <StaggerItem>Card 3</StaggerItem>
 * </StaggerChildren>
 * ```
 */
export function StaggerChildren({
  children,
  staggerDelay = 0.1,
  baseDelay = 0,
  duration = 0.4,
  direction = "up",
  distance = 20,
  triggerOnView = false,
  once = true,
  viewThreshold = 0.1,
  className,
  as = "div",
}: StaggerChildrenProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: viewThreshold,
  });

  const shouldAnimate = triggerOnView ? isInView : true;

  const MotionComponent = motion[as];

  const contextValue: StaggerContextValue = {
    staggerDelay,
    baseDelay,
    duration,
    direction,
    distance,
    isInView,
    shouldAnimate,
  };

  return (
    <StaggerContext.Provider value={contextValue}>
      <MotionComponent
        ref={ref as any}
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
        variants={containerVariants}
        transition={{
          staggerChildren: staggerDelay,
          delayChildren: baseDelay,
        }}
        className={className}
      >
        {children}
      </MotionComponent>
    </StaggerContext.Provider>
  );
}

// ============================================================================
// StaggerItem Component
// ============================================================================

/**
 * Individual item within StaggerChildren container.
 * Automatically receives staggered animation.
 */
export function StaggerItem({ children, className }: StaggerItemProps) {
  const { direction, distance, duration } = useStaggerContext();

  const variants = React.useMemo(
    () => createItemVariants(direction, distance),
    [direction, distance]
  );

  return (
    <motion.div
      variants={variants}
      transition={{
        duration,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ============================================================================
// StaggerList - For list items
// ============================================================================

export interface StaggerListProps {
  items: React.ReactNode[];
  /** Stagger delay between items */
  staggerDelay?: number;
  /** Direction of animation */
  direction?: StaggerChildrenProps["direction"];
  /** Trigger on scroll into view */
  triggerOnView?: boolean;
  /** Render as ul or ol */
  listType?: "ul" | "ol";
  /** Container className */
  className?: string;
  /** Item className */
  itemClassName?: string;
}

/**
 * Convenience component for rendering staggered lists.
 */
export function StaggerList({
  items,
  staggerDelay = 0.08,
  direction = "up",
  triggerOnView = false,
  listType = "ul",
  className,
  itemClassName,
}: StaggerListProps) {
  return (
    <StaggerChildren
      as={listType}
      staggerDelay={staggerDelay}
      direction={direction}
      triggerOnView={triggerOnView}
      className={className}
    >
      {items.map((item, index) => (
        <StaggerItem key={index} className={itemClassName}>
          {listType === "ul" || listType === "ol" ? <li>{item}</li> : item}
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}

// ============================================================================
// StaggerGrid - For grid layouts
// ============================================================================

export interface StaggerGridProps {
  children: React.ReactNode;
  /** Number of columns */
  columns?: number;
  /** Gap between items */
  gap?: number;
  /** Stagger delay */
  staggerDelay?: number;
  /** Trigger on scroll */
  triggerOnView?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Grid layout with staggered animation.
 */
export function StaggerGrid({
  children,
  columns = 3,
  gap = 4,
  staggerDelay = 0.08,
  triggerOnView = true,
  className,
}: StaggerGridProps) {
  return (
    <StaggerChildren
      staggerDelay={staggerDelay}
      triggerOnView={triggerOnView}
      direction="up"
      className={`grid gap-${gap} ${
        columns === 2
          ? "grid-cols-2"
          : columns === 3
          ? "grid-cols-3"
          : columns === 4
          ? "grid-cols-4"
          : `grid-cols-${columns}`
      } ${className || ""}`}
    >
      {React.Children.map(children, (child) => (
        <StaggerItem>{child}</StaggerItem>
      ))}
    </StaggerChildren>
  );
}

// ============================================================================
// AnimatedList - Simple list with staggered items
// ============================================================================

export interface AnimatedListProps {
  children: React.ReactNode;
  /** Delay between items */
  delay?: number;
  /** Additional className */
  className?: string;
}

/**
 * Simple animated list where each child appears with a delay.
 */
export function AnimatedList({
  children,
  delay = 0.05,
  className,
}: AnimatedListProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * delay,
            ease: "easeOut",
          }}
        >
          {child}
        </motion.div>
      ))}
    </div>
  );
}
