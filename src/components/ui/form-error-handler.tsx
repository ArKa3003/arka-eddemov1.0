'use client'

import * as React from 'react'
import { FieldErrors } from 'react-hook-form'
import { AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

// ============================================================================
// Types
// ============================================================================

export interface FormErrorHandlerProps<T extends Record<string, any>> {
  /** Form errors from react-hook-form */
  errors: FieldErrors<T>
  /** Additional className */
  className?: string
  /** Whether to show summary at top */
  showSummary?: boolean
  /** Auto-focus first error field */
  autoFocus?: boolean
}

// ============================================================================
// FormErrorHandler Component
// ============================================================================

/**
 * Form error handler component that displays validation errors.
 * Shows inline field errors and optional summary at form top.
 * Auto-focuses first error field if enabled.
 *
 * @example
 * ```tsx
 * <FormErrorHandler errors={errors} showSummary autoFocus />
 * ```
 */
export function FormErrorHandler<T extends Record<string, any>>({
  errors,
  className,
  showSummary = false,
  autoFocus = false,
}: FormErrorHandlerProps<T>) {
  const errorEntries = Object.entries(errors)
  const firstErrorRef = React.useRef<HTMLDivElement>(null)

  // Auto-focus first error
  React.useEffect(() => {
    if (autoFocus && errorEntries.length > 0 && firstErrorRef.current) {
      const firstInput = firstErrorRef.current.querySelector('input, textarea, select')
      if (firstInput instanceof HTMLElement) {
        firstInput.focus()
      }
    }
  }, [autoFocus, errorEntries.length])

  if (errorEntries.length === 0) return null

  // Get error messages
  const errorMessages = errorEntries.map(([field, error]) => {
    const message = error?.message || 'This field has an error'
    return { field, message }
  })

  return (
    <>
      {/* Error Summary */}
      {showSummary && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className={cn(
            'mb-4 p-4 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-800',
            className
          )}
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100 mb-1">
                Please fix the following errors:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-rose-700 dark:text-rose-300">
                {errorMessages.map(({ field, message }) => (
                  <li key={field}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

// ============================================================================
// FieldError Component
// ============================================================================

export interface FieldErrorProps {
  /** Error message */
  error?: string
  /** Additional className */
  className?: string
}

/**
 * Inline field error component.
 */
export function FieldError({ error, className }: FieldErrorProps) {
  if (!error) return null

  return (
    <AnimatePresence>
      <motion.p
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        className={cn('mt-1 text-sm text-rose-600 dark:text-rose-400', className)}
      >
        {error}
      </motion.p>
    </AnimatePresence>
  )
}

// ============================================================================
// FormErrorSummary Component
// ============================================================================

export interface FormErrorSummaryProps {
  /** Error messages */
  errors: string[]
  /** Additional className */
  className?: string
}

/**
 * Standalone error summary component.
 */
export function FormErrorSummary({ errors, className }: FormErrorSummaryProps) {
  if (errors.length === 0) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'mb-4 p-4 rounded-lg border border-rose-200 bg-rose-50 dark:bg-rose-950/20 dark:border-rose-800',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-rose-900 dark:text-rose-100 mb-2">
            Please fix the following errors:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-rose-700 dark:text-rose-300">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  )
}
