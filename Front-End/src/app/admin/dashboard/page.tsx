"use client"

import { useState } from "react";
import AgeDistributionChart from "@/components/dashboard/admin/AgeDistributionChart";
import LowStockAlerts from "@/components/dashboard/admin/LowStockAlerts";
import MedicalPointsGrid from "@/components/dashboard/admin/MedicalPointsGrid";
import StatsGrid from "@/components/dashboard/admin/StatsGrid"
import TopDepartments from "@/components/dashboard/admin/TopDepartments";
import RecentRequests from "@/components/dashboard/admin/RecentRequests";
import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function DashboardPage() {
    const [regionName, setRegionName] = useState<string>("");
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="نظرة عامة"
                description="إحصائيات وتحليلات شاملة لأداء النظام والمخزون الطبي"
                icon={LayoutDashboard}
                regionName={regionName}
            />

            <StatsGrid onRegionLoad={(name) => setRegionName(name)} isAdmin={true} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="md:col-span-1 lg:col-span-2">
                    <AgeDistributionChart />
                </div>
                <div className="md:col-span-1 lg:col-span-1">
                    <TopDepartments title="النقاط الطبية الأكثر زيارة" isAdmin={true} />
                </div>
            </div>

            <MedicalPointsGrid isAdmin={true} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <RecentRequests isAdmin={true} />
                <LowStockAlerts />
            </div>
        </div>
    );
}
