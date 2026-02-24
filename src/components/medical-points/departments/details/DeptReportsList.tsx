"use client";

import { FileText, Calendar, User, ChevronLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui";

interface Report {
    id: number;
    text: string;
    date: string;
    managerName: string;
}

interface DeptReportsListProps {
    reports: Report[];
    isLoading?: boolean;
}

export default function DeptReportsList({
    reports,
    isLoading = false,
}: DeptReportsListProps) {
    if (isLoading) {
        return (
            <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border/50 space-y-2">
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-56" />
                </div>
                <div className="divide-y divide-border/50">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-5 space-y-3">
                            <div className="flex items-center gap-3">
                                <Skeleton className="w-10 h-10 rounded-xl" />
                                <div className="space-y-1.5 flex-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <Skeleton className="h-16 w-full rounded-lg" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ translateY: 30 }}
            animate={{ translateY: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-border/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                        <FileText size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground">تقارير القسم</h3>
                        <p className="text-sm text-muted-foreground">
                            التقارير المرفوعة من رئيس القسم · {reports.length} تقرير
                        </p>
                    </div>
                </div>
            </div>

            {/* Reports List */}
            <div className="divide-y divide-border/50">
                <AnimatePresence mode="wait">
                    {reports.length === 0 ? (
                        <div className="p-12 text-center flex flex-col items-center justify-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                <FileText size={32} />
                            </div>
                            <p className="text-muted-foreground font-bold italic text-sm">لا توجد تقارير حالياً</p>
                        </div>
                    ) : (
                        reports.map((report, index) => (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="p-5 hover:bg-muted/20 transition-all group cursor-pointer"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Report Icon */}
                                    <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary shrink-0 mt-0.5 group-hover:bg-primary/10 transition-colors">
                                        <FileText size={18} />
                                    </div>

                                    {/* Report Content */}
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <User size={12} />
                                                <span className="font-bold">{report.managerName}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                                <Calendar size={12} />
                                                <span className="font-medium">{report.date}</span>
                                            </div>
                                        </div>

                                        <p className="text-sm text-foreground/90 leading-relaxed line-clamp-3">
                                            {report.text}
                                        </p>
                                    </div>

                                    {/* Arrow */}
                                    <ChevronLeft
                                        size={16}
                                        className="text-muted-foreground/30 group-hover:text-primary transition-colors shrink-0 mt-3"
                                    />
                                </div>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="p-4 bg-muted/5 border-t border-border/50 text-center">
                <p className="text-[10px] text-muted-foreground font-bold italic">
                    التقارير مرتبطة بجدول reports → department_manager_id
                </p>
            </div>
        </motion.div>
    );
}
