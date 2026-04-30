"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    Clock,
    CheckCircle,
    XCircle,
    ClipboardList,
    Hospital,
    Search,
    Loader2,
    PlayCircle,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import api from "@/api/axios";
import SupplyRequestsSkeleton from "./SupplyRequestsSkeleton";

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface Medicine {
    medicine_id: number;
    name: string;
    quantity: number;
    max: number;
}

interface ApiSupplyRequest {
    id: number;
    point_id: number;
    point_name: string;
    point_manager: {
        id: number;
        name: string;
        email: string;
    };
    storage_id: number;
    storage_name: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
    medicines: Medicine[];
    created_at: string;
}

interface MappedSupplyRequest {
    id: string;
    itemName: string;
    quantity: number;
    clinic: string;
    requester: string;
    date: string;
    status: "pending" | "in_progress" | "completed" | "cancelled";
}

// ----------------------------------------------------------------------
// Helper Functions for Status (UI Mapping)
// ----------------------------------------------------------------------
const getStatusColor = (status: MappedSupplyRequest["status"]) => {
    switch (status) {
        case "pending": return "bg-orange-500/10 text-orange-600 border-orange-500/20";
        case "in_progress": return "bg-blue-500/10 text-blue-600 border-blue-500/20";
        case "completed": return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20";
        case "cancelled": return "bg-red-500/10 text-red-600 border-red-500/20";
        default: return "bg-muted text-muted-foreground border-border";
    }
};

const getStatusIcon = (status: MappedSupplyRequest["status"]) => {
    switch (status) {
        case "pending": return <Clock size={16} />;
        case "in_progress": return <PlayCircle size={16} />;
        case "completed": return <CheckCircle2 size={16} />;
        case "cancelled": return <XCircle size={16} />;
        default: return <AlertCircle size={16} />;
    }
};

const getStatusText = (status: MappedSupplyRequest["status"]) => {
    switch (status) {
        case "pending": return "قيد الانتظار";
        case "in_progress": return "قيد التنفيذ";
        case "completed": return "مكتمل";
        case "cancelled": return "ملغي";
        default: return "غير معروف";
    }
};

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------
interface InventoryReportsProps {
    isAdmin?: boolean;
}

export default function InventoryReports({ isAdmin = true }: InventoryReportsProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "in_progress" | "completed" | "cancelled">("all");
    const [searchTerm, setSearchTerm] = useState("");

    // 1. Fetch Data
    const {
        data: requestsData,
        isLoading,
        isError
    } = useQuery({
        queryKey: ['supply-requests', isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? '/supply-requests' : '/point-manager/supply-requests';
            const response = await api.get(endpoint);
            const apiData = response.data.data;

            if (isAdmin) {
                return apiData.map((req: any): MappedSupplyRequest => ({
                    id: req.id.toString(),
                    itemName: req.medicines.map((m: any) => m.name).join('، ') || 'طلب إمداد',
                    quantity: req.medicines.reduce((total: number, m: any) => total + m.quantity, 0),
                    clinic: req.point_name,
                    requester: req.point_manager.name,
                    date: new Date(req.created_at).toLocaleDateString('ar-EG', {
                        year: 'numeric', month: 'short', day: 'numeric'
                    }),
                    status: req.status
                }));
            } else {
                // Mapping for Manager
                return apiData.map((req: any) => ({
                    id: req.id.toString(),
                    itemName: req.content,
                    quantity: req.total_quantity,
                    clinic: req.storage_name,
                    requester: "النظام",
                    date: new Date(req.created_at).toLocaleDateString('ar-EG', {
                        day: 'numeric', month: 'long'
                    }) + ' | ' + new Date(req.created_at).toLocaleTimeString('ar-EG', {
                        hour: '2-digit', minute: '2-digit'
                    }),
                    status: req.status
                }));
            }
        }
    });

    const requests: MappedSupplyRequest[] = requestsData || [];

    // 2. Mutation for Approve / Reject
    // 2. Mutation for Approve / Reject (Optimistic Update Pattern)
    const actionMutation = useMutation({
        mutationFn: async ({ id, action }: { id: string; action: "approve" | "reject" }) => {
            const endpoint = action === "approve" ? "approve" : "reject";
            const res = await api.post(`/supply-requests/${id}/${endpoint}`);
            return res.data;
        },
        // 1. قبل بدء الطلب: نقوم بتحديث الواجهة فوراً
        onMutate: async ({ id, action }) => {
            // إيقاف أي جلب للبيانات يعمل في الخلفية حالياً لتجنب التعارض
            await queryClient.cancelQueries({ queryKey: ['supply-requests'] });

            // أخذ نسخة من البيانات الحالية للرجوع إليها (Rollback) في حال فشل السيرفر
            const previousRequests = queryClient.getQueryData(['supply-requests']);

            // التحديث المحلي الفوري
            queryClient.setQueryData(['supply-requests'], (old: MappedSupplyRequest[] | undefined) => {
                if (!old) return [];

                // ⚠️ هام: تأكد أن هذه الحالة ("completed") مطابقة لما يحفظه السيرفر بعد الموافقة
                // إذا كان السيرفر يحولها إلى "in_progress" مثلاً، قم بتغييرها هنا لتتطابق
                const newStatus = action === "approve" ? "completed" : "cancelled";

                return old.map(req =>
                    req.id === id ? { ...req, status: newStatus } : req
                );
            });

            // تمرير البيانات القديمة للـ onError
            return { previousRequests };
        },
        // 2. في حال فشل الطلب: نلغي التحديث الوهمي ونرجع البيانات السابقة
        onError: (error: any, _variables, context) => {
            if (context?.previousRequests) {
                queryClient.setQueryData(['supply-requests'], context.previousRequests);
            }

            const msg = error?.response?.data?.message || "حدث خطأ أثناء التواصل مع الخادم";
            toast.custom((t) => (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative overflow-hidden bg-card border border-destructive/20 shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[320px] w-full"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 text-destructive shrink-0">
                        <AlertCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground">فشل الإجراء</h4>
                        <p className="text-[11px] text-muted-foreground mt-1">{msg}</p>
                    </div>
                </motion.div>
            ), { duration: 5000 });
        },
        // 3. في حال النجاح: نعرض رسالة التأكيد
        onSuccess: (_data, variables) => {
            const isApproved = variables.action === "approve";
            const durationMs = 4000;

            toast.custom((t) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={cn(
                        "relative overflow-hidden bg-card border shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[320px] w-full",
                        isApproved ? "border-emerald-500/20" : "border-red-500/20"
                    )}
                >
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-inner",
                        isApproved ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
                    )}>
                        {isApproved ? <CheckCircle2 className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
                    </div>
                    <div className="flex-1 pt-0.5">
                        <h4 className="text-sm font-bold text-foreground">
                            {isApproved ? "تمت الموافقة بنجاح" : "تم رفض الطلب"}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            {isApproved
                                ? "تم تحديث المخزون وإشعار الجهة الطالبة بالإمداد."
                                : "تم إلغاء طلب الإمداد بنجاح."}
                        </p>
                    </div>
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: durationMs / 1000, ease: "linear" }}
                        className={cn("absolute bottom-0 left-0 h-1", isApproved ? "bg-emerald-500" : "bg-red-500")}
                    />
                </motion.div>
            ), { duration: durationMs });
        },
        // 4. في النهاية (سواء نجاح أو فشل): نجلب البيانات من السيرفر للتأكيد النهائي
        onSettled: () => {
            // وضع تأخير لمدة ثانية واحدة يضمن أن قاعدة البيانات قد أتمت عملية التحديث
            // قبل أن نقوم بسحب البيانات من السيرفر مرة أخرى
            setTimeout(() => {
                queryClient.invalidateQueries({ queryKey: ["supply-requests"] });
            }, 1000);
        }
    });

    const handleAction = (id: string, action: "approve" | "reject") => {
        actionMutation.mutate({ id, action });
    };

    // 3. Filter & Sort Logic
    // أولوية الترتيب لضمان ظهور الطلبات المعلقة أولاً
    const statusPriority = {
        pending: 1,
        in_progress: 2,
        completed: 3,
        cancelled: 4
    };

    const filteredAndSortedRequests = [...requests]
        .filter(req => {
            const matchesTab = activeTab === "all" || req.status === activeTab;
            const matchesSearch =
                (req.itemName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                (req.clinic || "").includes(searchTerm);
            return matchesTab && matchesSearch;
        })
        // الحل للمشكلة الثانية: ترتيب القائمة بناءً على الأولوية
        .sort((a, b) => statusPriority[a.status] - statusPriority[b.status]);

    return (
        <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
            {/* Toolbar & Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/50 p-4 rounded-3xl shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="بحث عن دواء أو نقطة طبية..."
                        className="pr-10 bg-muted/30 border-none rounded-2xl h-11 focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/50 overflow-x-auto no-scrollbar pb-0 md:pb-0" dir="rtl">
                    {[
                        { id: "all", label: "الكل", icon: ClipboardList },
                        { id: "pending", label: "معلقة", icon: Clock },
                        { id: "in_progress", label: "قيد التنفيذ", icon: PlayCircle },
                        { id: "completed", label: "مكتملة", icon: CheckCircle },
                        { id: "cancelled", label: "ملغاة", icon: XCircle }
                    ].map((tab) => {
                        const isActive = activeTab === tab.id;
                        const count = tab.id === "all"
                            ? requests.length
                            : requests.filter(r => r.status === tab.id).length;

                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "relative flex items-center gap-2.5 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer group outline-hidden",
                                    isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                <div className="relative z-10 flex items-center gap-2">
                                    <tab.icon
                                        size={16}
                                        className={cn(
                                            "transition-transform group-hover:scale-110",
                                            isActive ? "text-primary-foreground" : "text-muted-foreground/60 group-hover:text-primary"
                                        )}
                                    />
                                    <span>{tab.label}</span>
                                    <span className={cn(
                                        "px-2 py-0.5 rounded-lg text-[10px] font-black transition-colors shadow-xs",
                                        isActive ? "bg-white/20 text-primary-foreground" : "bg-muted text-muted-foreground"
                                    )}>
                                        {count}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* List Container */}
            <div className="bg-card border border-border/50 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-6 md:p-5 border-b border-border/50 flex items-center justify-between bg-linear-to-b from-muted/20 to-transparent">
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <SupplyRequestsSkeleton />
                        ) : isError ? (
                            <motion.div
                                key="error"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-20 text-center text-red-500 font-bold"
                            >
                                حدث خطأ أثناء تحميل الطلبات، يرجى المحاولة لاحقاً.
                            </motion.div>
                        ) : filteredAndSortedRequests.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-20 text-center flex flex-col items-center justify-center gap-5"
                            >
                                <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center text-muted-foreground/20">
                                    <ClipboardList size={32} />
                                </div>
                                <p className="text-muted-foreground font-black italic text-sm">لا توجد طلبات تطابق معايير البحث</p>
                            </motion.div>
                        ) : !isAdmin ? (
                            <motion.div
                                key="manager-list"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="p-4 md:p-6 space-y-3"
                            >
                                {filteredAndSortedRequests.map((req, i) => {
                                    const statusConfig = {
                                        pending: { badge: "bg-orange-500/10 text-orange-400 border-orange-500/20", bar: "bg-orange-500", label: "قيد الانتظار" },
                                        in_progress: { badge: "bg-blue-500/10 text-blue-400 border-blue-500/20", bar: "bg-blue-500", label: "قيد التنفيذ" },
                                        completed: { badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", bar: "bg-emerald-500", label: "تمت الموافقة" },
                                        cancelled: { badge: "bg-red-500/10 text-red-400 border-red-500/20", bar: "bg-red-500", label: "ملغي" },
                                    };
                                    const cfg = statusConfig[req.status] || statusConfig.pending;

                                    return (
                                        <motion.div
                                            key={req.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.06, type: "spring", stiffness: 200, damping: 20 }}
                                            className="relative group bg-card/60 border border-border/40 rounded-2xl p-4 md:p-5 flex items-center gap-4 hover:border-primary/30 hover:bg-card/90 hover:shadow-md transition-all duration-300 overflow-hidden"
                                        >
                                            {/* Accent Left Bar */}
                                            <div className={cn("absolute right-0 top-0 bottom-3 w-[3px] rounded-full opacity-70 group-hover:opacity-100 transition-opacity h-full", cfg.bar)} />

                                            {/* Status Icon Circle */}
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                                                cfg.badge
                                            )}>
                                                {getStatusIcon(req.status)}
                                            </div>

                                            {/* Main Content */}
                                            <div className="flex-1 min-w-0">
                                                {/* Medicine names */}
                                                <p className="text-sm font-bold text-foreground/90 line-clamp-1 leading-relaxed mb-1.5 text-right" dir="ltr">
                                                    {req.itemName}
                                                </p>

                                                {/* Meta row */}
                                                <div className="flex items-center justify-end gap-3 flex-wrap">
                                                    <span className="text-[10px] text-muted-foreground/50 font-medium tracking-tight">
                                                        {req.date}
                                                    </span>
                                                    <span className="w-1 h-1 rounded-full bg-border/60" />
                                                    <span className="text-[11px] text-muted-foreground/70 font-semibold">
                                                        {req.clinic}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Right Side: badges */}
                                            <div className="flex flex-col items-end gap-2 shrink-0">
                                                <span className={cn(
                                                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black border",
                                                    cfg.badge
                                                )}>
                                                    {getStatusIcon(req.status)}
                                                    {cfg.label}
                                                </span>
                                                <span className="text-[9px] font-black text-muted-foreground/40 tracking-wider uppercase">
                                                    #{req.id}
                                                </span>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="divide-y divide-border/40"
                            >
                                {filteredAndSortedRequests.map((req) => {
                                    const isApproving = actionMutation.isPending && actionMutation.variables?.id === req.id && actionMutation.variables?.action === "approve";
                                    const isRejecting = actionMutation.isPending && actionMutation.variables?.id === req.id && actionMutation.variables?.action === "reject";
                                    const isAnyActionPending = actionMutation.isPending;

                                    return (
                                        <div key={req.id} className="p-5 md:px-8 md:py-6 group relative overflow-hidden hover:bg-muted/30 transition-all duration-300">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                                {/* Details Section */}
                                                <div className="flex items-start gap-4">
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border shadow-xs transition-colors",
                                                        getStatusColor(req.status)
                                                    )}>
                                                        {getStatusIcon(req.status)}
                                                    </div>

                                                    <div className="space-y-2.5">
                                                        <div className="flex flex-wrap items-center gap-3">
                                                            <h4 className="font-black text-base text-foreground tracking-tight group-hover:text-primary transition-colors line-clamp-1 max-w-[300px]" title={req.itemName}>
                                                                {req.itemName}
                                                            </h4>
                                                            <span className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">إجمالي الكمية: {req.quantity}</span>
                                                        </div>

                                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-bold">
                                                            <div className="flex items-center gap-1.5 bg-background/50 border border-border/50 px-2 py-1 rounded-lg">
                                                                <Hospital size={12} className="text-primary/70" />
                                                                <span>{req.clinic}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 bg-background/50 border border-border/50 px-2 py-1 rounded-lg">
                                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                                                                <span>{req.requester}</span>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 opacity-60 mr-1">
                                                                <Clock size={12} />
                                                                <span>{req.date}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Actions / Status Badge Section */}
                                                <div className="flex items-center gap-3 md:self-center">
                                                    {(req.status === "pending" || req.status === "in_progress") ? (
                                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                                            <button
                                                                onClick={() => handleAction(req.id, "approve")}
                                                                disabled={isAnyActionPending}
                                                                className="flex-1 md:flex-none h-9 px-5 rounded-xl flex items-center justify-center gap-2 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 transition-all font-black text-[11px] cursor-pointer active:scale-95 disabled:opacity-50"
                                                            >
                                                                {isApproving ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                                                                <span>{isApproving ? "جاري..." : "موافقة"}</span>
                                                            </button>
                                                            <button
                                                                onClick={() => handleAction(req.id, "reject")}
                                                                disabled={isAnyActionPending}
                                                                className="flex-1 lg:flex-none h-9 px-5 rounded-xl flex items-center justify-center gap-2 text-red-600 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/20 transition-all font-black text-[11px] cursor-pointer active:scale-95 disabled:opacity-50"
                                                            >
                                                                {isRejecting ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
                                                                <span>{isRejecting ? "جاري..." : "رفض"}</span>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={cn(
                                                            "px-5 py-2 rounded-xl text-[10px] font-black border flex items-center gap-2 shadow-xs transition-colors",
                                                            getStatusColor(req.status)
                                                        )}>
                                                            {getStatusIcon(req.status)}
                                                            <span>{getStatusText(req.status)}</span>
                                                        </div>
                                                    )}
                                                </div>

                                            </div>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className="px-8 py-4 bg-muted/5 border-t border-border/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        يتم التحديث بشكل تلقائي بكل جديد (عبر React Query)
                    </div>
                </div>
            </div>
        </div>
    );
}