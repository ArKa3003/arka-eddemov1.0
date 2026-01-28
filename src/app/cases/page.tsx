'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { Navigation } from '@/components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Mock case data
const MOCK_CASES = [
  {
    id: '1',
    title: 'Acute Chest Pain',
    category: 'Cardiovascular',
    difficulty: 'Intermediate',
    specialty: 'Emergency Medicine',
    description: 'A 45-year-old male presents with acute onset chest pain...',
  },
  {
    id: '2',
    title: 'Headache in Young Adult',
    category: 'Neurological',
    difficulty: 'Beginner',
    specialty: 'Internal Medicine',
    description: 'A 28-year-old female with recurrent headaches...',
  },
  {
    id: '3',
    title: 'Abdominal Pain',
    category: 'Gastrointestinal',
    difficulty: 'Advanced',
    specialty: 'Emergency Medicine',
    description: 'A 35-year-old female with right lower quadrant pain...',
  },
  {
    id: '4',
    title: 'Low Back Pain',
    category: 'Musculoskeletal',
    difficulty: 'Intermediate',
    specialty: 'Family Medicine',
    description: 'A 50-year-old male with chronic low back pain...',
  },
  {
    id: '5',
    title: 'Extremity Trauma',
    category: 'Trauma',
    difficulty: 'Beginner',
    specialty: 'Emergency Medicine',
    description: 'A 22-year-old male with ankle injury after fall...',
  },
  {
    id: '6',
    title: 'Shortness of Breath',
    category: 'Pulmonary',
    difficulty: 'Advanced',
    specialty: 'Internal Medicine',
    description: 'A 65-year-old female with progressive dyspnea...',
  },
]

const CATEGORIES = ['All', 'Cardiovascular', 'Neurological', 'Gastrointestinal', 'Musculoskeletal', 'Trauma', 'Pulmonary']
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced']
const SPECIALTIES = ['All', 'Emergency Medicine', 'Internal Medicine', 'Family Medicine', 'Surgery', 'Pediatrics']

export default function CasesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedSpecialty, setSelectedSpecialty] = useState('All')
  const [showFilters, setShowFilters] = useState(false)

  const filteredCases = MOCK_CASES.filter((caseItem) => {
    const matchesSearch =
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || caseItem.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'All' || caseItem.difficulty === selectedDifficulty
    const matchesSpecialty = selectedSpecialty === 'All' || caseItem.specialty === selectedSpecialty

    return matchesSearch && matchesCategory && matchesDifficulty && matchesSpecialty
  })

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navigation />
        <main id="main-content" className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">Case Library</h1>
            <p className="text-sm sm:text-base text-slate-600">
              Practice with real clinical scenarios and master imaging appropriateness
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Search cases..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full focus-visible-ring"
                aria-label="Search cases"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto touch-target"
              aria-expanded={showFilters}
              aria-controls="case-filters"
            >
              <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
              Filters
            </Button>

            {showFilters && (
              <motion.div
                id="case-filters"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-white rounded-lg border border-slate-200"
              >
                <div>
                  <label htmlFor="category-filter" className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>
                  <select
                    id="category-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus-visible-ring touch-target"
                    aria-label="Filter by category"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="difficulty-filter" className="block text-sm font-medium text-slate-700 mb-2">
                    Difficulty
                  </label>
                  <select
                    id="difficulty-filter"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus-visible-ring touch-target"
                    aria-label="Filter by difficulty"
                  >
                    {DIFFICULTIES.map((diff) => (
                      <option key={diff} value={diff}>
                        {diff}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="specialty-filter" className="block text-sm font-medium text-slate-700 mb-2">
                    Specialty
                  </label>
                  <select
                    id="specialty-filter"
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 focus-visible-ring touch-target"
                    aria-label="Filter by specialty"
                  >
                    {SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </div>

          {/* Cases Grid */}
          {filteredCases.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredCases.map((caseItem) => (
                <Link
                  key={caseItem.id}
                  href={`/cases/${caseItem.id}`}
                  className="focus-visible-ring rounded-lg"
                  aria-label={`Start case: ${caseItem.title}`}
                >
                  <Card className="h-full cursor-pointer hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2 gap-2">
                        <CardTitle className="text-base sm:text-lg flex-1">{caseItem.title}</CardTitle>
                        <span
                          className={cn(
                            'px-2 py-1 text-xs font-medium rounded flex-shrink-0',
                            caseItem.difficulty === 'Beginner' && 'bg-emerald-100 text-emerald-700',
                            caseItem.difficulty === 'Intermediate' && 'bg-amber-100 text-amber-700',
                            caseItem.difficulty === 'Advanced' && 'bg-rose-100 text-rose-700'
                          )}
                          aria-label={`Difficulty: ${caseItem.difficulty}`}
                        >
                          {caseItem.difficulty}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500">{caseItem.category}</p>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 line-clamp-3 mb-4">
                        {caseItem.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">{caseItem.specialty}</span>
                        <Button size="sm" variant="ghost" className="touch-target">
                          Start Case →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-slate-500" role="status">No cases found matching your filters.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </ProtectedRoute>
  )
}
