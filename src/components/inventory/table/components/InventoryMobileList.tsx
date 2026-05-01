import { motion, AnimatePresence } from "framer-motion";
import { Pencil, Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryItem } from "../types";
import { getCategoryIcon } from "../utils";

interface InventoryMobileListProps {
    data: InventoryItem[];
    selectedCategory: string;
    search: string;
    isAdmin?: boolean;
}

export default function InventoryMobileList({ data, selectedCategory, search, isAdmin = true }: InventoryMobileListProps) {
    return (
        <div className="md:hidden">
            <AnimatePresence mode="wait">
                <motion.div
                    key={selectedCategory + search}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="divide-y divide-border/50"
                >
                    {data.length > 0 ? (
                        data.map((item) => {
                            // تم التعديل لاستخدام type بدلاً من category
                            const Icon = getCategoryIcon(item.type);

                            // استنتاج الحالة بناءً على الكمية
                            const status = item.quantity === 0 ? "out_of_stock" : 
                                           item.quantity <= 150 ? "critical" :
                                           item.quantity < 400 ? "low_stock" : "available";

                            return (
                                <div
                                    key={`${item.id}-${item.storage_id}`}
                                    className="p-3 sm:p-4 space-y-3 sm:space-y-4"
                                >
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        {/* Icon - Right */}
                                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/70 shadow-xs shrink-0">
                                            <Icon className="size-5 sm:size-6" />
                                        </div>

                                        {/* Info - Middle */}
                                        <div className="min-w-0 flex-1">
                                            <h4 className="font-bold text-foreground text-[12px] sm:text-[13px] leading-tight tracking-tight mb-0.5">{item.name}</h4>
                                            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                                                <span className="text-[7px] sm:text-[8px] font-mono font-medium text-muted-foreground/40 bg-muted/20 px-1.5 py-0.5 rounded-lg border border-border/20">
                                                    #{item.id}
                                                </span>
                                                <span className="text-[7px] sm:text-[8px] font-bold text-primary/60 bg-primary/5 px-2 py-0.5 rounded-lg border border-primary/10 italic">
                                                    {item.type}
                                                </span>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="grid grid-cols-2 gap-2 sm:gap-3 p-1 px-2 rounded-xl sm:rounded-2xl bg-muted/30 border border-border/40">
                                        <div className="space-y-0.5 sm:space-y-1">
                                            <p className="text-[7px] sm:text-[8px] font-medium text-muted-foreground/60 uppercase tracking-wider">الكمية المتوفرة</p>
                                            <div className="flex items-center gap-1 sm:gap-1.5">
                                                <span className={cn(
                                                    "font-bold text-[11px] sm:text-xs",
                                                    item.quantity === 0 ? "text-red-500" :
                                                    item.quantity <= 150 ? "text-orange-500" :
                                                    item.quantity < 400 ? "text-amber-500" : 
                                                    "text-emerald-500"
                                                )}>{item.quantity.toLocaleString('en-US')}</span>
                                                <span className="text-[7px] sm:text-[8px] text-muted-foreground font-medium opacity-50">وحدة</span>
                                            </div>
                                        </div>
                                        <div className="space-y-0.5 sm:space-y-1">
                                            {/* تم التعديل لعرض المخزن بدلاً من تاريخ الانتهاء الوهمي */}
                                            <p className="text-[7px] sm:text-[8px] font-medium text-muted-foreground/50 uppercase tracking-wider">المخزن</p>
                                            <p className="text-[11px] sm:text-[12px] font-bold text-foreground truncate">{item.storage_name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-0.5 sm:pt-1">
                                        <div className="flex flex-col">
                                            <p className="text-[7px] sm:text-[8px] font-medium text-muted-foreground/60 uppercase tracking-widest mb-0.5">سعر الوحدة</p>
                                            <span className="font-bold text-xs sm:text-sm text-primary/80 tracking-tighter">{item.price} <span className="text-[8px] font-medium">$</span></span>
                                        </div>
                                        <div className={cn(
                                            "px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg sm:rounded-xl border text-[8px] sm:text-[9px] font-bold shadow-sm",
                                            status === "available" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
                                            status === "low_stock" ? "bg-amber-500/5 text-amber-600 border-amber-500/10" :
                                            status === "critical" ? "bg-orange-500/5 text-orange-600 border-orange-500/10" :
                                            "bg-red-500/5 text-red-600 border-red-500/10"
                                        )}>
                                            {status === "available" ? "جيد" : 
                                             status === "low_stock" ? "منخفض" : 
                                             status === "critical" ? "على وشك النفاذ" : "نفد"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 sm:p-12 text-center text-muted-foreground flex flex-col items-center gap-2 sm:gap-3">
                            <Search className="size-8 sm:size-10 opacity-20" />
                            <span className="font-bold text-xs sm:text-sm">لا توجد نتائج مطابقة لبحثك</span>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}