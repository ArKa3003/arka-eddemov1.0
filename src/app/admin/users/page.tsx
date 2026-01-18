// @ts-nocheck
"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  Download,
  UserPlus,
  MoreHorizontal,
  Eye,
  Shield,
  Ban,
  Mail,
  Calendar,
  Activity,
  Target,
  Trophy,
  Clock,
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  Users,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalClose, ModalFooter } from "@/components/ui/modal";
import { cn, getTimeAgo } from "@/lib/utils";
import type { Profile, UserRole } from "@/types/database";

// ============================================================================
// Types
// ============================================================================

interface UserWithStats extends Profile {
  cases_completed: number;
  accuracy: number;
  last_active: string | null;
}

interface UserFilters {
  search: string;
  role: UserRole | "all";
  institution: string;
}

// ============================================================================
// Mock Data
// ============================================================================

const MOCK_USERS: UserWithStats[] = [
  {
    id: "1",
    email: "john.smith@hospital.edu",
    full_name: "John Smith",
    avatar_url: null,
    role: "resident",
    institution: "Memorial Hospital",
    specialty_track: "em",
    training_year: 2,
    streak_count: 15,
    last_activity_date: new Date().toISOString(),
    onboarding_completed: true,
    created_at: "2025-06-15T00:00:00Z",
    updated_at: "2026-01-15T00:00:00Z",
    cases_completed: 45,
    accuracy: 78,
    last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    email: "sarah.johnson@med.edu",
    full_name: "Sarah Johnson",
    avatar_url: null,
    role: "student",
    institution: "State Medical School",
    specialty_track: "im",
    training_year: 3,
    streak_count: 7,
    last_activity_date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    onboarding_completed: true,
    created_at: "2025-08-01T00:00:00Z",
    updated_at: "2026-01-14T00:00:00Z",
    cases_completed: 23,
    accuracy: 85,
    last_active: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    email: "dr.chen@clinic.com",
    full_name: "Dr. Michael Chen",
    avatar_url: null,
    role: "attending",
    institution: "Private Practice",
    specialty_track: "fm",
    training_year: null,
    streak_count: 3,
    last_activity_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    onboarding_completed: true,
    created_at: "2025-09-10T00:00:00Z",
    updated_at: "2026-01-10T00:00:00Z",
    cases_completed: 12,
    accuracy: 92,
    last_active: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "4",
    email: "admin@arka-ed.com",
    full_name: "Admin User",
    avatar_url: null,
    role: "admin",
    institution: "ARKA-ED",
    specialty_track: null,
    training_year: null,
    streak_count: 0,
    last_activity_date: new Date().toISOString(),
    onboarding_completed: true,
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2026-01-17T00:00:00Z",
    cases_completed: 0,
    accuracy: 0,
    last_active: new Date().toISOString(),
  },
  {
    id: "5",
    email: "emily.davis@university.edu",
    full_name: "Emily Davis",
    avatar_url: null,
    role: "student",
    institution: "University Medical Center",
    specialty_track: "surgery",
    training_year: 2,
    streak_count: 21,
    last_activity_date: new Date().toISOString(),
    onboarding_completed: true,
    created_at: "2025-07-20T00:00:00Z",
    updated_at: "2026-01-17T00:00:00Z",
    cases_completed: 67,
    accuracy: 81,
    last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
];

// ============================================================================
// Component
// ============================================================================

export default function UserManagementPage() {
  const [users, setUsers] = React.useState<UserWithStats[]>(MOCK_USERS);
  const [filters, setFilters] = React.useState<UserFilters>({
    search: "",
    role: "all",
    institution: "",
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<UserWithStats | null>(null);
  const [showUserModal, setShowUserModal] = React.useState(false);
  const [showInviteModal, setShowInviteModal] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [loading] = React.useState(false);
  const perPage = 10;

  // Filter users
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      if (
        filters.search &&
        !user.full_name.toLowerCase().includes(filters.search.toLowerCase()) &&
        !user.email.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }
      if (filters.role !== "all" && user.role !== filters.role) {
        return false;
      }
      if (
        filters.institution &&
        !user.institution?.toLowerCase().includes(filters.institution.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [users, filters]);

  // Paginate
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const paginatedUsers = filteredUsers.slice(
    (page - 1) * perPage,
    page * perPage
  );

  /**
   * Handle CSV export
   */
  const handleExport = () => {
    const headers = [
      "Name",
      "Email",
      "Role",
      "Institution",
      "Cases Completed",
      "Accuracy",
      "Last Active",
    ];
    const rows = filteredUsers.map((user) => [
      user.full_name,
      user.email,
      user.role,
      user.institution || "",
      user.cases_completed,
      `${user.accuracy}%`,
      user.last_active ? new Date(user.last_active).toLocaleDateString() : "Never",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users-export.csv";
    a.click();
  };

  /**
   * Get role badge color
   */
  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "bg-rose-500/20 text-rose-400 border-rose-500/30";
      case "attending":
        return "bg-violet-500/20 text-violet-400 border-violet-500/30";
      case "resident":
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
      case "student":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-slate-500/20 text-slate-400 border-slate-500/30";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 mt-1">
            Manage users, roles, and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            onClick={handleExport}
            className="border-slate-700 text-slate-300"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button
            onClick={() => setShowInviteModal(true)}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Users
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Users"
          value={users.length}
          icon={<Users className="w-5 h-5" />}
          color="cyan"
        />
        <StatCard
          title="Active Today"
          value={
            users.filter(
              (u) =>
                u.last_active &&
                new Date(u.last_active) > new Date(Date.now() - 24 * 60 * 60 * 1000)
            ).length
          }
          icon={<Activity className="w-5 h-5" />}
          color="emerald"
        />
        <StatCard
          title="Avg Accuracy"
          value={`${Math.round(
            users.reduce((sum, u) => sum + u.accuracy, 0) / users.length
          )}%`}
          icon={<Target className="w-5 h-5" />}
          color="amber"
        />
        <StatCard
          title="Institutions"
          value={new Set(users.map((u) => u.institution).filter(Boolean)).size}
          icon={<Building className="w-5 h-5" />}
          color="violet"
        />
      </div>

      {/* Filters */}
      <Card className="bg-slate-900 border-slate-800">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search users by name or email..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                className="pl-10 bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <Button
              variant="primary"
              onClick={() => setShowFilters(!showFilters)}
              className={cn(
                "border-slate-700",
                showFilters ? "bg-slate-700 text-white" : "text-slate-300"
              )}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-800">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Role
                    </label>
                    <select
                      value={filters.role}
                      onChange={(e) =>
                        setFilters((f) => ({
                          ...f,
                          role: e.target.value as UserRole | "all",
                        }))
                      }
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                    >
                      <option value="all">All Roles</option>
                      <option value="student">Student</option>
                      <option value="resident">Resident</option>
                      <option value="attending">Attending</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">
                      Institution
                    </label>
                    <Input
                      placeholder="Filter by institution..."
                      value={filters.institution}
                      onChange={(e) =>
                        setFilters((f) => ({ ...f, institution: e.target.value }))
                      }
                      className="bg-slate-800 border-slate-700 text-white"
                    />
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setFilters({ search: "", role: "all", institution: "" })
                      }
                      className="text-slate-400 hover:text-white"
                    >
                      Clear Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* User Table */}
      <Card className="bg-slate-900 border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  User
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Role
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Institution
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Cases
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Accuracy
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Last Active
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-500 mx-auto" />
                  </td>
                </tr>
              ) : paginatedUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-slate-400"
                  >
                    No users found
                  </td>
                </tr>
              ) : (
                paginatedUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white font-medium">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {user.full_name}
                          </p>
                          <p className="text-sm text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="primary"
                        className={cn("capitalize", getRoleBadge(user.role))}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {user.institution || "-"}
                    </td>
                    <td className="py-3 px-4 text-white font-medium">
                      {user.cases_completed}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          "font-medium",
                          user.accuracy >= 80
                            ? "text-emerald-400"
                            : user.accuracy >= 60
                            ? "text-amber-400"
                            : "text-rose-400"
                        )}
                      >
                        {user.accuracy}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {user.last_active
                        ? getTimeAgo(new Date(user.last_active))
                        : "Never"}
                    </td>
                    <td className="py-3 px-4">
                      <UserActionMenu
                        user={user}
                        onView={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        onRoleChange={(role) => {
                          setUsers((prev) =>
                            prev.map((u) =>
                              u.id === user.id ? { ...u, role } : u
                            )
                          );
                        }}
                      />
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-800">
            <p className="text-sm text-slate-400">
              Showing {(page - 1) * perPage + 1} -{" "}
              {Math.min(page * perPage, filteredUsers.length)} of{" "}
              {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="border-slate-700 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p === page ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={
                    p === page
                      ? "bg-cyan-500"
                      : "border-slate-700 text-slate-300"
                  }
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="border-slate-700 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* User Detail Modal */}
      <Modal open={showUserModal} onOpenChange={setShowUserModal}>
        <ModalContent className="bg-slate-900 border-slate-800 max-w-2xl">
          <ModalHeader>
            <ModalTitle className="text-white">User Details</ModalTitle>
            <ModalClose />
          </ModalHeader>
          {selectedUser && <UserDetailContent user={selectedUser} />}
        </ModalContent>
      </Modal>

      {/* Invite Modal */}
      <Modal open={showInviteModal} onOpenChange={setShowInviteModal}>
        <ModalContent className="bg-slate-900 border-slate-800">
          <ModalHeader>
            <ModalTitle className="text-white">Invite Users</ModalTitle>
            <ModalClose />
          </ModalHeader>
          <InviteUserForm onClose={() => setShowInviteModal(false)} />
        </ModalContent>
      </Modal>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: "cyan" | "emerald" | "amber" | "violet";
}) {
  const colors = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    violet: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  };

  return (
    <Card className={cn("border", colors[color])}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">{title}</p>
            <p className="text-2xl font-bold text-white mt-1">{value}</p>
          </div>
          <div className={cn("p-3 rounded-lg", colors[color])}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function UserActionMenu({
  user,
  onView,
  onRoleChange,
}: {
  user: UserWithStats;
  onView: () => void;
  onRoleChange: (role: UserRole) => void;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpen(!open)}
        className="text-slate-400 hover:text-white"
      >
        <MoreHorizontal className="w-4 h-4" />
      </Button>
      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden"
            >
              <button
                onClick={() => {
                  onView();
                  setOpen(false);
                }}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View Details
              </button>
              <button
                onClick={() => setOpen(false)}
                className="w-full px-4 py-2 text-left text-sm text-slate-300 hover:bg-slate-700 flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                Send Message
              </button>
              <div className="border-t border-slate-700 my-1" />
              <div className="px-4 py-2 text-xs text-slate-500 uppercase">
                Change Role
              </div>
              {(["student", "resident", "attending", "admin"] as UserRole[]).map(
                (role) => (
                  <button
                    key={role}
                    onClick={() => {
                      onRoleChange(role);
                      setOpen(false);
                    }}
                    className={cn(
                      "w-full px-4 py-2 text-left text-sm flex items-center gap-2",
                      user.role === role
                        ? "text-cyan-400 bg-cyan-500/10"
                        : "text-slate-300 hover:bg-slate-700"
                    )}
                  >
                    <Shield className="w-4 h-4" />
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </button>
                )
              )}
              <div className="border-t border-slate-700 my-1" />
              <button
                onClick={() => setOpen(false)}
                className="w-full px-4 py-2 text-left text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2"
              >
                <Ban className="w-4 h-4" />
                Disable Account
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function UserDetailContent({ user }: { user: UserWithStats }) {
  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 flex items-center justify-center text-white text-2xl font-bold">
          {user.full_name.charAt(0)}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.full_name}</h2>
          <p className="text-slate-400">{user.email}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="primary" className="capitalize">
              {user.role}
            </Badge>
            {user.specialty_track && (
              <Badge variant="primary" className="uppercase">
                {user.specialty_track}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800 rounded-lg text-center">
          <Trophy className="w-5 h-5 text-amber-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{user.cases_completed}</p>
          <p className="text-xs text-slate-400">Cases</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg text-center">
          <Target className="w-5 h-5 text-emerald-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{user.accuracy}%</p>
          <p className="text-xs text-slate-400">Accuracy</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg text-center">
          <Activity className="w-5 h-5 text-cyan-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{user.streak_count}</p>
          <p className="text-xs text-slate-400">Streak</p>
        </div>
        <div className="p-4 bg-slate-800 rounded-lg text-center">
          <Calendar className="w-5 h-5 text-violet-400 mx-auto mb-2" />
          <p className="text-sm font-bold text-white">
            {new Date(user.created_at).toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-400">Joined</p>
        </div>
      </div>

      {/* Activity History */}
      <div>
        <h3 className="text-sm font-medium text-slate-400 mb-3">
          Recent Activity
        </h3>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <div className="flex-1">
                <p className="text-sm text-white">Completed case #{i}</p>
                <p className="text-xs text-slate-400">{i} day{i > 1 ? "s" : ""} ago</p>
              </div>
              <Badge variant="primary" className="bg-emerald-500/20 text-emerald-400">
                {85 + i}%
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InviteUserForm({ onClose }: { onClose: () => void }) {
  const [emails, setEmails] = React.useState("");
  const [role, setRole] = React.useState<UserRole>("student");
  const [sending, setSending] = React.useState(false);

  const handleSend = async () => {
    setSending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    onClose();
  };

  return (
    <div className="p-6 space-y-4">
      <div>
        <label className="text-sm text-slate-400 mb-1 block">
          Email Addresses
        </label>
        <textarea
          value={emails}
          onChange={(e) => setEmails(e.target.value)}
          placeholder="Enter email addresses, one per line..."
          rows={4}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white resize-none"
        />
        <p className="text-xs text-slate-500 mt-1">
          Separate multiple emails with a new line
        </p>
      </div>
      <div>
        <label className="text-sm text-slate-400 mb-1 block">
          Default Role
        </label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
        >
          <option value="student">Student</option>
          <option value="resident">Resident</option>
          <option value="attending">Attending</option>
        </select>
      </div>
      <ModalFooter className="px-0 pb-0">
        <Button
          variant="primary"
          onClick={onClose}
          className="border-slate-700 text-slate-300"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          disabled={!emails.trim() || sending}
          className="bg-cyan-500 hover:bg-cyan-600"
        >
          {sending ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Mail className="w-4 h-4 mr-2" />
          )}
          Send Invitations
        </Button>
      </ModalFooter>
    </div>
  );
}
