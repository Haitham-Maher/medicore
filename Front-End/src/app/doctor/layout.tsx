import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
    return <AdminDashboardLayout role="doctor">{children}</AdminDashboardLayout>;
}
