"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Building2,
  Star,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MedicalPointsGridSkeleton from "@/components/medical-points/skeletons/MedicalPointsGridSkeleton";
import MedicalPointsTableSkeleton from "@/components/medical-points/skeletons/MedicalPointsTableSkeleton";
import StatsBarSkeleton from "@/components/medical-points/skeletons/StatsBarSkeleton";
import { PageHeader } from "@/components/ui";
import { StatsCard } from "@/components/ui/StatsCard";
import AddMedicalPointModal from "@/components/medical-points/modals/AddMedicalPointModal";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { MedicalPointCard } from "@/components/medical-points/MedicalPointCard";
import { MedicalPointsTableView } from "@/components/medical-points/MedicalPointsTableView";
import { MedicalPointsControls } from "@/components/medical-points/MedicalPointsControls";

import { MedicalPointsStats } from "@/components/medical-points/MedicalPointsStats";
import { medicalPoints } from "@/constants/medical-points";

export default function MedicalPointsPage() {
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const filteredPoints = medicalPoints.filter((point) => {
    const query = searchQuery.toLowerCase().trim();
    return (
      point.name.toLowerCase().includes(query) ||
      point.location.toLowerCase().includes(query)
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
          title="إدارة النقاط الطبية"
          description="إدارة ومتابعة جميع الفروع والعيادات الطبية"
          icon={Building2}
        />

        <motion.button
          onClick={() => setIsAddModalOpen(true)}
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 cursor-pointer self-start md:self-center">
          <Plus size={20} />
          إضافة نقطة طبية
        </motion.button>
      </div>

      {/* Stats Bar */}
      <MedicalPointsStats points={medicalPoints} isLoading={isLoading} />

      {/* Controls Bar */}
      <MedicalPointsControls
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredPoints.map((point) => (
                <MedicalPointCard
                  key={point.id}
                  point={point}
                  onDelete={(p) => {
                    setSelectedPoint(p);
                    setIsDeleteModalOpen(true);
                  }}
                />
              ))}
            </motion.div>
          ) : (
            <MedicalPointsTableView
              key="table"
              points={filteredPoints}
              onDelete={(p) => {
                setSelectedPoint(p);
                setIsDeleteModalOpen(true);
              }}
            />
          )
        )}
      </AnimatePresence>

      <AddMedicalPointModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
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
