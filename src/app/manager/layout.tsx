import RoleGuard from "@/components/auth/RoleGuard";
import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRole="manager">
            <AdminDashboardLayout isAdmin={false}>
                {children}
            </AdminDashboardLayout>
        </RoleGuard>
    );
}