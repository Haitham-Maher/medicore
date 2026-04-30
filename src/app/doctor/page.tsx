"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
    Stethoscope, Users, Star, Info, Activity,
    Clock, ChevronLeft, Sun, Sunset, Coffee,
    Eye, Phone, Calendar, ClipboardList, Pill,
    ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

// ─── Skeleton Component ───────────────────────────────────────
function DashboardSkeleton() {
    const Sk = ({ className }: { className?: string }) => (
        <div className={cn("animate-pulse rounded-lg bg-muted/30", className)} />
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6" dir="rtl">
            {/* 1. Profile Card Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
                <div className="h-1 bg-muted/20" />
                <div className="p-5 sm:p-7">
                    <div className="flex items-start gap-4 sm:gap-5">
                        <Sk className="size-16 sm:size-20 rounded-2xl shrink-0" />
                        <div className="flex-1 min-w-0 space-y-3">
                            <div className="flex justify-between items-start">
                                <Sk className="h-7 w-40 sm:w-56" />
                                <Sk className="h-5 w-16 rounded-full" />
                            </div>
                            <Sk className="h-4 w-32 sm:w-44" />
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Sk key={i} className="size-3.5 rounded-full" />)}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 sm:mt-5 p-3 sm:p-4 rounded-xl bg-muted/20 border border-border/40 space-y-2">
                        <Sk className="h-3 w-full" />
                        <Sk className="h-3 w-4/5" />
                    </div>
                </div>
            </div>

            {/* 2. Today's Shift Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <Sk className="size-8 rounded-xl" />
                        <div className="space-y-1">
                            <Sk className="h-3 w-20" />
                            <Sk className="h-2 w-28" />
                        </div>
                    </div>
                    <Sk className="h-3 w-20 rounded-lg" />
                </div>
                <div className="p-4 sm:p-5 flex items-center gap-4">
                    <Sk className="size-12 sm:size-14 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-2">
                        <Sk className="h-3.5 w-16 rounded-full" />
                        <Sk className="h-4 w-24" />
                    </div>
                    <div className="shrink-0 space-y-2 text-center">
                        <Sk className="h-6 w-32" />
                        <Sk className="h-2.5 w-20 mx-auto" />
                    </div>
                </div>
            </div>

            {/* 3. Recent Patients Skeleton */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Sk className="size-8 sm:size-9 rounded-xl" />
                        <div className="space-y-1">
                            <Sk className="h-4 w-24" />
                            <Sk className="h-2.5 w-32" />
                        </div>
                    </div>
                    <Sk className="h-3 w-16 rounded-lg" />
                </div>
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card border border-border/50 rounded-xl p-3.5 flex items-center gap-3">
                        <Sk className="size-9 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                            <Sk className="h-3 w-40" />
                            <Sk className="h-2 w-24" />
                        </div>
                        <Sk className="size-7 rounded-lg shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── Shared Types ─────────────────────────────────────────────
type ShiftType = "morning" | "evening" | "night" | "off";

interface Medicine { id: string; name: string; type: string; quantity: number; }
interface Prescription { id: string; medicines: Medicine[]; }
interface Patient { id: string; name: string; nationalId: string; birthdate: string; phone: string; prescriptions: Prescription[]; }

// ─── Mock Data ────────────────────────────────────────────────
const doctorProfile = {
    name: "د. أحمد كمال",
    specialize: "General Surgery — جراحة عامة",
    status: "active" as const,
    rating: 4.8,
    bio: "متخصص في الجراحة العامة والمناظير بخبرة تجاوزت 12 عاماً في إجراء العمليات الجراحية الدقيقة.",
};

const schedule = [
    { day: "الأحد", dayEn: "Sunday", shift: "morning" as ShiftType, from: "08:00", to: "14:00" },
    { day: "الإثنين", dayEn: "Monday", shift: "morning" as ShiftType, from: "08:00", to: "14:00" },
    { day: "الثلاثاء", dayEn: "Tuesday", shift: "evening" as ShiftType, from: "14:00", to: "20:00" },
    { day: "الأربعاء", dayEn: "Wednesday", shift: "morning" as ShiftType, from: "08:00", to: "14:00" },
    { day: "الخميس", dayEn: "Thursday", shift: "evening" as ShiftType, from: "14:00", to: "20:00" },
    { day: "الجمعة", dayEn: "Friday", shift: "off" as ShiftType, from: "—", to: "—" },
    { day: "السبت", dayEn: "Saturday", shift: "off" as ShiftType, from: "—", to: "—" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayEn = DAYS[new Date().getDay()];
const todayRow = schedule.find(d => d.dayEn === todayEn);

const recentPatients: Patient[] = [
    {
        id: "1", name: "محمد سعد العتيبي", nationalId: "1098765432",
        birthdate: "1985-04-15", phone: "0551234567",
        prescriptions: [{
            id: "RX-100", medicines: [
                { id: "m1", name: "أموكسيسيلين", type: "Antibiotic", quantity: 20 },
                { id: "m2", name: "إيبوبروفين", type: "Painkiller", quantity: 15 },
            ]
        }],
    },
    {
        id: "2", name: "فاطمة علي الزهراني", nationalId: "2098776543",
        birthdate: "1992-08-22", phone: "0559876543",
        prescriptions: [{
            id: "RX-101", medicines: [
                { id: "m3", name: "ميتفورمين", type: "Antidiabetic", quantity: 60 },
            ]
        }],
    },
    {
        id: "3", name: "عبدالله ناصر القحطاني", nationalId: "1076543210",
        birthdate: "1970-03-10", phone: "0544321098",
        prescriptions: [
            { id: "RX-102", medicines: [{ id: "m5", name: "لوسارتان", type: "Antihypertensive", quantity: 30 }] },
        ],
    },
];

// ─── Helpers ──────────────────────────────────────────────────
function shiftCfg(shift: ShiftType) {
    switch (shift) {
        case "morning": return { label: "صباحي", icon: Sun, bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20" };
        case "evening": return { label: "مسائي", icon: Sunset, bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20" };
        case "off": return { label: "إجازة", icon: Coffee, bg: "bg-muted/30", text: "text-muted-foreground", border: "border-border/30" };
        default: return { label: shift, icon: Clock, bg: "bg-muted/30", text: "text-muted-foreground", border: "border-border/30" };
    }
}

const badgeColors: Record<string, string> = {
    Antibiotic: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    Painkiller: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    Antidiabetic: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    Antihypertensive: "bg-rose-500/10 text-rose-600 border-rose-500/20",
};

// ─── Mini Patient Card ────────────────────────────────────────
function MiniPatientCard({ patient, index }: { patient: Patient; index: number }) {
    const [expanded, setExpanded] = useState(false);
    const totalMeds = patient.prescriptions.reduce((s, rx) => s + rx.medicines.length, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + index * 0.06, type: "spring", stiffness: 130, damping: 16 }}
            className={cn(
                "bg-card border rounded-xl overflow-hidden transition-all duration-300",
                expanded ? "border-emerald-500/30 shadow-md shadow-emerald-500/5" : "border-border/50 hover:border-border hover:shadow-sm"
            )}
        >
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center gap-3 p-3.5 text-right cursor-pointer hover:bg-muted/10 transition-colors"
            >
                <div className={cn(
                    "size-9 rounded-lg flex items-center justify-center shrink-0 font-black text-sm transition-all",
                    expanded ? "bg-emerald-500 text-white" : "bg-primary/8 text-primary border border-primary/15"
                )}>
                    {patient.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-xs text-foreground truncate mb-0.5">{patient.name}</h3>
                    <p className="text-[9px] text-muted-foreground font-mono">{patient.nationalId}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <span className="hidden sm:block text-[9px] font-bold text-muted-foreground">{totalMeds} دواء</span>
                    <div className={cn(
                        "size-7 rounded-lg border flex items-center justify-center transition-all",
                        expanded ? "bg-emerald-500 border-emerald-500 text-white" : "bg-muted/30 border-border/40 text-muted-foreground"
                    )}>
                        {expanded ? <ChevronDown className="size-3" /> : <Eye className="size-3" />}
                    </div>
                </div>
            </button>

            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <div className="border-t border-emerald-500/15 bg-emerald-500/3 p-3 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-2 bg-card border border-border/40 rounded-lg p-2">
                                    <Phone className="size-3 text-primary/60 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[7px] text-muted-foreground">هاتف</p>
                                        <p className="font-bold text-[10px] text-foreground truncate" dir="ltr">{patient.phone}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 bg-card border border-border/40 rounded-lg p-2">
                                    <Calendar className="size-3 text-primary/60 shrink-0" />
                                    <div className="min-w-0">
                                        <p className="text-[7px] text-muted-foreground">ميلاد</p>
                                        <p className="font-bold text-[10px] text-foreground truncate">{patient.birthdate}</p>
                                    </div>
                                </div>
                            </div>
                            {patient.prescriptions.map(rx => (
                                <div key={rx.id} className="bg-card border border-border/40 rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-3 py-1.5 bg-muted/20 border-b border-border/30">
                                        <span className="text-[9px] font-bold text-muted-foreground font-mono">وصفة #{rx.id}</span>
                                        <ClipboardList className="size-2.5 text-emerald-600" />
                                    </div>
                                    <div className="divide-y divide-border/20">
                                        {rx.medicines.map(med => (
                                            <div key={med.id} className="flex items-center gap-2 px-3 py-2">
                                                <Pill className="size-2.5 text-primary/50 shrink-0" />
                                                <span className="font-bold text-[10px] text-foreground flex-1 truncate">{med.name}</span>
                                                <span className={cn("text-[7px] font-bold px-1.5 py-0.5 rounded-full border shrink-0",
                                                    badgeColors[med.type] ?? "bg-muted text-muted-foreground border-border/40"
                                                )}>{med.type}</span>
                                                <span className="font-black text-[10px] text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-lg shrink-0">
                                                    {med.quantity}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─── Section Card Wrapper ─────────────────────────────────────
function SectionCard({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, type: "spring", stiffness: 120, damping: 16 }}
            className="bg-card border border-border/50 rounded-2xl sm:rounded-3xl overflow-hidden shadow-sm"
        >
            {children}
        </motion.div>
    );
}

// ─── Main Page (Dashboard) ────────────────────────────────────
export default function DoctorDashboard() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // محاكاة جلب البيانات
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <DashboardSkeleton />;

    const todayCfg = todayRow ? shiftCfg(todayRow.shift) : null;
    const TodayIcon = todayCfg?.icon ?? Clock;

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">

            {/* ── 1. Doctor Profile Card ── */}
            <SectionCard delay={0}>
                <div className="h-1 bg-linear-to-r from-emerald-500 via-primary to-emerald-500" />
                <div className="p-5 sm:p-7">
                    <div className="flex items-start gap-4 sm:gap-5">
                        <div className="relative shrink-0">
                            <div className="size-16 sm:size-20 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center shadow-inner">
                                <Stethoscope className="size-8 sm:size-10 text-primary/80" />
                            </div>
                            {doctorProfile.status === "active" && (
                                <div className="absolute -bottom-1 -left-1 flex items-center gap-1 bg-emerald-500 text-white text-[7px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                                    <span className="size-1.5 rounded-full bg-white animate-pulse" />
                                    نشط
                                </div>
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-start justify-between gap-2 mb-1.5">
                                <h1 className="font-black text-lg sm:text-xl md:text-2xl text-foreground leading-tight">
                                    {doctorProfile.name}
                                </h1>
                                <span className={cn(
                                    "text-[8px] sm:text-[9px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border flex items-center gap-1",
                                    doctorProfile.status === "active"
                                        ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/25"
                                        : "bg-red-500/10 text-red-600 border-red-500/20"
                                )}>
                                    <Activity className="size-2.5" />
                                    {doctorProfile.status === "active" ? "Active" : "Inactive"}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm text-muted-foreground font-medium mb-2 sm:mb-3">{doctorProfile.specialize}</p>
                            <div className="flex items-center gap-1.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={cn("size-3.5", i < Math.floor(doctorProfile.rating) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30")} />
                                ))}
                                <span className="font-black text-xs sm:text-sm text-amber-500 mr-1">{doctorProfile.rating}</span>
                                <span className="text-[9px] sm:text-[10px] text-muted-foreground">/ 5.0</span>
                            </div>
                        </div>
                    </div>
                    {doctorProfile.bio && (
                        <div className="mt-4 sm:mt-5 flex items-start gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl bg-muted/30 border border-border/40">
                            <Info className="size-3.5 sm:size-4 text-muted-foreground shrink-0 mt-0.5" />
                            <p className="text-[11px] sm:text-[12px] md:text-[13px] text-muted-foreground leading-relaxed">{doctorProfile.bio}</p>
                        </div>
                    )}
                </div>
            </SectionCard>

            {/* ── 2. Today's Shift ── */}
            <SectionCard delay={0.1}>
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-border/40">
                    <div className="flex items-center gap-2.5">
                        <div className="size-8 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                            <Clock className="size-4 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-black text-sm text-foreground">دوام اليوم</h2>
                            <p className="text-[9px] text-muted-foreground">وردية اليوم الحالية</p>
                        </div>
                    </div>
                    <Link href="/doctor/schedule">
                        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-primary hover:underline transition-all">
                            الجدول الكامل
                            <ChevronLeft className="size-3" />
                        </span>
                    </Link>
                </div>

                {todayRow && todayCfg ? (
                    <div className="p-4 sm:p-5 flex items-center gap-4">
                        <div className={cn(
                            "size-12 sm:size-14 rounded-2xl flex items-center justify-center shrink-0 border",
                            todayCfg.bg, todayCfg.border
                        )}>
                            <TodayIcon className={cn("size-6 sm:size-7", todayCfg.text)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn("text-[8px] font-bold px-2 py-0.5 rounded-full border", todayCfg.bg, todayCfg.text, todayCfg.border)}>
                                    {todayCfg.label}
                                </span>
                            </div>
                            <p className="font-black text-sm sm:text-base text-foreground">{todayRow.day}</p>
                        </div>
                        {todayRow.shift !== "off" ? (
                            <div className="shrink-0 text-center">
                                <p className="font-mono font-black text-base sm:text-xl text-foreground" dir="ltr">
                                    {todayRow.to} <span className="rotate-180 inline-block">→</span> {todayRow.from}
                                </p>
                                <p className="text-[9px] text-muted-foreground mt-0.5">6 ساعات عمل</p>
                            </div>
                        ) : (
                            <span className="text-[10px] font-bold text-muted-foreground/50">لا يوجد دوام</span>
                        )}
                    </div>
                ) : (
                    <div className="p-5 text-center text-muted-foreground text-sm">لم يتم تحديد دوام لهذا اليوم</div>
                )}
            </SectionCard>

            {/* ── 3. Recent Patients ── */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-8 sm:size-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Users className="size-4 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="font-black text-sm sm:text-base text-foreground">آخر المرضى</h2>
                            <p className="text-[9px] sm:text-[10px] text-muted-foreground">{recentPatients.length} مرضى حديثون</p>
                        </div>
                    </div>
                    <Link href="/doctor/patients">
                        <span className="flex items-center gap-1 text-[9px] sm:text-[10px] font-bold text-emerald-600 hover:underline transition-all">
                            عرض الكل
                            <ChevronLeft className="size-3" />
                        </span>
                    </Link>
                </div>

                <div className="space-y-2.5">
                    {recentPatients.map((p, i) => <MiniPatientCard key={p.id} patient={p} index={i} />)}
                </div>
            </div>
        </div>
    );
}