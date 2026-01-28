'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export interface HintPanelProps {
  hints: string[]
  hintsUsed: number
  onUseHint: () => void
  disabled?: boolean
  className?: string
}

const HINT_COST_PERCENTAGE = 10 // Each hint costs 10% of potential score

export function HintPanel({
  hints,
  hintsUsed,
  onUseHint,
  disabled = false,
  className,
}: HintPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const canUseMoreHints = hintsUsed < hints.length && !disabled
  const nextHintCost = hintsUsed === 0 ? 0 : HINT_COST_PERCENTAGE

  const handleUseHint = () => {
    if (canUseMoreHints) {
      onUseHint()
      setIsExpanded(true)
    }
  }

  if (!hints || hints.length === 0) {
    return null
  }

  return (
    <Card className={cn('border-amber-200 bg-amber-50/30', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-600" />
            <CardTitle className="text-lg font-semibold text-slate-900">
              Hints
            </CardTitle>
            <Badge variant="outline" className="bg-white">
              {hintsUsed}/{hints.length}
            </Badge>
          </div>
          {hintsUsed > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-8 w-8 p-0"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Revealed Hints */}
        <AnimatePresence>
          {hintsUsed > 0 && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2"
            >
              {hints.slice(0, hintsUsed).map((hint, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-amber-200"
                >
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-700 flex-1">{hint}</p>
                  {index === 0 && (
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      Free
                    </Badge>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Use Hint Button */}
        {canUseMoreHints && (
          <Button
            onClick={handleUseHint}
            disabled={disabled}
            variant="outline"
            className={cn(
              'w-full border-amber-300 bg-white hover:bg-amber-50',
              hintsUsed === 0 && 'border-amber-400 bg-amber-50'
            )}
          >
            <Lightbulb className="w-4 h-4 mr-2 text-amber-600" />
            {hintsUsed === 0 ? (
              <>
                Use First Hint
                <Badge variant="outline" className="ml-2 bg-emerald-50 text-emerald-700 border-emerald-200">
                  Free
                </Badge>
              </>
            ) : (
              <>
                Use Hint {hintsUsed + 1}
                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-300">
                  -{nextHintCost}%
                </Badge>
              </>
            )}
          </Button>
        )}

        {/* All Hints Used */}
        {hintsUsed >= hints.length && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-white rounded-lg p-3 border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>All hints have been revealed</span>
          </div>
        )}

        {/* Disabled State */}
        {disabled && hintsUsed === 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 rounded-lg p-3">
            <AlertCircle className="w-4 h-4" />
            <span>Hints are not available in assessment mode</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
