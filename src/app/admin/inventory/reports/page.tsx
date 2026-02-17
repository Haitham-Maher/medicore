"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";
import InventoryReports from "@/components/inventory/reports/InventoryReports";
import SupplyRequestsSkeleton from "@/components/inventory/reports/SupplyRequestsSkeleton";
import { PageHeader } from "@/components/ui";

export default function InventoryReportsPage() {
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="space-y-8 pb-12" dir="rtl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <PageHeader 
                    title="طلبات الإمداد"
                    description="إدارة واعتماد طلبات المستلزمات الطبية الواردة من جميع العيادات"
                    icon={ClipboardList}
                />
            </div>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    <motion.div
                        key="loader"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <SupplyRequestsSkeleton />
                    </motion.div>
                ) : (
                    <motion.div
                        key="content"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    >
                        <InventoryReports />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
