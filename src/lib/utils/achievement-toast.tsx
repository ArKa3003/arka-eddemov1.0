'use client'

import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'

// ============================================================================
// Achievement Toast Helper
// ============================================================================

/**
 * Show achievement toast with confetti animation.
 */
export function showAchievementToast(
  title: string,
  description: string,
  options?: {
    icon?: string
    duration?: number
    showConfetti?: boolean
  }
) {
  const { icon = '🏆', duration = 5000, showConfetti = true } = options || {}

  // Trigger confetti burst
  if (showConfetti) {
    const count = 200
    const defaults = {
      origin: { y: 0.7 },
      zIndex: 10000,
    }

    function fire(particleRatio: number, opts: confetti.Options) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      })
    }

    // Multiple bursts
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
      colors: ['#06b6d4', '#10b981'],
    })
    fire(0.2, {
      spread: 60,
      colors: ['#f59e0b', '#ec4899'],
    })
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
      colors: ['#8b5cf6', '#06b6d4'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
      colors: ['#f59e0b'],
    })
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
      colors: ['#ec4899'],
    })
  }

  // Show toast
  toast.success(
    (t) => (
      <div className="flex items-start gap-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <p className="font-semibold text-white">{title}</p>
          <p className="text-sm text-white/90 mt-0.5">{description}</p>
        </div>
      </div>
    ),
    {
      duration,
      style: {
        background: 'linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)',
        color: 'white',
        borderRadius: '0.5rem',
        padding: '1rem',
        fontSize: '0.875rem',
        fontWeight: '500',
        maxWidth: '420px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      iconTheme: {
        primary: 'white',
        secondary: '#f59e0b',
      },
    }
  )
}

/**
 * Show case submission success toast.
 */
export function showCaseSubmissionToast(score: number, isCorrect: boolean) {
  if (score >= 90) {
    showAchievementToast(
      'Excellent Work!',
      `You scored ${score}/100 points!`,
      {
        icon: '🎉',
        showConfetti: true,
      }
    )
  } else if (isCorrect) {
    toast.success(`Great job! You scored ${score}/100 points.`, {
      icon: '✅',
    })
  } else {
    toast('Keep practicing!', {
      icon: '💪',
      style: {
        background: '#06b6d4',
        color: 'white',
      },
    })
  }
}

/**
 * Show assessment completion toast.
 */
export function showAssessmentCompletionToast(
  score: number,
  passed: boolean,
  totalCases: number,
  correctCount: number
) {
  if (passed) {
    showAchievementToast(
      'Assessment Complete!',
      `You scored ${score}% (${correctCount}/${totalCases} correct)`,
      {
        icon: '🎓',
        showConfetti: true,
      }
    )
  } else {
    toast(`Assessment complete. Score: ${score}%`, {
      icon: '📊',
      style: {
        background: '#06b6d4',
        color: 'white',
      },
    })
  }
}

/**
 * Show profile update toast.
 */
export function showProfileUpdateToast() {
  toast.success('Profile updated successfully!', {
    icon: '✅',
  })
}
