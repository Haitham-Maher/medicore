"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft } from "lucide-react";

import api from "@/api/axios";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryToolbar from "./components/InventoryToolbar";
import InventoryCategoryFilters from "./components/InventoryCategoryFilters";
import InventoryDesktopTable from "./components/InventoryDesktopTable";
import InventoryMobileList from "./components/InventoryMobileList";
import { InventoryItem } from "./types";
import AddInventoryModal from "./components/AddInventoryModal";

// ----------------------------------------------------------------------
// المكون الأساسي (Main Component)
// ----------------------------------------------------------------------

interface InventoryTableProps {
    isAdmin?: boolean;
}

export default function InventoryTable({ isAdmin = true }: InventoryTableProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const queryClient = useQueryClient();

    // جلب البيانات بناءً على الدور مع دعم الـ Pagination
    const { data: response, isLoading } = useQuery({
        queryKey: ["Inventory-Table", isAdmin, currentPage],
        queryFn: async () => {
            const endpoint = isAdmin ? "/storage/items" : "/point-manager/inventory";
            const table = await api.get(endpoint, { params: { page: currentPage } });
            return table.data;
        }
    });

    // تحويل البيانات لتتوافق مع واجهة المستخدم
    const inventoryData: InventoryItem[] = (response?.data || []).map((item: any) => ({
        ...item,
        storage_name: item.storage_name || (isAdmin ? "المخزن المركزي" : "المخزن الحالي")
    }));

    // بيانات الـ Pagination من الـ API
    const pagination = response?.pagination;
    const totalPages = pagination?.total_pages || 1;
    const totalItems = pagination?.total || inventoryData.length;

    // استخراج storage_id من أول عنصر في البيانات المحملة
    const storageId: number | undefined = (response?.data?.[0]?.storage_id) ?? undefined;

    // إضافة صنف جديد
    const addMutation = useMutation({
        mutationFn: async (newItem: any) => {
            const res = await api.post("/storage/items", newItem);
            return res.data;
        },
        onSuccess: (data) => {
            // الانتقال للصفحة الأخيرة لعرض العنصر الجديد
            queryClient.invalidateQueries({ queryKey: ["Inventory-Table"] });
            toast.success(data.message || "تم إضافة الصنف إلى المخزون المركزي بنجاح");
            setIsAddModalOpen(false);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "حدث خطأ أثناء إضافة الصنف");
        }
    });

    const categories = ["الكل", "tablet", "syrup", "injection"];

    if (isLoading) return <InventoryTableSkeleton />;

    const filteredData = inventoryData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "الكل" || item.type === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-4">
            <InventoryToolbar
                search={search}
                setSearch={setSearch}
                isAdmin={isAdmin}
                onAdd={() => setIsAddModalOpen(true)}
            />

            <InventoryCategoryFilters
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                inventoryData={inventoryData}
            />

            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card shadow-sm">
                <div className="hidden sm:block">
                    <InventoryDesktopTable
                        data={filteredData}
                        selectedCategory={selectedCategory}
                        search={search}
                        isAdmin={isAdmin}
                    />
                </div>

                <div className="sm:hidden">
                    <InventoryMobileList
                        data={filteredData}
                        selectedCategory={selectedCategory}
                        search={search}
                        isAdmin={isAdmin}
                    />
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 gap-3 border-t border-border/50 bg-muted/5">
                        <p className="text-xs font-bold text-muted-foreground order-2 sm:order-1">
                            الصفحة {currentPage} من {totalPages} — إجمالي {totalItems} صنف
                        </p>
                        <div className="flex items-center gap-2 order-1 sm:order-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="h-8 px-3 flex items-center gap-1 rounded-lg border border-border/50 text-[11px] font-bold hover:bg-muted/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronRight size={14} />
                                السابق
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                                        if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push("...");
                                        acc.push(p);
                                        return acc;
                                    }, [])
                                    .map((p, i) =>
                                        p === "..." ? (
                                            <span key={`dots-${i}`} className="text-[11px] text-muted-foreground px-1">…</span>
                                        ) : (
                                            <button
                                                key={p}
                                                onClick={() => setCurrentPage(p as number)}
                                                className={`w-8 h-8 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${currentPage === p
                                                        ? "bg-primary text-white shadow-sm"
                                                        : "border border-border/50 hover:bg-muted/50"
                                                    }`}
                                            >
                                                {p}
                                            </button>
                                        )
                                    )}
                            </div>

                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="h-8 px-3 flex items-center gap-1 rounded-lg border border-border/50 text-[11px] font-bold hover:bg-muted/50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                            >
                                التالي
                                <ChevronLeft size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* موديل الإضافة — يستقبل storageId المستخرج من بيانات GET */}
            <AddInventoryModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={(newItem) => addMutation.mutate(newItem)}
                isLoading={addMutation.isPending}
                storageId={storageId}
            />
        </div>
    );
}
