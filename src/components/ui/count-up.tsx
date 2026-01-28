'use client'

import * as React from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface CountUpProps {
  /** Target number to count to */
  value: number
  /** Duration of animation in seconds */
  duration?: number
  /** Decimal places to show */
  decimals?: number
  /** Prefix text (e.g., "$") */
  prefix?: string
  /** Suffix text (e.g., "%") */
  suffix?: string
  /** Custom formatter function */
  formatter?: (value: number) => string
  /** Additional className */
  className?: string
  /** Whether to start animation immediately */
  startOnMount?: boolean
  /** Callback when animation completes */
  onComplete?: () => void
}

// ============================================================================
// CountUp Component
// ============================================================================

/**
 * Animated number counter that counts up from 0 to target value.
 * Uses Framer Motion for smooth animations.
 *
 * @example
 * ```tsx
 * <CountUp value={100} duration={2} suffix="%" />
 * <CountUp value={1250} prefix="$" formatter={(v) => v.toLocaleString()} />
 * ```
 */
export function CountUp({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatter,
  className,
  startOnMount = true,
  onComplete,
}: CountUpProps) {
  const [isAnimating, setIsAnimating] = React.useState(startOnMount)
  const spring = useSpring(0, {
    damping: 30,
    stiffness: 100,
  })
  const display = useTransform(spring, (current) => {
    if (formatter) {
      return formatter(Math.round(current * 10 ** decimals) / 10 ** decimals)
    }
    const num = Math.round(current * 10 ** decimals) / 10 ** decimals
    return num.toFixed(decimals)
  })

  React.useEffect(() => {
    if (isAnimating) {
      spring.set(value)
      const timer = setTimeout(() => {
        onComplete?.()
      }, duration * 1000)
      return () => clearTimeout(timer)
    }
  }, [isAnimating, value, spring, duration, onComplete])

  // Trigger animation when value changes
  React.useEffect(() => {
    if (startOnMount) {
      setIsAnimating(true)
    }
  }, [startOnMount])

  return (
    <motion.span
      className={cn('tabular-nums', className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {prefix}
      <motion.span>{display}</motion.span>
      {suffix}
    </motion.span>
  )
}

// ============================================================================
// CountUpNumber - Simplified version for numbers only
// ============================================================================

export interface CountUpNumberProps {
  value: number
  duration?: number
  className?: string
}

/**
 * Simplified count-up component for numbers only.
 */
export function CountUpNumber({ value, duration = 2, className }: CountUpNumberProps) {
  return <CountUp value={value} duration={duration} className={className} />
}
