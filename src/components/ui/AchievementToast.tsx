'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface AchievementToastProps {
  /** Achievement title */
  title: string
  /** Achievement description */
  description: string
  /** Achievement icon (emoji or component) */
  icon?: string | React.ReactNode
  /** Whether to show confetti */
  showConfetti?: boolean
  /** Auto-dismiss delay in milliseconds (default: 5000) */
  autoDismissDelay?: number
  /** Handler when toast is dismissed */
  onDismiss?: () => void
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Confetti Component
// ============================================================================

function ConfettiEffect() {
  const colors = ['#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
  const confettiCount = 30

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {[...Array(confettiCount)].map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)]
        const left = Math.random() * 100
        const delay = Math.random() * 0.5
        const duration = 1.5 + Math.random() * 1
        const size = 6 + Math.random() * 6

        return (
          <motion.div
            key={i}
            initial={{
              top: '50%',
              left: `${left}%`,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              top: '110%',
              rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
              opacity: 0,
            }}
            transition={{
              duration,
              delay,
              ease: 'easeOut',
            }}
            style={{
              position: 'absolute',
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
            }}
          />
        )
      })}
    </div>
  )
}

// ============================================================================
// Component
// ============================================================================

/**
 * Achievement Toast component that slides in from bottom with optional confetti.
 * Auto-dismisses after specified delay.
 */
export function AchievementToast({
  title,
  description,
  icon,
  showConfetti = false,
  autoDismissDelay = 5000,
  onDismiss,
  className,
}: AchievementToastProps) {
  const [isVisible, setIsVisible] = React.useState(true)

  React.useEffect(() => {
    if (autoDismissDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, autoDismissDelay)

      return () => clearTimeout(timer)
    }
  }, [autoDismissDelay])

  const handleDismiss = () => {
    setIsVisible(false)
    onDismiss?.()
  }

  return (
    <AnimatePresence onExitComplete={onDismiss}>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className={cn(
            'fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-50',
            className
          )}
        >
          <div className="relative bg-white rounded-lg shadow-lg border-2 border-amber-200 overflow-hidden">
            {/* Confetti Background */}
            {showConfetti && <ConfettiEffect />}

            {/* Content */}
            <div className="relative p-4 sm:p-6">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex-shrink-0">
                  {typeof icon === 'string' ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl">
                      {icon}
                    </div>
                  ) : icon ? (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      {icon}
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                      <Trophy className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
                      <p className="text-sm text-slate-600">{description}</p>
                    </div>
                    {showConfetti && (
                      <Sparkles className="w-5 h-5 text-amber-500 flex-shrink-0" />
                    )}
                  </div>
                </div>

                {/* Dismiss Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ============================================================================
// Achievement Toast Manager Hook
// ============================================================================

export interface AchievementToastData {
  id: string
  title: string
  description: string
  icon?: string | React.ReactNode
  showConfetti?: boolean
}

export function useAchievementToasts() {
  const [toasts, setToasts] = React.useState<AchievementToastData[]>([])

  const showToast = React.useCallback((toast: Omit<AchievementToastData, 'id'>) => {
    const id = Math.random().toString(36).substring(7)
    setToasts((prev) => [...prev, { ...toast, id }])
  }, [])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return {
    toasts,
    showToast,
    dismissToast,
  }
}

// ============================================================================
// Achievement Toast Container
// ============================================================================

export function AchievementToastContainer({ toasts, onDismiss }: {
  toasts: AchievementToastData[]
  onDismiss: (id: string) => void
}) {
  return (
    <>
      {toasts.map((toast, index) => (
        <AchievementToast
          key={toast.id}
          title={toast.title}
          description={toast.description}
          icon={toast.icon}
          showConfetti={toast.showConfetti}
          className="mb-2"
          style={{ bottom: `${4 + index * 120}px` }}
          onDismiss={() => onDismiss(toast.id)}
        />
      ))}
    </>
  )
}
