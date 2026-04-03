"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, Sun, Sunset, Moon, Coffee } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Skeleton Component ───────────────────────────────────────
function ScheduleSkeleton() {
    const Sk = ({ className }: { className?: string }) => (
        <div className={cn("animate-pulse rounded-lg bg-muted/30", className)} />
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6" dir="rtl">
            {/* Header Skeleton */}
            <div className="flex items-center gap-3">
                <Sk className="size-10 sm:size-11 rounded-2xl shrink-0" />
                <div className="space-y-1.5 flex-1">
                    <Sk className="h-5 w-44 sm:w-60" />
                    <Sk className="h-3 w-36 sm:w-48" />
                </div>
            </div>

            {/* Today's Card Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
                <Sk className="h-1 w-full rounded-none" />
                <div className="p-4 sm:p-5 flex items-center gap-4">
                    <Sk className="size-12 rounded-2xl shrink-0" />
                    <div className="flex-1 space-y-2.5">
                        <div className="flex items-center gap-2">
                            <Sk className="h-4 w-12 rounded-full" />
                            <Sk className="h-4 w-16 rounded-full" />
                        </div>
                        <Sk className="h-4 w-24" />
                        <Sk className="h-3 w-32" />
                    </div>
                    <div className="shrink-0 space-y-2 text-center">
                        <Sk className="h-6 w-24 sm:w-32" />
                        <Sk className="h-2.5 w-20 mx-auto" />
                        <Sk className="h-6 w-24 sm:w-32" />
                    </div>
                </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="bg-card border border-border/40 rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center space-y-2">
                        <Sk className="h-7 w-8 mx-auto" />
                        <Sk className="h-2 w-14 mx-auto" />
                    </div>
                ))}
            </div>

            {/* Table Skeleton */}
            <div className="bg-card border border-border/50 rounded-2xl sm:rounded-4xl overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/40">
                    <div className="space-y-1.5 flex-1">
                        <Sk className="h-4 w-32" />
                        <Sk className="h-2.5 w-24" />
                    </div>
                    <div className="flex gap-3">
                        {[1, 2, 3].map(i => <Sk key={i} className="h-2.5 w-10 sm:w-16 rounded-full" />)}
                    </div>
                </div>
                <div className="grid grid-cols-12 gap-1 sm:gap-2 px-3 sm:px-6 py-2 bg-muted/5">
                    {[1, 2, 3].map(i => <Sk key={i} className="col-span-4 h-2 w-10 sm:w-16" />)}
                </div>
                <div className="divide-y divide-border/30">
                    {[...Array(7)].map((_, i) => (
                        <div key={i} className="grid grid-cols-12 gap-1 sm:gap-2 items-center px-3 sm:px-6 py-3 sm:py-4">
                            <Sk className="col-span-4 h-3 w-16 sm:w-24" />
                            <Sk className="col-span-4 h-5 w-14 sm:w-20 rounded-full" />
                            <Sk className="col-span-4 h-3 w-20 sm:w-28 mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── Types ────────────────────────────────────────────────────
type ShiftType = "morning" | "evening" | "night" | "off";

interface ScheduleDay {
    day: string;
    dayEn: string;
    shift: ShiftType;
    from: string;
    to: string;
    note?: string;
}

// ─── Data ─────────────────────────────────────────────────────
const schedule: ScheduleDay[] = [
    { day: "الأحد", dayEn: "Sunday", shift: "morning", from: "08:00", to: "14:00", note: "عيادة خارجية" },
    { day: "الإثنين", dayEn: "Monday", shift: "morning", from: "08:00", to: "14:00", note: "عيادة خارجية" },
    { day: "الثلاثاء", dayEn: "Tuesday", shift: "evening", from: "14:00", to: "20:00", note: "جراحة مناظير" },
    { day: "الأربعاء", dayEn: "Wednesday", shift: "morning", from: "08:00", to: "14:00", note: "عيادة خارجية" },
    { day: "الخميس", dayEn: "Thursday", shift: "evening", from: "14:00", to: "20:00", note: "جراحة عامة" },
    { day: "الجمعة", dayEn: "Friday", shift: "off", from: "—", to: "—", note: "إجازة أسبوعية" },
    { day: "السبت", dayEn: "Saturday", shift: "off", from: "—", to: "—", note: "إجازة أسبوعية" },
];

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const todayEn = DAYS[new Date().getDay()];

// ─── Shift Config ─────────────────────────────────────────────
function shiftConfig(shift: ShiftType) {
    switch (shift) {
        case "morning": return {
            label: "صباحي", icon: Sun,
            bg: "bg-amber-500/10", text: "text-amber-600", border: "border-amber-500/20",
            bar: "bg-amber-400", rowBg: "bg-amber-500/3",
        };
        case "evening": return {
            label: "مسائي", icon: Sunset,
            bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-500/20",
            bar: "bg-blue-400", rowBg: "bg-blue-500/3",
        };
        case "night": return {
            label: "ليلي", icon: Moon,
            bg: "bg-violet-500/10", text: "text-violet-600", border: "border-violet-500/20",
            bar: "bg-violet-400", rowBg: "bg-violet-500/3",
        };
        case "off": return {
            label: "إجازة", icon: Coffee,
            bg: "bg-muted/30", text: "text-muted-foreground", border: "border-border/30",
            bar: "bg-muted-foreground/20", rowBg: "",
        };
    }
}

// ─── Stats ────────────────────────────────────────────────────
const workingDays = schedule.filter(d => d.shift !== "off").length;
const morningDays = schedule.filter(d => d.shift === "morning").length;
const eveningDays = schedule.filter(d => d.shift === "evening").length;
const totalHours = workingDays * 6;

// ─── Main Page ────────────────────────────────────────────────
export default function SchedulePage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // محاكاة جلب البيانات
        const timer = setTimeout(() => setIsLoading(false), 1300);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <ScheduleSkeleton />;

    const todayRow = schedule.find(d => d.dayEn === todayEn);
    const todayCfg = todayRow ? shiftConfig(todayRow.shift) : null;

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 120, damping: 16 }}
                className="flex items-center gap-3"
            >
                <div className="size-10 sm:size-11 rounded-2xl bg-primary/10 border border-primary/15 flex items-center justify-center">
                    <Clock className="size-5 text-primary" />
                </div>
                <div>
                    <h1 className="font-black text-base sm:text-xl text-foreground">جدول الدوام الأسبوعي</h1>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">أوقات العمل الرسمية للطبيب</p>
                </div>
            </motion.div>

            {/* ── Today Card ── */}
            {todayRow && todayCfg && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05, type: "spring", stiffness: 130, damping: 16 }}
                    className={cn(
                        "relative bg-card border rounded-2xl overflow-hidden shadow-sm",
                        todayRow.shift === "off" ? "border-border/50" : "border-primary/20"
                    )}
                >
                    <div className="h-1 bg-linear-to-r from-primary via-primary/60 to-primary" />
                    <div className="p-4 sm:p-5 flex items-center gap-4">
                        <div className={cn(
                            "size-12 rounded-2xl flex items-center justify-center shrink-0 border",
                            todayCfg.bg, todayCfg.border
                        )}>
                            <todayCfg.icon className={cn("size-6", todayCfg.text)} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[9px] sm:text-[10px] font-black text-white bg-primary px-2 py-0.5 rounded-full">اليوم</span>
                                <span className={cn("text-[8px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full border", todayCfg.bg, todayCfg.text, todayCfg.border)}>
                                    {todayCfg.label}
                                </span>
                            </div>
                            <p className="font-black text-sm sm:text-base text-foreground">{todayRow.day}</p>
                            {todayRow.note && (
                                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{todayRow.note}</p>
                            )}
                        </div>
                        {todayRow.shift !== "off" && (
                            <div className="shrink-0 text-left">
                                <p className="font-mono font-black text-base sm:text-lg text-foreground" dir="ltr">
                                    {todayRow.from}
                                </p>
                                <p className="text-[9px] text-muted-foreground text-center">إلى</p>
                                <p className="font-mono font-black text-base sm:text-lg text-foreground" dir="ltr">
                                    {todayRow.to}
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}

            {/* ── Stats Row ── */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                    { label: "أيام العمل", value: workingDays, suffix: "يوم", color: "text-primary", bg: "bg-primary/8 border-primary/15" },
                    { label: "إجمالي الساعات", value: totalHours, suffix: "ساعة", color: "text-emerald-600", bg: "bg-emerald-500/8 border-emerald-500/15" },
                    { label: "وردية صباحية", value: morningDays, suffix: "أيام", color: "text-amber-600", bg: "bg-amber-500/8 border-amber-500/15" },
                    { label: "وردية مسائية", value: eveningDays, suffix: "أيام", color: "text-blue-600", bg: "bg-blue-500/8 border-blue-500/15" },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 + i * 0.04 }}
                        className={cn("border rounded-xl sm:rounded-2xl p-2.5 sm:p-4 text-center", stat.bg)}
                    >
                        <p className={cn("font-black text-lg sm:text-2xl", stat.color)}>{stat.value}</p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground font-medium leading-tight mt-0.5">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* ── Full Schedule Table ── */}
            <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, type: "spring", stiffness: 120, damping: 16 }}
                className="bg-card border border-border/50 rounded-2xl sm:rounded-4xl overflow-hidden shadow-sm"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-border/40">
                    <div>
                        <h2 className="font-black text-base sm:text-lg text-foreground">الجدول الأسبوعي</h2>
                        <p className="text-xs sm:text-sm text-muted-foreground">تفاصيل كل يوم عمل</p>
                    </div>
                    {/* Legend */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {(["morning", "evening", "off"] as ShiftType[]).map(s => {
                            const c = shiftConfig(s);
                            return (
                                <div key={s} className="flex items-center gap-1">
                                    <span className={cn("size-2.5 rounded-full", c.bar)} />
                                    <span className={cn("text-xs sm:text-sm font-bold", c.text)}>{c.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Column Headers */}
                <div className="grid grid-cols-12 gap-1 sm:gap-2 px-3 sm:px-6 py-2 bg-muted/10">
                    <span className="col-span-4 sm:col-span-3 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">اليوم</span>
                    <span className="col-span-4 sm:col-span-3 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">الوردية</span>
                    <span className="col-span-4 sm:col-span-3 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider text-center">الوقت</span>
                    <span className="hidden sm:block sm:col-span-3 text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-wider">ملاحظة</span>
                </div>

                <div className="divide-y divide-border/30">
                    {schedule.map((row, i) => {
                        const isToday = row.dayEn === todayEn;
                        const cfg = shiftConfig(row.shift);
                        const ShiftIcon = cfg.icon;
                        return (
                            <motion.div
                                key={row.dayEn}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.18 + i * 0.04 }}
                                className={cn(
                                    "grid grid-cols-12 gap-1 sm:gap-2 items-center px-3 sm:px-6 py-3 sm:py-3.5 transition-colors",
                                    isToday ? "bg-primary/5 border-r-2 border-r-primary" : "hover:bg-muted/5",
                                )}
                            >
                                {/* Day */}
                                <div className="col-span-4 sm:col-span-3 flex items-center gap-1 sm:gap-1.5 min-w-0">
                                    <span className={cn(
                                        "font-bold text-xs sm:text-sm truncate",
                                        isToday ? "text-primary" : row.shift === "off" ? "text-muted-foreground/60" : "text-foreground"
                                    )}>
                                        {row.day}
                                    </span>
                                    {isToday && (
                                        <span className="text-[8px] sm:text-[9px] font-black text-white bg-primary px-1.5 sm:px-2 py-0.5 rounded-full shrink-0 hidden sm:inline">
                                            اليوم
                                        </span>
                                    )}
                                </div>

                                {/* Shift */}
                                <div className="col-span-4 sm:col-span-3 flex items-center gap-1 sm:gap-1.5">
                                    <ShiftIcon className={cn("size-3 shrink-0 hidden sm:block", cfg.text)} />
                                    <span className={cn(
                                        "text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full border",
                                        cfg.bg, cfg.text, cfg.border
                                    )}>
                                        {cfg.label}
                                    </span>
                                </div>

                                {/* Time */}
                                <div className="col-span-4 sm:col-span-3 flex items-center justify-center gap-0.5 sm:gap-1">
                                    {row.shift === "off" ? (
                                        <span className="text-[10px] text-muted-foreground/30 font-bold">—</span>
                                    ) : (
                                        <>
                                            <span className="font-mono font-bold text-xs sm:text-sm text-foreground" dir="ltr">{row.from}</span>
                                            <span className="text-muted-foreground/40 text-xs sm:text-sm rotate-180">→</span>
                                            <span className="font-mono font-bold text-xs sm:text-sm text-foreground" dir="ltr">{row.to}</span>
                                        </>
                                    )}
                                </div>

                                {/* Note — hidden on mobile */}
                                <div className="hidden sm:block sm:col-span-3">
                                    {row.note && (
                                        <span className="text-xs sm:text-sm text-muted-foreground font-medium truncate block">
                                            {row.note}
                                        </span>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
