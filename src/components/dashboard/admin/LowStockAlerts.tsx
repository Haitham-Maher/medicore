"use client"

import { AlertTriangle, ArrowLeft, Package } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import LowStockAlertsSkeleton from "../skeletons/LowStockAlertsSkeleton";

export default function LowStockAlerts({ isAdmin = true }: { isAdmin?: boolean }) {

    const { data: response, isLoading } = useQuery({
        queryKey: ["inventory-alerts", isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? "/inventory/alerts?limit=5" : "/point-manager/pharmacy/stock-alerts";
            const { data } = await api.get(endpoint);
            return data;
        }
    });

    if (isLoading) return <LowStockAlertsSkeleton />;

    // توحيد شكل البيانات بين الأدمن والمنجر
    const lowStock = (response?.data || []).map((item: any, i: number) => {
        if (!isAdmin) {
            // تحويل بيانات المنجر لتناسب الواجهة
            return {
                id: item.medicine_id,
                name: item.medicine_name,
                type: item.type,
                quantity: item.available,
                max: item.max_capacity,
                status_text: item.status,
                percentage: parseFloat(item.percentage) || 0
            };
        }
        // بيانات الأدمن
        return {
            id: item.id || i,
            name: item.medicine_name,
            type: item.location_name,
            quantity: item.current_quantity,
            max: item.max_quantity || 1000,
            status_text: "تنبيه مخزون",
            percentage: parseFloat(item.percentage) || 0
        };
    }).slice(0, 8);

    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header - بدون أي تغيير في التصميم */}
            <div className="p-4 md:p-6 pb-4 border-b border-border/50 bg-linear-to-br from-destructive/5 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="text-destructive w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">مخزون النقطة</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                                {lowStock.length} أدوية على وشك النفاذ
                            </p>
                        </div>
                    </div>
                    <Link href={isAdmin ? "/admin/inventory" : "/manager/inventory"}>
                        <button className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 shrink-0">
                            عرض الكل <ArrowLeft size={14} />
                        </button>
                    </Link>
                </div>
            </div>

            {/* Items List - نفس التصميم مع تعديل مسميات البيانات فقط */}
            <div className="p-4 md:p-6 pt-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar flex-1">
                {lowStock.map((item: any, i: number) => {
                    const percentageValue = item.percentage;
                    const isCritical = percentageValue < 15;
                    const isLow = percentageValue >= 15 && percentageValue < 30;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-3 md:p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 hover:bg-background transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-2 md:mb-3 gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <Package size={12} className="text-muted-foreground shrink-0 md:w-3.5 md:h-3.5" />
                                        <p className="font-semibold text-xs md:text-sm text-foreground truncate">{item.name}</p>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <span className="shrink-0">📦</span>
                                        <span className="truncate">{item.type}</span>
                                    </p>
                                </div>

                                <div className="shrink-0">
                                    <span
                                        className={cn(
                                            "inline-flex items-center px-1.5 md:px-2.5 py-0.5 md:py-1 rounded-full text-[9px] md:text-xs font-bold border whitespace-nowrap",
                                            isCritical
                                                ? "bg-destructive/10 text-destructive border border-destructive/20"
                                                : isLow
                                                    ? "bg-warning/10 text-warning border border-warning/20"
                                                    : "bg-chart-3/10 text-chart-3 border border-chart-3/20"
                                        )}
                                    >
                                        {item.quantity} متبقي
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar Area */}
                            <div className="space-y-1 md:space-y-1.5">
                                <div className="flex items-center justify-between text-[9px] md:text-xs">
                                    <span className="text-muted-foreground">{item.status_text}</span>
                                    <span className="font-medium text-foreground">
                                        {item.quantity} <span className="text-muted-foreground mx-0.5">/ {item.max}</span>
                                    </span>
                                </div>
                                <div className="h-1 md:h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(percentageValue, 100)}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className={cn(
                                            "h-full rounded-full transition-all",
                                            isCritical ? "bg-destructive" : isLow ? "bg-warning" : "bg-chart-3"
                                        )}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}