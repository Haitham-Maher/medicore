"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    const queryClient = useQueryClient();

    // جلب البيانات بناءً على الدور
    const { data: response, isLoading } = useQuery({
        queryKey: ["Inventory-Table", isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? "/storage/items" : "/point-manager/inventory"; 
            const table = await api.get(endpoint);
            return table.data;
        }
    });

    // تحويل البيانات لتتوافق مع واجهة المستخدم
    const inventoryData: InventoryItem[] = (response?.data || []).map((item: any) => ({
        ...item,
        storage_name: item.storage_name || (isAdmin ? "المخزن المركزي" : "المخزن الحالي")
    }));

    // استخراج storage_id من أول عنصر في البيانات المحملة
    // الباك إند يُرجعه في كل عنصر من GET /storage/items
    const storageId: number | undefined = (response?.data?.[0]?.storage_id) ?? undefined;

    // إضافة صنف جديد
    // الـ Payload يُرسل مباشرة من AddInventoryModal مطابقاً للباك إند
    const addMutation = useMutation({
        mutationFn: async (newItem: any) => {
            // newItem يحتوي: name, type, quantity, storage_id (إجباري), max?, price?
            const res = await api.post("/storage/items", newItem);
            return res.data;
        },
        onSuccess: (data) => {
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