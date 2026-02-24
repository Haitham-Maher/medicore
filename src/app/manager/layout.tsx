import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function ManagerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminDashboardLayout isAdmin={false}>{children}</AdminDashboardLayout>;
}