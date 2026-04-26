"use client";

import { Building2, Filter, Star } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import StatsBarSkeleton from "@/components/medical-points/skeletons/StatsBarSkeleton";
import { IMedicalPoint } from "@/constants/medical-points";

interface MedicalPointsStatsProps {
    points: IMedicalPoint[];
    isLoading: boolean;
    isAdmin?: boolean;
}

export function MedicalPointsStats({ points, isLoading, isAdmin = true }: MedicalPointsStatsProps) {
    if (isLoading) return <StatsBarSkeleton />;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
                title={isAdmin ? "إجمالي النقاط" : "إجمالي الأقسام"}
                value={points.length.toString()}
                color="bg-primary/10 text-primary"
                icon={Building2}
            />
            <StatsCard
                title={isAdmin ? "النقاط النشطة" : "الأقسام النشطة"}
                value={points.filter((p) => p.status === "active").length.toString()}
                color="bg-success/10 text-success"
                icon={Star}
            />
            <StatsCard
                title="تحت الصيانة"
                value={points.filter((p) => p.status === "maintenance").length.toString()}
                color="bg-warning/10 text-warning"
                icon={Filter}
            />
        </div>
    );
}
