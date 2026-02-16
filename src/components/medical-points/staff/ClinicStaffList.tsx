"use client"
import { Phone, Mail, User, Star, Trophy, ArrowLeft, UserCheck, UserMinus, Search } from "lucide-react";
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
    },
    {
        id: "2",
        name: "د. سارة علي",
        specialty: "أخصائية طب الأطفال",
        department: "قسم الأطفال",
        status: "busy",
        rating: 4.8,
        reviewsCount: 98,
    },
    {
        id: "3",
        name: "د. خالد منصور",
        specialty: "طبيب باطنية",
        department: "قسم الباطنية",
        status: "available",
        rating: 4.7,
        reviewsCount: 85,
    },
    {
        id: "4",
        name: "م. محمد حسن",
        specialty: "ممرض أول",
        department: "قسم الطوارئ",
        status: "off-duty",
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

    if (isLoading) return <ClinicStaffListSkeleton />;

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
                <div className="p-6 border-b border-border/50 flex items-center justify-between bg-linear-to-br from-primary/5 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shadow-sm">
                            <Trophy size={20} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg text-foreground">أفضل الأطباء</h3>
                            <p className="text-[10px] text-muted-foreground font-bold">الأعلى تقييماً في هذه النقطة</p>
                        </div>
                    </div>

                    {onViewAll && (
                        <button
                            onClick={onViewAll}
                            className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 shrink-0"
                        >
                            عرض الكل <ArrowLeft size={14} />
                        </button>
                    )}
                </div>
            ) : (
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-foreground">الكادر الطبي</h3>
                        <p className="text-sm text-muted-foreground">{mockSearch.length} عضو فريق عمل</p>
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
                            className="w-full bg-background border border-border/50 rounded-xl py-2 pr-10 pl-4 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
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
                        className="divide-y divide-border/50"
                    >
                        {displayStaff.length === 0 ? (
                            <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                    <User size={32} />
                                </div>
                                <p className="text-muted-foreground font-bold italic text-sm">لا توجد نتائج تطابق معايير البحث</p>
                            </div>
                        ) : (
                            displayStaff.map((staff) => (
                                <div
                                    key={staff.id}
                                    className="p-5 flex items-center gap-4 hover:bg-muted/30 transition-all group bg-card"
                                >
                                    {/* Avatar Column */}
                                    <div className="relative">
                                        <div className="h-12 w-12 rounded-xl border-2 border-background shadow-md overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                                            <span className="text-primary font-black text-lg">
                                                {getInitials(staff.name)}
                                            </span>
                                        </div>
                                        {variant === "top" && (
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-orange-500 text-white flex items-center justify-center shadow-sm border-2 border-background">
                                                <Star size={10} className="fill-current" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Info Column */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <h4 className="font-black text-sm text-foreground truncate group-hover:text-primary transition-colors">{staff.name}</h4>
                                            {variant === "full" && (
                                                <span className={cn(
                                                    "text-[9px] px-1.5 py-0.5 rounded-full border font-bold",
                                                    staff.status === "available" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                        staff.status === "busy" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                            "bg-muted text-muted-foreground border-border"
                                                )}>
                                                    {staff.status === "available" ? "متاح" : staff.status === "busy" ? "مشغول" : "خارج الدوام"}
                                                </span>
                                            )}
                                        </div>

                                        {variant === "top" ? (
                                            <div className="space-y-2">
                                                <p className="text-[11px] text-muted-foreground font-bold">{staff.specialty}</p>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full">
                                                        <Star size={10} className="text-orange-500 fill-orange-500" />
                                                        <span className="text-[10px] font-black text-orange-600">{staff.rating}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-[11px] text-muted-foreground font-bold">{staff.specialty}</p>
                                                <p className="text-[10px] text-primary/70 font-black">{staff.department}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Actions Column */}
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer border-none outline-none">
                                            <Phone size={14} />
                                        </button>
                                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/5 text-primary hover:bg-primary hover:text-white transition-all shadow-sm cursor-pointer border-none outline-none">
                                            <Mail size={14} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer */}
            {variant === "top" ? (
                <div className="p-4 bg-muted/5 border-t border-border/50 text-center">
                    <p className="text-[10px] text-muted-foreground font-bold italic">يتم تحديث التقييمات بناءً على أداء الخدمة شهرياً</p>
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
                </div>
            )}
        </motion.div>
    );
}
