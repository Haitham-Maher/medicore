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

                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
                    {[
                        { id: "all", label: "الكل" },
                        { id: "pending", label: "معلقة" },
                        { id: "approved", label: "مقبولة" },
                        { id: "rejected", label: "مرفوضة" }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={cn(
                                "px-5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                                activeTab === tab.id ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground hover:bg-muted"
                            )}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Requests List Container */}
            <div className="bg-card border border-border/50 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                <div className="p-6 border-b border-border/50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-sm shadow-primary/5">
                            <ClipboardList size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-foreground">طلبات الإمداد</h3>
                            <p className="text-xs text-muted-foreground font-medium">إدارة طلبات المستلزمات الواردة من جميع النقاط الطبية</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab + searchTerm}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="divide-y divide-border/50"
                        >
                            {filteredRequests.length === 0 ? (
                                <div className="p-20 text-center flex flex-col items-center justify-center gap-4">
                                    <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                        <ClipboardList size={40} />
                                    </div>
                                    <p className="text-muted-foreground font-bold italic">لا توجد طلبات تطابق معايير البحث</p>
                                </div>
                            ) : (
                                filteredRequests.map((req, index) => (
                                    <div
                                        key={req.id}
                                        className="p-5 sm:p-7 group relative overflow-hidden hover:bg-muted/20 transition-all border-b border-border/50 last:border-0"
                                    >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                                            <div className="flex items-start gap-5">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border-2 transition-transform group-hover:scale-105 group-hover:rotate-3 shadow-sm",
                                                    req.status === "pending" ? "bg-orange-500/10 text-orange-500 border-orange-500/20" :
                                                        req.status === "approved" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                                                            "bg-red-500/10 text-red-500 border-red-500/20"
                                                )}>
                                                    <ClipboardList size={24} />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
                                                        <h4 className="font-black text-base sm:text-lg text-foreground tracking-tight">{req.itemName}</h4>
                                                        <span className="text-[10px] sm:text-xs font-black text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/10 shadow-xs min-w-fit">
                                                            الكمية: {req.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-bold">
                                                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
                                                            <Hospital size={14} className="text-primary" />
                                                            <span>{req.clinic}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-lg">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                                                            <span>{req.requester}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 opacity-70">
                                                            <Clock size={14} />
                                                            <span>{req.date}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3 self-end sm:self-center">
                                                {req.status === "pending" ? (
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleAction(req.id, "approved")}
                                                            className="h-11 px-5 rounded-2xl flex items-center gap-2 text-emerald-600 bg-emerald-500/5 hover:bg-emerald-500 hover:text-white border border-emerald-500/10 hover:border-emerald-500 transition-all duration-300 font-black text-xs shadow-sm hover:shadow-emerald-500/20 cursor-pointer group/btn"
                                                        >
                                                            <CheckCircle size={18} className="transition-transform group-hover/btn:scale-110" />
                                                            <span>موافقة</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleAction(req.id, "rejected")}
                                                            className="h-11 px-5 rounded-2xl flex items-center gap-2 text-red-600 bg-red-500/5 hover:bg-red-500 hover:text-white border border-red-500/10 hover:border-red-500 transition-all duration-300 font-black text-xs shadow-sm hover:shadow-red-500/20 cursor-pointer group/btn"
                                                        >
                                                            <XCircle size={18} className="transition-transform group-hover/btn:scale-110" />
                                                            <span>رفض</span>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className={cn(
                                                        "px-6 py-2 rounded-2xl text-[11px] font-black border-2 flex items-center gap-2",
                                                        req.status === "approved" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/20" : "bg-red-500/5 text-red-600 border-red-500/20"
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

                {/* Footer simple pagination lookalike */}
                <div className="p-6 bg-muted/5 border-t border-border/50 flex items-center justify-between">
                    <p className="text-xs font-bold text-muted-foreground/60">يتم عرض أحدث الطلبات المستلمة</p>
                    <button className="text-xs font-black text-primary hover:underline transition-all cursor-pointer">تحميل المزيد...</button>
                </div>
            </div>
        </div>
    );
}
