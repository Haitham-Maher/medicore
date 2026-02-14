"use client";

import { useState } from "react";
import { AlertTriangle, ArrowLeft, PackageCheck, PackageX, Boxes, Pill, Droplets, Thermometer, History, FileText, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import ClinicInventorySkeleton from "../dashboard/skeletons/ClinicInventorySkeleton";

interface InventoryItem {
    id: string;
    name: string;
    stock: number;
    max: number;
    status: "good" | "low" | "critical";
    icon: any;
}

interface SupplyRequest {
    id: string;
    itemName: string;
    quantity: number;
    requester: string;
    date: string;
    status: "pending" | "approved" | "rejected";
}

const mockInventory: InventoryItem[] = [
    { id: "1", name: "قفازات طبية", stock: 85, max: 100, status: "good", icon: Boxes },
    { id: "2", name: "شاش معقم", stock: 15, max: 100, status: "low", icon: Droplets },
    { id: "3", name: "حقن أنسولين", stock: 5, max: 50, status: "critical", icon: Thermometer },
    { id: "4", name: "مسكنات (باندول)", stock: 140, max: 200, status: "good", icon: Pill },
];

const mockRequests: SupplyRequest[] = [
    { id: "Req-1", itemName: "شاش معقم", quantity: 50, requester: "د. عبد الرحمن", date: "منذ 2 ساعة", status: "pending" },
    { id: "Req-2", itemName: "حقن أنسولين", quantity: 30, requester: "الممرضة سارة", date: "منذ 5 ساعات", status: "pending" },
];

export default function ClinicInventory({
    showRequests = false,
    onViewAll,
    isLoading = false
}: {
    showRequests?: boolean;
    onViewAll?: () => void;
    isLoading?: boolean;
}) {
    if (isLoading) return <ClinicInventorySkeleton />;
    const [view, setView] = useState<"stock" | "requests">("stock");
    const [requests, setRequests] = useState(mockRequests);

    const handleAction = (id: string, action: "approved" | "rejected") => {
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: action } : req
        ));
    };

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
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div>
                        <h3 className="font-bold text-lg">الأصناف المتوفرة</h3>
                        <span className="text-sm text-muted-foreground">
                            {mockInventory.length} أصناف
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
                    {mockInventory.map((item) => (
                        <div
                            key={item.id}
                            className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
                        >
                            <div className={cn(
                                "h-12 w-12 rounded-xl border border-border/50 bg-secondary flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                                item.status === "critical" ? "text-red-500 bg-red-500/5 border-red-500/10" :
                                    item.status === "low" ? "text-orange-500 bg-orange-500/5 border-orange-500/10" :
                                        "text-green-500 bg-green-500/5 border-green-500/10"
                            )}>
                                <item.icon size={22} />
                            </div>

                            <div className="flex-1 min-w-0 space-y-1.5">
                                <div className="flex items-center justify-between gap-2">
                                    <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                                    <div className="flex items-center gap-1.5">
                                        {item.status === "critical" && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                            {item.stock} / {item.max}
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
                                        style={{ width: `${(item.stock / item.max) * 100}%` }}
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
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">مكتملة</span>
                            <span className="text-sm font-black text-foreground">12</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <PackageX size={16} className="text-red-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">نفد</span>
                            <span className="text-sm font-black text-foreground">03</span>
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
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden h-full flex flex-col">

            {/* Header with Toggle */}
            <div className="p-4 border-b border-border/50 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setView("stock")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-bold transition-all cursor-pointer",
                            view === "stock" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        الأصناف المتوفرة
                    </button>
                    <button
                        onClick={() => setView("requests")}
                        className={cn(
                            "px-3 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 cursor-pointer",
                            view === "requests" ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted"
                        )}
                    >
                        الطلبات
                        {pendingCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full">
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
                            {mockInventory.map((item) => (
                                <div
                                    key={item.id}
                                    className="p-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
                                >
                                    <div className={cn(
                                        "h-12 w-12 rounded-xl border border-border/50 bg-secondary flex items-center justify-center shrink-0 transition-transform group-hover:scale-105",
                                        item.status === "critical" ? "text-red-500 bg-red-500/5 border-red-500/10" :
                                            item.status === "low" ? "text-orange-500 bg-orange-500/5 border-orange-500/10" :
                                                "text-green-500 bg-green-500/5 border-green-500/10"
                                    )}>
                                        <item.icon size={22} />
                                    </div>

                                    <div className="flex-1 min-w-0 space-y-1.5">
                                        <div className="flex items-center justify-between gap-2">
                                            <h4 className="font-semibold text-sm truncate">{item.name}</h4>
                                            <div className="flex items-center gap-1.5">
                                                {item.status === "critical" && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                                                    {item.stock} / {item.max}
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
                                                style={{ width: `${(item.stock / item.max) * 100}%` }}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
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
                            ) : requests.map((req) => (
                                <div key={req.id} className="p-4 group relative overflow-hidden">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h4 className="font-bold text-sm text-foreground">{req.itemName}</h4>
                                            <p className="text-xs text-muted-foreground mt-1">الكمية المطلوبة: <span className="font-bold text-primary">{req.quantity}</span></p>
                                            <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                                                <span>{req.requester}</span>
                                                <span>•</span>
                                                <span>{req.date}</span>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2">
                                            {req.status === "pending" ? (
                                                <span className="px-2 py-1 rounded-md bg-orange-500/10 text-orange-600 text-[10px] font-bold border border-orange-500/20">
                                                    قيد الانتظار
                                                </span>
                                            ) : req.status === "approved" ? (
                                                <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-600 text-[10px] font-bold border border-green-500/20">
                                                    تمت الموافقة
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-600 text-[10px] font-bold border border-red-500/20">
                                                    مرفوض
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons Overlay */}
                                    {req.status === "pending" && (
                                        <div className="absolute inset-0 bg-card/90 backdrop-blur-[1px] opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3">
                                            <button
                                                onClick={() => handleAction(req.id, "approved")}
                                                className="flex items-center gap-1 bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-green-600 transition-colors transform hover:scale-105 cursor-pointer"
                                            >
                                                <CheckCircle2 size={16} />
                                                موافق
                                            </button>
                                            <button
                                                onClick={() => handleAction(req.id, "rejected")}
                                                className="flex items-center gap-1 bg-red-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm hover:bg-red-600 transition-colors transform hover:scale-105 cursor-pointer"
                                            >
                                                <XCircle size={16} />
                                                رفض
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))}
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
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">مكتملة</span>
                            <span className="text-sm font-black text-foreground">12</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="flex items-center gap-2">
                        <PackageX size={16} className="text-red-500" />
                        <div className="flex flex-col">
                            <span className="text-[10px] text-muted-foreground font-bold leading-none mb-1">نفد</span>
                            <span className="text-sm font-black text-foreground">03</span>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}
