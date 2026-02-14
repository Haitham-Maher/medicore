"use client";

import { motion } from "framer-motion";
import { Package, PackageX, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import InventoryStatsSkeleton from "./InventoryStatsSkeleton";



const stats = [
    {
        label: "إجمالي الأصناف",
        value: "1,240",
        description: "+12 صنف جديد هذا الشهر",
        icon: Package,
        color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        trend: "up"
    },
    {
        label: "القيمة الإجمالية",
        value: "450,000 ر.س",
        description: "مخزون الأدوية والمستلزمات",
        icon: DollarSign,
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
        trend: "up"
    },
    {
        label: "منخفض المخزون",
        value: "23",
        description: "تحتاج إعادة تعبئة عاجلة",
        icon: AlertTriangle,
        color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        trend: "down"
    },
    {
        label: "نفد المخزون",
        value: "5",
        description: "غير متوفرة حالياً",
        icon: PackageX,
        color: "text-red-500 bg-red-500/10 border-red-500/20",
        trend: "down"
    }
];

export default function InventoryStats({ isLoading = false }: { isLoading?: boolean }) {
    if (isLoading) return <InventoryStatsSkeleton />;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
                <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border/50 rounded-2xl p-5 hover:shadow-md transition-all group"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", stat.color)}>
                            <stat.icon size={24} />
                        </div>
                        {stat.trend === "up" && (
                            <span className="flex items-center text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                                <TrendingUp size={14} className="mr-1" /> +2.5%
                            </span>
                        )}
                    </div>

                    <h3 className="text-2xl font-bold text-foreground mb-1">{stat.value}</h3>
                    <p className="text-sm text-muted-foreground font-medium mb-1">{stat.label}</p>
                    <p className="text-xs text-muted-foreground opacity-70">{stat.description}</p>
                </motion.div>
            ))}
        </div>
    );
}
