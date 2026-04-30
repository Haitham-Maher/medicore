"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrescriptionsSkeleton from "@/components/department-head/skeletons/PrescriptionsSkeleton";
import { ClipboardList, CalendarDays, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui";

const prescriptions = [
    { id: "1", doctor: "د. أحمد كمال", patient: "محمد علي", date: "2026-03-10", items: 3, status: "active" },
    { id: "2", doctor: "د. سارة علي", patient: "فاطمة حسن", date: "2026-03-09", items: 2, status: "active" },
    { id: "3", doctor: "د. خالد منصور", patient: "أحمد سالم", date: "2026-03-08", items: 5, status: "completed" },
    { id: "4", doctor: "د. فاطمة حسين", patient: "خالد محمد", date: "2026-03-07", items: 1, status: "completed" },
    { id: "5", doctor: "د. أحمد كمال", patient: "سارة يوسف", date: "2026-03-06", items: 4, status: "active" },
    { id: "6", doctor: "د. نور الدين", patient: "عمر حسين", date: "2026-03-05", items: 2, status: "completed" },
];

const getInitials = (name: string) => {
    const clean = name.replace(/^(د\.|م\.)\s+/, "");
    return clean.charAt(0);
};

export default function DeptHeadPrescriptionsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1500);
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) return <PrescriptionsSkeleton />;

    const filteredPrescriptions = prescriptions.filter(rx =>
        rx.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.patient.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PageHeader
                title="الوصفات الطبية"
                description="عرض جميع الوصفات الصادرة من أطباء القسم"
                icon={ClipboardList}
            />

            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-500 shadow-sm">
                            <ClipboardList size={20} />
                        </div>  
                        <div>
                            <h3 className="font-bold text-lg text-foreground">جميع الوصفات</h3>
                            <p className="text-sm text-muted-foreground">{filteredPrescriptions.length} وصفة طبية</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group w-full md:w-80">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                        <input
                            type="text"
                            placeholder="ابحث باسم الطبيب أو المريض..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-muted/30 border border-border/50 rounded-xl py-2.5 pr-10 pl-4 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative min-h-[200px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={searchTerm}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {filteredPrescriptions.length === 0 ? (
                                <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                        <ClipboardList size={32} />
                                    </div>
                                    <p className="text-muted-foreground font-bold italic text-sm">لا توجد نتائج تطابق معايير البحث</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-border/30">
                                    {filteredPrescriptions.map((rx) => (
                                        <div
                                            key={rx.id}
                                            className="px-6 py-4 flex items-center gap-4 hover:bg-muted/20 transition-all cursor-pointer group"
                                        >
                                            <div className="h-10 w-10 rounded-full bg-violet-500/10 flex items-center justify-center shrink-0">
                                                <span className="text-violet-500 font-black text-sm">{getInitials(rx.doctor)}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{rx.doctor}</h4>
                                                    <span className="text-[8px] px-1.5 py-px rounded-full border font-bold bg-violet-500/10 text-violet-600 border-violet-500/20 shrink-0">
                                                        {rx.items} أدوية
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-muted-foreground font-medium truncate mt-0.5">
                                                    المريض: {rx.patient}
                                                </p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <CalendarDays size={10} className="text-muted-foreground/50" />
                                                    <span className="text-[10px] text-muted-foreground font-medium">{rx.date}</span>
                                                </div>
                                            </div>
                                            <span className={cn(
                                                "text-[9px] px-2 py-0.5 rounded-full border font-bold shrink-0",
                                                rx.status === "active"
                                                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                                                    : "bg-muted text-muted-foreground border-border"
                                            )}>
                                                {rx.status === "active" ? "فعّالة" : "مكتملة"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="p-4 bg-muted/10 border-t border-border/50 text-center">
                    <p className="text-[10px] text-muted-foreground italic">يتم تحديث الوصفات تلقائياً</p>
                </div>
            </div>
        </div>
    );
}
