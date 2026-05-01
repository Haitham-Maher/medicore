"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Users, Search, Phone, Calendar, ClipboardList,
    Pill, Eye, ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import ErrorData from "@/components/inventory/table/components/errorData";

// ─── Skeleton Component ───────────────────────────────────────
function PatientsSkeleton() {
    const Sk = ({ className }: { className?: string }) => (
        <div className={cn("animate-pulse rounded-lg bg-muted/30", className)} />
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5" dir="rtl">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
                <Sk className="size-10 sm:size-11 rounded-2xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                    <Sk className="h-5 w-40 sm:w-56" />
                    <Sk className="h-3 w-28 sm:w-36" />
                </div>
                <Sk className="h-6 w-16 rounded-full shrink-0 mr-auto" />
            </div>

            {/* Search Bar Skeleton */}
            <Sk className="h-11 sm:h-12 w-full rounded-xl" />

            {/* Patient Cards Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5 flex items-center gap-3">
                        <Sk className="size-11 rounded-xl shrink-0" />
                        <div className="flex-1 space-y-2.5 min-w-0">
                            <Sk className="h-3.5 w-32 sm:w-48" />
                            <Sk className="h-2.5 w-24 sm:w-36" />
                        </div>
                        <div className="hidden sm:flex flex-col items-end gap-1.5 shrink-0">
                            <Sk className="h-3 w-12" />
                            <Sk className="h-2 w-10" />
                        </div>
                        <Sk className="size-8 rounded-xl shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Types ────────────────────────────────────────────────────
interface Medicine {
    medicine_name: string;
    dose: string;
    instructions: string;
}

interface Prescription {
    prescription_id: number;
    date: string;
    medicines_count: number;
    medicines_details: Medicine[];
}

interface Patient {
    patient_id: number;
    patient_name: string;
    patient_national_id: string;
    phone_number: string;
    birthdate: string;
    total_prescriptions_by_me: number;
    prescriptions_history: Prescription[];
}

// ─── Patient Card ─────────────────────────────────────────────
function PatientCard({ patient, index }: { patient: Patient; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const totalMeds = patient.prescriptions_history.reduce((s: number, rx: Prescription) => s + rx.medicines_count, 0);

    return (
        <motion.div
            className={cn(
                "bg-card border rounded-2xl overflow-hidden transition-all duration-300",
                expanded
                    ? "border-emerald-500/30 shadow-md shadow-emerald-500/5"
                    : "border-border/50 hover:border-border hover:shadow-sm"
            )}
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 sm:gap-4 p-4 sm:p-5 text-right cursor-pointer hover:bg-muted/10 transition-colors"
            >
                <div className={cn(
                    "size-11 rounded-xl flex items-center justify-center shrink-0 font-black text-base transition-all",
                    expanded
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                        : "bg-primary/8 text-primary border border-primary/15"
                )}>
                    {patient.patient_name.charAt(0)}
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs sm:text-sm text-foreground truncate mb-0.5">{patient.patient_name}</h3>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground font-mono tracking-wide">{patient.patient_national_id}</p>
                </div>

                <div className="flex items-center gap-2.5 shrink-0">
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="font-bold text-[10px] sm:text-[11px] text-foreground">{totalMeds} دواء</span>
                        <span className="text-[8px] sm:text-[9px] text-muted-foreground">{patient.prescriptions_history.length} وصفة</span>
                    </div>
                    <div className={cn(
                        "size-8 rounded-xl border flex items-center justify-center transition-all",
                        expanded
                            ? "bg-emerald-500 border-emerald-500 text-white"
                            : "bg-muted/30 border-border/40 text-muted-foreground hover:border-emerald-500/30 hover:text-emerald-600"
                    )}>
                        {expanded ? <ChevronDown className="size-3.5" /> : <Eye className="size-3.5" />}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-emerald-500/15 bg-emerald-500/3">
                            {/* Personal Info */}
                            <div className="p-3 sm:p-5 grid grid-cols-2 gap-2 sm:gap-3">
                                <div className="flex items-center gap-2 sm:gap-2.5 bg-card border border-border/40 rounded-xl p-2.5 sm:p-3">
                                    <div className="size-6 sm:size-7 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center text-primary/70 shrink-0">
                                        <Phone className="size-3 sm:size-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[7px] sm:text-[8px] text-muted-foreground font-medium mb-0.5">رقم الهاتف</p>
                                        <p className="font-bold text-[10px] sm:text-[11px] text-foreground truncate" dir="ltr">{patient.phone_number}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 sm:gap-2.5 bg-card border border-border/40 rounded-xl p-2.5 sm:p-3">
                                    <div className="size-6 sm:size-7 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center text-primary/70 shrink-0">
                                        <Calendar className="size-3 sm:size-3.5" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-[7px] sm:text-[8px] text-muted-foreground font-medium mb-0.5">تاريخ الميلاد</p>
                                        <p className="font-bold text-[10px] sm:text-[11px] text-foreground truncate">{patient.birthdate}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Prescriptions */}
                            <div className="px-4 sm:px-5 pb-5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <ClipboardList className="size-3 sm:size-3.5 text-emerald-600" />
                                    <h4 className="text-[9px] sm:text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                                        الوصفات الطبية ({patient.prescriptions_history.length})
                                    </h4>
                                </div>

                                {patient.prescriptions_history.map((rx: Prescription, rxIdx: number) => (
                                    <div key={rx.prescription_id} className="bg-card border border-border/50 rounded-xl overflow-hidden">
                                        <div className="flex items-center justify-between px-3 sm:px-4 py-2 sm:py-2.5 bg-muted/20 border-b border-border/30">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-[9px] sm:text-[10px] text-muted-foreground font-mono">
                                                    وصفة #{rx.prescription_id}
                                                </span>
                                                <span className="text-[7px] text-muted-foreground">{rx.date}</span>
                                            </div>
                                            <span className="text-[7px] sm:text-[8px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-1.5 sm:px-2 py-0.5 rounded-full">
                                                {rx.medicines_count} دواء
                                            </span>
                                        </div>
                                        <div className="divide-y divide-border/30">
                                            <div className="grid grid-cols-12 gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-muted/10">
                                                <span className="col-span-6 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider">اسم الدواء / التعليمات</span>
                                                <span className="col-span-3 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider text-center">الجرعة</span>
                                            </div>
                                            {rx.medicines_details.map((med: Medicine, medIdx: number) => (
                                                <motion.div
                                                    key={medIdx}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: (rxIdx * rx.medicines_details.length + medIdx) * 0.04 }}
                                                    className="grid grid-cols-12 gap-2 items-center px-3 sm:px-4 py-2 sm:py-3 hover:bg-muted/10 transition-colors"
                                                >
                                                    <div className="col-span-6 flex items-center gap-1.5 sm:gap-2 min-w-0">
                                                        <div className="size-5 sm:size-6 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                                                            <Pill className="size-2.5 sm:size-3 text-primary/70" />
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="font-bold text-[10px] sm:text-[11px] text-foreground truncate">{med.medicine_name}</p>
                                                            <p className="text-[8px] text-muted-foreground truncate">{med.instructions}</p>
                                                        </div>
                                                    </div>
                                                    <div className="col-span-3 flex justify-center">
                                                        <span className="font-black text-[10px] sm:text-[12px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2 sm:px-2.5 py-0.5 rounded-lg min-w-[30px] sm:min-w-[36px] text-center">
                                                            {med.dose}
                                                        </span>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Main Page ────────────────────────────────────────────────
export default function PatientsPage() {
    const [search, setSearch] = useState("");

    const { data: patients, isLoading, refetch } = useQuery({
        queryKey: ["all-patients"],
        queryFn: async () => {
            const res = await api.get("/doctor/recent-patients");
            return res.data.data as Patient[];
        }
    });

    if (isLoading) return <PatientsSkeleton />;
    if (!patients) return <ErrorData refetch={refetch} />;

    const filtered = (patients || []).filter((p) => {
        const q = search.trim().toLowerCase();
        return p.patient_national_id.includes(q) || p.patient_name.toLowerCase().includes(q);
    });

    return (
        <div className="max-w-4xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">

            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                className="flex items-center gap-3"
            >
                <div className="size-10 sm:size-11 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <Users className="size-5 text-emerald-600" />
                </div>
                <div>
                    <h1 className="font-black text-base sm:text-xl text-foreground">سجل المرضى الكامل</h1>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{patients.length} مريض مسجل</p>
                </div>
                <div className="mr-auto flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                        {filtered.length} نتيجة
                    </span>
                </div>
            </motion.div>

            {/* Search Bar */}
            <div className="relative group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-emerald-600 transition-colors" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث بالاسم أو رقم الهوية الوطنية..."
                    className="w-full bg-card border border-border/50 rounded-xl py-2.5 sm:py-3 pr-11 pl-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/25 focus:border-emerald-500/50 transition-all placeholder:text-muted-foreground/50"
                    dir="rtl"
                />
                {search && (
                    <button
                        onClick={() => setSearch("")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[9px] font-bold text-muted-foreground hover:text-foreground bg-muted/50 px-2 py-0.5 rounded-full border border-border/40 transition-colors cursor-pointer"
                    >
                        مسح
                    </button>
                )}
            </div>

            {/* Patient Cards */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={search}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                >
                    {filtered.length === 0 ? (
                        <div className="py-16 flex flex-col items-center justify-center gap-4 bg-card rounded-2xl border border-dashed border-border/50 w-full h-full">
                            <div className="size-14 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                <Search className="size-7" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm text-foreground mb-1">لا توجد نتائج</p>
                                <p className="text-xs text-muted-foreground">لا يوجد مريض يطابق بحثك</p>
                            </div>
                        </div>
                    ) : (
                        filtered.map((p, i) => <PatientCard key={p.patient_id} patient={p} index={i} />)
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
