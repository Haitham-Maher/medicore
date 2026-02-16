"use client";

import { useState, useEffect } from "react";
import InventoryStats from "@/components/inventory/stats/InventoryStats";
import InventoryTable from "@/components/inventory/table/InventoryTable";
import { Package } from "lucide-react";
import { PageHeader } from "@/components/ui";

export default function InventoryPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 p-6 pb-20" dir="rtl">
            <PageHeader
                title="المخزون المركزي"
                description="إدارة ومراقبة المخزون الطبي لجميع النقاط والمراكز"
                icon={Package}
            />

            {/* Stats Overview */}
            <section>
                <InventoryStats isLoading={isLoading} />
            </section>

            {/* Main Inventory Content */}
            <section className="bg-card rounded-3xl border border-border/50 shadow-sm p-1">
                <div className="p-4 md:p-6">
                    <InventoryTable isLoading={isLoading} />
                </div>
            </section>
        </div>
    );
}
