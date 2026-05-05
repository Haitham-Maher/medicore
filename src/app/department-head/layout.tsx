import RoleGuard from "@/components/auth/RoleGuard";
import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function DeptHeadLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRole="department-head">
            <AdminDashboardLayout role="department-head">
                {children}
            </AdminDashboardLayout>
        </RoleGuard>
    );
}
