"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrescriptionsSkeleton from "@/components/department-head/skeletons/PrescriptionsSkeleton";
import { ClipboardList, CalendarDays, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageHeader } from "@/components/ui";

import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

const getInitials = (name: string) => {
    const clean = name.replace(/^(د\.|م\.)\s+/, "");
    return clean.charAt(0);
};

export default function DeptHeadPrescriptionsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const { data: response, isLoading } = useQuery({
        queryKey: ["department-head-prescriptions-full", currentPage],
        queryFn: async () => {
            const res = await api.get(`/department-head/prescriptions?page=${currentPage}`);
            return res.data;
        },
    });

    if (isLoading) return <PrescriptionsSkeleton />;

    const prescriptions = response?.data || [];
    const pagination = response?.pagination || { current_page: 1, last_page: 1 };

    const filteredPrescriptions = prescriptions.filter((rx: any) =>
        rx.doctor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rx.prescription_number.toString().includes(searchTerm)
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
                                    {filteredPrescriptions.map((rx: any) => (
                                        <div
                                            key={rx.prescription_number}
                                            className="px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/20 transition-all cursor-pointer group"
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="h-10 w-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 border border-violet-500/5 group-hover:scale-110 transition-transform">
                                                    <span className="text-violet-500 font-black text-sm">{getInitials(rx.doctor_name)}</span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <h4 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">{rx.doctor_name}</h4>
                                                        <span className={cn(
                                                            "text-[9px] px-2 py-0.5 rounded-full border font-black uppercase tracking-tight",
                                                            rx.status === "Dispensed" 
                                                                ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                                                                : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                                                        )}>
                                                            {rx.status === "Dispensed" ? "تم الصرف" : "قيد الانتظار"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                                        <p className="text-[11px] text-muted-foreground font-bold truncate">المريض: {rx.patient_name}</p>
                                                        <span className="hidden sm:inline size-1 rounded-full bg-muted-foreground/30" />
                                                        <div className="flex items-center gap-1.5">
                                                            <CalendarDays size={10} className="text-muted-foreground/40" />
                                                            <span className="text-[10px] text-muted-foreground font-medium">{rx.created_at}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center justify-between sm:justify-end gap-4 pl-0 sm:pl-4">
                                                <div className="flex flex-col items-end gap-1">
                                                    <span className="text-[10px] font-black text-violet-600 bg-violet-500/5 px-2.5 py-1 rounded-lg border border-violet-500/10">
                                                        {rx.medicines_count} أدوية
                                                    </span>
                                                    <span className="text-[9px] text-muted-foreground font-mono">#{rx.prescription_number}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Pagination */}
                <div className="p-4 bg-muted/10 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[10px] text-muted-foreground italic order-2 sm:order-1">يتم تحديث الوصفات تلقائياً</p>
                    
                    <div className="flex items-center gap-2 order-1 sm:order-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight size={16} />
                        </button>
                        
                        <div className="flex items-center gap-1 mx-2">
                            <span className="text-xs font-bold text-foreground">{currentPage}</span>
                            <span className="text-xs text-muted-foreground">من</span>
                            <span className="text-xs font-bold text-foreground">{pagination.last_page}</span>
                        </div>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                            disabled={currentPage === pagination.last_page}
                            className="p-2 rounded-lg border border-border bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
