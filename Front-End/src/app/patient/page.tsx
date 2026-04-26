"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    User, Phone, Calendar, ClipboardList, Pill,
    ChevronDown, Activity, CreditCard, Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
interface Medicine {
    id: string;
    name: string;   // medicines.name
    type: string;   // medicines.type
    quantity: number; // prescriptions_has_medicines.quantity
}

interface Prescription {
    id: string;          // prescriptions.id
    medicines: Medicine[]; // prescriptions_has_medicines JOIN medicines
}

interface PatientProfile {
    name: string;        // persons.name
    nationalId: string;  // persons.national_id
    birthdate: string;   // persons.birthdate
    phone: string;       // persons.phone_number
    prescriptions: Prescription[];
}

// ─── Mock Data (تُستبدل لاحقاً ببيانات API) ───────────────────
const patientData: PatientProfile = {
    name: "محمد سعد العتيبي",
    nationalId: "1098765432",
    birthdate: "1985-04-15",
    phone: "0551234567",
    prescriptions: [
        {
            id: "RX-100",
            medicines: [
                { id: "m1", name: "أموكسيسيلين",  type: "Antibiotic",   quantity: 20 },
                { id: "m2", name: "إيبوبروفين",    type: "Painkiller",   quantity: 15 },
            ],
        },
        {
            id: "RX-101",
            medicines: [
                { id: "m3", name: "أوميبرازول",    type: "Antacid",      quantity: 30 },
                { id: "m4", name: "فيتامين D",     type: "Supplement",   quantity: 60 },
                { id: "m5", name: "سيتريزين",      type: "Antihistamine",quantity: 10 },
            ],
        },
    ],
};

// ─── Badge Colors ─────────────────────────────────────────────
const badgeColors: Record<string, string> = {
    Antibiotic:       "bg-blue-500/10   text-blue-600   border-blue-500/20",
    Painkiller:       "bg-orange-500/10 text-orange-600 border-orange-500/20",
    Antidiabetic:     "bg-violet-500/10 text-violet-600 border-violet-500/20",
    Antacid:          "bg-cyan-500/10   text-cyan-600   border-cyan-500/20",
    Antihypertensive: "bg-rose-500/10   text-rose-600   border-rose-500/20",
    Statin:           "bg-amber-500/10  text-amber-600  border-amber-500/20",
    Antihistamine:    "bg-green-500/10  text-green-600  border-green-500/20",
    Antiplatelet:     "bg-pink-500/10   text-pink-600   border-pink-500/20",
    Supplement:       "bg-teal-500/10   text-teal-600   border-teal-500/20",
};

function MedicineBadge({ type }: { type: string }) {
    return (
        <span className={cn(
            "text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded-full border shrink-0",
            badgeColors[type] ?? "bg-muted text-muted-foreground border-border/40"
        )}>
            {type}
        </span>
    );
}

// ─── Prescription Card ────────────────────────────────────────
function PrescriptionCard({ rx, index }: { rx: Prescription; index: number }) {
    const [open, setOpen] = useState(index === 0); // الأولى مفتوحة افتراضياً

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.07, type: "spring", stiffness: 130, damping: 16 }}
            className={cn(
                "border rounded-2xl overflow-hidden transition-all duration-300",
                open ? "border-primary/25 shadow-sm shadow-primary/5" : "border-border/50 hover:border-border"
            )}
        >
            {/* Header */}
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-4 sm:p-5 text-right hover:bg-muted/10 transition-colors cursor-pointer"
            >
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-xl flex items-center justify-center shrink-0 border transition-all",
                        open
                            ? "bg-primary/10 border-primary/20 text-primary"
                            : "bg-muted/30 border-border/40 text-muted-foreground"
                    )}>
                        <ClipboardList className="size-4" />
                    </div>
                    <div>
                        <p className="font-black text-sm text-foreground">وصفة #{rx.id}</p>
                        <p className="text-[9px] text-muted-foreground">{rx.medicines.length} دواء موصوف</p>
                    </div>
                </div>
                <div className={cn(
                    "size-7 rounded-lg border flex items-center justify-center transition-all",
                    open
                        ? "bg-primary border-primary text-white"
                        : "bg-muted/30 border-border/40 text-muted-foreground"
                )}>
                    <ChevronDown className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
                </div>
            </button>

            {/* Medicines Table */}
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
                            {/* Table Header */}
                            <div className="grid grid-cols-12 gap-2 px-4 sm:px-5 py-2 bg-muted/10">
                                <span className="col-span-5 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider">اسم الدواء</span>
                                <span className="col-span-4 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider">النوع</span>
                                <span className="col-span-3 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider text-center">الكمية</span>
                            </div>

                            {/* Table Rows */}
                            <div className="divide-y divide-border/20">
                                {rx.medicines.map((med, i) => (
                                    <motion.div
                                        key={med.id}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="grid grid-cols-12 gap-2 items-center px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-muted/5 transition-colors"
                                    >
                                        <div className="col-span-5 flex items-center gap-2 min-w-0">
                                            <div className="size-6 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                                                <Pill className="size-3 text-primary/60" />
                                            </div>
                                            <span className="font-bold text-[10px] sm:text-[11px] text-foreground truncate">{med.name}</span>
                                        </div>
                                        <div className="col-span-4">
                                            <MedicineBadge type={med.type} />
                                        </div>
                                        <div className="col-span-3 flex justify-center">
                                            <span className="font-black text-[11px] sm:text-[12px] text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-lg min-w-[36px] text-center">
                                                {med.quantity}
                                            </span>
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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // محاكاة جلب البيانات
        const timer = setTimeout(() => setIsLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <PatientSkeleton />;

    const totalMeds = patientData.prescriptions.reduce((s, rx) => s + rx.medicines.length, 0);
    const totalRx   = patientData.prescriptions.length;

    // حساب العمر من تاريخ الميلاد
    const age = new Date().getFullYear() - new Date(patientData.birthdate).getFullYear();

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
                                    {patientData.name}
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
                                    {patientData.nationalId}
                                </span>
                            </div>

                            {/* Contact Row */}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                    <Phone className="size-3 text-muted-foreground/50" />
                                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium" dir="ltr">
                                        {patientData.phone}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar className="size-3 text-muted-foreground/50" />
                                    <span className="text-[10px] sm:text-xs text-muted-foreground font-medium">
                                        {patientData.birthdate} · {age} سنة
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
                        icon={ClipboardList} value={totalRx}
                        label="وصفة طبية" color="text-primary" bg="bg-primary/8 border-primary/15"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
                    <StatCard
                        icon={Pill} value={totalMeds}
                        label="دواء موصوف" color="text-emerald-600" bg="bg-emerald-500/8 border-emerald-500/15"
                    />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
                    <StatCard
                        icon={Calendar} value={age}
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
                        { icon: User,       label: "الاسم الكامل",    value: patientData.name,        dir: "rtl" as const },
                        { icon: CreditCard, label: "رقم الهوية الوطنية", value: patientData.nationalId, dir: "ltr" as const },
                        { icon: Phone,      label: "رقم الهاتف",      value: patientData.phone,        dir: "ltr" as const },
                        { icon: Calendar,   label: "تاريخ الميلاد",   value: patientData.birthdate,    dir: "ltr" as const },
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
                        <p className="text-[9px] sm:text-[10px] text-muted-foreground">{totalRx} وصفة · {totalMeds} دواء</p>
                    </div>
                </motion.div>

                <div className="space-y-3">
                    {patientData.prescriptions.map((rx, i) => (
                        <PrescriptionCard key={rx.id} rx={rx} index={i} />
                    ))}
                </div>
            </div>
        </div>
    );
}
