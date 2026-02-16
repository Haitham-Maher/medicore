import { motion, AnimatePresence } from "framer-motion";
import { Search, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui";
import { cn } from "@/lib/utils";
import { InventoryItem } from "../types";
import { getCategoryIcon } from "../utils";

interface InventoryDesktopTableProps {
    data: InventoryItem[];
    selectedCategory: string;
    search: string;
}

export default function InventoryDesktopTable({ data, selectedCategory, search }: InventoryDesktopTableProps) {
    return (
        <div className="hidden md:block overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/30 border-b border-border/50 hover:bg-muted/30">
                        <TableHead className="text-right font-black text-[11px] uppercase tracking-wider py-4 pr-6 text-muted-foreground">المعرف</TableHead>
                        <TableHead className="text-right font-black text-[11px] uppercase tracking-wider py-4 text-muted-foreground">اسم الصنف</TableHead>
                        <TableHead className="text-center font-black text-[11px] uppercase tracking-wider py-4 text-muted-foreground">التصنيف</TableHead>
                        <TableHead className="text-right font-black text-[11px] uppercase tracking-wider py-4 text-muted-foreground">الكمية</TableHead>
                        <TableHead className="text-right font-black text-[11px] uppercase tracking-wider py-4 text-muted-foreground">السعر</TableHead>
                        <TableHead className="text-center font-black text-[11px] uppercase tracking-wider py-4 pl-6 text-muted-foreground">الحالة</TableHead>
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
                        {data.length > 0 ? (
                            data.map((item) => {
                                const Icon = getCategoryIcon(item.category);
                                return (
                                    <TableRow
                                        key={item.id}
                                        className="group hover:bg-muted/20 transition-all border-b border-border/40"
                                    >
                                        <TableCell className="font-mono text-[10px] text-muted-foreground/70 pr-6">#{item.id.split('-')[1]}</TableCell>
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-9 h-9 rounded-lg bg-primary/5 border border-primary/10 flex items-center justify-center text-primary/70 shrink-0">
                                                        <Icon size={18} />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="font-bold text-sm text-foreground truncate">{item.name}</span>
                                                    <span className="text-[10px] text-muted-foreground font-medium italic">انتهاء: {item.expiry}</span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <div className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-secondary/50 text-muted-foreground border border-border/50 will-change-contents w-fit mx-auto">
                                                {item.category}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "font-black text-sm",
                                                    item.stock === 0 ? "text-destructive" :
                                                        item.stock < 50 ? "text-orange-500" : "text-foreground"
                                                )}>
                                                    {item.stock.toLocaleString()}
                                                </span>
                                                <span className="text-[11px] text-muted-foreground font-medium">{item.unit}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-mono text-sm font-bold text-foreground/80">{item.price} <span className="text-[10px]">ر.س</span></TableCell>
                                        <TableCell className="text-center pl-6">
                                            <div className="flex justify-between items-center gap-3">
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black",
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
                                                <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all cursor-pointer shadow-sm active:scale-95" title="حذف">
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground font-bold">
                                    <div className="flex flex-col items-center gap-2">
                                        <Search className="h-8 w-8 opacity-20" />
                                        <span>لا توجد نتائج مطابقة لبحثك</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </motion.tbody>
                </AnimatePresence>
            </Table>
        </div>
    );
}
