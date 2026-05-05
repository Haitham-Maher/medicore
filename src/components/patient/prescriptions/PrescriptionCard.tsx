"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Pill, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Prescription, Medicine } from "@/types/prescription";

interface PrescriptionCardProps {
    rx: Prescription;
    searchQuery?: string;
    defaultOpen?: boolean;
}

export default function PrescriptionCard({ rx, searchQuery = "", defaultOpen = false }: PrescriptionCardProps) {
    const [open, setOpen] = useState(defaultOpen);

    // Filter medicines based on search
    const filteredMeds = (rx.medicines_details || []).filter((m: Medicine) => {
        if (!searchQuery) return true;
        const name = String(m.name || "").toLowerCase();
        const instr = String(m.instructions || "").toLowerCase();
        return name.includes(searchQuery) || instr.includes(searchQuery);
    });

    return (
        <motion.div
            className={cn(
                "bg-card border rounded-2xl overflow-hidden transition-all duration-300",
                open
                    ? "border-primary/25 shadow-sm shadow-primary/5"
                    : "border-border/50 hover:border-border"
            )}
        >
            {/* ── Card Header ── */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-right hover:bg-muted/10 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={cn(
                        "size-11 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                        open
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-muted/30 border-border/40 text-muted-foreground"
                    )}>
                        <ClipboardList className="size-5" />
                    </div>

                    {/* Labels */}
                    <div className="text-right">
                        <div className="flex items-center gap-2">
                            <p className="font-black text-sm sm:text-base text-foreground">
                                {rx.prescription_number || `#${rx.prescription_id}`}
                            </p>
                            <span className="text-[10px] font-bold text-primary/70 bg-primary/5 px-1.5 py-0.5 rounded-lg border border-primary/10">
                                {rx.doctor_name}
                            </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-muted-foreground">
                                {rx.medicines_count} دواء
                            </span>
                            <span className="text-muted-foreground/30 text-[9px]">·</span>
                            <span className="text-[9px] text-muted-foreground">
                                {rx.created_at}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Chevron */}
                <div className={cn(
                    "size-8 rounded-xl border flex items-center justify-center transition-all shrink-0",
                    open
                        ? "bg-primary border-primary text-white"
                        : "bg-muted/30 border-border/40 text-muted-foreground"
                )}>
                    <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
                </div>
            </button>

            {/* ── Medicines Table ── */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-primary/10 bg-primary/2">
                            {/* Table Column Headers */}
                            <div className="grid grid-cols-12 gap-2 px-4 sm:px-5 py-2 bg-muted/10">
                                <span className="col-span-6 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider text-right">
                                    اسم الدواء / النوع
                                </span>
                                <span className="col-span-3 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                                    الجرعة
                                </span>
                                <span className="col-span-3 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                                    التعليمات
                                </span>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-border/20">
                                {filteredMeds.map((med: Medicine, i: number) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="grid grid-cols-12 gap-2 items-center px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-muted/5 transition-colors"
                                    >
                                        {/* Name */}
                                        <div className="col-span-6 flex items-center gap-2 min-w-0">
                                            <div className="size-6 sm:size-7 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                                                <Pill className="size-3 sm:size-3.5 text-primary/60" />
                                            </div>
                                            <div className="min-w-0 text-right">
                                                <p className="font-bold text-[10px] sm:text-[11px] text-foreground truncate">
                                                    {med.name}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[7px] sm:text-[8px] font-bold text-muted-foreground/70 bg-muted/50 px-1 rounded">
                                                        {med.type}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dosage */}
                                        <div className="col-span-3 flex justify-center">
                                            <span className="font-black text-[11px] sm:text-[12px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg min-w-[36px] text-center">
                                                {med.dose}
                                            </span>
                                        </div>

                                        {/* Instructions */}
                                        <div className="col-span-3 text-center">
                                            <p className="text-[8px] sm:text-[9px] text-muted-foreground font-medium">
                                                {med.instructions}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}