"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Building2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MedicalPointsGridSkeleton from "@/components/medical-points/skeletons/MedicalPointsGridSkeleton";
import MedicalPointsTableSkeleton from "@/components/medical-points/skeletons/MedicalPointsTableSkeleton";
import { PageHeader } from "@/components/ui";
import AddMedicalPointModal from "@/components/medical-points/modals/AddMedicalPointModal";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { MedicalPointCard } from "@/components/medical-points/MedicalPointCard";
import { MedicalPointsTableView } from "@/components/medical-points/MedicalPointsTableView";
import { MedicalPointsControls } from "@/components/medical-points/MedicalPointsControls";

import { MedicalPointsStats } from "@/components/medical-points/MedicalPointsStats";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export default function MedicalPointsPage() {
    const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPoint, setSelectedPoint] = useState<any>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // 1. جلب ملخص البيانات (Stats)
    const { data: summaryResponse, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["manager-departments-summary"],
        queryFn: async () => {
            const res = await api.get("/point-manager/departments/summary");
            return res.data;
        }
    });

    // 2. جلب قائمة الأقسام الكاملة
    const { data: listResponse, isLoading: isListLoading } = useQuery({
        queryKey: ["manager-departments-list"],
        queryFn: async () => {
            const res = await api.get("/point-manager/departments-detailed");
            return res.data;
        }
    });

    const isLoading = isSummaryLoading || isListLoading;
    const departments = listResponse?.data || [];
    const summaryData = summaryResponse?.data;

    const filteredPoints = departments.filter((point: any) => {
        const query = searchQuery.toLowerCase().trim();
        return (
            point.name.toLowerCase().includes(query) ||
            (point.location?.toLowerCase().includes(query) ?? false)
        );
    });

    const handleDeletePoint = async () => {
        if (!selectedPoint) return;
        setIsDeleting(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        setSelectedPoint(null);
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="إدارة الأقسام الطبية"
                    description="إدارة ومتابعة جميع الأقسام الطبية"
                    icon={Building2}
                />
            </div>

            {/* Stats Bar */}
            <MedicalPointsStats summary={summaryData} points={departments} isLoading={isLoading} isAdmin={false} />

            {/* Controls Bar */}
            <MedicalPointsControls
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                isAdmin={false}
            />

            {/* Content Area */}
            <AnimatePresence mode="wait">
                {isLoading ? (
                    viewMode === "grid" ? (
                        <MedicalPointsGridSkeleton key="grid-skeleton" />
                    ) : (
                        <MedicalPointsTableSkeleton key="table-skeleton" />
                    )
                ) : (
                    viewMode === "grid" ? (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {filteredPoints.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <AnimatePresence mode="popLayout">
                                        {filteredPoints.map((point: any, i: number) => (
                                            <motion.div
                                                key={point.id}
                                                layout
                                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                transition={{
                                                    duration: 0.25,
                                                    delay: i * 0.05,
                                                    layout: { type: "spring", stiffness: 400, damping: 40 },
                                                }}
                                            >
                                                <MedicalPointCard
                                                    point={point}
                                                    onDelete={(p: any) => {
                                                        setSelectedPoint(p);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                    isAdmin={false}
                                                />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0 }}
                                    className="flex flex-col items-center justify-center py-20 gap-4 text-center"
                                >
                                    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground/40">
                                        <Building2 size={32} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-foreground mb-1">لا توجد نتائج</p>
                                        <p className="text-sm text-muted-foreground">
                                            لم يتم العثور على أقسام تطابق &quot;<span className="text-primary font-medium">{searchQuery}</span>&quot;
                                        </p>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ) : (
                        <MedicalPointsTableView
                            key="table"
                            points={filteredPoints}
                            onDelete={(p: any) => {
                                setSelectedPoint(p);
                                setIsDeleteModalOpen(true);
                            }}
                            isAdmin={false}
                            searchQuery={searchQuery}
                        />
                    )
                )}
            </AnimatePresence>

            <AddMedicalPointModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                title="إضافة قسم طبي"
                isAdmin={false}
            />

            <DeleteConfirmation
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeletePoint}
                title="حذف النقطة الطبية"
                description={`هل أنت متأكد من رغبتك في حذف "${selectedPoint?.name}"؟ سيتم حذف جميع البيانات المتعلقة بهذه النقطة ولا يمكن التراجع عن هذا الإجراء.`}
                isLoading={isDeleting}
            />
        </div>
    );
}
