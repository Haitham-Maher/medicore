"use client"
import { Phone, User, Star, Trophy, ArrowLeft, UserCheck, UserMinus, Search, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClinicStaffListSkeleton from "./ClinicStaffListSkeleton";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StaffMember {
    id: string;
    name: string;
    specialty: string;
    department: string;
    status: "available" | "busy" | "off-duty";
    rating?: number;
    reviewsCount?: number;
    avatar?: string;
    phone: string;
}

const mockStaff: StaffMember[] = [
    {
        id: "1",
        name: "د. أحمد كمال",
        specialty: "استشاري جراحة عامة",
        department: "قسم الجراحة",
        status: "available",
        rating: 4.9,
        reviewsCount: 124,
        phone: "+966 50 111 2222",
    },
    {
        id: "2",
        name: "د. سارة علي",
        specialty: "أخصائية طب الأطفال",
        department: "قسم الأطفال",
        status: "busy",
        rating: 4.8,
        reviewsCount: 98,
        phone: "+966 50 333 4444",
    },
    {
        id: "3",
        name: "د. خالد منصور",
        specialty: "طبيب باطنية",
        department: "قسم الباطنية",
        status: "available",
        rating: 4.7,
        reviewsCount: 85,
        phone: "+966 50 555 6666",
    },
    {
        id: "4",
        name: "م. محمد حسن",
        specialty: "ممرض أول",
        department: "قسم الطوارئ",
        status: "off-duty",
        phone: "+966 50 777 8888",
    },
];

const getInitials = (name: string) => {
    const cleanName = name.replace(/^(د\.|م\.)\s+/, "");
    return cleanName.charAt(0);
};

export default function ClinicStaffList({
    onViewAll,
    isLoading = false,
    variant = "full"
}: {
    onViewAll?: () => void;
    isLoading?: boolean;
    variant?: "top" | "full";
}) {
    const [search, setSearch] = useState<string>("");

    if (isLoading) return <ClinicStaffListSkeleton variant={variant} />;

    const mockSearch = mockStaff.filter(item =>
        item.name.includes(search) ||
        item.specialty.includes(search) ||
        item.department.includes(search)
    );

    const displayStaff = variant === "top"
        ? [...mockSearch].filter(s => s.rating).sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3)
        : mockSearch;

    return (
        <motion.div
            initial={{ translateY: 30 }}
            animate={{ translateY: 0 }}
            transition={{ duration: .3 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col"
        >
            {/* Header */}
            {variant === "top" ? (
                <div className="p-4 md:p-6 border-b border-border/50 flex items-center justify-between bg-linear-to-br from-primary/5 to-transparent gap-2">
                    <div className="flex items-center gap-2 md:gap-3 min-w-0">
                        <div className="size-8 md:size-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                            <Trophy className="size-4 md:size-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-black text-sm md:text-lg text-foreground truncate">أفضل الأطباء</h3>
                            <p className="text-[9px] md:text-[10px] text-muted-foreground font-bold truncate">الأعلى تقييماً في هذه النقطة</p>
                        </div>
                    </div>

                    {onViewAll && (
                        <button
                            onClick={onViewAll}
                            className="text-[10px] md:text-sm text-primary hover:text-primary/80 font-black flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 whitespace-nowrap bg-primary/5 md:bg-transparent shrink-0"
                        >
                            عرض الكل <ArrowLeft className="size-3 md:size-[14px]" />
                        </button>
                    )}
                </div>
            ) : (
                <div className="p-5 md:p-6 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-sm md:text-lg text-foreground">الكادر الطبي</h3>
                        <p className="text-[10px] md:text-sm text-muted-foreground">{mockSearch.length} عضو فريق عمل</p>
                    </div>
                </div>
            )}

            {/* Search Bar */}
            {variant === "full" && (
                <div className="px-5 py-3 bg-muted/20 border-b border-border/10">
                    <div className="relative group">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            type="text"
                            placeholder="ابحث عن طبيب أو تخصص..."
                            className="w-full bg-background border border-border/50 rounded-xl py-4 pr-10 pl-4 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                        />
                    </div>
                </div>
            )}

            {/* List Content */}
            <div className="flex-1 overflow-hidden relative min-h-[200px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={variant + search}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {displayStaff.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                    <User size={32} />
                                </div>
                                <p className="text-muted-foreground font-bold italic text-sm">لا توجد نتائج تطابق معايير البحث</p>
                            </div>
                        ) : variant === "top" ? (
                            /* ── Top Doctors: Simple Cards ── */
                            <div className="p-4 space-y-3">
                                {displayStaff.map((staff, index) => {
                                    const rankColors = [
                                        "bg-amber-500/15 text-amber-600 border-amber-500/20",
                                        "bg-slate-400/15 text-slate-500 border-slate-400/20",
                                        "bg-orange-500/15 text-orange-500 border-orange-400/20",
                                    ];
                                    return (
                                        <motion.div
                                            key={staff.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.08 }}
                                            className="flex items-center gap-2 md:gap-3 p-2 md:p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors group cursor-pointer"
                                        >
                                            {/* Rank */}
                                            <div className={cn(
                                                "size-6 md:size-8 rounded-lg flex items-center justify-center text-[10px] md:text-xs font-black border shrink-0",
                                                rankColors[index] ?? rankColors[2]
                                            )}>
                                                {index + 1}
                                            </div>

                                            {/* Avatar */}
                                            <div className="size-7 md:size-9 rounded-full bg-primary/10 items-center justify-center shrink-0 hidden sm:flex">
                                                <span className="text-primary font-black text-[10px] md:text-xs">{getInitials(staff.name)}</span>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[11px] md:text-sm text-foreground truncate group-hover:text-primary transition-colors">{staff.name}</h4>
                                                <p className="text-[9px] md:text-[10px] text-muted-foreground truncate">{staff.specialty}</p>
                                            </div>

                                            {/* Rating */}
                                            <div className="flex items-center gap-1 bg-amber-500/10 px-1.5 md:px-2 py-0.5 rounded-full shrink-0">
                                                <Star className="size-2.5 md:size-3 text-amber-500 fill-amber-500" />
                                                <span className="text-[10px] md:text-[11px] font-bold text-amber-600">{staff.rating}</span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        ) : (
                            /* ── Full: List Rows ── */
                            <div className="divide-y divide-border/30">
                                {displayStaff.map((staff) => (
                                    <div
                                        key={staff.id}
                                        className="px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-between gap-4 hover:bg-muted/10 transition-all group cursor-pointer"
                                    >
                                        <div className="flex items-center gap-3 flex-1 min-w-0">
                                            {/* Avatar */}
                                            <div className="shrink-0">
                                                <div className="size-9 md:size-10 rounded-full bg-primary/10 items-center justify-center border border-primary/5 hidden sm:flex">
                                                    <span className="text-primary font-black text-[10px] md:text-xs">
                                                        {getInitials(staff.name)}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <h4 className="font-bold text-[12px] md:text-[13px] text-foreground truncate group-hover:text-primary transition-colors">{staff.name}</h4>
                                                    <span className={cn(
                                                        "text-[8px] md:text-[9px] px-1.5 py-px rounded-full border font-bold shrink-0",
                                                        staff.status === "available" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                            staff.status === "busy" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                                "bg-muted text-muted-foreground border-border"
                                                    )}>
                                                        {staff.status === "available" ? "متاح" : staff.status === "busy" ? "مشغول" : "خارج الدوام"}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] md:text-[11px] text-muted-foreground/80 font-medium truncate mt-0.5">
                                                    {staff.specialty} · {staff.department}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Actions/Status Side */}
                                        <div className="flex items-center gap-3 md:gap-4 shrink-0">
                                            {/* Phone Number */}
                                            <div className="hidden md:flex flex-col items-end">
                                                <div className="flex items-center gap-1.5 bg-muted/20 px-2 py-0.5 rounded-lg border border-border/10">
                                                    <Phone className="size-2.5 text-muted-foreground/50" />
                                                    <span className="font-mono text-[9.5px] md:text-[10px] text-muted-foreground/70 font-medium" dir="ltr">{staff.phone}</span>
                                                </div>
                                            </div>

                                            {/* Rating */}
                                            {staff.rating && (
                                                <div className="flex flex-col items-end shrink-0">
                                                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 md:py-1 rounded-lg border border-amber-500/5">
                                                        <Star className="size-2.5 md:size-3 text-amber-500 fill-amber-500" />
                                                        <span className="text-[10px] md:text-[11px] font-bold text-amber-600">{staff.rating}</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            {variant === "top" ? (
                <div className="px-5 py-3 border-t border-border/50 flex items-center justify-between">
                    <p className="text-[10px] text-muted-foreground italic">تقييمات شهرية</p>
                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Star size={10} className="text-amber-400 fill-amber-400" />
                        <span>متوسط التقييم: <span className="font-black text-foreground">{(displayStaff.reduce((a, s) => a + (s.rating || 0), 0) / displayStaff.length).toFixed(1)}</span></span>
                    </div>
                </div>
            ) : (
                <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-around">
                    <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-emerald-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">متاح الآن</span>
                            <span className="text-sm font-black text-foreground">{mockSearch.filter((s) => s.status === "available").length}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <UserMinus size={16} className="text-amber-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">في مهمة</span>
                            <span className="text-sm font-black text-foreground">{mockSearch.filter((s) => s.status === "busy").length}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">الإجمالي</span>
                            <span className="text-sm font-black text-foreground">{mockSearch.length}</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
