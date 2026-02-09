"use client"

import { AlertTriangle, ArrowLeft, Package } from "lucide-react";
import { motion } from "framer-motion";

interface LowStockItem {
    name: string;
    stock: number;
    minLevel: number;
    point: string;
}

const lowStockItems: LowStockItem[] = [
    { name: "Panadol Extra", stock: 5, minLevel: 20, point: "نقطة الرمال" },
    { name: "Amoxicillin 500mg", stock: 2, minLevel: 15, point: "نقطة الشاطئ" },
    { name: "Insulin Lantus", stock: 0, minLevel: 10, point: "المخزن الرئيسي" },
    { name: "Aspirin 100mg", stock: 8, minLevel: 25, point: "نقطة الشفاء" },
];

export default function LowStockAlerts() {
    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-6 pb-4 border-b border-border/50 bg-linear-to-br from-destructive/5 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                            <AlertTriangle size={20} className="text-destructive" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-foreground">تنبيهات المخزون</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {lowStockItems.filter(item => item.stock === 0).length} منتج نفد تماماً
                            </p>
                        </div>
                    </div>
                    <button className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-3 py-1.5 rounded-lg hover:bg-primary/5">
                        عرض الكل <ArrowLeft size={14} />
                    </button>
                </div>
            </div>

            {/* Items List */}
            <div className="p-6 pt-4 space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                {lowStockItems.map((item, i) => {
                    const percentage = (item.stock / item.minLevel) * 100;
                    const isOutOfStock = item.stock === 0;
                    const isCritical = percentage < 20 && !isOutOfStock;
                    const isLow = percentage >= 20 && percentage < 50;

                    return (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="group p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 hover:bg-background transition-all cursor-pointer"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Package size={14} className="text-muted-foreground" />
                                        <p className="font-semibold text-sm text-foreground">{item.name}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-1 mr-5">
                                        📍 {item.point}
                                    </p>
                                </div>

                                <div className="text-left">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${isOutOfStock
                                                ? "bg-destructive/10 text-destructive border border-destructive/20"
                                                : isCritical
                                                    ? "bg-warning/10 text-warning border border-warning/20"
                                                    : "bg-chart-3/10 text-chart-3 border border-chart-3/20"
                                            }`}
                                    >
                                        {isOutOfStock ? "نفد المخزون" : `${item.stock} متبقي`}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-muted-foreground">المستوى</span>
                                    <span className="font-medium text-foreground">
                                        {item.stock} / {item.minLevel}
                                    </span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(percentage, 100)}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className={`h-full rounded-full transition-all ${isOutOfStock
                                                ? "bg-destructive"
                                                : isCritical
                                                    ? "bg-warning"
                                                    : isLow
                                                        ? "bg-chart-3"
                                                        : "bg-success"
                                            }`}
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