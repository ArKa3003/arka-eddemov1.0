'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface LoadingScreenProps {
  /** Loading text */
  text?: string
  /** Additional className */
  className?: string
  /** Show full screen overlay */
  fullScreen?: boolean
}

// ============================================================================
// LoadingScreen Component
// ============================================================================

/**
 * Global loading screen with ARKA logo animation.
 * Use for initial page loads.
 *
 * @example
 * ```tsx
 * <LoadingScreen text="Loading cases..." />
 * ```
 */
export function LoadingScreen({
  text = 'Loading...',
  className,
  fullScreen = true,
}: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center',
        fullScreen && 'fixed inset-0 z-50 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950',
        !fullScreen && 'min-h-[400px]',
        className
      )}
    >
      {/* ARKA Logo Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative mb-8"
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-cyan-500/20"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          style={{ width: 80, height: 80 }}
        />

        {/* Progress arc */}
        <svg
          className="absolute inset-0"
          viewBox="0 0 100 100"
          style={{ width: 80, height: 80 }}
        >
          <motion.circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            className="text-cyan-500"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 0.7, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              strokeDasharray: '283',
              strokeDashoffset: '0',
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
            }}
          />
        </svg>

        {/* Logo text */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-2xl font-bold"
          >
            <span className="text-cyan-400">ARKA</span>
            <span className="text-white">-ED</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Loading text */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-slate-400 text-sm font-medium"
      >
        {text}
      </motion.p>

      {/* Loading dots */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex items-center gap-1.5 mt-4"
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-cyan-500"
            animate={{ y: [0, -8, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.1,
              ease: 'easeInOut',
            }}
          />
        ))}
      </motion.div>
    </div>
  )
}
