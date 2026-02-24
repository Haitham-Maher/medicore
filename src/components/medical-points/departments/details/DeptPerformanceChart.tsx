"use client";

import { motion } from "framer-motion";
import { TrendingUp, Activity } from "lucide-react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui";

const data = [
    { name: "السبت", "الزيارات": 40 },
    { name: "الأحد", "الزيارات": 30 },
    { name: "الأثنين", "الزيارات": 65 },
    { name: "الثلاثاء", "الزيارات": 45 },
    { name: "الأربعاء", "الزيارات": 90 },
    { name: "الخميس", "الزيارات": 120 },
    { name: "الجمعة", "الزيارات": 20 },
];

interface DeptPerformanceChartProps {
    isLoading?: boolean;
    accentColor?: string;
}

export default function DeptPerformanceChart({
    isLoading = false,
    accentColor = "#14b8a6" // Default dashboard teal
}: DeptPerformanceChartProps) {
    if (isLoading) {
        return <Skeleton className="w-full h-[350px] rounded-2xl" />;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col relative overflow-hidden"
        >
            {/* Soft Background Glow */}
            <div
                className="absolute -top-24 -right-24 w-64 h-64 blur-[120px] opacity-[0.08] rounded-full pointer-events-none"
                style={{ backgroundColor: accentColor }}
            />

            <div className="mb-6 relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-foreground">أداء القسم</h3>
                        <p className="text-sm text-muted-foreground">تحليل الزيارات الأسبوعية وأداء الكادر</p>
                    </div>
                    <div className="bg-success/10 text-success px-3 py-1.5 rounded-xl flex items-center gap-1.5 border border-success/20">
                        <TrendingUp size={16} />
                        <span className="text-xs font-black">+12.5%</span>
                    </div>
                </div>
            </div>

            <div className="h-[300px] w-full mt-auto relative z-10" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={data}
                        margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="colorPerformance" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                                <stop offset="50%" stopColor={accentColor} stopOpacity={0.1} />
                                <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="hsl(var(--border))"
                            strokeOpacity={0.4}
                        />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: "600" }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontWeight: "500" }}
                        />
                        <Tooltip
                            cursor={{ stroke: accentColor, strokeWidth: 1.5, strokeDasharray: "4 4" }}
                            contentStyle={{
                                backgroundColor: "hsl(var(--card))",
                                borderRadius: "14px",
                                border: "1px solid hsl(var(--border))",
                                padding: "10px 14px",
                                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                            }}
                            itemStyle={{ fontSize: "12px", fontWeight: "700", color: accentColor }}
                        />
                        <Area
                            type="monotone"
                            dataKey="الزيارات"
                            stroke={accentColor}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPerformance)"
                            animationDuration={2000}
                            dot={{ r: 4, fill: "hsl(var(--card))", stroke: accentColor, strokeWidth: 2 }}
                            activeDot={{ r: 6, fill: accentColor, stroke: "hsl(var(--card))", strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 border-t border-border/50 pt-4">
                <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: accentColor }} />
                    <span className="text-xs font-bold text-muted-foreground">إجمالي الزيارات</span>
                </div>
            </div>
        </motion.div>
    );
}
