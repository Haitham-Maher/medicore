"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import InventoryStats from "@/components/inventory/InventoryStats";
import InventoryTable from "@/components/inventory/InventoryTable";
import { Button } from "@/components/ui";

export default function InventoryPage() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 p-6 pb-20">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">المخزون المركزي</h1>
                    <p className="text-muted-foreground mt-4 text-sm">
                        إدارة ومراقبة المخزون الطبي لجميع النقاط والمراكز
                    </p>
                </div>
            </div>

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
