"use client"
import { useState } from "react";

import { FileText, ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import RecentRequestsSkeleton from "./skeletons/RecentRequestsSkeleton";
import Link from "next/link";

interface RequestItem {
    id: string;
    type: "maintenance" | "medicine";
    title: string;
    requester: string;
    date: string;
    status: "pending" | "approved" | "rejected" | "urgent";
}

const mockRequests: RequestItem[] = [
    {
        id: "REQ-001",
        type: "medicine",
        title: "طلب توريد أدوية ضغط",
        requester: "د. أحمد كمال - نقطة الرمال",
        date: "منذ ساعتين",
        status: "urgent"
    },
    {
        id: "REQ-002",
        type: "maintenance",
        title: "صيانة أجهزة تكييف",
        requester: "نقطة الشاطئ",
        date: "منذ 4 ساعات",
        status: "pending"
    },
    {
        id: "REQ-003",
        type: "medicine",
        title: "طلبية مستلزمات طوارئ",
        requester: "المخزن الرئيسي",
        date: "أمس",
        status: "approved"
    },
    {
        id: "REQ-004",
        type: "maintenance",
        title: "إصلاح جهاز أشعة",
        requester: "نقطة الشفاء",
        date: "منذ يومين",
        status: "rejected"
    }
];

const getStatusColor = (status: RequestItem["status"]) => {
    switch (status) {
        case "pending": return "bg-warning/10 text-warning border-warning/20";
        case "approved": return "bg-success/10 text-success border-success/20";
        case "rejected": return "bg-destructive/10 text-destructive border-destructive/20";
        case "urgent": return "bg-destructive text-destructive-foreground border-destructive";
        default: return "bg-muted text-muted-foreground";
    }
};

const getStatusIcon = (status: RequestItem["status"]) => {
    switch (status) {
        case "pending": return <Clock size={14} />;
        case "approved": return <CheckCircle2 size={14} />;
        case "rejected": return <XCircle size={14} />;
        case "urgent": return <AlertCircle size={14} />;
    }
};

const getStatusText = (status: RequestItem["status"]) => {
    switch (status) {
        case "pending": return "قيد الانتظار";
        case "approved": return "تمت الموافقة";
        case "rejected": return "مرفوض";
        case "urgent": return "عاجل";
    }
};

export default function RecentRequests({
    onViewAll,
    isLoading = false
}: {
    onViewAll?: () => void;
    isLoading?: boolean;
}) {
    if (isLoading) return <RecentRequestsSkeleton />;
    const [requests, setRequests] = useState(mockRequests);

    const handleAction = (id: string, action: "approved" | "rejected") => {
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: action } : req
        ));
    };

    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-4 md:p-6 pb-4 border-b border-border/50 bg-linear-to-br from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center justify-between gap-2 md:gap-3">
                        {/* تصغير حجم الأيقونة في الشاشات الصغيرة */}
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="text-primary w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            {/* العنوان: text-base للصغير و text-lg للكبير */}
                            <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">الطلبات الحديثة</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                                {requests.filter(r => r.status === "pending" || r.status === "urgent").length} طلبات تحتاج مراجعة
                            </p>
                        </div>
                    </div>
                    {onViewAll ? (
                        <button
                            onClick={onViewAll}
                            className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 shrink-0"
                        >
                            عرض الكل <ArrowLeft size={14} />
                        </button>
                    ) : (
                        <Link
                            href="/admin/inventory/reports"
                            className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 shrink-0"
                        >
                            عرض الكل <ArrowLeft size={14} />
                        </Link>
                    )}
                </div>
            </div>

            {/* Items List */}
            <div className="p-4 md:p-6 pt-4 space-y-3 overflow-y-auto custom-scrollbar flex-1">
                {requests.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group p-3 md:p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 hover:bg-background transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between gap-3 md:gap-4">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    {/* التسمية (Badge): تصغير الخط والبادينج */}
                                    <span className={cn(
                                        "text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-md border font-medium whitespace-nowrap",
                                        item.type === "medicine" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                    )}>
                                        {item.type === "medicine" ? "أدوية" : "صيانة"}
                                    </span>
                                    {/* اسم الطلب: text-xs للصغير و text-sm للكبير */}
                                    <h4 className="font-semibold text-xs md:text-sm text-foreground line-clamp-1 leading-tight">{item.title}</h4>
                                </div>
                                <p className="text-[10px] md:text-xs text-muted-foreground flex items-center gap-1">
                                    <span className="opacity-70">بواسطة:</span> {item.requester}
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-1.5 md:gap-2 shrink-0">
                                {(item.status === 'pending' || item.status === 'urgent') ? (
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'approved'); }}
                                            title="موافقة"
                                            className="w-9 h-9 sm:w-auto sm:h-10 sm:px-4 rounded-xl flex items-center justify-center gap-2 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 hover:border-emerald-500 transition-all duration-300 font-bold text-xs shadow-sm hover:shadow-emerald-500/20 cursor-pointer group/btn shrink-0"
                                        >
                                            <CheckCircle2 size={16} className="transition-transform group-hover/btn:scale-110" />
                                            <span className="hidden sm:inline">موافقة</span>
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleAction(item.id, 'rejected'); }}
                                            title="رفض"
                                            className="w-9 h-9 sm:w-auto sm:h-10 sm:px-4 rounded-xl flex items-center justify-center gap-2 text-red-600 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-red-500 transition-all duration-300 font-bold text-xs shadow-sm hover:shadow-red-500/20 cursor-pointer group/btn shrink-0"
                                        >
                                            <XCircle size={16} className="transition-transform group-hover/btn:scale-110" />
                                            <span className="hidden sm:inline">رفض</span>
                                        </button>
                                    </div>
                                ) : (
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[9px] md:text-[10px] font-bold border whitespace-nowrap",
                                        getStatusColor(item.status)
                                    )}>
                                        {getStatusIcon(item.status)}
                                        {getStatusText(item.status)}
                                    </span>
                                )}
                                <span className="text-[9px] md:text-[10px] text-muted-foreground">{item.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
