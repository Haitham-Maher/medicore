"use client";

import { Building2, Filter, Star } from "lucide-react";
import { StatsCard } from "@/components/ui/StatsCard";
import StatsBarSkeleton from "@/components/medical-points/skeletons/StatsBarSkeleton";
import { IMedicalPoint } from "@/constants/medical-points";

interface MedicalPointsStatsProps {
    points?: IMedicalPoint[];
    summary?: {
        total: number;
        active: number;
        inactive: number;
    };
    isLoading: boolean;
    isAdmin?: boolean;
}

export function MedicalPointsStats({ points = [], summary, isLoading, isAdmin = true }: MedicalPointsStatsProps) {
    if (isLoading) return <StatsBarSkeleton />;

    const total = summary ? summary.total : points.length;
    const active = summary ? summary.active : points.filter((p) => p.status === "active").length;
    const inactive = summary ? summary.inactive : points.filter((p) => p.status === "maintenance").length;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard
                title={isAdmin ? "إجمالي النقاط" : "إجمالي الأقسام"}
                value={total.toString()}
                color="bg-primary/10 text-primary"
                icon={Building2}
            />
            <StatsCard
                title={isAdmin ? "النقاط النشطة" : "الأقسام النشطة"}
                value={active.toString()}
                color="bg-success/10 text-success"
                icon={Star}
            />
            <StatsCard
                title={isAdmin ? "النقاط غير النشطة" : "تحت الصيانة"}
                value={inactive.toString()}
                color="bg-warning/10 text-warning"
                icon={Filter}
            />
        </div>
    );
}
