import { notFound } from "next/navigation";
import { Suspense } from "react";
import { SpecialtyTrackContent } from "./track-content";
import { getTrackBySlug, getAllTracks } from "@/data/specialty-tracks";

// ============================================================================
// Types
// ============================================================================

interface SpecialtyTrackPageProps {
  params: { track: string };
}

// ============================================================================
// Page
// ============================================================================

export default function SpecialtyTrackPage({ params }: SpecialtyTrackPageProps) {
  const track = getTrackBySlug(params.track);

  if (!track) {
    notFound();
  }

  return (
    <Suspense fallback={<TrackSkeleton />}>
      <SpecialtyTrackContent track={track} />
    </Suspense>
  );
}

// ============================================================================
// Generate Static Params
// ============================================================================

export function generateStaticParams() {
  return getAllTracks().map((track) => ({
    track: track.slug,
  }));
}

// ============================================================================
// Metadata
// ============================================================================

export async function generateMetadata({ params }: SpecialtyTrackPageProps) {
  const track = getTrackBySlug(params.track);

  if (!track) {
    return { title: "Track Not Found | ARKA-ED" };
  }

  return {
    title: `${track.name} Track | ARKA-ED`,
    description: track.longDescription || track.description,
  };
}

// ============================================================================
// Skeleton
// ============================================================================

function TrackSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 animate-pulse">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-slate-200 rounded-2xl" />
            <div className="flex-1">
              <div className="h-8 w-64 bg-slate-200 rounded mb-2" />
              <div className="h-4 w-96 bg-slate-200 rounded mb-4" />
              <div className="h-2 w-full bg-slate-200 rounded" />
            </div>
          </div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-5 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-slate-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 w-48 bg-slate-200 rounded mb-2" />
                    <div className="h-4 w-full bg-slate-200 rounded mb-3" />
                    <div className="h-2 w-32 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-5 h-64 animate-pulse" />
            <div className="bg-white rounded-xl p-5 h-48 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
