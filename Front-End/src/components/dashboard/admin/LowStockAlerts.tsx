"use client"

import { AlertTriangle, ArrowLeft, Package } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import LowStockAlertsSkeleton from "../skeletons/LowStockAlertsSkeleton";

interface LowStockItem {
    medicine_name: string;
    location_name: string;
    current_quantity: number;
    max_quantity: number;
    percentage: string;
}


export default function LowStockAlerts({ isAdmin = true }: { isAdmin?: boolean }) {

    const { data: response, isLoading } = useQuery({
        queryKey: ["low-stock-alerts"],
        queryFn: async () => {
            const { data } = await api.get("/inventory/alerts?limit=5")
            return data
        }
    })
    if (isLoading) return <LowStockAlertsSkeleton />
    const lowStock: LowStockItem[] = response?.data || []


    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden flex flex-col h-full">
            {/* Header */}
            <div className="p-4 md:p-6 pb-4 border-b border-border/50 bg-linear-to-br from-destructive/5 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0">
                            <AlertTriangle className="text-destructive w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">تنبيهات المخزون</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                                {lowStock.length} أدوية تحت الحد الأدنى
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

            {/* Items List */}
            <div className="p-4 md:p-6 pt-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar flex-1">
                {lowStock.map((item, i) => {
                    const percentageValue = parseFloat(item.percentage);
                    const isCritical = percentageValue < 4;
                    const isLow = percentageValue >= 4 && percentageValue < 6;

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
                                        <p className="font-semibold text-xs md:text-sm text-foreground truncate">{item.medicine_name}</p>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-muted-foreground mt-1 flex items-center gap-1">
                                        <span className="shrink-0">📍</span>
                                        <span className="truncate">{item.location_name}</span>
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
                                        {item.current_quantity} متبقي
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar Area */}
                            <div className="space-y-1 md:space-y-1.5">
                                <div className="flex items-center justify-between text-[9px] md:text-xs">
                                    <span className="text-muted-foreground">نسبة المخزون</span>
                                    <span className="font-medium text-foreground">
                                        {item.current_quantity} <span className="text-muted-foreground mx-0.5">/</span> {item.max_quantity}
                                        <span className="text-muted-foreground mr-1">({item.percentage})</span>
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