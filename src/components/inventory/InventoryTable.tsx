"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    Button,
    Input,
    Badge
} from "@/components/ui";
import {
    MoreHorizontal,
    ArrowUpDown,
    Search,
    Filter,
    Plus,
    FileDown,
    Edit,
    Trash2,
    History
} from "lucide-react";
// Badge already imported above
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import InventoryTableSkeleton from "./InventoryTableSkeleton";

// Mock Data
const inventoryData = [
    {
        id: "INV-001",
        name: "باراسيتامول 500 ملغ",
        category: "أدوية",
        stock: 1200,
        unit: "علبة",
        price: 15.50,
        expiry: "2025-12-01",
        status: "available"
    },
    {
        id: "INV-002",
        name: "أموكسيسيلين 250 ملغ",
        category: "مضادات حيوية",
        stock: 45,
        unit: "زجاجة",
        price: 22.00,
        expiry: "2024-08-15",
        status: "low_stock"
    },
    {
        id: "INV-003",
        name: "شاش طبي معقم",
        category: "مستلزمات",
        stock: 0,
        unit: "قطعة",
        price: 5.00,
        expiry: "2026-01-01",
        status: "out_of_stock"
    },
    {
        id: "INV-004",
        name: "حقن أنسولين",
        category: "أدوية",
        stock: 300,
        unit: "قلم",
        price: 150.00,
        expiry: "2024-11-20",
        status: "available"
    },
    {
        id: "INV-005",
        name: "قفازات طبية (L)",
        category: "مستلزمات",
        stock: 5000,
        unit: "زوج",
        price: 0.50,
        expiry: "-",
        status: "available"
    },
];

export default function InventoryTable({ isLoading = false }: { isLoading?: boolean }) {
    const [search, setSearch] = useState("");

    if (isLoading) return <InventoryTableSkeleton />;

    const filteredData = inventoryData.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            {/* Toolbar - Optimized for Responsive Layout */}
            <div className="flex flex-col gap-4 bg-card p-4 rounded-2xl border border-border/50 shadow-sm transition-all duration-300">
                <div className="relative w-full">
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e: any) => setSearch(e.target.value)}
                        placeholder="بحث عن صنف..."
                        className="pr-10 bg-background/50 border-border/50 focus:bg-background transition-colors h-11 md:h-10"
                    />
                </div>
                <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full">
                    <Button variant="outline" size="sm" className="h-10 md:h-9 gap-2 font-medium cursor-pointer flex-1 sm:flex-none">
                        <Filter className="h-4 w-4" />
                        تصفية
                    </Button>
                    <Button variant="outline" size="sm" className="h-10 md:h-9 gap-2 font-medium cursor-pointer flex-1 sm:flex-none">
                        <FileDown className="h-4 w-4" />
                        تصدير
                    </Button>
                    <Button size="sm" className="h-10 md:h-9 gap-2 col-span-2 sm:w-auto bg-primary hover:bg-primary/90 shadow-sm cursor-pointer">
                        <Plus className="h-4 w-4" />
                        إضافة صنف
                    </Button>
                </div>
            </div>

            {/* Content Area */}
            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card shadow-sm">
                {/* Desktop/Tablet Table View (Visible on md and up) */}
                <div className="hidden md:block overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/30">
                            <TableRow>
                                <TableHead className="text-right font-bold w-[100px]">المعرف</TableHead>
                                <TableHead className="text-right font-bold">
                                    <Button variant="ghost" className="p-0 hover:bg-transparent font-bold gap-1 cursor-pointer">
                                        اسم الصنف
                                        <ArrowUpDown className="h-3 w-3" />
                                    </Button>
                                </TableHead>
                                <TableHead className="font-bold text-center">التصنيف</TableHead>
                                <TableHead className="text-right font-bold">الكمية</TableHead>
                                <TableHead className="text-right font-bold">السعر</TableHead>
                                <TableHead className="font-bold text-center">الحالة</TableHead>
                                <TableHead className="text-right font-bold w-[50px]"></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredData.map((item, index) => (
                                <motion.tr
                                    key={item.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group hover:bg-muted/30 transition-colors border-b border-border/50 last:border-0"
                                >
                                    <TableCell className="font-mono text-xs text-muted-foreground">{item.id}</TableCell>
                                    <TableCell className="font-medium text-foreground">
                                        <div className="flex flex-col">
                                            <span>{item.name}</span>
                                            <span className="text-[10px] text-muted-foreground">انتهاء: {item.expiry}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <Badge variant="outline" className="bg-background/50 text-muted-foreground font-normal">
                                            {item.category}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <span className={cn(
                                                "font-bold",
                                                item.stock === 0 ? "text-destructive" :
                                                    item.stock < 50 ? "text-orange-500" : "text-foreground"
                                            )}>
                                                {item.stock}
                                            </span>
                                            <span className="text-xs text-muted-foreground">{item.unit}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono">{item.price} ر.س</TableCell>
                                    <TableCell className="text-center">
                                        <Badge className={cn(
                                            "capitalize shadow-none border-none",
                                            item.status === "available" ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20" :
                                                item.status === "low_stock" ? "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20" :
                                                    "bg-red-500/10 text-red-600 hover:bg-red-500/20"
                                        )}>
                                            {item.status === "available" ? "متوفر" :
                                                item.status === "low_stock" ? "منخفض" : "نفد"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0 md:opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-[160px]">
                                                <DropdownMenuItem className="cursor-pointer gap-2">
                                                    <Edit className="h-4 w-4 text-muted-foreground" />
                                                    تعديل
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer gap-2">
                                                    <History className="h-4 w-4 text-muted-foreground" />
                                                    سجل الحركات
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive focus:bg-destructive/10">
                                                    <Trash2 className="h-4 w-4" />
                                                    حذف
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </motion.tr>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card List View (Visible on screens smaller than md) */}
                <div className="md:hidden divide-y divide-border/50">
                    {filteredData.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 space-y-4 active:bg-muted/50 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <h4 className="font-bold text-foreground text-base truncate ml-2">
                                        {item.name}
                                    </h4>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[10px] font-mono font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border/50">
                                            {item.id}
                                        </span>
                                        <Badge variant="outline" className="text-[10px] font-medium py-0 h-5 px-1.5 border-border/50">
                                            {item.category}
                                        </Badge>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-9 w-9 p-0 cursor-pointer hover:bg-muted rounded-full">
                                            <MoreHorizontal className="h-5 w-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[180px]">
                                        <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
                                            <Edit className="h-4 w-4 text-muted-foreground" />
                                            <span>تعديل الصنف</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="cursor-pointer gap-3 py-2.5">
                                            <History className="h-4 w-4 text-muted-foreground" />
                                            <span>سجل الحركات</span>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="cursor-pointer gap-3 py-2.5 text-destructive focus:text-destructive focus:bg-destructive/10">
                                            <Trash2 className="h-4 w-4" />
                                            <span>حذف من المخزون</span>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="grid grid-cols-2 gap-x-6 gap-y-3 p-3 rounded-xl bg-muted/30 border border-border/20">
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground/70 mb-1">الكمية المتوفرة</p>
                                    <div className="flex items-center gap-1.5">
                                        <span className={cn(
                                            "font-black text-base",
                                            item.stock === 0 ? "text-destructive" :
                                                item.stock < 50 ? "text-orange-500" : "text-foreground"
                                        )}>
                                            {item.stock}
                                        </span>
                                        <span className="text-[11px] text-muted-foreground font-medium">{item.unit}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-muted-foreground/70 mb-1">تاريخ الانتهاء</p>
                                    <p className="text-sm font-bold text-foreground">{item.expiry}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-4 pt-1">
                                <div className="flex flex-col">
                                    <p className="text-[10px] font-bold text-muted-foreground/70 mb-0.5">السعر للوحدة</p>
                                    <span className="font-mono text-sm font-black text-primary">
                                        {item.price} ر.س
                                    </span>
                                </div>
                                <Badge className={cn(
                                    "text-[10px] px-3 py-0.5 shadow-none border-none font-bold rounded-lg",
                                    item.status === "available" ? "bg-emerald-500/15 text-emerald-600" :
                                        item.status === "low_stock" ? "bg-orange-500/15 text-orange-600" :
                                            "bg-red-500/15 text-red-600"
                                )}>
                                    {item.status === "available" ? "متوفر" :
                                        item.status === "low_stock" ? "منخفض" : "نفد"}
                                </Badge>
                            </div>
                        </motion.div>
                    ))}
                    {filteredData.length === 0 && (
                        <div className="p-8 text-center text-muted-foreground italic">
                            لا يوجد نتائج تطابق البحث...
                        </div>
                    )}
                </div>

                {/* Pagination - Responsive Layout */}
                <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-4 border-t border-border/50 bg-muted/5">
                    <div className="text-xs text-muted-foreground font-medium order-2 sm:order-1">
                        عرض <strong>1-{filteredData.length}</strong> من أصل <strong>{inventoryData.length}</strong>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto order-1 sm:order-2">
                        <Button variant="outline" size="sm" disabled className="h-8 text-xs flex-1 sm:flex-none cursor-pointer">
                            السابق
                        </Button>
                        <Button variant="outline" size="sm" className="h-8 text-xs flex-1 sm:flex-none cursor-pointer">
                            التالي
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
