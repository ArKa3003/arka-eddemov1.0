// @ts-nocheck
/**
 * Unified case index - exports all cases and provides getCaseBySlug function
 */

import { headacheCases, getHeadacheCaseBySlug } from './headache'
import { lowBackPainCases, getLBPCaseBySlug } from './low-back-pain'
import { chestPainCases, getChestPainCaseBySlug } from './chest-pain'
import { abdominalPainCases, getAbdominalPainCaseBySlug } from './abdominal-pain'
import { extremityTraumaCases, getExtremityTraumaCaseBySlug } from './extremity-trauma'
import type { Case } from '@/types/database'

// Export all cases
export const allCases: Case[] = [
  ...headacheCases,
  ...lowBackPainCases,
  ...chestPainCases,
  ...abdominalPainCases,
  ...extremityTraumaCases,
]

/**
 * Get a case by slug from any category
 */
export function getCaseBySlug(slug: string): Case | undefined {
  // Try each category's getter function
  return (
    getHeadacheCaseBySlug(slug) ||
    getLBPCaseBySlug(slug) ||
    getChestPainCaseBySlug(slug) ||
    getAbdominalPainCaseBySlug(slug) ||
    getExtremityTraumaCaseBySlug(slug)
  )
}

/**
 * Get a case by ID
 */
export function getCaseById(id: string): Case | undefined {
  return allCases.find((c) => c.id === id)
}
