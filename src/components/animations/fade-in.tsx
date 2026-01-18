// @ts-nocheck
"use client";

import * as React from "react";
import { motion, useInView, Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export interface FadeInProps {
  children: React.ReactNode;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Direction to fade in from */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance to animate from (in pixels) */
  distance?: number;
  /** Use Intersection Observer to trigger animation */
  triggerOnView?: boolean;
  /** Threshold for intersection observer (0-1) */
  viewThreshold?: number;
  /** Only animate once when in view */
  once?: boolean;
  /** Additional className */
  className?: string;
  /** As which HTML element to render */
  as?: keyof JSX.IntrinsicElements;
}

// ============================================================================
// Animation Variants
// ============================================================================

const createVariants = (
  direction: FadeInProps["direction"],
  distance: number
): Variants => {
  const directions = {
    up: { y: distance },
    down: { y: -distance },
    left: { x: distance },
    right: { x: -distance },
    none: {},
  };

  return {
    hidden: {
      opacity: 0,
      ...directions[direction || "none"],
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
    },
  };
};

// ============================================================================
// FadeIn Component
// ============================================================================

/**
 * Fade-in animation wrapper component.
 * Supports directional animations and Intersection Observer trigger.
 *
 * @example
 * ```tsx
 * <FadeIn direction="up" delay={0.2}>
 *   <Card>Content</Card>
 * </FadeIn>
 *
 * // With Intersection Observer
 * <FadeIn triggerOnView once direction="up">
 *   <Section>...</Section>
 * </FadeIn>
 * ```
 */
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  direction = "up",
  distance = 24,
  triggerOnView = false,
  viewThreshold = 0.1,
  once = true,
  className,
  as = "div",
}: FadeInProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once,
    amount: viewThreshold,
  });

  const variants = React.useMemo(
    () => createVariants(direction, distance),
    [direction, distance]
  );

  const MotionComponent = motion[as as keyof typeof motion] as typeof motion.div;

  return (
    <MotionComponent
      ref={ref}
      initial="hidden"
      animate={triggerOnView ? (isInView ? "visible" : "hidden") : "visible"}
      variants={variants}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      className={className}
    >
      {children}
    </MotionComponent>
  );
}

// ============================================================================
// FadeInGroup - For multiple items with sequential delays
// ============================================================================

export interface FadeInGroupProps {
  children: React.ReactNode;
  /** Base delay before animations start */
  baseDelay?: number;
  /** Delay between each child */
  staggerDelay?: number;
  /** Direction to fade in from */
  direction?: FadeInProps["direction"];
  /** Use Intersection Observer */
  triggerOnView?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Wraps children to apply sequential fade-in animations.
 */
export function FadeInGroup({
  children,
  baseDelay = 0,
  staggerDelay = 0.1,
  direction = "up",
  triggerOnView = false,
  className,
}: FadeInGroupProps) {
  const childArray = React.Children.toArray(children);

  return (
    <div className={className}>
      {childArray.map((child, index) => (
        <FadeIn
          key={index}
          delay={baseDelay + index * staggerDelay}
          direction={direction}
          triggerOnView={triggerOnView}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

// ============================================================================
// Preset Fade Components
// ============================================================================

export function FadeInUp({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn direction="up" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function FadeInDown({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn direction="down" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function FadeInLeft({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn direction="left" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

export function FadeInRight({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn direction="right" delay={delay} className={className}>
      {children}
    </FadeIn>
  );
}

// ============================================================================
// FadeInOnScroll - Specifically for scroll-triggered animations
// ============================================================================

export interface FadeInOnScrollProps {
  children: React.ReactNode;
  /** Animation direction */
  direction?: FadeInProps["direction"];
  /** Delay after entering viewport */
  delay?: number;
  /** Threshold for trigger (0-1) */
  threshold?: number;
  /** Additional className */
  className?: string;
}

/**
 * Fade-in animation triggered when element enters viewport.
 */
export function FadeInOnScroll({
  children,
  direction = "up",
  delay = 0,
  threshold = 0.2,
  className,
}: FadeInOnScrollProps) {
  return (
    <FadeIn
      direction={direction}
      delay={delay}
      triggerOnView
      viewThreshold={threshold}
      once
      className={className}
    >
      {children}
    </FadeIn>
  );
}
