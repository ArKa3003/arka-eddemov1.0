// @ts-nocheck
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  Trash2,
  Eye,
  CheckSquare,
  Square,
  Search,
  Filter,
  X,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/modal";
import { cn } from "@/lib/utils";
import type { CaseCategory, DifficultyLevel } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

export interface CaseTableRow {
  id: string;
  title: string;
  slug: string;
  category: CaseCategory;
  difficulty: DifficultyLevel;
  isPublished: boolean;
  attempts: number;
  avgScore: number | null;
  createdAt: string;
  updatedAt: string;
}

export type SortField = "title" | "category" | "difficulty" | "attempts" | "avgScore" | "createdAt" | "updatedAt";
export type SortDirection = "asc" | "desc";

export interface CaseTableProps {
  /** Table data */
  cases: CaseTableRow[];
  /** Total count for pagination */
  totalCount: number;
  /** Current page (1-indexed) */
  currentPage: number;
  /** Items per page */
  pageSize: number;
  /** Sort field */
  sortField: SortField;
  /** Sort direction */
  sortDirection: SortDirection;
  /** Selected row IDs */
  selectedIds: string[];
  /** Loading state */
  isLoading?: boolean;
  /** Selection change handler */
  onSelectionChange: (ids: string[]) => void;
  /** Delete handler */
  onDelete: (ids: string[]) => void;
  /** Publish handler */
  onPublish: (ids: string[]) => void;
  /** Unpublish handler */
  onUnpublish: (ids: string[]) => void;
  /** Duplicate handler */
  onDuplicate: (id: string) => void;
  /** Archive handler */
  onArchive: (id: string) => void;
}

// ============================================================================
// Configuration
// ============================================================================

const CATEGORY_COLORS: Record<CaseCategory, string> = {
  "low-back-pain": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  headache: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  "chest-pain": "bg-rose-500/10 text-rose-400 border-rose-500/20",
  "abdominal-pain": "bg-amber-500/10 text-amber-400 border-amber-500/20",
  "extremity-trauma": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
};

const DIFFICULTY_COLORS: Record<DifficultyLevel, string> = {
  beginner: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  intermediate: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  advanced: "bg-rose-500/10 text-rose-400 border-rose-500/20",
};

// ============================================================================
// Component
// ============================================================================

export function CaseTable({
  cases,
  totalCount,
  currentPage,
  pageSize,
  sortField,
  sortDirection,
  selectedIds,
  isLoading = false,
  onSelectionChange,
  onDelete,
  onPublish,
  onUnpublish,
  onDuplicate,
  onArchive,
}: CaseTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deleteTarget, setDeleteTarget] = React.useState<string[] | null>(null);
  const [actionDropdownId, setActionDropdownId] = React.useState<string | null>(null);

  const allSelected = cases.length > 0 && selectedIds.length === cases.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < cases.length;
  const totalPages = Math.ceil(totalCount / pageSize);

  /**
   * Update URL params
   */
  const updateParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  /**
   * Handle sort
   */
  const handleSort = (field: SortField) => {
    const newDirection =
      sortField === field && sortDirection === "asc" ? "desc" : "asc";
    updateParams({ sort: field, dir: newDirection });
  };

  /**
   * Handle select all
   */
  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(cases.map((c) => c.id));
    }
  };

  /**
   * Handle row select
   */
  const handleRowSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter((i) => i !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  /**
   * Open delete confirmation
   */
  const confirmDelete = (ids: string[]) => {
    setDeleteTarget(ids);
    setDeleteModalOpen(true);
  };

  /**
   * Handle delete confirmed
   */
  const handleDeleteConfirmed = () => {
    if (deleteTarget) {
      onDelete(deleteTarget);
      setDeleteModalOpen(false);
      setDeleteTarget(null);
    }
  };

  /**
   * Format date
   */
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  /**
   * Render sort icon
   */
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUp className="w-4 h-4 text-slate-600" />;
    }
    return sortDirection === "asc" ? (
      <ChevronUp className="w-4 h-4 text-cyan-400" />
    ) : (
      <ChevronDown className="w-4 h-4 text-cyan-400" />
    );
  };

  return (
    <>
      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-800 rounded-lg p-3 mb-4 flex items-center justify-between"
          >
            <span className="text-sm text-slate-300">
              {selectedIds.length} item{selectedIds.length !== 1 ? "s" : ""} selected
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onPublish(selectedIds)}
                className="text-slate-300 hover:text-white"
              >
                Publish
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUnpublish(selectedIds)}
                className="text-slate-300 hover:text-white"
              >
                Unpublish
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => confirmDelete(selectedIds)}
                className="text-rose-400 hover:text-rose-300"
              >
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSelectionChange([])}
                className="text-slate-400"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 text-left w-12">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleSelectAll}
                  />
                </th>
                <SortableHeader
                  label="Title"
                  field="title"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Category"
                  field="category"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Difficulty"
                  field="difficulty"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Status
                </th>
                <SortableHeader
                  label="Attempts"
                  field="attempts"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Avg Score"
                  field="avgScore"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <SortableHeader
                  label="Updated"
                  field="updatedAt"
                  currentField={sortField}
                  direction={sortDirection}
                  onSort={handleSort}
                />
                <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-4 py-4">
                      <div className="w-5 h-5 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-48 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-24 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-20 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-5 w-16 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-12 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-12 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-4 w-20 bg-slate-800 rounded" />
                    </td>
                    <td className="px-4 py-4">
                      <div className="h-8 w-8 bg-slate-800 rounded" />
                    </td>
                  </tr>
                ))
              ) : cases.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-500">
                    No cases found
                  </td>
                </tr>
              ) : (
                cases.map((caseRow) => (
                  <tr
                    key={caseRow.id}
                    className={cn(
                      "hover:bg-slate-800/50 transition-colors",
                      selectedIds.includes(caseRow.id) && "bg-slate-800/30"
                    )}
                  >
                    <td className="px-4 py-4">
                      <Checkbox
                        checked={selectedIds.includes(caseRow.id)}
                        onCheckedChange={() => handleRowSelect(caseRow.id)}
                      />
                    </td>
                    <td className="px-4 py-4">
                      <Link
                        href={`/admin/cases/${caseRow.id}`}
                        className="text-white font-medium hover:text-cyan-400 transition-colors"
                      >
                        {caseRow.title}
                      </Link>
                      <p className="text-xs text-slate-500 mt-0.5">
                        /{caseRow.slug}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        size="sm"
                        className={cn("border", CATEGORY_COLORS[caseRow.category])}
                      >
                        {caseRow.category.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Badge
                        size="sm"
                        className={cn("border", DIFFICULTY_COLORS[caseRow.difficulty])}
                      >
                        {caseRow.difficulty}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      {caseRow.isPublished ? (
                        <Badge variant="success" size="sm">
                          Published
                        </Badge>
                      ) : (
                        <Badge variant="default" size="sm" className="bg-slate-700 text-slate-400">
                          Draft
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {caseRow.attempts.toLocaleString()}
                    </td>
                    <td className="px-4 py-4 text-slate-300">
                      {caseRow.avgScore !== null ? `${caseRow.avgScore}%` : "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-400 text-sm">
                      {formatDate(caseRow.updatedAt)}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setActionDropdownId(
                              actionDropdownId === caseRow.id ? null : caseRow.id
                            )
                          }
                          className="text-slate-400 hover:text-white"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>

                        <AnimatePresence>
                          {actionDropdownId === caseRow.id && (
                            <ActionDropdown
                              caseId={caseRow.id}
                              onEdit={() => router.push(`/admin/cases/${caseRow.id}/edit`)}
                              onView={() => router.push(`/cases/${caseRow.slug}`)}
                              onDuplicate={() => {
                                onDuplicate(caseRow.id);
                                setActionDropdownId(null);
                              }}
                              onArchive={() => {
                                onArchive(caseRow.id);
                                setActionDropdownId(null);
                              }}
                              onDelete={() => {
                                confirmDelete([caseRow.id]);
                                setActionDropdownId(null);
                              }}
                              onClose={() => setActionDropdownId(null)}
                            />
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-slate-800 px-4 py-3 flex items-center justify-between">
            <p className="text-sm text-slate-400">
              Showing {(currentPage - 1) * pageSize + 1} to{" "}
              {Math.min(currentPage * pageSize, totalCount)} of {totalCount}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateParams({ page: String(currentPage - 1) })}
                disabled={currentPage <= 1}
                className="text-slate-400 hover:text-white disabled:opacity-50"
              >
                Previous
              </Button>
              <span className="text-sm text-slate-400">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateParams({ page: String(currentPage + 1) })}
                disabled={currentPage >= totalPages}
                className="text-slate-400 hover:text-white disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent size="sm" className="bg-slate-900 border-slate-800">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-300">
              Are you sure you want to delete {deleteTarget?.length || 0} case
              {deleteTarget?.length !== 1 ? "s" : ""}? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setDeleteModalOpen(false)}
              className="text-slate-400 hover:text-white"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirmed}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// ============================================================================
// Sortable Header
// ============================================================================

interface SortableHeaderProps {
  label: string;
  field: SortField;
  currentField: SortField;
  direction: SortDirection;
  onSort: (field: SortField) => void;
}

function SortableHeader({
  label,
  field,
  currentField,
  direction,
  onSort,
}: SortableHeaderProps) {
  return (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => onSort(field)}
        className="flex items-center gap-1 text-xs font-medium text-slate-400 uppercase tracking-wider hover:text-white transition-colors"
      >
        {label}
        {currentField === field ? (
          direction === "asc" ? (
            <ChevronUp className="w-4 h-4 text-cyan-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-cyan-400" />
          )
        ) : (
          <ChevronUp className="w-4 h-4 opacity-30" />
        )}
      </button>
    </th>
  );
}

// ============================================================================
// Action Dropdown
// ============================================================================

interface ActionDropdownProps {
  caseId: string;
  onEdit: () => void;
  onView: () => void;
  onDuplicate: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onClose: () => void;
}

function ActionDropdown({
  caseId,
  onEdit,
  onView,
  onDuplicate,
  onArchive,
  onDelete,
  onClose,
}: ActionDropdownProps) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const actions = [
    { label: "Edit", icon: Edit, onClick: onEdit },
    { label: "View", icon: Eye, onClick: onView },
    { label: "Duplicate", icon: Copy, onClick: onDuplicate },
    { label: "Archive", icon: Archive, onClick: onArchive },
    { label: "Delete", icon: Trash2, onClick: onDelete, danger: true },
  ];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute right-0 mt-1 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
    >
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors text-left",
            action.danger
              ? "text-rose-400 hover:bg-rose-500/10"
              : "text-slate-300 hover:bg-slate-700"
          )}
        >
          <action.icon className="w-4 h-4" />
          {action.label}
        </button>
      ))}
    </motion.div>
  );
}

// ============================================================================
// Case Filters
// ============================================================================

export interface CaseFiltersProps {
  search: string;
  category: CaseCategory | "";
  difficulty: DifficultyLevel | "";
  status: "all" | "published" | "draft";
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: CaseCategory | "") => void;
  onDifficultyChange: (value: DifficultyLevel | "") => void;
  onStatusChange: (value: "all" | "published" | "draft") => void;
  onClear: () => void;
}

export function CaseFilters({
  search,
  category,
  difficulty,
  status,
  onSearchChange,
  onCategoryChange,
  onDifficultyChange,
  onStatusChange,
  onClear,
}: CaseFiltersProps) {
  const hasFilters = search || category || difficulty || status !== "all";

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[200px] max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
        <Input
          placeholder="Search cases..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
        />
      </div>

      {/* Category Filter */}
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value as CaseCategory | "")}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="">All Categories</option>
        <option value="low-back-pain">Low Back Pain</option>
        <option value="headache">Headache</option>
        <option value="chest-pain">Chest Pain</option>
        <option value="abdominal-pain">Abdominal Pain</option>
        <option value="extremity-trauma">Extremity Trauma</option>
      </select>

      {/* Difficulty Filter */}
      <select
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value as DifficultyLevel | "")}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="">All Difficulties</option>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {/* Status Filter */}
      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as "all" | "published" | "draft")}
        className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="all">All Status</option>
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>

      {/* Clear Filters */}
      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  );
}
