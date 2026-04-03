import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import {
    Table,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { InventoryItem } from "../types";
import { getCategoryIcon } from "../utils";
import { useState, useEffect } from "react";

interface InventoryDesktopTableProps {
    data: InventoryItem[];
    selectedCategory: string;
    search: string;
    onDelete: (id: string) => void;
}

export default function InventoryDesktopTable({ data, selectedCategory, search, onDelete }: InventoryDesktopTableProps) {
    const MotionRow = motion.create("tr");

    return (
        <div className="overflow-x-auto">
            <Table className="overflow-hidden">
                <TableHeader>
                    <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
                        <TableHead className="text-right font-bold lg:font-black text-[9px] lg:text-[10px] uppercase tracking-wider py-3 lg:py-4 pr-4 lg:pr-6 text-muted-foreground/60 hidden lg:table-cell">المعرف</TableHead>
                        <TableHead className="text-right font-bold lg:font-black text-[9px] lg:text-[10px] uppercase tracking-wider py-3 lg:py-4 pr-4 lg:pr-0 text-muted-foreground/60">اسم الصنف</TableHead>
                        <TableHead className="text-center font-bold lg:font-black text-[9px] lg:text-[10px] uppercase tracking-wider py-3 lg:py-4 text-muted-foreground/60">التصنيف</TableHead>
                        <TableHead className="text-right font-bold lg:font-black text-[9px] lg:text-[10px] uppercase tracking-wider py-3 lg:py-4 text-muted-foreground/60">الكمية</TableHead>
                        <TableHead className="text-right font-bold lg:font-black text-[9px] lg:text-[10px] uppercase tracking-wider py-3 lg:py-4 text-muted-foreground/60 hidden lg:table-cell">السعر</TableHead>
                        <TableHead className="text-center font-bold lg:font-black text-[9px] lg:text-[10px] uppercase tracking-wider py-3 lg:py-4 pl-4 lg:pl-6 text-muted-foreground/60">الحالة</TableHead>
                    </TableRow>
                </TableHeader>
                <AnimatePresence mode="wait">
                    <motion.tbody
                        key={selectedCategory + search}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="[&_tr:last-child]:border-0"
                    >
                        <AnimatePresence initial={false}>
                            {data.length > 0 ? (
                                data.map((item) => {
                                    const Icon = getCategoryIcon(item.category);
                                    return (
                                        <MotionRow
                                            // layout
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -80, scale: 0.95 }}
                                            transition={{
                                                opacity: { duration: 0.2 },
                                                layout: { type: "spring", stiffness: 500, damping: 50, mass: 1 },
                                                duration: 0.3
                                            }}
                                            key={item.id}
                                            className="group hover:bg-muted/20 transition-all border-b border-border/40 "
                                        >
                                            <TableCell className="font-mono text-[9px] text-muted-foreground/40 pr-4 lg:pr-6 hidden lg:table-cell">#{item.id.split('-')[1]}</TableCell>
                                            <TableCell className="py-3 lg:py-4 pr-4 lg:pr-0">
                                                <div className="flex items-center gap-2 lg:gap-3">
                                                    <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/70 shrink-0 group-hover:bg-primary/10 transition-colors">
                                                        <Icon className="size-4 lg:size-[18px]" />
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="font-bold lg:font-black text-[11px] lg:text-[13px] text-foreground truncate group-hover:text-primary transition-colors tracking-tight">{item.name}</span>
                                                        <span className="text-[9px] lg:text-[10px] text-muted-foreground/60 font-bold italic tracking-tighter">انتهاء: {item.expiry}</span>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="text-[9px] lg:text-[10px] font-bold lg:font-black px-2 lg:px-2.5 py-1 rounded-lg bg-secondary/50 text-muted-foreground border border-border/50 w-fit mx-auto whitespace-nowrap opacity-80">
                                                    {item.category}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5 lg:gap-2">
                                                    <span className={cn(
                                                        "font-bold lg:font-black text-[11px] lg:text-[13px] tracking-tight",
                                                        item.stock === 0 ? "text-destructive" :
                                                            item.stock < 50 ? "text-orange-500" : "text-foreground"
                                                    )}>
                                                        {item.stock.toLocaleString('en-US')}
                                                    </span>
                                                    <span className="text-[9px] lg:text-[10px] text-muted-foreground font-bold lg:font-black opacity-40">{item.unit}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-mono text-[11px] lg:text-[13px] font-bold lg:font-black text-foreground/80 hidden lg:table-cell tracking-tighter">{item.price} <span className="text-[9px] opacity-40">ر.س</span></TableCell>
                                            <TableCell className="text-center pl-4 lg:pl-6">
                                                <div className="flex justify-between items-center gap-2 lg:gap-3">
                                                    <div className={cn(
                                                        "inline-flex items-center gap-1.5 lg:gap-2 px-2 lg:px-3 py-1 lg:py-1.5 rounded-xl border text-[9px] lg:text-[10px] font-bold lg:font-black",
                                                        item.status === "available" ? "bg-emerald-500/5 text-emerald-600 border-emerald-500/10" :
                                                            item.status === "low_stock" ? "bg-orange-500/5 text-orange-600 border-orange-500/10" :
                                                                "bg-red-500/5 text-red-600 border-red-500/10"
                                                    )}>
                                                        <span className={cn(
                                                            "w-1.5 h-1.5 rounded-full",
                                                            item.status === "available" ? "bg-emerald-500" :
                                                                item.status === "low_stock" ? "bg-orange-500" : "bg-red-500"
                                                        )} />
                                                        {item.status === "available" ? "متوفر" : item.status === "low_stock" ? "منخفض" : "نفد"}
                                                    </div>

                                                    <button
                                                        onClick={() => {
                                                            onDelete(item.id)
                                                        }}
                                                        className="w-7 h-7 lg:w-8 lg:h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95" title="حذف">
                                                        <Trash2 className="size-3 lg:size-3.5" />
                                                    </button>
                                                </div>
                                            </TableCell>
                                        </MotionRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 lg:h-32 text-center text-muted-foreground font-bold text-xs lg:text-sm">
                                        <div className="flex flex-col items-center gap-2">
                                            <Search className="h-8 w-8 opacity-20" />
                                            <span>لا توجد نتائج مطابقة لبحثك</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </AnimatePresence>
                    </motion.tbody>
                </AnimatePresence>
            </Table>
        </div>
    );
}
