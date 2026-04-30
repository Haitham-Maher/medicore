"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ArrowLeft, PackageCheck, PackageX, Boxes, Pill, Droplets, Thermometer, History, FileText, CheckCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ClinicInventorySkeleton from "./ClinicInventorySkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/api/axios";
import { useParams } from "next/navigation";
import { toast } from "sonner";

interface InventoryItem {
    id: string | number;
    name: string;
    quantity: number;
    stock?: number;
    max?: number;
    status?: "good" | "low" | "critical";
    icon?: any;
}

interface SupplyRequest {
    id: string;
    itemName: string;
    quantity: number;
    requester: string;
    date: string;
    status: "pending" | "approved" | "rejected";
}
 
export default function ClinicInventory({
    showRequests = false,
    onViewAll,
    isLoading = false,
    data,
    defaultView = "stock"
}: {
    showRequests?: boolean;
    onViewAll?: () => void;
    isLoading?: boolean;
    data?: InventoryItem[];
    defaultView?: "stock" | "requests";
}) {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [view, setView] = useState<"stock" | "requests">(defaultView);

    useEffect(() => {
        setView(defaultView);
    }, [defaultView]);

    // Fetch Requests
    const { data: requestsResponse, isLoading: isRequestsLoading } = useQuery({
        queryKey: ["medical-point-requests", id],
        queryFn: async () => {
            const res = await api.get(`/medical-points/${id}/point-orders`);
            return res.data.data;
        },
        enabled: showRequests
    });

    const requestsData = requestsResponse || [];

    // Handle Actions
    const actionMutation = useMutation({
        mutationFn: async ({ requestId, action }: { requestId: string | number, action: "approved" | "rejected" }) => {
            const endpoint = action === "approved" ? "approve" : "reject";
            const res = await api.post(`/supply-requests/${requestId}/${endpoint}`);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["medical-point-requests", id] });
            toast.success("تم تحديث حالة الطلب بنجاح");
        },
        onError: (error: any) => {
            const msg = error?.response?.data?.message || "فشل في تحديث حالة الطلب";
            toast.error(msg);
        }
    });

    const handleAction = (requestId: string | number, action: "approved" | "rejected") => {
        actionMutation.mutate({ requestId, action });
    };

    if (isLoading || (showRequests && view === "requests" && isRequestsLoading)) {
        return <ClinicInventorySkeleton />;
    }

    const getStatus = (quantity: number) => {
        if (quantity === 0) return "critical";
        if (quantity < 100) return "low";
        return "good";
    };

    const getIcon = (name: string) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes("pill") || lowerName.includes("para") || lowerName.includes("ibu")) return Pill;
        if (lowerName.includes("thermometer")) return Thermometer;
        if (lowerName.includes("droplet") || lowerName.includes("liquid")) return Droplets;
        if (lowerName.includes("syringe") || lowerName.includes("inj")) return Thermometer;
        return Boxes;
    };

    const items = (data || []).map(item => ({
        ...item,
        status: item.status || getStatus(item.quantity),
        icon: item.icon || getIcon(item.name),
        max: item.max || 2000 // Arbitrary max for progress bar if not provided
    }));

    // Map API orders to SupplyRequest structure
    const requests: SupplyRequest[] = requestsData.map((order: any) => {
        const medicines = order.requested_medicines || [];
        const itemName = medicines.length > 0 
            ? medicines.map((m: any) => m.name).join("، ") 
            : (order.item_name || "طلب إمدادات");
        const totalQuantity = medicines.reduce((sum: number, m: any) => sum + (m.quantity || 0), 0) || order.quantity || 0;

        return {
            id: order.id,
            itemName,
            quantity: totalQuantity,
            requester: order.manager_name || "مدير النقطة",
            status: ((): SupplyRequest["status"] => {
                switch (order.status) {
                    case "in_progress":
                    case "completed": return "approved";
                    case "cancelled": return "rejected";
                    default: return "pending";
                }
            })()
        };
    });

    const pendingCount = requests.filter(r => r.status === "pending").length;

    // Render Logic based on showRequests prop
    if (!showRequests) {
        // Simple View: Only Stock List (for Overview Tab)
        return (
            <motion.div
                initial={{ translateY: 30 }}
                animate={{ translateY: 0 }}
                transition={{ duration: .3 }}
                className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col">
                <div className="p-4 md:p-6 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-sm md:text-lg text-foreground">الأصناف المتوفرة</h3>
                        <span className="text-[10px] md:text-sm text-muted-foreground font-medium">
                            {items.length} أصناف
                        </span>
                    </div>

                    <div className="flex items-center gap-4">

                        {onViewAll && (
                            <button
                                onClick={onViewAll}
                                className="text-[11px] md:text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors cursor-pointer px-2 md:px-3 py-1 md:py-1.5 rounded-lg hover:bg-primary/5 shrink-0"
                            >
                                عرض الكل <ArrowLeft size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="divide-y divide-border/50 flex-1 overflow-y-auto">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 hover:bg-muted/30 transition-colors group"
                        >
                            {/* Header: Icon + Name (Flexible for mobile) */}
                            <div className="flex items-center gap-3 shrink-0">
                                <div className={cn(
                                    "h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-border/50 bg-secondary flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                                    item.status === "critical" ? "text-red-500 bg-red-500/5 border-red-500/10" :
                                        item.status === "low" ? "text-orange-500 bg-orange-500/5 border-orange-500/10" :
                                            "text-green-500 bg-green-500/5 border-green-500/10"
                                )}>
                                    <item.icon size={20} className="sm:size-[22px]" />
                                </div>
                                <h4 className="font-semibold text-sm truncate sm:hidden">{item.name}</h4>
                            </div>

                            {/* Body: Progress Bar & Status (Full width on mobile) */}
                            <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="hidden sm:block font-bold text-[12px] md:text-sm text-foreground truncate">{item.name}</h4>
                                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                                        {item.status === "critical" && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
                                        <span className="text-[9px] md:text-[10px] font-black text-muted-foreground/70 uppercase tracking-tighter sm:tracking-wider">
                                            {item.quantity} / {item.max}
                                        </span>
                                    </div>
                                </div>

                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <div
                                        className={cn(
                                            "h-full rounded-full transition-all duration-700",
                                            item.status === "good" ? "bg-green-500" :
                                                item.status === "low" ? "bg-orange-500" : "bg-red-500"
                                        )}
                                        style={{ width: `${(item.quantity / item.max) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-around">
                    <div className="flex items-center gap-2">
                        <PackageCheck size={16} className="text-green-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">متوفرة</span>
                            <span className="text-sm font-black text-foreground">{items.filter(i => i.status === "good").length}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <PackageX size={16} className="text-red-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">نفد / حرج</span>
                            <span className="text-sm font-black text-foreground">{items.filter(i => i.status !== "good").length}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // Full View: With Tabs and Requests (for Supplies Tab)
    return (
        <motion.div
            initial={{ translateY: 30 }}
            animate={{ translateY: 0 }}
            transition={{ duration: .3 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col w-full">

            {/* Header with Toggle */}
            <div className="p-3 md:p-4 border-b border-border/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-1 md:gap-2">
                    <button
                        onClick={() => setView("stock")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs md:text-sm font-black transition-all cursor-pointer",
                            view === "stock" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        الأصناف المتوفرة
                    </button>
                    <button
                        onClick={() => setView("requests")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-xs md:text-sm font-black transition-all flex items-center gap-2 cursor-pointer",
                            view === "requests" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        الطلبات
                        {pendingCount > 0 && (
                            <span className="bg-red-500 text-white text-[9px] md:text-[10px] w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-full font-black animate-pulse">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {view === "stock" ? (
                        <motion.div
                            key="stock"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="divide-y divide-border/50 h-full overflow-y-auto"
                        >
                            {items.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-muted/30 transition-colors group"
                                >
                                    {/* Header: Icon + Name + Quick Stats for mobile */}
                                    <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0">
                                        <div className="flex items-center gap-3">
                                            <div className={cn(
                                                "h-10 w-10 sm:h-12 sm:w-12 rounded-xl border border-border/50 bg-secondary flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                                                item.status === "critical" ? "text-red-500 bg-red-500/5 border-red-500/10" :
                                                    item.status === "low" ? "text-orange-500 bg-orange-500/5 border-orange-500/10" :
                                                        "text-green-500 bg-green-500/5 border-green-500/10"
                                            )}>
                                                <item.icon size={20} className="sm:size-[22px]" />
                                            </div>
                                            <h4 className="font-semibold text-sm truncate sm:hidden">{item.name}</h4>
                                        </div>

                                        {/* Actions: Mobile only visible actions or kept separate */}
                                        <div className="flex items-center gap-1 sm:hidden">
                                            <button className="p-2 rounded-lg bg-primary/5 text-primary">
                                                <History size={14} />
                                            </button>
                                            <button className="p-2 rounded-lg bg-primary/5 text-primary">
                                                <ArrowLeft size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Body: Full Width Progress Bar & Stats */}
                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="hidden sm:block font-bold text-[12px] md:text-sm text-foreground truncate">{item.name}</h4>
                                            <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                                                {item.status === "critical" && <AlertTriangle size={12} className="text-red-500 animate-pulse" />}
                                                <span className="text-[9px] md:text-[10px] font-black text-muted-foreground/70 uppercase tracking-tighter sm:tracking-wider">
                                                    {item.quantity} / {item.max}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={cn(
                                                    "h-full rounded-full transition-all duration-700",
                                                    item.status === "good" ? "bg-green-500" :
                                                        item.status === "low" ? "bg-orange-500" : "bg-red-500"
                                                )}
                                                style={{ width: `${(item.quantity / item.max) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    {/* Actions: Desktop only */}
                                    <div className="hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer">
                                            <History size={16} />
                                        </button>
                                        <button className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors cursor-pointer">
                                            <ArrowLeft size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    ) : (
                        <motion.div
                            key="requests"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="divide-y divide-border/50 h-full overflow-y-auto"
                        >
                            {requests.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                                    <FileText size={48} className="opacity-20 mb-4" />
                                    <p className="text-sm">لا توجد طلبات معلقة</p>
                                </div>
                            ) : (
                                requests.map((req) => (
                                    <div key={req.id} className="p-4 group relative overflow-hidden">
                                        <div className="flex items-start justify-between gap-4">
                                            <div>
                                                <h4 className="font-bold text-[13px] md:text-sm text-foreground">{req.itemName}</h4>
                                                <p className="text-[10px] md:text-xs text-muted-foreground mt-0.5">الكمية المطلوبة: <span className="font-black text-primary">{req.quantity}</span></p>
                                                <div className="flex items-center gap-2 mt-1.5 text-[9px] md:text-[10px] text-muted-foreground/60 font-bold">
                                                    <span>{req.requester}</span>
                                                    <span className="opacity-30">•</span>
                                                    <span>{req.date}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center self-end sm:self-center">
                                                {req.status === "pending" ? (
                                                    <div className="flex items-center gap-1.5 md:gap-2">
                                                        <button
                                                            onClick={() => handleAction(req.id, "approved")}
                                                            title="موافقة"
                                                            className="w-9 h-9 sm:w-auto sm:h-10 sm:px-4 rounded-xl flex items-center justify-center gap-2 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 hover:border-emerald-500 transition-all duration-300 font-bold text-xs shadow-sm hover:shadow-emerald-500/20 cursor-pointer group/btn shrink-0"
                                                        >
                                                            <CheckCircle size={16} className="transition-transform group-hover/btn:scale-110" />
                                                            <span className="hidden sm:inline">موافقة</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.id, "rejected")}
                                                            title="رفض"
                                                            className="w-9 h-9 sm:w-auto sm:h-10 sm:px-4 rounded-xl flex items-center justify-center gap-2 text-red-600 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-red-500 transition-all duration-300 font-bold text-xs shadow-sm hover:shadow-red-500/20 cursor-pointer group/btn shrink-0"
                                                        >
                                                            <XCircle size={16} className="transition-transform group-hover/btn:scale-110" />
                                                            <span className="hidden sm:inline">رفض</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={cn(
                                                        "px-3 py-1.5 rounded-xl text-[10px] font-bold border flex items-center gap-2",
                                                        req.status === "approved" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" : "bg-red-500/5 text-red-600 border-red-500/20"
                                                    )}>
                                                        {req.status === "approved" ? (
                                                            <>
                                                                <CheckCircle size={12} />
                                                                تمت الموافقة
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle size={12} />
                                                                مرفوض
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Simplified Footer - Only show generic stats for stock view, or hide for requests to keep it clean */}
            {view === "stock" && (
                <div className="p-4 bg-muted/20 border-t border-border/50 flex items-center justify-around">
                    <div className="flex items-center gap-2">
                        <PackageCheck size={16} className="text-green-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">متوفرة</span>
                            <span className="text-sm font-black text-foreground">{items.filter(i => i.status === "good").length}</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <PackageX size={16} className="text-red-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">نفد / حرج</span>
                            <span className="text-sm font-black text-foreground">{items.filter(i => i.status !== "good").length}</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
