import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function DepartmentHeadLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminDashboardLayout role="department-head">{children}</AdminDashboardLayout>;
}
