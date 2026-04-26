import { AdminDashboardLayout } from "@/components/dashboard/admin/AdminDashboardLayout";

export default function PatientLayout({ children }: { children: React.ReactNode }) {
    return <AdminDashboardLayout role="patient">{children}</AdminDashboardLayout>;
}
