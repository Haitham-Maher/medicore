"use client";

import { motion } from "framer-motion";
import { Package, PackageX, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import InventoryStatsSkeleton from "./InventoryStatsSkeleton";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

interface InventoryStatsProps {
    isAdmin?: boolean;
}

export default function InventoryStats({ isAdmin = true }: InventoryStatsProps) {
    const { data: statsResponse, isLoading } = useQuery({
        queryKey: ['inventory-stats', isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? '/storage/items' : '/point-manager/inventory/stats';
            const res = await api.get(endpoint);
            return res.data; // يرجع كائن يحتوي على { data, pagination, ... } للأدمن
        }
    });

    if (isLoading) return <InventoryStatsSkeleton />;

    // تهيئة القيم الافتراضية
    let statsValues = {
        total_items: 0,
        total_value: 0,
        low_stock_count: 0,
        out_of_stock_count: 0
    };

    // استخراج البيانات بناءً على نوع المستخدم وشكل الاستجابة
    const rawData = statsResponse?.data;

    if (isAdmin && Array.isArray(rawData)) {
        // حساب البيانات برمجياً للأدمن من مصفوفة الأصناف
        const pagination = statsResponse?.pagination;

        statsValues.total_items = pagination?.total || rawData.length;

        // حساب إجمالي القيمة: السعر × الكمية
        statsValues.total_value = rawData.reduce((acc: number, item: any) => {
            return acc + (parseFloat(item.price || 0) * (item.quantity || 0));
        }, 0);

        // حساب المخزون المنخفض (مثال: الكمية أقل من 20% من الحد الأقصى)
        statsValues.low_stock_count = rawData.filter((item: any) =>
            item.quantity > 0 && item.quantity <= (item.max * 0.2)
        ).length;

        // حساب المخزون الذي نفد
        statsValues.out_of_stock_count = rawData.filter((item: any) =>
            item.quantity === 0
        ).length;

    } else if (!isAdmin && rawData) {
        // استلام البيانات الجاهزة لمدير النقطة
        statsValues = {
            total_items: rawData.total_items || 0,
            total_value: rawData.total_value || 0,
            low_stock_count: rawData.low_stock_count || 0,
            out_of_stock_count: rawData.out_of_stock_count || 0
        };
    }

    // تجهيز مصفوفة العرض
    const statsData = [
        {
            label: "إجمالي الأصناف",
            value: statsValues.total_items.toLocaleString(),
            description: isAdmin ? "الأصناف في المخزون المركزي" : "إجمالي الأصناف المتوفرة",
            icon: Package,
            color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
            trend: "up"
        },
        {
            label: "القيمة الإجمالية",
            value: `${Math.round(statsValues.total_value).toLocaleString()}$`,
            description: "مخزون الأدوية والمستلزمات",
            icon: DollarSign,
            color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
            trend: "up"
        },
        {
            label: "منخفض المخزون",
            value: statsValues.low_stock_count.toString(),
            description: "تحتاج إعادة تعبئة عاجلة",
            icon: AlertTriangle,
            color: "text-orange-500 bg-orange-500/10 border-orange-500/20",
            trend: "down"
        },
        {
            label: "نفد المخزون",
            value: statsValues.out_of_stock_count.toString(),
            description: "غير متوفرة حالياً",
            icon: PackageX,
            color: "text-red-500 bg-red-500/10 border-red-500/20",
            trend: "down"
        }
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 w-full px-0">
            {statsData.map((stat, index) => (
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

                    <h3 className="text-xl lg:text-xl font-black text-foreground mb-0.5 tracking-tight">
                        {stat.value}
                    </h3>
                    <p className="text-xs lg:text-[13px] text-muted-foreground font-black mb-1 opacity-80">
                        {stat.label}
                    </p>
                    <p className="text-[10px] lg:text-[11px] text-muted-foreground opacity-60 font-medium">
                        {stat.description}
                    </p>
                </motion.div>
            ))}
        </div>
    );
}