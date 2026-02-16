"use client";

import { useState } from "react";
import InventoryTableSkeleton from "./InventoryTableSkeleton";
import InventoryToolbar from "./components/InventoryToolbar";
import InventoryCategoryFilters from "./components/InventoryCategoryFilters";
import InventoryDesktopTable from "./components/InventoryDesktopTable";
import InventoryMobileList from "./components/InventoryMobileList";
import InventoryPagination from "./components/InventoryPagination";
import { InventoryItem } from "./types";

// Mock Data
const inventoryData: InventoryItem[] = [
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
    const [selectedCategory, setSelectedCategory] = useState<string>("الكل");

    const categories = ["الكل", "أدوية", "مستلزمات", "مضادات حيوية"];

    if (isLoading) return <InventoryTableSkeleton />;

    const filteredData = inventoryData.filter((item) => {
        const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = selectedCategory === "الكل" || item.category === selectedCategory;
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
                <InventoryDesktopTable
                    data={filteredData}
                    selectedCategory={selectedCategory}
                    search={search}
                />

                <InventoryMobileList
                    data={filteredData}
                    selectedCategory={selectedCategory}
                    search={search}
                />

                <InventoryPagination
                    totalItems={inventoryData.length}
                    filteredCount={filteredData.length}
                />
            </div>
        </div>
    );
}
