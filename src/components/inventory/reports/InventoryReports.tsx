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
    AlertCircle,
    ChevronDown,
    Pill,
    User,
    Calendar,
    Plus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Button, Input } from "@/components/ui";
import api from "@/api/axios";
import SupplyRequestsSkeleton from "./SupplyRequestsSkeleton";
import AddSupplyRequestModal from "./AddSupplyRequestModal";

// ----------------------------------------------------------------------
// Interfaces
// ----------------------------------------------------------------------
interface Medicine {
    medicine_id: number;
    name: string;
    quantity: number;
    max: number;
}

interface MappedSupplyRequest {
    id: string;
    itemName: string;
    quantity: number;
    clinic: string;
    requester: string;
    date: string;
    createdAt: string; // تم الإضافة من أجل الترتيب
    status: "pending" | "in_progress" | "completed" | "cancelled";
    medicines: Medicine[];
}

// ----------------------------------------------------------------------
// Helper Functions for UI
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
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "completed" | "cancelled">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // 1. Fetch Data
    const { data: requestsData, isLoading } = useQuery({
        queryKey: ['supply-requests', isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? '/supply-requests' : '/point-manager/supply-requests';
            const response = await api.get(endpoint);
            const apiData = response.data.data;

            return apiData.map((req: any): MappedSupplyRequest => ({
                id: (req.order_id || req.id || '').toString(),
                itemName: (req.medicines && req.medicines.length > 0)
                    ? req.medicines.map((m: any) => m.name).join('، ')
                    : (req.content || 'طلب إمداد'),
                quantity: (req.medicines && req.medicines.length > 0)
                    ? req.medicines.reduce((total: number, m: any) => total + m.quantity, 0)
                    : (req.total_quantity || 0),
                clinic: req.point_name || req.storage_name || "النقطة الطبية",
                requester: req.point_manager?.name || (isAdmin ? "النظام" : "أنت"),
                date: req.time_relative || new Date(req.created_at).toLocaleDateString('ar-EG', {
                    year: 'numeric', month: 'short', day: 'numeric'
                }),
                createdAt: req.created_at || new Date().toISOString(), // الإضافة هنا لتمرير التاريخ
                status: req.status,
                medicines: req.medicines || []
            }));
        }
    });

    const requests: MappedSupplyRequest[] = requestsData || [];

    // 2. Mutation for Approve / Reject
    const actionMutation = useMutation({
        mutationFn: async ({ id, action }: { id: string; action: "approve" | "reject" }) => {
            const endpoint = action === "approve" ? "approve" : "reject";
            const res = await api.post(`/supply-requests/${id}/${endpoint}`);
            return res.data;
        },
        onSuccess: (_data, variables) => {
            toast.success(variables.action === "approve" ? "تمت الموافقة بنجاح" : "تم رفض الطلب");
            queryClient.invalidateQueries({ queryKey: ["supply-requests"] });
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "حدث خطأ أثناء تنفيذ الإجراء";
            toast.error(msg);
        }
    });

    // 3. Mutation for Creating a New Request
    const createRequestMutation = useMutation({
        mutationFn: async (data: { description: string; medicines: any[] }) => {
            const res = await api.post("/point-manager/supply-requests", data);
            return res.data;
        },
        onSuccess: (data) => {
            toast.success(data.message || "تم إرسال طلب الإمداد بنجاح");
            queryClient.invalidateQueries({ queryKey: ["supply-requests"] });
            setIsAddModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "حدث خطأ أثناء إرسال الطلب");
        }
    });

    const handleAction = (e: React.MouseEvent, id: string, action: "approve" | "reject") => {
        e.stopPropagation(); // منع فتح الكارد عند الضغط على الأزرار
        actionMutation.mutate({ id, action });
    };

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    // 4. Filter and Sort Logic (تطبيق الفلترة والترتيب بالأولويات ثم التاريخ)
    const filteredRequests = requests
        .filter(req => {
            const matchesTab = activeTab === "all" ||
                (activeTab === "pending" && (req.status === "pending" || req.status === "in_progress")) ||
                (req.status === activeTab);

            const matchesSearch =
                req.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                req.clinic.includes(searchTerm);

            return matchesTab && matchesSearch;
        })
        .sort((a, b) => {
            // 1. تحديد أولوية الحالات (الرقم الأقل يظهر أولاً)
            const statusPriority: Record<string, number> = {
                pending: 1,
                in_progress: 2,
                completed: 3,
                cancelled: 4
            };

            const priorityA = statusPriority[a.status] || 5;
            const priorityB = statusPriority[b.status] || 5;

            // إذا كانت الحالة مختلفة، رتب بناءً على الأولوية
            if (priorityA !== priorityB) {
                return priorityA - priorityB;
            }

            // 2. إذا كانت الحالة متطابقة، رتب بناءً على التاريخ (الأحدث أولاً)
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

    return (
        <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">

            {/* Toolbar & Filters */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card border border-border/50 p-4 rounded-3xl shadow-sm">
                <div className="flex flex-col md:flex-row items-center gap-4 flex-1">
                    <div className="relative flex-1 w-full max-w-md">
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="بحث عن دواء أو نقطة طبية..."
                            className="pr-10 bg-muted/30 border-none rounded-2xl h-11"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {!isAdmin && (
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full md:w-auto rounded-2xl h-11 px-6 font-black gap-2 shadow-lg shadow-primary/20 cursor-pointer"
                        >
                            <Plus size={18} />
                            <span>طلب إمداد جديد</span>
                        </Button>
                    )}
                </div>

                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/50 overflow-x-auto no-scrollbar">
                    {[
                        { id: "all", label: "الكل", icon: ClipboardList },
                        { id: "pending", label: "معلقة", icon: Clock },
                        { id: "completed", label: "مكتملة", icon: CheckCircle },
                        { id: "cancelled", label: "ملغاة", icon: XCircle }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap group outline-none",
                                activeTab === tab.id ? "text-white" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabReports"
                                    className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <div className="relative z-10 flex items-center gap-2">
                                <tab.icon size={14} />
                                <span>{tab.label}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* List Container */}
            <div className="bg-card border border-border/50 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">

                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <SupplyRequestsSkeleton key="skeleton" />
                        ) : filteredRequests.length === 0 ? (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="p-20 text-center flex flex-col items-center justify-center gap-4"
                            >
                                <ClipboardList size={48} className="text-muted-foreground/20" />
                                <p className="text-muted-foreground font-bold">لا توجد طلبات حالياً</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                                className="divide-y divide-border/40"
                            >
                                {filteredRequests.map((req) => {
                                    const isExpanded = expandedId === req.id;
                                    const isPendingAction = actionMutation.isPending && actionMutation.variables?.id === req.id;
 
                                    return (
                                        <div key={req.id} className={cn("transition-colors", isExpanded ? "bg-muted/30" : "hover:bg-muted/10")}>
                                            {/* Header Row */}
                                            <div
                                                className="p-5 md:px-8 md:py-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                                                onClick={() => toggleExpand(req.id)}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-transform", getStatusColor(req.status), isExpanded && "scale-105")}>
                                                        {getStatusIcon(req.status)}
                                                    </div>

                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <h4 className="font-black text-sm md:text-base text-foreground line-clamp-1">{req.itemName}</h4>
                                                            <ChevronDown size={16} className={cn("text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
                                                        </div>
                                                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground font-bold">
                                                            <span className="flex items-center gap-1"><Hospital size={12} /> {req.clinic}</span>
                                                            <span className="flex items-center gap-1"><Calendar size={12} /> {req.date}</span>
                                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">الكمية: {req.quantity}</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    {isAdmin && (req.status === "pending" || req.status === "in_progress") ? (
                                                        <div className="flex items-center gap-2 w-full md:w-auto">
                                                            <button
                                                                onClick={(e) => handleAction(e, req.id, "approve")}
                                                                disabled={isPendingAction}
                                                                className="h-9 px-4 rounded-xl flex items-center gap-2 text-emerald-600 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white transition-all font-bold text-[11px] cursor-pointer"
                                                            >
                                                                {isPendingAction ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                                                                موافقة
                                                            </button>
                                                            <button
                                                                onClick={(e) => handleAction(e, req.id, "reject")}
                                                                disabled={isPendingAction}
                                                                className="h-9 px-4 rounded-xl flex items-center gap-2 text-red-600 bg-red-500/10 hover:bg-red-600 hover:text-white transition-all font-bold text-[11px] cursor-pointer"
                                                            >
                                                                <XCircle size={14} />
                                                                رفض
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className={cn("px-4 py-1.5 rounded-xl text-[10px] font-black border flex items-center gap-2", getStatusColor(req.status))}>
                                                            {getStatusIcon(req.status)}
                                                            {getStatusText(req.status)}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Expandable Details Section */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="overflow-hidden bg-background/40 border-t border-border/20"
                                                    >
                                                        <div className="p-6 md:px-12 space-y-6">
                                                            {/* Requester Info */}
                                                            <div className="flex items-center gap-6 text-xs border-b border-border/40 pb-4">
                                                                <div className="flex items-center gap-2">
                                                                    <User size={14} className="text-muted-foreground" />
                                                                    <span className="text-muted-foreground">صاحب الطلب:</span>
                                                                    <span className="font-bold">{req.requester}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2">
                                                                    <ClipboardList size={14} className="text-muted-foreground" />
                                                                    <span className="text-muted-foreground">رقم الطلب:</span>
                                                                    <span className="font-bold">#{req.id}</span>
                                                                </div>
                                                            </div>

                                                            {/* Medicines List */}
                                                            <div className="space-y-3">
                                                                <h5 className="text-[11px] font-black text-primary flex items-center gap-2 uppercase tracking-wider">
                                                                    <Pill size={14} />
                                                                    الأصناف المطلوبة
                                                                </h5>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                    {req.medicines.map((med, idx) => (
                                                                        <div key={idx} className="bg-card border border-border/50 p-4 rounded-2xl flex items-center justify-between shadow-sm">
                                                                            <div className="space-y-1">
                                                                                <p className="text-sm font-bold">{med.name}</p>
                                                                                <p className="text-[10px] text-muted-foreground">ID: {med.medicine_id}</p>
                                                                            </div>
                                                                            <div className="bg-primary/5 border border-primary/10 px-3 py-1 rounded-lg text-primary font-black text-xs">
                                                                                {med.quantity} وحدة
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    );
                                })}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Info */}
                <div className="px-8 py-4 bg-muted/5 border-t border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        تحديث تلقائي عبر النظام
                    </div>
                </div>
            </div>

            {/* Add Request Modal */}
            <AddSupplyRequestModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={(data) => createRequestMutation.mutate(data)}
                isLoading={createRequestMutation.isPending}
            />
        </div>
    );
}