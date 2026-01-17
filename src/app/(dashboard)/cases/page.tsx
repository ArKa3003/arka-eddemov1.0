import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { CaseFilters, parseFiltersFromSearchParams } from "@/components/cases/case-filters";
import { CaseGrid, CaseGridSkeleton } from "@/components/cases/case-grid";
import { ProgressSummary, ProgressSummarySkeleton } from "@/components/progress/progress-summary";
import { Pagination } from "@/components/ui/pagination";
import type { Case, UserCaseAttempt, UserProgress } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface CasesPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

interface CaseWithAttempts extends Case {
  user_case_attempts?: UserCaseAttempt[];
}

// ============================================================================
// Constants
// ============================================================================

const ITEMS_PER_PAGE = 12;

// ============================================================================
// Page Component
// ============================================================================

export default async function CasesPage({ searchParams }: CasesPageProps) {
  const params = await searchParams;
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-slate-900 mb-2">
            Case Library
          </h1>
          <p className="text-slate-600">
            Practice with real clinical scenarios and master imaging appropriateness
          </p>
        </div>

        {/* Progress Summary */}
        <Suspense fallback={<ProgressSummarySkeleton />}>
          <ProgressSection />
        </Suspense>

        {/* Filters */}
        <div className="mt-8 mb-6">
          <CaseFilters />
        </div>

        {/* Cases Grid */}
        <Suspense fallback={<CaseGridSkeleton count={ITEMS_PER_PAGE} />}>
          <CasesSection searchParams={params} />
        </Suspense>
      </div>
    </div>
  );
}

// ============================================================================
// Progress Section (Server Component)
// ============================================================================

async function ProgressSection() {
  const user = await getUser();
  
  if (!user) {
    return (
      <ProgressSummary
        casesCompleted={0}
        totalCases={50}
        accuracy={0}
        streakDays={0}
      />
    );
  }

  const supabase = await createClient();

  // Try to get user progress
  let progress: Partial<UserProgress> = {
    total_cases_completed: 0,
    overall_accuracy: 0,
    current_streak: 0,
  };

  try {
    // Call the calculate_user_progress RPC function
    const { data, error } = await supabase.rpc("calculate_user_progress", {
      p_user_id: user.id,
    });

    if (!error && data) {
      progress = data;
    }
  } catch {
    // Fallback to basic query if RPC fails
    const { count } = await supabase
      .from("user_case_attempts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("is_correct", true);

    progress.total_cases_completed = count || 0;
  }

  // Get total cases count
  const { count: totalCases } = await supabase
    .from("cases")
    .select("*", { count: "exact", head: true })
    .eq("is_published", true);

  return (
    <ProgressSummary
      casesCompleted={progress.total_cases_completed || 0}
      totalCases={totalCases || 50}
      accuracy={Math.round(progress.overall_accuracy || 0)}
      streakDays={progress.current_streak || 0}
    />
  );
}

// ============================================================================
// Cases Section (Server Component)
// ============================================================================

interface CasesSectionProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

async function CasesSection({ searchParams }: CasesSectionProps) {
  const user = await getUser();
  const supabase = await createClient();

  // Parse filters from search params
  const urlSearchParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === "string") {
      urlSearchParams.set(key, value);
    }
  });
  const filters = parseFiltersFromSearchParams(urlSearchParams);

  // Get current page
  const page = parseInt(searchParams.page as string) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  // Build query
  let query = supabase
    .from("cases")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  // Apply filters
  if (filters.category !== "all") {
    query = query.eq("category", filters.category);
  }

  if (filters.specialty !== "all") {
    query = query.contains("specialty_tags", [filters.specialty]);
  }

  if (filters.difficulty !== "all") {
    query = query.eq("difficulty", filters.difficulty);
  }

  if (filters.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,chief_complaint.ilike.%${filters.search}%`
    );
  }

  // Apply sorting
  switch (filters.sort) {
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    case "difficulty":
      query = query.order("difficulty", { ascending: true });
      break;
    case "alphabetical":
    default:
      query = query.order("title", { ascending: true });
      break;
  }

  // Apply pagination
  query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

  // Execute query
  const { data: cases, count: totalCount, error } = await query;

  if (error) {
    console.error("Error fetching cases:", error);
    return <CaseGrid cases={[]} />;
  }

  // Get user attempts if logged in
  let casesWithAttempts: CaseWithAttempts[] = cases || [];

  if (user && cases && cases.length > 0) {
    const caseIds = cases.map((c) => c.id);

    const { data: attempts } = await supabase
      .from("user_case_attempts")
      .select("*")
      .eq("user_id", user.id)
      .in("case_id", caseIds);

    // Map attempts to cases
    if (attempts) {
      const attemptsByCase = attempts.reduce((acc, attempt) => {
        if (!acc[attempt.case_id]) {
          acc[attempt.case_id] = [];
        }
        acc[attempt.case_id].push(attempt);
        return acc;
      }, {} as Record<string, UserCaseAttempt[]>);

      casesWithAttempts = cases.map((caseData) => ({
        ...caseData,
        user_case_attempts: attemptsByCase[caseData.id] || [],
      }));
    }

    // Filter by status if needed
    if (filters.status !== "all") {
      casesWithAttempts = casesWithAttempts.filter((caseData) => {
        const attempts = caseData.user_case_attempts || [];
        const hasCompleted = attempts.some((a) => a.is_correct || a.score >= 70);

        switch (filters.status) {
          case "completed":
            return hasCompleted;
          case "in_progress":
            return attempts.length > 0 && !hasCompleted;
          case "not_started":
            return attempts.length === 0;
          default:
            return true;
        }
      });
    }
  }

  const totalPages = Math.ceil((totalCount || 0) / ITEMS_PER_PAGE);

  return (
    <>
      <CaseGrid cases={casesWithAttempts} />

      {totalPages > 1 && (
        <div className="mt-8">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalCount || 0}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>
      )}
    </>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export const metadata = {
  title: "Case Library | ARKA-ED",
  description:
    "Practice with real clinical scenarios and master medical imaging appropriateness criteria.",
};
