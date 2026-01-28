# Comprehensive Feedback System for ARKA-ED

This document describes the comprehensive feedback system implemented after case submission in ARKA-ED.

## Components Created

### 1. FeedbackPanel.tsx (`src/components/cases/FeedbackPanel.tsx`)

The main feedback panel displayed after case submission. Features include:

- **Result Header**: Large "Correct!" (green) or "Incorrect" (amber) indicator with animated score display
- **Score Display**: Shows points earned (e.g., "85/100 points")
- **Time & Hints Tracking**: Displays time taken and hints used
- **Your Answer vs Best Answer**: Two-column comparison showing:
  - Selected option vs optimal option
  - AIIE scores for both
  - Appropriateness categories
- **Radiation & Cost Comparison**: Visual comparison with bar charts
- **Teaching Points Panel**: 3-5 key learning points with:
  - "Why this matters clinically" section
  - Common mistakes explained
  - Guidelines referenced (peer-reviewed journals)
- **Next Actions**: Buttons for:
  - Next Case
  - Review All Options
  - Save to Study List
  - Back to Library

### 2. ScoreBreakdown.tsx (`src/components/aiie/ScoreBreakdown.tsx`)

Visual SHAP explanation component showing:

- **AIIE Score Calculation**: Baseline score (5.0) with factor contributions
- **Waterfall Visualization**: Shows how score progresses from baseline
- **Clinical Factor Contributions**: Each factor displays:
  - Contribution value (+/-)
  - Visual bar representation
  - Clickable to show evidence citation
  - Expandable explanations
- **Final Score Display**: Shows rounded score and category (Usually Appropriate, May Be Appropriate, etc.)
- **Mobile Support**: Collapsible for smaller screens

### 3. OptionsComparison.tsx (`src/components/cases/OptionsComparison.tsx`)

Expandable table showing ALL imaging options:

- **Columns**:
  - Modality name
  - AIIE Score (with color-coded badges)
  - Category (Usually Appropriate, May Be Appropriate, etc.)
  - Radiation level (with color coding)
  - Cost
  - Your Pick indicator
- **Color-coded rows**: By appropriateness category
- **Sorted by AIIE score**: Highest scores first
- **Expandable/Collapsible**: For better UX

### 4. AchievementToast.tsx (`src/components/ui/AchievementToast.tsx`)

Toast notification component for achievements:

- **Animations**: Slides in from bottom with Framer Motion
- **Confetti Effect**: Optional confetti animation
- **Auto-dismiss**: Configurable delay (default: 5 seconds)
- **Achievement Types**:
  - First case completed
  - 5 correct in a row
  - Specialty track completion
  - 100% on assessment
- **Toast Manager Hook**: `useAchievementToasts()` for managing multiple toasts

### 5. Progress Utilities (`src/lib/utils/progress.ts`)

Utilities for tracking user progress:

- **calculateProgressUpdate()**: Calculates progress after case submission
- **checkMilestones()**: Checks for achievement milestones
- **Tracks**:
  - Cases completed
  - Accuracy percentage
  - Current streak (resets if wrong)
  - Category progress
  - Specialty progress

## Integration

### Case Page Updates (`src/app/cases/[slug]/page.tsx`)

The case page has been updated to:

1. **Calculate AIIE Scores**: Automatically calculates scores for all imaging options
2. **Show Feedback Panel**: Displays comprehensive feedback after submission
3. **Handle Achievements**: Shows achievement toasts when milestones are reached
4. **Update Progress**: Tracks user progress (ready for database integration)

### Key Features

- **Automatic Score Calculation**: Uses clinical data from case to calculate AIIE scores
- **Real-time Feedback**: Immediate feedback after submission
- **Mobile Responsive**: All components adapt to mobile screens
- **Framer Motion Animations**: Smooth, professional animations throughout
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Usage Example

```tsx
<FeedbackPanel
  isCorrect={true}
  score={85}
  timeSpent={154}
  hintsUsed={1}
  totalHints={3}
  selectedOption={selectedOption}
  optimalOption={optimalOption}
  selectedAIIEScore={selectedScore}
  optimalAIIEScore={optimalScore}
  allOptions={imagingOptions}
  allAIIEScores={allAIIEScores}
  caseData={caseData}
  onNextCase={handleNextCase}
  onReviewAllOptions={handleReviewAll}
  onSaveToStudyList={handleSave}
  onBackToLibrary={handleBack}
  isBookmarked={false}
/>
```

## Mobile Layout

All components are mobile-responsive:

- **Stacked Layout**: Sections stack vertically on mobile
- **Collapsible SHAP**: Score breakdown can be collapsed on mobile
- **Swipe Support**: Ready for swipe gestures (can be added)
- **Touch-friendly**: Large touch targets for buttons

## Next Steps

1. **Database Integration**: Connect progress updates to Supabase
2. **Achievement System**: Integrate with achievement database
3. **Study List**: Implement bookmarking functionality
4. **Next Case Logic**: Implement case sequencing
5. **Analytics**: Track user engagement with feedback

## Files Modified/Created

### Created:
- `src/components/cases/FeedbackPanel.tsx`
- `src/components/aiie/ScoreBreakdown.tsx`
- `src/components/cases/OptionsComparison.tsx`
- `src/components/ui/AchievementToast.tsx`
- `src/lib/utils/progress.ts`

### Modified:
- `src/app/cases/[slug]/page.tsx`

## Dependencies

All components use existing dependencies:
- `framer-motion` for animations
- `lucide-react` for icons
- Existing UI components (Card, Button, Badge)
- AIIE scoring engine
- Type definitions from `@/types/database`
