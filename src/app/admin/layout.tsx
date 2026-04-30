import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminDashboardLayout>{children}</AdminDashboardLayout>;
}
 