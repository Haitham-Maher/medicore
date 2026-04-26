"use client"
import { FileText, ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import RecentRequestsSkeleton from "../skeletons/RecentRequestsSkeleton";
import Link from "next/link";
import api from "@/api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface RequestItem {
    id: string;
    type: "maintenance" | "medicine";
    title: string;
    requester: string;
    date: string;
    status: "pending" | "approved" | "rejected" | "urgent";
}

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

interface RecentRequestsProps {
    onViewAll?: () => void;
    isAdmin?: boolean;
}

export default function RecentRequests({
    onViewAll,
    isAdmin = true
}: RecentRequestsProps) {
    const queryClient = useQueryClient();

    // جلب البيانات
    const { data: response, isLoading } = useQuery({
        queryKey: ["recent-requests"],
        queryFn: async () => {
            const res = await api.get("/dashboard/recent-orders");
            return res.data;
        }
    });

    // التعامل مع العمليات (الموافقة والرفض)
    const actionMutation = useMutation({
        mutationFn: async ({ id, action }: { id: string, action: "approved" | "rejected" }) => {
            const endpoint = action === "approved" ? "approve" : "reject";
            const res = await api.post(`/supply-requests/${id}/${endpoint}`);
            return res.data;
        },
        onMutate: ({ action }) => {
            // 1. Toast التحميل الأنيق
            const loadingId = toast.custom((t) => (
                <div className="relative overflow-hidden bg-card border border-border shadow-2xl rounded-2xl p-4 flex items-center gap-4 min-w-[300px] w-full border-b-primary/50">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
                        <Loader2 className="w-5 h-5 text-primary animate-spin" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground">
                            {action === "approved" ? "جاري الموافقة..." : "جاري معالجة الرفض..."}
                        </h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5 font-medium">يرجى الانتظار ثوانٍ معدودة</p>
                    </div>
                </div>
            ), { duration: Infinity });

            return { loadingId };
        },
        onSuccess: async (_data, variables, context: any) => {
            toast.dismiss(context?.loadingId);
            await queryClient.invalidateQueries({ queryKey: ["recent-requests"] });

            const isApproved = variables.action === "approved";
            const durationMs = 4000;

            // 2. Toast النجاح مع Progress Bar وأنيميشن راقي
            toast.custom((t) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    className={cn(
                        "relative overflow-hidden bg-card border shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[320px] w-full",
                        isApproved ? "border-emerald-500/20" : "border-orange-500/20"
                    )}
                >
                    <div className={cn(
                        "flex items-center justify-center w-10 h-10 rounded-xl shrink-0 shadow-inner",
                        isApproved ? "bg-emerald-500/10 text-emerald-600" : "bg-orange-500/10 text-orange-600"
                    )}>
                        {isApproved ? <CheckCircle2 className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                    </div>

                    <div className="flex-1 pt-0.5">
                        <h4 className="text-sm font-bold text-foreground">
                            {isApproved ? "تمت العملية بنجاح" : "تم رفض الطلب"}
                        </h4>
                        <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">
                            {isApproved
                                ? "تم تحديث المخزون المركزي وإخطار الجهة الطالبة."
                                : "تم إلغاء الطلب نهائياً من قائمة الانتظار."}
                        </p>
                    </div>

                    {/* Progress Bar السحري */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: durationMs / 1000, ease: "linear" }}
                        className={cn("absolute bottom-0 left-0 h-1", isApproved ? "bg-emerald-500" : "bg-orange-500")}
                    />
                </motion.div>
            ), { duration: durationMs });
        },
        onError: (error: any, _variables, context: any) => {
            toast.dismiss(context?.loadingId);
            const msg = error?.response?.data?.message || "فشل الاتصال بالسيرفر";

            // 3. Toast الخطأ مع Progress Bar أحمر
            toast.custom((t) => (
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="relative overflow-hidden bg-card border border-destructive/20 shadow-2xl rounded-2xl p-4 flex items-start gap-4 min-w-[320px] w-full"
                >
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-destructive/10 text-destructive shrink-0">
                        <XCircle className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-sm font-bold text-foreground">حدث خطأ أثناء المعالجة</h4>
                        <p className="text-[11px] text-muted-foreground mt-1">{msg}</p>
                    </div>
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="absolute bottom-0 left-0 h-1 bg-destructive"
                    />
                </motion.div>
            ), { duration: 5000 });
        }
    });

    if (isLoading) return <RecentRequestsSkeleton />;

    const listRecent = response?.data;

    const requests: RequestItem[] = (listRecent || [])
        .map((item: any) => ({
            id: item.id.toString(),
            type: "medicine",
            title: `عيادة ${item.point_name}`,
            requester: item.manager_name,
            date: item.created_at_human.replace(/(\d+\.\d+)/, (match: string) => Math.floor(parseFloat(match)).toString()),
            status: ((): RequestItem["status"] => {
                switch (item.status) {
                    case "in_progress":
                    case "completed": return "approved";
                    case "cancelled": return "rejected";
                    default: return "pending";
                }
            })()
        }))
        .sort((a: any, b: any) => {
            if (a.status === "pending" && b.status !== "pending") return -1;
            if (a.status !== "pending" && b.status === "pending") return 1;
            return 0;
        });

    return (
        <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col">
            {/* Header */}
            <div className="p-4 md:p-6 pb-4 border-b border-border/50 bg-linear-to-br from-primary/5 to-transparent">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                            <FileText className="text-primary w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div>
                            <h3 className="text-base md:text-lg font-bold text-foreground leading-tight">الطلبات الحديثة</h3>
                            <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">
                                {requests.filter(r => r.status === "pending").length} طلبات قيد المراجعة
                            </p>
                        </div>
                    </div>
                    <Link
                        href={isAdmin ? "/admin/reports" : "/manager/reports"}
                        className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-all px-3 py-1.5 rounded-lg hover:bg-primary/5 shrink-0"
                    >
                        عرض الكل <ArrowLeft size={14} />
                    </Link>
                </div>
            </div>

            {/* Items List */}
            <div className="p-4 md:p-6 pt-4 space-y-3 custom-scrollbar flex-1 max-h-[400px] overflow-y-auto">
                {requests.map((item, i) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="group p-3 md:p-4 rounded-xl border border-border/50 hover:border-primary/30 bg-background/50 hover:bg-background transition-all cursor-pointer relative overflow-hidden"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-1.5 md:gap-2">
                                    <span className={cn(
                                        "text-[9px] md:text-[10px] px-1.5 py-0.5 rounded-md border font-medium whitespace-nowrap",
                                        item.type === "medicine" ? "bg-blue-500/10 text-blue-500 border-blue-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                                    )}>
                                        {item.type === "medicine" ? "أدوية" : "صيانة"}
                                    </span>
                                    <h4 className="font-semibold text-xs md:text-sm text-foreground line-clamp-1">{item.title}</h4>
                                </div>
                                <p className="text-[10px] md:text-xs text-muted-foreground">
                                    بواسطة: <span className="text-foreground/80">{item.requester}</span>
                                </p>
                            </div>

                            <div className="flex flex-col items-end gap-2 shrink-0">
                                {item.status === 'pending' ? (
                                    <div className="flex items-center gap-1.5 md:gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                actionMutation.mutate({ id: item.id, action: 'approved' });
                                            }}
                                            disabled={actionMutation.isPending}
                                            className="w-8 h-8 md:w-auto md:h-9 md:px-3 rounded-lg flex items-center justify-center gap-2 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all font-bold text-xs disabled:opacity-50"
                                        >
                                            <CheckCircle2 size={16} />
                                            <span className="hidden md:inline">موافقة</span>
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                actionMutation.mutate({ id: item.id, action: 'rejected' });
                                            }}
                                            disabled={actionMutation.isPending}
                                            className="w-8 h-8 md:w-auto md:h-9 md:px-3 rounded-lg flex items-center justify-center gap-2 text-red-600 bg-red-500/10 hover:bg-red-500 hover:text-white transition-all font-bold text-xs disabled:opacity-50"
                                        >
                                            <XCircle size={16} />
                                            <span className="hidden md:inline">رفض</span>
                                        </button>
                                    </div>
                                ) : (
                                    <span className={cn(
                                        "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold border",
                                        getStatusColor(item.status)
                                    )}>
                                        {getStatusIcon(item.status)}
                                        {getStatusText(item.status)}
                                    </span>
                                )}
                                <span className="text-[9px] text-muted-foreground font-medium">{item.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}