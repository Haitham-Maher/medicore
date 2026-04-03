"use client";

import { useState } from "react";
import {
    Clock,
    CheckCircle,
    XCircle,
    ClipboardList,
    Hospital,
    History,
    Search,
    Filter
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Button, Input } from "@/components/ui";

interface SupplyRequest {
    id: string;
    itemName: string;
    quantity: number;
    clinic: string;
    requester: string;
    date: string;
    status: "pending" | "approved" | "rejected";
}

const mockRequests: SupplyRequest[] = [
    { id: "REQ-001", itemName: "باراسيتامول 500ملغ", quantity: 500, clinic: "نقطة الشفاء", requester: "د. أحمد كمال", date: "منذ ساعتين", status: "pending" },
    { id: "REQ-002", itemName: "قفازات طبية (M)", quantity: 1000, clinic: "مركز الأمل", requester: "ممرضة سارة", date: "منذ 5 ساعات", status: "pending" },
    { id: "REQ-003", itemName: "شاش معقم", quantity: 200, clinic: "نقطة الجنوب", requester: "د. خالد منصور", date: "أمس", status: "approved" },
    { id: "REQ-004", itemName: "أنسولين سريع المفعول", quantity: 50, clinic: "نقطة الشفاء", requester: "د. مريم علي", date: "منذ يومين", status: "rejected" },
];

export default function InventoryReports() {
    const [activeTab, setActiveTab] = useState<"all" | "pending" | "approved" | "rejected">("all");
    const [requests, setRequests] = useState(mockRequests);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredRequests = requests.filter(req => {
        const matchesTab = activeTab === "all" || req.status === activeTab;
        const matchesSearch = req.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            req.clinic.includes(searchTerm);
        return matchesTab && matchesSearch;
    });

    const handleAction = (id: string, action: "approved" | "rejected") => {
        setRequests(prev => prev.map(req =>
            req.id === id ? { ...req, status: action } : req
        ));
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500" dir="rtl">
            {/* Toolbar Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card border border-border/50 p-4 rounded-3xl shadow-sm">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="بحث عن طلب أو نقطة طبية..."
                        className="pr-10 bg-muted/30 border-none rounded-2xl h-11 focus-visible:ring-primary/20"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-2xl border border-border/50 overflow-x-auto no-scrollbar pb-0 md:pb-0" dir="rtl">
                    {[
                        { id: "all", label: "الكل", icon: ClipboardList },
                        { id: "pending", label: "معلقة", icon: Clock },
                        { id: "approved", label: "مقبولة", icon: CheckCircle },
                        { id: "rejected", label: "مرفوضة", icon: XCircle }
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
                                {/* Active Background Indicator */}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-xl shadow-lg shadow-primary/20"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}

                                {/* Button Content */}
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
                                        isActive
                                            ? "bg-white/20 text-primary-foreground backdrop-blur-md"
                                            : "bg-muted text-muted-foreground border border-border/50 group-hover:border-primary/30"
                                    )}>
                                        {count}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Requests List Container */}
            <div className="bg-card border border-border/50 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-6 md:p-5 border-b border-border/50 flex items-center justify-between bg-linear-to-b from-muted/20 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-xs">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h3 className="text-lg font-black text-foreground">طلبات الإمداد</h3>
                            <p className="text-[11px] text-muted-foreground font-bold opacity-80 mt-0.5">إدارة ومتابعة طلبات المستلزمات الطبية</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + searchTerm}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.3 }}
                            className="divide-y divide-border/40"
                        >
                            {filteredRequests.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center justify-center gap-5">
                                    <div className="w-16 h-16 rounded-3xl bg-muted/30 flex items-center justify-center text-muted-foreground/20">
                                        <ClipboardList size={32} />
                                    </div>
                                    <p className="text-muted-foreground font-black italic text-sm">لا توجد طلبات تطابق معايير البحث</p>
                                </div>
                            ) : (
                                filteredRequests.map((req, index) => (
                                    <div
                                        key={req.id}
                                        className="p-5 md:px-8 md:py-6 group relative overflow-hidden hover:bg-muted/30 transition-all duration-300"
                                    >
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            {/* Item Info Side */}
                                            <div className="flex items-start gap-4">
                                                <div className={cn(
                                                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-500 shadow-xs",
                                                    req.status === "pending" ? "bg-orange-500/5 text-orange-600 border-orange-500/10" :
                                                        req.status === "approved" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
                                                            "bg-red-500/5 text-red-600 border-red-500/10"
                                                )}>
                                                    <ClipboardList size={20} />
                                                </div>

                                                <div className="space-y-2.5">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <h4 className="font-black text-base text-foreground tracking-tight group-hover:text-primary transition-colors">{req.itemName}</h4>
                                                        <span className="text-[9px] font-black tracking-widest uppercase bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-lg border border-border/50">
                                                            {req.id}
                                                        </span>
                                                        <span className="text-[10px] font-black text-primary bg-primary/5 px-2.5 py-0.5 rounded-full border border-primary/10">
                                                            الكمية: {req.quantity}
                                                        </span>
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

                                            {/* Actions / Status Side */}
                                            <div className="flex items-center gap-3 md:self-center">
                                                {req.status === "pending" ? (
                                                    <div className="flex items-center gap-2 w-full md:w-auto">
                                                        <button
                                                            onClick={() => handleAction(req.id, "approved")}
                                                            className="flex-1 md:flex-none h-9 px-5 rounded-xl flex items-center justify-center gap-2 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 hover:border-emerald-500 transition-all duration-300 font-black text-[11px] cursor-pointer group/btn active:scale-95"
                                                        >
                                                            <CheckCircle size={16} />
                                                            <span>موافقة</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.id, "rejected")}
                                                            className="flex-1 lg:flex-none h-9 px-5 rounded-xl flex items-center justify-center gap-2 text-red-600 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/20 hover:border-red-500 transition-all duration-300 font-black text-[11px] cursor-pointer group/btn active:scale-95"
                                                        >
                                                            <XCircle size={16} />
                                                            <span>رفض</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={cn(
                                                        "px-5 py-2 rounded-xl text-[10px] font-black border flex items-center gap-2 shadow-xs whitespace-nowrap",
                                                        req.status === "approved" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" : "bg-red-500/5 text-red-600 border-red-500/10"
                                                    )}>
                                                        {req.status === "approved" ? (
                                                            <>
                                                                <CheckCircle size={14} />
                                                                تمت الموافقة
                                                            </>
                                                        ) : (
                                                            <>
                                                                <XCircle size={14} />
                                                                تم الرفض
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
                    </AnimatePresence>
                </div>

                {/* Footer status bar */}
                <div className="px-8 py-4 bg-muted/5 border-t border-border/50 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground/60 tracking-tight">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                        يتم التحديث بشكل تلقائي بكل جديد
                    </div>
                </div>
            </div>
        </div>
    );
}
