"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Phone, Calendar, ClipboardList, Pill,
    ChevronDown, Activity, CreditCard, Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import ErrorData from "@/components/inventory/table/components/errorData";

// ─── Skeleton Component ───────────────────────────────────────
function PatientSkeleton() {
    const Sk = ({ className }: { className?: string }) => (
        <div className={cn("animate-pulse rounded-lg bg-muted/30", className)} />
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6" dir="rtl">
            {/* 1. Profile Card Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl sm:rounded-4xl overflow-hidden shadow-sm">
                <div className="h-1 bg-muted/20" />
                <div className="p-5 sm:p-7">
                    <div className="flex items-start gap-4 sm:gap-5">
                        <Sk className="size-16 sm:size-20 rounded-2xl shrink-0" />
                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex justify-between items-start">
                                <Sk className="h-7 w-40 sm:w-56" />
                                <Sk className="h-5 w-20 rounded-full" />
                            </div>
                            <Sk className="h-4 w-32 sm:w-44" />
                            <div className="flex gap-3">
                                <Sk className="h-3 w-24" />
                                <Sk className="h-3 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Quick Stats Skeleton */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="border border-border/40 rounded-2xl p-4 sm:p-5 flex flex-col gap-2">
                        <Sk className="size-8 rounded-xl" />
                        <Sk className="h-8 w-10" />
                        <Sk className="h-2 w-14" />
                    </div>
                ))}
            </div>

            {/* 3. Personal Info Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/40">
                    <Sk className="h-4 w-32" />
                    <Sk className="h-2 w-24 mt-1" />
                </div>
                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="p-3 sm:p-4 bg-muted/20 border border-border/30 rounded-xl flex items-center gap-3">
                            <Sk className="size-8 sm:size-9 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <Sk className="h-2 w-16" />
                                <Sk className="h-3 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 4. Prescriptions List Skeleton */}
            <div className="space-y-3">
                <div className="flex items-center gap-3">
                    <Sk className="size-8 sm:size-9 rounded-xl shrink-0" />
                    <div className="space-y-1">
                        <Sk className="h-4 w-24" />
                        <Sk className="h-2.5 w-32" />
                    </div>
                </div>
                {[1, 2].map(i => (
                    <div key={i} className="border border-border/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sk className="size-10 rounded-xl shrink-0" />
                            <div className="space-y-1.5">
                                <Sk className="h-4 w-20" />
                                <Sk className="h-2.5 w-24" />
                            </div>
                        </div>
                        <Sk className="size-7 rounded-lg shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Types (مطابقة لجداول قاعدة البيانات) ─────────────────────
// Components
import PrescriptionCard from "@/components/patient/prescriptions/PrescriptionCard";

// Types
import { Prescription } from "@/types/prescription";

interface PatientPersonalInfo {
    id: number;
    name: string;
    national_id: string;
    birthdate: string;
    age: number;
    phone_number: string;
    blood_type: string;
    email: string;
}

interface PatientStats {
    total_prescriptions: number;
    total_medicines: number;
}

interface PatientProfileResponse {
    personal_info: PatientPersonalInfo;
    statistics: PatientStats;
}

// ─── Stat Card ────────────────────────────────────────────────
function StatCard({ icon: Icon, value, label, color, bg }: {
    icon: React.ElementType; value: number | string;
    label: string; color: string; bg: string;
}) {
    return (
        <div className={cn("border rounded-2xl p-4 sm:p-5 flex flex-col gap-1.5", bg)}>
            <div className={cn("size-8 rounded-xl flex items-center justify-center", bg, "border", color.replace("text-", "border-").replace("600", "500/20"))}>
                <Icon className={cn("size-4", color)} />
            </div>
            <p className={cn("font-black text-xl sm:text-2xl", color)}>{value}</p>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground font-medium">{label}</p>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────
export default function PatientDashboard() {
    // 1. جلب الملف الشخصي
    const { data: profileResponse, isLoading: profileLoading, refetch: refetchProfile } = useQuery({
        queryKey: ["patient-profile"],
        queryFn: async () => {
            const res = await api.get("/patient/profile");
            return res.data.data as PatientProfileResponse;
        }
    });

    // 2. جلب الوصفات الطبية
    const { data: prescriptionsResponse, isLoading: rxLoading } = useQuery({
        queryKey: ["patient-prescriptions"],
        queryFn: async () => {
            const res = await api.get("/patient/prescriptions");
            return res.data.data as { total_prescriptions: number; prescriptions: Prescription[] };
        }
    });

    const isLoading = profileLoading || rxLoading;

    if (isLoading) return <PatientSkeleton />;
    if (!profileResponse) return <ErrorData refetch={refetchProfile} />;

    const { personal_info, statistics } = profileResponse;
    const { total_prescriptions, total_medicines } = statistics;
    const prescriptions = prescriptionsResponse?.prescriptions || [];

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">

            {/* ── 1. Patient Profile Card ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                className="relative bg-card border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm"
            >
                {/* Gradient Bar */}
                <div className="h-1 bg-linear-to-r from-primary via-primary/60 to-primary" />

                <div className="p-5 sm:p-7">
                    <div className="flex items-start gap-4 sm:gap-5">
                        {/* Avatar */}
                        <div className="relative shrink-0">
                            <div className="size-16 sm:size-20 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner">
                                <User className="size-8 sm:size-10 text-primary/80" />
                            </div>
                            <div className="absolute -bottom-1 -left-1 flex items-center gap-1 bg-emerald-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                <span className="size-1.5 rounded-full bg-white animate-pulse" />
                                نشط
                            </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                                <h1 className="font-black text-lg sm:text-xl md:text-2xl text-foreground leading-tight">
                                    {personal_info.name}
                                </h1>
                                <span className="text-[8px] sm:text-[9px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/25 flex items-center gap-1">
                                    <Activity className="size-2.5" />
                                    مريض نشط
                                </span>
                            </div>

                            {/* National ID */}
                            <div className="flex items-center gap-1.5 mb-3">
                                <CreditCard className="size-3.5 text-muted-foreground/60 shrink-0" />
                                <span className="font-mono text-xs sm:text-sm text-muted-foreground tracking-widest">
                                    {personal_info.national_id}
                                </span>
                            </div>

                            {/* Contact Row */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <Phone className="size-3 text-muted-foreground/50" />
                                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium" dir="ltr">
                                        {personal_info.phone_number}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="size-3 text-muted-foreground/50" />
                                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                                        {personal_info.birthdate} · {personal_info.age} سنة
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ── 2. Quick Stats ── */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
                    <StatCard
                        icon={ClipboardList} value={total_prescriptions}
                        label="وصفة طبية" color="text-primary" bg="bg-primary/8 border-primary/15"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                    <StatCard
                        icon={Pill} value={total_medicines}
                        label="دواء موصوف" color="text-emerald-600" bg="bg-emerald-500/8 border-emerald-500/15"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                    <StatCard
                        icon={Calendar} value={personal_info.age}
                        label="العمر" color="text-amber-600" bg="bg-amber-500/8 border-amber-500/15"
                    />
                </motion.div>
            </div>

            {/* ── 3. Personal Info ── */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, type: "spring", stiffness: 120, damping: 16 }}
                className="bg-card border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm"
            >
                <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/40">
                    <h2 className="font-black text-sm sm:text-base text-foreground">المعلومات الشخصية</h2>
                    <p className="text-[9px] sm:text-[10px] text-muted-foreground">البيانات المسجلة في النظام</p>
                </div>

                <div className="p-4 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {[
                        { icon: User, label: "الاسم الكامل", value: personal_info.name, dir: "rtl" as const },
                        { icon: CreditCard, label: "رقم الهوية الوطنية", value: personal_info.national_id, dir: "ltr" as const },
                        { icon: Phone, label: "رقم الهاتف", value: personal_info.phone_number, dir: "ltr" as const },
                        { icon: Calendar, label: "تاريخ الميلاد", value: personal_info.birthdate, dir: "ltr" as const },
                        { icon: User, label: "البريد الإلكتروني", value: personal_info.email, dir: "ltr" as const },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className="flex items-center gap-3 p-3 sm:p-4 bg-muted/20 border border-border/30 rounded-xl hover:bg-muted/30 transition-colors"
                        >
                            <div className="size-8 sm:size-9 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                                <item.icon className="size-3.5 sm:size-4 text-primary/70" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-[8px] sm:text-[9px] text-muted-foreground font-medium mb-0.5">{item.label}</p>
                                <p className="font-bold text-xs sm:text-sm text-foreground truncate" dir={item.dir}>{item.value}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* ── 4. Prescriptions ── */}
            <div className="space-y-3">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.22 }}
                    className="flex items-center gap-3"
                >
                    <div className="size-8 sm:size-9 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                        <ClipboardList className="size-4 text-primary" />
                    </div>
                    <div>
                        <h2 className="font-black text-sm sm:text-base text-foreground">السجل الطبي</h2>
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground">{total_prescriptions} وصفة · {total_medicines} دواء</p>
                    </div>
                </motion.div>

                <div className="space-y-3">
                    {prescriptions.length > 0 ? (
                        prescriptions.map((rx: Prescription, i: number) => (
                            <PrescriptionCard key={rx.prescription_id} rx={rx} defaultOpen={i === 0} />
                        ))
                    ) : (
                        <div className="text-center py-16 bg-card border border-dashed border-border/50 rounded-3xl flex flex-col items-center gap-3">
                            <div className="size-12 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                <ClipboardList className="size-6" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm text-foreground mb-1">لا توجد وصفات طبية</p>
                                <p className="text-[10px] text-muted-foreground">لم يتم تسجيل أي وصفات طبية لك في النظام بعد.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
