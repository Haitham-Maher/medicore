"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui";

interface Doctor {
    id: string;
    name: string;
    specialty: string;
    status: "available" | "busy" | "off-duty";
    rating: number;
    patients: number;
    visits: number;
    phone: string;
}

const mockDoctors: Doctor[] = [
    { id: "1", name: "د. أحمد كمال", specialty: "استشاري جراحة عامة", status: "available", rating: 4.9, patients: 85, visits: 320, phone: "+966 50 111 2222" },
    { id: "2", name: "د. سارة علي", specialty: "أخصائية جراحة أطفال", status: "busy", rating: 4.8, patients: 62, visits: 245, phone: "+966 50 333 4444" },
    { id: "3", name: "د. خالد منصور", specialty: "جراح عظام", status: "available", rating: 4.7, patients: 54, visits: 198, phone: "+966 50 555 6666" },
    { id: "4", name: "د. فاطمة حسين", specialty: "جراحة تجميل", status: "available", rating: 4.6, patients: 48, visits: 176, phone: "+966 50 777 8888" },
    { id: "5", name: "د. عمر يوسف", specialty: "جراحة قلب", status: "off-duty", rating: 4.5, patients: 40, visits: 152, phone: "+966 50 999 0000" },
    { id: "6", name: "د. نور الدين", specialty: "جراحة أعصاب", status: "busy", rating: 4.4, patients: 35, visits: 128, phone: "+966 50 222 3333" },
    { id: "7", name: "د. ليلى محمود", specialty: "جراحة مسالك", status: "available", rating: 4.3, patients: 28, visits: 98, phone: "+966 50 444 5555" },
    { id: "8", name: "د. حسن إبراهيم", specialty: "جراحة صدر", status: "off-duty", rating: 4.2, patients: 22, visits: 72, phone: "+966 50 666 7777" },
];

const getInitials = (name: string) => {
    const clean = name.replace(/^(د\.|م\.)\s+/, "");
    return clean.charAt(0);
};

export default function DeptHeadDoctorsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <DoctorsListSkeleton />;

    const filteredDoctors = mockDoctors.filter(d =>
        d.name.includes(searchQuery) || d.specialty.includes(searchQuery)
    );

    const availableCount = mockDoctors.filter(d => d.status === "available").length;
    const busyCount = mockDoctors.filter(d => d.status === "busy").length;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                                        <div className="px-4 md:px-5 py-3 md:py-3.5 flex items-center justify-between gap-4 hover:bg-muted/10 transition-all group cursor-pointer">
                                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                                <div className="shrink-0">
                                                    <div className="size-9 md:size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/5 transition-transform group-hover:scale-105">
                                                        <span className="text-primary font-black text-[10px] md:text-xs">{getInitials(doctor.name)}</span>
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
                                                                doctor.status === "available" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                                                    doctor.status === "busy" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                                        "bg-muted text-muted-foreground border-border"
                                                            )}>
                                                                {doctor.status === "available" ? "متاح" : doctor.status === "busy" ? "مشغول" : "خارج الدوام"}
                                                            </span>
                                                        </div>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-x-2.5 gap-y-1 mt-0.5">
                                                            <p className="text-[10px] md:text-[11px] text-muted-foreground/80 font-medium truncate">
                                                                {doctor.specialty}
                                                            </p>
                                                            <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-muted-foreground/20 shrink-0" />
                                                            <span className="text-[9px] md:text-[10px] text-muted-foreground/60 font-bold">
                                                                {doctor.patients} مريض · {doctor.visits} زيارة
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 md:gap-4 shrink-0">
                                                <div className="hidden md:flex flex-col items-end gap-1">
                                                    <div className="flex items-center gap-1.5 bg-muted/20 px-2 py-0.5 rounded-lg">
                                                        <Phone className="size-2.5 text-muted-foreground/50" />
                                                        <span className="font-mono text-[9.5px] md:text-[10px] text-muted-foreground/70 font-medium" dir="ltr">{doctor.phone}</span>
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
                        <UserMinus size={16} className="text-amber-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">مشغول</span>
                            <span className="text-sm font-black text-foreground">{busyCount}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <Users size={16} className="text-primary" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">الإجمالي</span>
                            <span className="text-sm font-black text-foreground">{mockDoctors.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
