import RoleGuard from "@/components/auth/RoleGuard";
import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    return (
        <RoleGuard allowedRole="doctor">
            <AdminDashboardLayout role="doctor">
                {children}
            </AdminDashboardLayout>
        </RoleGuard>
    );
}
