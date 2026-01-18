// @ts-nocheck
import { RoleGuard } from "@/components/auth/role-guard";

// ============================================================================
// Admin Layout
// ============================================================================

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-slate-950">
        {children}
      </div>
    </RoleGuard>
  );
}

// ============================================================================
// Metadata
// ============================================================================

export const metadata = {
  title: "Admin Dashboard | ARKA-ED",
  description: "Administrative dashboard for ARKA-ED platform management.",
};
