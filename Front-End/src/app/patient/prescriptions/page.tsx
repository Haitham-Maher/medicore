"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList, Pill, ChevronDown, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

// ─── Skeleton Component ───────────────────────────────────────
function PrescriptionsSkeleton() {
    const Sk = ({ className }: { className?: string }) => (
        <div className={cn("animate-pulse rounded-lg bg-muted/30", className)} />
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6" dir="rtl">
            {/* Header Skeleton */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Sk className="size-10 sm:size-11 rounded-2xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <Sk className="h-5 w-40 sm:w-56" />
                        <Sk className="h-3 w-28 sm:w-36" />
                    </div>
                </div>
                <Sk className="h-6 w-16 rounded-full shrink-0" />
            </div>

            {/* Search Bar Skeleton */}
            <Sk className="h-11 sm:h-12 w-full rounded-xl" />

            {/* Summary Stats Skeleton */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[1, 2].map(i => (
                    <div key={i} className="border border-border/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center space-y-2">
                        <Sk className="h-7 w-8 mx-auto" />
                        <Sk className="h-2 w-16 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Prescriptions List Skeleton */}
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-card border border-border/50 rounded-2xl p-4 sm:p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Sk className="size-11 rounded-xl shrink-0" />
                            <div className="space-y-2">
                                <Sk className="h-4 w-24 sm:w-32" />
                                <Sk className="h-2.5 w-28 sm:w-36" />
                            </div>
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
    id: string;
    name: string;     // medicines.name
    type: string;     // medicines.type
    quantity: number; // prescriptions_has_medicines.quantity
}

interface Prescription {
    id: string;          // prescriptions.id
    medicines: Medicine[]; // JOIN prescriptions_has_medicines + medicines
}

// ─── Mock Data (تُستبدل ببيانات API لاحقاً) ───────────────────
const allPrescriptions: Prescription[] = [
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
    {
        id: "RX-102",
        medicines: [
            { id: "m6", name: "ميتفورمين",     type: "Antidiabetic", quantity: 60 },
            { id: "m7", name: "أتورفاستاتين",  type: "Statin",       quantity: 30 },
        ],
    },
    {
        id: "RX-103",
        medicines: [
            { id: "m8", name: "لوسارتان",      type: "Antihypertensive", quantity: 30 },
            { id: "m9", name: "أسبرين",        type: "Antiplatelet",     quantity: 30 },
            { id: "m10", name: "أملوديبين",    type: "Antihypertensive", quantity: 30 },
        ],
    },
];

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
function PrescriptionCard({
    rx, index, searchQuery,
}: { rx: Prescription; index: number; searchQuery: string }) {
    const [open, setOpen] = useState(false);

    // فلترة الأدوية حسب البحث
    const filteredMeds = rx.medicines.filter(
        (m) =>
            searchQuery === "" ||
            m.name.toLowerCase().includes(searchQuery) ||
            m.type.toLowerCase().includes(searchQuery)
    );

    if (filteredMeds.length === 0) return null;

    const totalQty = rx.medicines.reduce((s, m) => s + m.quantity, 0);

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
                    <div>
                        <p className="font-black text-sm sm:text-base text-foreground">
                         {rx.id}# وصفة 
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[9px] text-muted-foreground">
                                {rx.medicines.length} دواء
                            </span>
                            <span className="text-muted-foreground/30 text-[9px]">·</span>
                            <span className="text-[9px] text-muted-foreground">
                                إجمالي الكمية: {totalQty}
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
                                <span className="col-span-5 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                                    اسم الدواء
                                </span>
                                <span className="col-span-4 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider">
                                    النوع
                                </span>
                                <span className="col-span-3 text-[7px] sm:text-[8px] font-bold text-muted-foreground uppercase tracking-wider text-center">
                                    الكمية
                                </span>
                            </div>

                            {/* Rows */}
                            <div className="divide-y divide-border/20">
                                {filteredMeds.map((med, i) => (
                                    <motion.div
                                        key={med.id}
                                        initial={{ opacity: 0, x: -6 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: i * 0.04 }}
                                        className="grid grid-cols-12 gap-2 items-center px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-muted/5 transition-colors"
                                    >
                                        {/* Name */}
                                        <div className="col-span-5 flex items-center gap-2 min-w-0">
                                            <div className="size-6 sm:size-7 rounded-lg bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0">
                                                <Pill className="size-3 sm:size-3.5 text-primary/60" />
                                            </div>
                                            <span className="font-bold text-[10px] sm:text-[11px] text-foreground truncate">
                                                {med.name}
                                            </span>
                                        </div>

                                        {/* Type */}
                                        <div className="col-span-4">
                                            <MedicineBadge type={med.type} />
                                        </div>

                                        {/* Quantity */}
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

// ─── Main Page ────────────────────────────────────────────────
export default function PatientPrescriptionsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // محاكاة جلب البيانات
        const timer = setTimeout(() => setIsLoading(false), 1250);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <PrescriptionsSkeleton />;

    const q = search.trim().toLowerCase();

    const totalMeds = allPrescriptions.reduce((s, rx) => s + rx.medicines.length, 0);

    // وصفات تحتوي على نتيجة بحث
    const visibleCount = allPrescriptions.filter(
        (rx) =>
            q === "" || rx.id.toLowerCase().includes(q) ||
            rx.medicines.some(
                (m) => m.name.toLowerCase().includes(q) || m.type.toLowerCase().includes(q)
            )
    ).length;

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">

            {/* ── Header ── */}
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
                            {allPrescriptions.length} وصفة · {totalMeds} دواء إجمالاً
                        </p>
                    </div>
                </div>

                {/* Counter Badge */}
                <div className="flex items-center gap-2">
                    <span className="text-[9px] sm:text-[10px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                        {visibleCount} وصفة
                    </span>
                </div>
            </motion.div>

            {/* ── Search ── */}
            <div className="relative group">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="ابحث باسم الدواء أو النوع أو رقم الوصفة..."
                    className="w-full bg-card border border-border/50 rounded-xl py-2.5 sm:py-3 pr-11 pl-4 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
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

            {/* ── Summary Stats ── */}
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                    { label: "إجمالي الوصفات", value: allPrescriptions.length, color: "text-primary",     bg: "bg-primary/8 border-primary/15" },
                    { label: "إجمالي الأدوية",  value: totalMeds,               color: "text-emerald-600", bg: "bg-emerald-500/8 border-emerald-500/15" },
                ].map((s, i) => (
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

            {/* ── Prescriptions List ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={search}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                >
                    {visibleCount === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-4 bg-card border border-dashed border-border/50 rounded-2xl">
                            <div className="size-14 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                <Search className="size-7" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm text-foreground mb-1">لا توجد نتائج</p>
                                <p className="text-xs text-muted-foreground">لا يوجد دواء أو وصفة تطابق بحثك</p>
                            </div>
                        </div>
                    ) : (
                        allPrescriptions.map((rx, i) => (
                            <PrescriptionCard
                                key={rx.id}
                                rx={rx}
                                index={i}
                                searchQuery={q}
                            />
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
