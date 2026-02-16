import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { InventoryItem } from "../types";
import { getCategoryIcon } from "../utils";

interface InventoryMobileListProps {
    data: InventoryItem[];
    selectedCategory: string;
    search: string;
}

export default function InventoryMobileList({ data, selectedCategory, search }: InventoryMobileListProps) {
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
                            const Icon = getCategoryIcon(item.category);
                            return (
                                <div
                                    key={item.id}
                                    className="p-4 space-y-4"
                                >
                                    <div className="flex gap-4">
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <div className="w-12 h-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/70 shadow-sm">
                                                <Icon size={24} />
                                            </div>
                                            <button className="w-12 h-10 flex items-center justify-center rounded-xl bg-red-500/10 text-red-600 border border-red-500/20 active:bg-red-500 active:text-white transition-all cursor-pointer shadow-sm">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                        <div className="min-w-0 flex-1 pt-0.5">
                                            <div className="flex flex-col gap-1.5">
                                                <h4 className="font-black text-foreground text-base leading-snug">{item.name}</h4>
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <span className="text-[10px] font-mono font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-lg border border-border/50">
                                                        #{item.id.split('-')[1]}
                                                    </span>
                                                    <span className="text-[10px] font-black text-primary/70 bg-primary/5 px-2.5 py-0.5 rounded-lg border border-primary/10 italic">
                                                        {item.category}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-muted/30 border border-border/40">
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider">الكمية المتوفرة</p>
                                            <div className="flex items-center gap-1.5">
                                                <span className={cn(
                                                    "font-black text-sm",
                                                    item.stock === 0 ? "text-destructive" :
                                                        item.stock < 50 ? "text-orange-500" : "text-foreground"
                                                )}>{item.stock.toLocaleString()}</span>
                                                <span className="text-[10px] text-muted-foreground font-bold">{item.unit}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider">تاريخ الانتهاء</p>
                                            <p className="text-sm font-black text-foreground">{item.expiry}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-1">
                                        <div className="flex flex-col">
                                            <p className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-wider">السعر للوحدة</p>
                                            <span className="font-black text-base text-primary">{item.price.toFixed(2)} <span className="text-[10px] font-bold">ر.س</span></span>
                                        </div>
                                        <div className={cn(
                                            "px-4 py-1.5 rounded-xl border text-[10px] font-black shadow-sm",
                                            item.status === "available" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
                                                item.status === "low_stock" ? "bg-orange-500/5 text-orange-600 border-orange-500/10" :
                                                    "bg-red-500/5 text-red-600 border-red-500/10"
                                        )}>
                                            {item.status === "available" ? "متوفر" : item.status === "low_stock" ? "منخفض" : "نفد"}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-12 text-center text-muted-foreground flex flex-col items-center gap-3">
                            <Search className="h-10 w-10 opacity-20" />
                            <span className="font-bold">لا توجد نتائج مطابقة لبحثك</span>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
