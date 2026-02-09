"use client"

import { useState, useEffect } from "react";
import AgeDistributionChart from "@/components/dashboard/AgeDistributionChart";
import LowStockAlerts from "@/components/dashboard/LowStockAlerts";
import MedicalPointsGrid from "@/components/dashboard/MedicalPointsGrid";
import StatsGrid from "@/components/dashboard/StatsGrid"
import TopDepartments from "@/components/dashboard/TopDepartments";

// Skeletons
import StatsGridSkeleton from "@/components/dashboard/skeletons/StatsGridSkeleton";
import ChartsSkeleton from "@/components/dashboard/skeletons/ChartsSkeleton";
import MedicalPointsGridSkeleton from "@/components/dashboard/skeletons/MedicalPointsGridSkeleton";
import LowStockAlertsSkeleton from "@/components/dashboard/skeletons/LowStockAlertsSkeleton";

export default function DashboardPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h1 className="text-3xl font-bold text-foreground">نظرة عامة</h1>
                <p className="text-muted-foreground mt-2">مرحباً بك مجدداً في نظام ميدي كور لإدارة النقاط الطبية.</p>
            </div>

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

            {isLoading ? <LowStockAlertsSkeleton /> : <LowStockAlerts />}
        </div>
    );
}
