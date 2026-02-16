"use client"

import { useState, useEffect } from "react";
import AgeDistributionChart from "@/components/dashboard/AgeDistributionChart";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";
import MedicalPointsGrid from "@/components/dashboard/MedicalPointsGrid";
import StatsGrid from "@/components/dashboard/StatsGrid"
import TopDepartments from "@/components/dashboard/TopDepartments";
import RecentRequests from "@/components/dashboard/RecentRequests";
import { LayoutDashboard } from "lucide-react";
import { PageHeader } from "@/components/ui";

// Skeletons
import StatsGridSkeleton from "@/components/dashboard/skeletons/StatsGridSkeleton";
import ChartsSkeleton from "@/components/dashboard/skeletons/ChartsSkeleton";
import MedicalPointsGridSkeleton from "@/components/medical-points/skeletons/MedicalPointsGridSkeleton";
import LowStockAlertsSkeleton from "@/components/dashboard/skeletons/LowStockAlertsSkeleton";
import RecentRequestsSkeleton from "@/components/dashboard/skeletons/RecentRequestsSkeleton";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PageHeader
                title="نظرة عامة"
                description="إحصائيات وتحليلات شاملة لأداء النظام والمخزون الطبي"
                icon={LayoutDashboard}
            />

            {isLoading ? <StatsGridSkeleton /> : <StatsGrid />}

            {isLoading ? (
                <ChartsSkeleton />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="md:col-span-1 lg:col-span-2">
                        <AgeDistributionChart />
                    </div>
                    <div className="md:col-span-1 lg:col-span-1">
                        <TopDepartments />
                    </div>
                </div>
            )}

            {isLoading ? <MedicalPointsGridSkeleton /> : <MedicalPointsGrid />}

            {isLoading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <RecentRequestsSkeleton />
                    <LowStockAlertsSkeleton />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <RecentRequests />
                    <LowStockAlerts />
                </div>
            )}
        </div>
    );
}
