import RoleGuard from "@/components/auth/RoleGuard";
import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRole="admin">
            <AdminDashboardLayout isAdmin={true}>
                {children}
            </AdminDashboardLayout>
        </RoleGuard>
    );
}
 