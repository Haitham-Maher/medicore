"use client"
import { FileText, ArrowLeft, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import RecentRequestsSkeleton from "../skeletons/RecentRequestsSkeleton";
import Link from "next/link";
import api from "@/api/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useParams } from "next/navigation";

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
    isAdmin = true,
    onViewAll
}: RecentRequestsProps) {
    const params = useParams();
    const id = params?.id;
    const queryClient = useQueryClient();

    // 1. جلب البيانات بناءً على الصلاحية
    const { data: response, isLoading } = useQuery({
        queryKey: isAdmin ? ["recent-requests"] : ["point-manager-supply-requests"],
        queryFn: async () => {
            const endpoint = isAdmin ? "/dashboard/recent-orders" : "/point-manager/supply-requests";
            const res = await api.get(endpoint);
            return res.data;
        }
    });

    // 2. معالجة العمليات (خاصة بالأدمن عادةً)
    const actionMutation = useMutation({
        mutationFn: async ({ id, action }: { id: string, action: "approved" | "rejected" }) => {
            const endpoint = action === "approved" ? "approve" : "reject";
            const res = await api.post(`/supply-requests/${id}/${endpoint}`);
            return res.data;
        },
        onMutate: ({ action }) => {
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

            // تحديث الكاش الصحيح بناءً على المستخدم الحالي
            const currentKey = isAdmin ? ["recent-requests"] : ["point-manager-supply-requests"];
            await queryClient.invalidateQueries({ queryKey: currentKey });

            const isApproved = variables.action === "approved";
            toast.success(isApproved ? "تمت الموافقة على الطلب" : "تم رفض الطلب بنجاح");
        },
        onError: (error: any, _variables, context: any) => {
            toast.dismiss(context?.loadingId);
            const msg = error?.response?.data?.message || "فشل الاتصال بالسيرفر";
            toast.error(msg);
        }
    });

    if (isLoading) return <RecentRequestsSkeleton />;

    const listRecent = response?.data;

    // 3. تحويل البيانات للعرض
    const requests: RequestItem[] = (listRecent || [])
        .map((item: any) => {
            if (isAdmin) {
                const medicines = item.requested_medicines || [];
                const medicinesText = medicines.length > 0
                    ? `${medicines[0].name}${medicines.length > 1 ? ` + ${medicines.length - 1} أصناف أخرى` : ""}`
                    : "طلب إمدادات";

                return {
                    id: item.id.toString(),
                    type: "medicine",
                    title: id ? medicinesText : `عيادة ${item.point_name}`,
                    requester: id ? (item.manager_name || "مدير النقطة") : item.manager_name,
                    date: new Date(item.created_at).toLocaleDateString('ar-EG-u-nu-arab', {
                        day: 'numeric', month: 'long'
                    }) + ' | ' + new Date(item.created_at).toLocaleTimeString('ar-EG-u-nu-arab', {
                        hour: '2-digit', minute: '2-digit'
                    }),
                    status: ((): RequestItem["status"] => {
                        switch (item.status) {
                            case "completed":
                            case "in_progress": return "approved";
                            case "cancelled": return "rejected";
                            default: return "pending";
                        }
                    })()
                };
            } else {
                const statusMap = (status: string): RequestItem["status"] => {
                    switch (status) {
                        case "pending": return "pending";
                        case "completed":
                        case "in_progress": return "approved";
                        case "cancelled": return "rejected";
                        default: return "pending";
                    }
                };
                return {
                    id: item.id.toString(),
                    type: "medicine",
                    title: item.content || "طلب إمدادات",
                    requester: item.storage_name || "المخزن الرئيسي",
                    date: new Date(item.created_at).toLocaleDateString('ar-EG-u-nu-arab', {
                        day: 'numeric', month: 'long'
                    }) + ' | ' + new Date(item.created_at).toLocaleTimeString('ar-EG-u-nu-arab', {
                        hour: '2-digit', minute: '2-digit'
                    }),
                    status: statusMap(item.status)
                };
            }
        })
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
                    {onViewAll ? (
                        <button
                            onClick={onViewAll}
                            className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-all px-3 py-1.5 rounded-lg hover:bg-primary/5 shrink-0 cursor-pointer"
                        >
                            عرض الكل <ArrowLeft size={14} />
                        </button>
                    ) : (
                        <Link
                            href={isAdmin ? "/admin/reports" : "/manager/reports"}
                            className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-all px-3 py-1.5 rounded-lg hover:bg-primary/5 shrink-0"
                        >
                            عرض الكل <ArrowLeft size={14} />
                        </Link>
                    )}
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
                                {/* التعديل الجوهري: الأزرار تظهر فقط للأدمن */}
                                {isAdmin && item.status === 'pending' ? (
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