"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Trash2, XCircle } from "lucide-react";

import api from "@/api/axios";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryToolbar from "./components/InventoryToolbar";
import InventoryCategoryFilters from "./components/InventoryCategoryFilters";
import InventoryDesktopTable from "./components/InventoryDesktopTable";
import InventoryMobileList from "./components/InventoryMobileList";
import { InventoryItem } from "./types";
import EditInventoryModal from "./components/EditInventoryModal";

// ----------------------------------------------------------------------
// المكون الأساسي (Main Component)
// ----------------------------------------------------------------------

interface InventoryTableProps {
    isAdmin?: boolean;
}

export default function InventoryTable({ isAdmin = true }: InventoryTableProps) {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("الكل")

    // جلب البيانات بناءً على الدور
    const { data: response, isLoading } = useQuery({
        queryKey: ["Inventory-Table", isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? "/inventory/items" : "/point-manager/inventory";
            const table = await api.get(endpoint);
            return table.data;
        }
    });

    // تحويل البيانات لتتوافق مع واجهة المستخدم
    const inventoryData: InventoryItem[] = isAdmin
        ? (response?.data || []).flatMap((medicine: any) => {
            // إذا لم تكن هناك صيدليات مرتبطة، نعرض الدواء بكمية صفر
            if (!medicine.pharmacies || medicine.pharmacies.length === 0) {
                return [{
                    ...medicine,
                    quantity: 0,
                    storage_id: null,
                    storage_name: "غير متوفر في أي مخزن"
                }];
            }

            // إنشاء سطر لكل صيدلية يوجد فيها الدواء
            return medicine.pharmacies.map((pharmacy: any) => ({
                ...medicine,
                id: medicine.id,
                quantity: pharmacy.quantity,
                storage_id: pharmacy.pharmacy_id,
                storage_name: `صيدلية #${pharmacy.pharmacy_id}`
            }));
        })
        : (response?.data || []).map((item: any) => ({
            ...item,
            storage_name: "المخزن الحالي" // للمدير نستخدم اسم افتراضي
        }));

    const categories = ["الكل", "tablet", "syrup", "Ointment", "Capsule", "injection"];

    if (isLoading) return <InventoryTableSkeleton />;

    const filteredData = inventoryData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "الكل" || item.type === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-4">
            <InventoryToolbar search={search} setSearch={setSearch} />

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
        </div>
    );
}