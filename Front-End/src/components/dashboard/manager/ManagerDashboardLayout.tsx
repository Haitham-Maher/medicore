import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

/**
 * ManagerDashboardLayout
 * هذا المكون هو الهيكل الأساسي للوحة تحكم "رئيس النقطة الطبية".
 */
export function ManagerDashboardLayout({ children }: { children: React.ReactNode }) {
    return <AdminDashboardLayout role="manager">{children}</AdminDashboardLayout>;
}
