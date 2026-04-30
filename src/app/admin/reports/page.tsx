"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ClipboardList } from "lucide-react";
import InventoryReports from "@/components/inventory/reports/InventoryReports";
import { PageHeader } from "@/components/ui";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export default function InventoryReportsPage() {
    // const [isLoading, setIsLoading] = useState(false);

    const { data: reports, isLoading } = useQuery({
        queryKey: ['reports'],
        queryFn: async () => {
            const reports = await api.get('/inventory/alerts');
            return reports.data;
        }
    })

    const reportsData = reports || [];

    return (
        <div className="space-y-8 pb-12" dir="rtl">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
                <PageHeader
                    title="طلبات الإمداد"
                    description="إدارة واعتماد طلبات المستلزمات الطبية الواردة من جميع العيادات"
                    icon={ClipboardList}
                    regionName={reportsData.region}
                />
            </div>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                <motion.div
                    key="content"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <InventoryReports />
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
