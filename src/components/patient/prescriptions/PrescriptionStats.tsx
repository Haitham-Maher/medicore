"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PrescriptionStatsProps {
    count: number;
    totalMeds: number;
}

export default function PrescriptionStats({ count, totalMeds }: PrescriptionStatsProps) {
    const stats = [
        { label: "إجمالي الوصفات", value: count, color: "text-primary", bg: "bg-primary/8 border-primary/15" },
        { label: "إجمالي الأدوية", value: totalMeds, color: "text-emerald-600", bg: "bg-emerald-500/8 border-emerald-500/15" },
    ];

    return (
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {stats.map((s, i) => (
                <motion.div
                    key={s.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.08 + i * 0.04 }}
                    className={cn("border rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center", s.bg)}
                >
                    <p className={cn("font-black text-xl sm:text-2xl", s.color)}>{s.value}</p>
                    <p className="text-[8px] sm:text-[9px] text-muted-foreground font-medium leading-tight mt-1">{s.label}</p>
                </motion.div>
            ))}
        </div>
    );
}
