"use client";

import { useState, useEffect } from "react";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryToolbar from "./components/InventoryToolbar";
import InventoryCategoryFilters from "./components/InventoryCategoryFilters";
import InventoryDesktopTable from "./components/InventoryDesktopTable";
import InventoryMobileList from "./components/InventoryMobileList";
import InventoryPagination from "./components/InventoryPagination";
import { InventoryItem } from "./types";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export default function InventoryTable() {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("الكل");
    
    // تعريف data كمصفوفة فارغة في البداية
    const [data, setData] = useState<InventoryItem[]>([]);

    const { data: response, isLoading } = useQuery({
        queryKey: ["Inventory-Table"],
        queryFn: async () => {
            const table = await api.get("/storage/items");
            return table.data; // يُرجع كائن JSON بالكامل
        }
    });

    // 1. تصحيح مسار البيانات
    const inventoryData: InventoryItem[] = response?.data || [];

    // 2. تحديث الـ State بمجرد وصول البيانات من السيرفر
    useEffect(() => {
        if (response?.data) {
            setData(response.data);
        }
    }, [response?.data]);

    // انتبه: الـ id في الـ JSON هو رقم (Number) وليس نص (String)
    const handleDelete = (id: number | string) => {
        setData(prev => prev.filter((item) => item.id !== id));
    };

    const categories = ["الكل", "أدوية", "مستلزمات", "مضادات حيوية"];

    if (isLoading) return <InventoryTableSkeleton />;

    const filteredData = data.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        // 3. تصحيح البحث ليتم عبر item.type بدلاً من item.category
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
                inventoryData={inventoryData} // نمرر البيانات الأصلية للإحصائيات
            />

            <div className="rounded-2xl border border-border/50 overflow-hidden bg-card shadow-sm">
                <div className="hidden sm:block">
                    <InventoryDesktopTable
                        data={filteredData}
                        selectedCategory={selectedCategory}
                        search={search}
                        onDelete={handleDelete}
                    />
                </div>

                <div className="sm:hidden">
                    <InventoryMobileList
                        data={filteredData}
                        selectedCategory={selectedCategory}
                        search={search}
                        onDelete={handleDelete}
                    />
                </div>
            </div>
        </div>
    );
}