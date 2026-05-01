"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DoctorsListSkeleton from "@/components/department-head/skeletons/DoctorsListSkeleton";
import {
    Stethoscope,
    Search,
    User,
    Star,
    Phone,
    UserCheck,
    UserMinus,
    Users,
    Mail,
    X,
    Info
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

interface Doctor {
    id: number;
    user_id: number;
    name: string;
    email: string;
    phone_number: string;
    specialize: string;
    rating: number;
    status: string;
    bio: string;
    avatar: string | null;
    patients_count: number;
    visits_count: number;
}

const getInitials = (name: string) => {
    const clean = name.replace(/^(د\.|م\.)\s+/, "");
    return clean.charAt(0);
};

export default function DeptHeadDoctorsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

    const { data: doctors = [], isLoading } = useQuery<Doctor[]>({
        queryKey: ["department-head-doctors"],
        queryFn: async () => {
            const response = await api.get("/department-head/staff");
            return response.data.data;
        },
    });

    if (isLoading) return <DoctorsListSkeleton />;

    const filteredDoctors = doctors.filter(d =>
        d.name.includes(searchQuery) || d.specialize.includes(searchQuery)
    );

    const availableCount = doctors.filter(d => d.status === "active").length;
    const offDutyCount = doctors.filter(d => d.status !== "active").length;

    return (
        <div className="relative space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="أطباء القسم"
                description="عرض وإدارة جميع الأطباء العاملين في القسم"
                icon={Stethoscope}
            />

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg text-foreground">قائمة الأطباء</h3>
                        <p className="text-sm text-muted-foreground">{filteredDoctors.length} طبيب في القسم</p>
                    </div>
                </div>

                {/* Search */}
                <div className="px-5 py-3 bg-muted/20 border-b border-border/10">
                    <div className="relative group">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            type="text"
                            placeholder="ابحث عن طبيب أو تخصص..."
                            className="w-full bg-background border border-border/50 rounded-xl py-4 pr-10 pl-4 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-hidden relative min-h-[200px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={searchQuery}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {filteredDoctors.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                        <User size={32} />
                                    </div>
                                    <p className="text-muted-foreground font-bold italic text-sm">لا توجد نتائج تطابق معايير البحث</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/30">
                                    {filteredDoctors.map((doctor) => (
                                        <div
                                            key={doctor.id}
                                            onClick={() => setSelectedDoctor(doctor)}
                                            className="px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-between gap-4 hover:bg-muted/30 transition-all group cursor-pointer"
                                        >
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="shrink-0">
                                                    <div className="size-9 md:size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/5 transition-transform group-hover:scale-105 overflow-hidden">
                                                        {doctor.avatar ? (
                                                            <img src={doctor.avatar} alt={doctor.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <span className="text-primary font-black text-[10px] md:text-xs">{getInitials(doctor.name)}</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2 min-w-0">
                                                            <h4 className="font-bold text-[12px] md:text-[13px] text-foreground truncate group-hover:text-primary transition-colors">
                                                                {doctor.name}
                                                            </h4>
                                                            <span className={cn(
                                                                "text-[8px] md:text-[9px] px-1.5 py-px rounded-full border font-bold shrink-0",
                                                                doctor.status === "active" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-muted text-muted-foreground border-border"
                                                            )}>
                                                                {doctor.status === "active" ? "متاح" : "غير متاح"}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-2.5 gap-y-1 mt-0.5">
                                                            <p className="text-[10px] md:text-[11px] text-muted-foreground/80 font-medium truncate">
                                                                {doctor.specialize}
                                                            </p>
                                                            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-muted-foreground/20 shrink-0" />
                                                            <span className="text-[9px] md:text-[10px] text-muted-foreground/60 font-bold">
                                                                {doctor.patients_count} مريض · {doctor.visits_count} زيارة
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                                                <div className="hidden md:flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1.5 bg-muted/20 px-2 py-0.5 rounded-lg">
                                                        <Phone className="size-2.5 text-muted-foreground/50" />
                                                        <span className="font-mono text-[9.5px] md:text-[10px] text-muted-foreground/70 font-medium" dir="ltr">{doctor.phone_number}</span>
                                                    </div>
                                                </div>

                                                <div className="flex flex-col items-end shrink-0">
                                                    <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 md:py-1 rounded-lg border border-amber-500/5">
                                                        <Star className="size-2.5 md:size-3 text-amber-500 fill-amber-500" />
                                                        <span className="text-[10px] md:text-[11px] font-bold text-amber-600">{doctor.rating}</span>
                                                    </div>
                                                    <span className="text-[8px] text-muted-foreground/40 font-bold hidden sm:block mt-0.5">تقييم القسم</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-around">
                    <div className="flex items-center gap-2">
                        <UserCheck size={16} className="text-emerald-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">متاح الآن</span>
                            <span className="text-sm font-black text-foreground">{availableCount}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <UserMinus size={16} className="text-muted-foreground" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">غير متاح</span>
                            <span className="text-sm font-black text-foreground">{offDutyCount}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">الإجمالي</span>
                            <span className="text-sm font-black text-foreground">{doctors.length}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Modal تفاصيل الطبيب المطابق للتصميم الجديد ─── */}
            <AnimatePresence>
                {selectedDoctor && (
                    <>
                        {/* خلفية معتمة */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedDoctor(null)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-99 h-full"
                        />

                        {/* المودال المركزي */}
                        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" dir="rtl">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                                // التعديل 1: الحاوية الخارجية تأخذ الحواف الدائرية و overflow-hidden فقط كقناع
                                className="relative w-full max-w-[440px] bg-[#1a2128] text-slate-100 rounded-4xl shadow-2xl border border-white/5 overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* التعديل 2: الحاوية الداخلية المسؤولة عن السكرول والطول */}
                                <div className="w-full max-h-[92vh] overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#10b981]/50">

                                    {/* ─── الهيدر الأخضر المتدرج ─── */}
                                    <div className="relative h-44 bg-linear-to-br from-[#10b981] to-[#047857] overflow-hidden">
                                        <button
                                            onClick={() => setSelectedDoctor(null)}
                                            className="absolute top-5 left-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors backdrop-blur-md cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>

                                        <div className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 border border-white/20 text-white text-xs font-bold backdrop-blur-md">
                                            <span>●</span>
                                            <span>{selectedDoctor.status === "active" ? "متاح" : "غير متاح"}</span>
                                        </div>
                                    </div>

                                    {/* ─── تفاصيل الطبيب ─── */}
                                    <div className="relative px-6 pb-6">
                                        {/* الصورة الشخصية (متداخلة على اليمين) */}
                                        <div className="absolute -top-12 right-6 size-[88px] rounded-3xl bg-[#1a2128] border-[6px] border-[#1a2128] flex items-center justify-center shadow-lg overflow-hidden z-10">
                                            {selectedDoctor.avatar ? (
                                                <img src={selectedDoctor.avatar} alt={selectedDoctor.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-[#10b981] font-black text-4xl">{getInitials(selectedDoctor.name)}</span>
                                            )}
                                        </div>

                                        {/* التقييم (متداخل على اليسار) */}
                                        <div className="absolute -top-5 left-6 flex items-center gap-1.5 bg-[#2c1e13] border border-amber-600/40 px-3.5 py-1.5 rounded-xl z-10 shadow-lg">
                                            <span className="text-amber-500 text-xs font-black tracking-wide">
                                                {selectedDoctor.rating} / <span className="text-amber-500/70">5</span>
                                            </span>
                                            <Star className="size-3.5 text-amber-500 fill-amber-500" />
                                        </div>

                                        {/* الاسم والتخصص */}
                                        <div className="pt-14 text-right">
                                            <h2 className="font-black text-2xl text-white tracking-tight">{selectedDoctor.name}</h2>
                                            <p className="text-[#10b981] font-bold mt-1">{selectedDoctor.specialize}</p>
                                        </div>

                                        {/* الإحصائيات (مرضى وزيارات) */}
                                        <div className="mt-6 grid grid-cols-2 gap-4">
                                            <div className="bg-[#232a32] border border-white/5 rounded-[1.25rem] p-4 flex items-center justify-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-xl font-black text-white">{selectedDoctor.patients_count}</p>
                                                    <p className="text-[11px] text-white/50 font-bold mt-0.5">مريض</p>
                                                </div>
                                                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                                                    <UserCheck className="size-5 text-blue-500" />
                                                </div>
                                            </div>

                                            <div className="bg-[#232a32] border border-white/5 rounded-[1.25rem] p-4 flex items-center justify-center gap-4">
                                                <div className="text-center">
                                                    <p className="text-xl font-black text-white">{selectedDoctor.visits_count}</p>
                                                    <p className="text-[11px] text-white/50 font-bold mt-0.5">زيارة</p>
                                                </div>
                                                <div className="size-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                                                    <Stethoscope className="size-5 text-purple-400" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* نبذة عن الطبيب */}
                                        <div className="mt-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Info className="size-3.5 text-[#10b981]" />
                                                <h4 className="text-[11px] font-bold text-white/70 uppercase">نبذة عن الطبيب</h4>
                                            </div>
                                            <div className="bg-[#232a32] rounded-[1.25rem] p-5 border border-white/5">
                                                <p className="text-sm text-white/80 leading-relaxed text-right font-medium">
                                                    {selectedDoctor.bio || "فحينئذ يسكن ويزول عنه ما تقتضيه هذه القوى الجسمانية فتفسد عليه حاله، وترده إلى اسفل فإذا سخن أما."}
                                                </p>
                                            </div>
                                        </div>

                                        {/* وسائل التواصل */}
                                        <div className="mt-4 space-y-3">
                                            <div className="flex items-center justify-between p-4 bg-[#232a32] rounded-[1.25rem] border border-white/5 transition-colors hover:bg-white/5 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-[10px] bg-[#1a2128] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[#10b981]/30">
                                                        <Phone className="size-4 text-[#10b981]" />
                                                    </div>
                                                    <span className="font-mono text-sm text-white/90 font-bold tracking-wider" dir="ltr">{selectedDoctor.phone_number}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between p-4 bg-[#232a32] rounded-[1.25rem] border border-white/5 transition-colors hover:bg-white/5 group">
                                                <div className="flex items-center gap-3">
                                                    <div className="size-8 rounded-[10px] bg-[#1a2128] border border-white/5 flex items-center justify-center shrink-0 group-hover:border-[#10b981]/30">
                                                        <Mail className="size-4 text-[#10b981]" />
                                                    </div>
                                                    <span className="text-sm text-white/90 font-bold">{selectedDoctor.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}