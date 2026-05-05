import RoleGuard from "@/components/auth/RoleGuard";
import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRole="patient">
            <AdminDashboardLayout role="patient">
                {children}
            </AdminDashboardLayout>
        </RoleGuard>
    );
}
