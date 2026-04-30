"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
    Phone, User, Star, Trophy, ArrowLeft,
    UserCheck, UserMinus, Search, Users, AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

import api from "@/api/axios";
import { cn } from "@/lib/utils";
import ClinicStaffListSkeleton from "./ClinicStaffListSkeleton";

// --- Interfaces ---
interface StaffMember {
    id: string | number;
    name: string;
    specialty?: string;
    specialize?: string; // لدعم التسميات المختلفة من الـ API
    department?: string;
    status?: "available" | "busy" | "off-duty";
    rating?: number;
    reviewsCount?: number;
    avatar?: string | null;
    phone?: string;
}

interface ClinicStaffListProps {
    onViewAll?: () => void;
    variant?: "top" | "full";
}

// --- Helpers ---
const getInitials = (name: string) => {
    const cleanName = name.replace(/^(د\.|م\.|أ\.|الدكتور|الدكتورة)\s+/, "").trim();
    const parts = cleanName.split(" ");
    if (parts.length > 1) return `${parts[0][0]} ${parts[1][0]}`;
    return cleanName.charAt(0);
};

export default function ClinicStaffList({ onViewAll, variant = "full" }: ClinicStaffListProps) {
    const { id } = useParams();
    const [search, setSearch] = useState<string>("");

    // 1. Fetching Data
    const { data: doctorsData, isLoading, isError, refetch } = useQuery({
        queryKey: ['medical-point-doctors', id, variant],
        queryFn: async () => {
            const endpoint = `/medical-points/${id}/doctors/top`
            const res = await api.get(endpoint);
            return (res.data.data as StaffMember[]) || [];
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
    });

    // 2. Logic: Filtering & Sorting (Memoized) 
    const processedStaff = useMemo(() => {
        if (!doctorsData) return [];

        let filtered = doctorsData.filter((item) => {
            const searchLower = search.toLowerCase();
            const specialty = item.specialty || item.specialize || "";
            return (
                item.name.toLowerCase().includes(searchLower) ||
                specialty.toLowerCase().includes(searchLower) ||
                (item.department || "").toLowerCase().includes(searchLower)
            );
        });

        if (variant === "top") {
            return [...filtered]
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .slice(0, 5);
        }

        return filtered;
    }, [doctorsData, search, variant]);

    // 3. Status Counters
    const counters = useMemo(() => {
        if (!doctorsData) return { available: 0, busy: 0, total: 0 };
        return {
            available: doctorsData.filter(s => s.status === "available").length,
            busy: doctorsData.filter(s => s.status === "busy").length,
            total: doctorsData.length
        };
    }, [doctorsData]);

    // --- Render States ---
    if (isLoading) return <ClinicStaffListSkeleton variant={variant} />;

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-10 bg-card rounded-2xl border border-destructive/20 text-center gap-3">
                <AlertCircle className="text-destructive size-10" />
                <p className="text-sm font-bold">عذراً، فشل تحميل قائمة الأطباء</p>
                <button onClick={() => refetch()} className="text-xs text-primary underline font-bold">إعادة المحاولة</button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col"
        >
            {/* --- Header Section --- */}
            <header className={cn(
                "p-4 md:p-6 border-b border-border/50 flex items-center justify-between gap-2",
                variant === "top" && "bg-linear-to-br from-primary/5 to-transparent"
            )}>
                <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                        "size-9 md:size-10 rounded-xl flex items-center justify-center shadow-xs shrink-0",
                        variant === "top" ? "bg-orange-500/10 text-orange-500" : "bg-primary/10 text-primary"
                    )}>
                        {variant === "top" ? <Trophy size={20} /> : <Users size={20} />}
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-black text-sm md:text-lg text-foreground truncate">
                            {variant === "top" ? "أفضل الأطباء" : "الكادر الطبي"}
                        </h3>
                        <p className="text-[10px] md:text-xs text-muted-foreground font-medium truncate">
                            {variant === "top" ? "الأعلى تقييماً لهذا الشهر" : `${processedStaff.length} طبيب مختص`}
                        </p>
                    </div>
                </div>

                {variant === "top" && onViewAll && (
                    <button
                        onClick={onViewAll}
                        className="text-[10px] md:text-base text-primary hover:bg-primary/10 font-black flex items-center gap-1 transition-all px-3 py-1.5 rounded-lg shrink-0 cursor-pointer"
                    >
                        عرض الكل <ArrowLeft size={14} />
                    </button>
                )}
            </header>

            {/* --- Search Bar (Full Variant Only) --- */}
            {variant === "full" && (
                <div className="px-5 py-3 bg-muted/10 border-b border-border/10">
                    <div className="relative group">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="ابحث بالاسم، التخصص أو القسم..."
                            className="w-full bg-background border border-border/50 rounded-xl py-3.5 pr-10 pl-4 text-xs font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-hidden"
                        />
                    </div>
                </div>
            )}

            {/* --- Main List Content --- */}
            <div className="flex-1 overflow-y-auto relative min-h-[250px]">
                <AnimatePresence mode="wait">
                    {processedStaff.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="p-12 text-center flex flex-col items-center justify-center gap-4"
                        >
                            <div className="size-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                <User size={32} />
                            </div>
                            <p className="text-muted-foreground font-bold italic text-sm">لا توجد نتائج تطابق بحثك</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={variant + search}
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className={cn("divide-y divide-border/30", variant === "top" && "p-4 space-y-3 divide-y-0")}
                        >
                            {processedStaff.map((staff, index) => (
                                <StaffRow
                                    key={staff.id}
                                    staff={staff}
                                    index={index}
                                    isTopVariant={variant === "top"}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

// --- Sub-components for better organization ---

function StaffRow({ staff, index, isTopVariant }: { staff: StaffMember, index: number, isTopVariant: boolean }) {
    const rankColors = [
        "bg-amber-500/15 text-amber-600 border-amber-500/20", // Gold
        "bg-slate-400/15 text-slate-500 border-slate-400/20", // Silver
        "bg-orange-500/15 text-orange-500 border-orange-400/20", // Bronze
    ];

    const statusMap = {
        available: { label: "متاح", class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" },
        busy: { label: "مشغول", class: "bg-amber-500/10 text-amber-600 border-amber-500/20" },
        "off-duty": { label: "خارج الدوام", class: "bg-muted text-muted-foreground border-border" }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={cn(
                "flex items-center gap-3 transition-all cursor-pointer group",
                isTopVariant
                    ? "p-3 rounded-xl bg-muted/20 hover:bg-muted/40 border border-transparent hover:border-border/50"
                    : "px-5 py-4 hover:bg-muted/10"
            )}
        >
            {/* Rank for Top Variant */}
            {isTopVariant && (
                <div className={cn(
                    "size-7 rounded-lg flex items-center justify-center text-[10px] font-black border shrink-0",
                    rankColors[index] || "bg-muted text-muted-foreground border-border"
                )}>
                    {index + 1}
                </div>
            )}

            {/* Avatar */}
            <div className="relative shrink-0">
                <div className="size-10 md:size-11 rounded-full bg-primary/10 flex items-center justify-center border border-primary/10 overflow-hidden shadow-xs">
                    {staff.avatar ? (
                        <img src={staff.avatar} alt={staff.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                        <span className="text-primary font-black text-xs">{getInitials(staff.name)}</span>
                    )}
                </div>
                {!isTopVariant && staff.status && (
                    <span className={cn(
                        "absolute bottom-0 right-0 size-3 rounded-full border-2 border-card",
                        staff.status === "available" ? "bg-emerald-500" : staff.status === "busy" ? "bg-amber-500" : "bg-muted-foreground"
                    )} />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <h4 className="font-bold text-xs md:text-sm text-foreground truncate group-hover:text-primary transition-colors">
                        {staff.name}
                    </h4>
                    {!isTopVariant && staff.status && (
                        <span className={cn("text-[8px] px-1.5 py-px rounded-full border font-bold shrink-0", statusMap[staff.status].class)}>
                            {statusMap[staff.status].label}
                        </span>
                    )}
                </div>
                <p className="text-[10px] md:text-xs text-muted-foreground/80 font-medium truncate">
                    {staff.specialty || staff.specialize} {staff.department && `• ${staff.department}`}
                </p>
            </div>

            {/* Actions/Rating */}
            <div className="flex flex-col items-end gap-1.5 shrink-0">
                {staff.rating && (
                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/10">
                        <Star className="size-2.5 md:size-3 text-amber-500 fill-amber-500" />
                        <span className="text-[10px] md:text-xs font-black text-amber-600">{staff.rating}</span>
                    </div>
                )}
                {!isTopVariant && staff.phone && (
                    <div className="hidden sm:flex items-center gap-1 text-muted-foreground/60">
                        <Phone size={10} />
                        <span className="text-[9px] font-mono" dir="ltr">{staff.phone}</span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode, label: string, value: number }) {
    return (
        <div className="flex items-center gap-2.5">
            <div className="shrink-0">{icon}</div>
            <div className="flex flex-col">
                <span className="text-[9px] text-muted-foreground font-bold leading-none mb-1">{label}</span>
                <span className="text-sm font-black text-foreground">{value}</span>
            </div>
        </div>
    );
}