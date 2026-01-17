import { Suspense } from "react";
import { ProgressDashboard } from "@/components/progress/progress-dashboard";

// ============================================================================
// Page
// ============================================================================

export default function ProgressPage() {
  return (
    <Suspense fallback={<ProgressSkeleton />}>
      <ProgressDashboard />
    </Suspense>
  );
}

// ============================================================================
// Skeleton
// ============================================================================

function ProgressSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-slate-200 rounded animate-pulse" />
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl" />
                <div className="w-16 h-6 bg-slate-200 rounded" />
              </div>
              <div className="h-8 w-24 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-32 bg-slate-200 rounded" />
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-5 h-[360px] animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
            <div className="h-[280px] bg-slate-100 rounded" />
          </div>
          <div className="bg-white rounded-xl p-5 h-[360px] animate-pulse">
            <div className="h-6 w-48 bg-slate-200 rounded mb-4" />
            <div className="h-[280px] bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export const metadata = {
  title: "Progress | ARKA-ED",
  description: "Track your learning progress and performance analytics.",
};
