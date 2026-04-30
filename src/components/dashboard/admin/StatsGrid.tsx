"use client"

import {
    Users,
    Hospital,
    UserRound,
    TrendingUp,
    Package,
} from "lucide-react";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { useEffect } from "react";
interface StatsGridProps {
    isAdmin?: boolean;
    onRegionLoad?: (regionName: string) => void;
}

const colorMap: Record<string, { color: string; bgColor: string }> = {
    patients: { color: "text-chart-2", bgColor: "bg-chart-2/15" },
    points: { color: "text-chart-1", bgColor: "bg-chart-1/15" },
    doctors: { color: "text-chart-4", bgColor: "bg-chart-4/15" },
    medicines: { color: "text-chart-3", bgColor: "bg-chart-3/15" },
    departments: { color: "text-chart-1", bgColor: "bg-chart-1/15" },
};

export default function StatsGrid({ isAdmin, onRegionLoad }: StatsGridProps) {


    const { data: response, isLoading } = useQuery({
        queryKey: [isAdmin ? "admin-stats" : "manager-staff-stats"],
        queryFn: async () => {
            const res = await api.get(isAdmin ? `/dashboard/overview-stats` : `/point-manager/staff/summary`);            
            return res.data;
        }
    })
    const stats = isAdmin ? response?.data : response;

    useEffect(() => {
        if (isAdmin && stats?.region_name && onRegionLoad) {
            onRegionLoad(stats.region_name);
        }
    }, [stats?.region_name, onRegionLoad, isAdmin]);

    if (isLoading) {
        return (
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${isAdmin ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
                {Array.from({ length: isAdmin ? 4 : 3 }).map((_, i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border border-border/50 h-32 animate-pulse" />
                ))}
            </div>
        );
    }

    const displayStats = isAdmin ? [
        {
            label: "إجمالي المرضى",
            value: stats?.total_patients_visited || "0",
            icon: Users,
            color: "text-chart-2",
            bgColor: "bg-chart-2/15",
        },
        {
            label: "النقاط الطبية",
            value: stats?.total_points || "0",
            icon: Hospital,
            color: "text-chart-1",
            bgColor: "bg-chart-1/15",
        },
        {
            label: "الأطباء",
            value: stats?.total_doctors || "0",
            icon: UserRound,
            color: "text-chart-4",
            bgColor: "bg-chart-4/15",
        },
        {
            label: "الأدوية في المخازن",
            value: stats?.total_medicines_in_storage || "0",
            icon: Package,
            color: "text-chart-3",
            bgColor: "bg-chart-3/15",
        },
    ] : [
        {
            label: "إجمالي الكادر",
            value: stats?.all || "0",
            icon: Users,
            color: "text-chart-1",
            bgColor: "bg-chart-1/15",
        },
        {
            label: "رؤساء الأقسام",
            value: stats?.heads || "0",
            icon: Hospital,
            color: "text-chart-2",
            bgColor: "bg-chart-2/15",
        },
        {
            label: "الأطباء",
            value: stats?.doctors || "0",
            icon: UserRound,
            color: "text-chart-4",
            bgColor: "bg-chart-4/15",
        },
    ];

    const gridCols = isAdmin ? "lg:grid-cols-4" : "lg:grid-cols-3";

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
            {displayStats.map((stat: any, i: number) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    whileHover={{ scale: 1.03 }}
                    className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-xl hover:border-primary/20 cursor-pointer group transition-shadow duration-300"
                >
                    <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center transition-all group-hover:shadow-lg group-hover:shadow-primary/10`}>
                            <stat.icon className={`${stat.color}`} size={24} />
                        </div>
                        {stat.trend && (
                            <div className="flex items-center gap-1 text-emerald-500 font-medium text-sm">
                                <span>{stat.trend}</span>
                                <TrendingUp size={14} />
                            </div>
                        )}
                    </div>
                    <div className="mt-4">
                        <p className="text-muted-foreground text-sm font-bold">{stat.label}</p>
                        <h3 className="text-2xl font-black text-foreground mt-1 tracking-tight">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
