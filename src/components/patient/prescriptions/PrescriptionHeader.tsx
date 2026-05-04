"use client";

import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

interface PrescriptionHeaderProps {
    count: number;
    totalMeds: number;
    filteredCount: number;
}

export default function PrescriptionHeader({ count, totalMeds, filteredCount }: PrescriptionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 120, damping: 16 }}
            className="flex items-center justify-between"
        >
            <div className="flex items-center gap-3">
                <div className="size-10 sm:size-11 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <ClipboardList className="size-5 text-primary" />
                </div>
                <div>
                    <h1 className="font-black text-base sm:text-xl text-foreground">وصفاتي الطبية</h1>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">
                        {count} وصفة · {totalMeds} دواء إجمالاً
                    </p>
                </div>
            </div>

            {/* Counter Badge */}
            <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                    {filteredCount} نتيجة
                </span>
            </div>
        </motion.div>
    );
}
