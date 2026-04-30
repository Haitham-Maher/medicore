"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MedicalPointHeader from "@/components/medical-points/header/MedicalPointHeader";
import MedicalPointStats from "@/components/medical-points/stats/MedicalPointStats";
import { ManagerSection } from "@/components/medical-points/leader/ManagerSection";
import ClinicStaffList from "@/components/medical-points/staff/ClinicStaffList";
import ClinicInventory from "@/components/medical-points/inventory/ClinicInventory";
import ClinicDepartments from "@/components/medical-points/departments/ClinicDepartments";
import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import RecentRequests from "@/components/dashboard/admin/RecentRequests";
import { cn } from "@/lib/utils";
import MedicalPointDetailsSkeleton from "@/components/medical-points/skeletons/MedicalPointDetailsSkeleton";
import { Skeleton } from "@/components/ui";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

export default function MedicalPointDetailsPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [inventoryView, setInventoryView] = useState<"stock" | "requests">("stock");

  const params = useParams();
  const id = params.id;

  const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "doctors", label: "الكادر الطبي" },
    { id: "inventory", label: "المخزون والطلبات" },
    { id: "departments", label: "الأقسام" },
    { id: "leader", label: "رئيس النقطة" },
  ];

  const { data: response, isLoading } = useQuery({
    queryKey: ['medical-point', id],
    queryFn: async () => {
      const response = await api.get(`/medical-points/${id}`);
      return response.data.data;
    }
  })

  const { data: statsResponse, isLoading: isStatsLoading } = useQuery({
    queryKey: ['medical-point-stats', id],
    queryFn: async () => {
      const response = await api.get(`/medical-points/${id}/stats`);
      return response.data.data;
    }
  })

  const { data: inventoryResponse, isLoading: isInventoryLoading } = useQuery({
    queryKey: ['medical-point-inventory', id],
    queryFn: async () => {
      const response = await api.get(`/medical-points/${id}/inventory`);
      return response.data.data;
    }
  })

  const clinicData = response
  const statsData = statsResponse
  const inventoryData = inventoryResponse

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    if (tabId !== "inventory") {
      setInventoryView("stock"); // Reset when leaving inventory
    }
  };

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500 ">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/admin/medical-points"
          className="hover:text-primary transition-colors"
        >
          النقاط الطبية
        </Link>
        <ArrowLeft size={14} />
        <span className="text-foreground font-medium">
          {isLoading ? <Skeleton className="h-4 w-32 inline-block" /> : "نقطة "+clinicData.name}
        </span>
      </div>

      {/* Header Section */}
      <MedicalPointHeader {...clinicData} isLoading={isLoading} />

      {/* Main Content Tabs */}
      <motion.div
        initial={{ translateY: 30 }}
        animate={{ translateY: 0 }}
        transition={{ duration: .5 }}
        className="w-full">

        <div className="flex items-center justify-between mb-6">
          <div className="bg-muted/50 p-1 rounded-xl h-auto flex gap-1 overflow-x-auto no-scrollbar max-w-full">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-9 w-24 rounded-lg" />
              ))
            ) : (
              tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={cn(
                    "px-3 md:px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all cursor-pointer whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {tab.label}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-0">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <MedicalPointStats stats={statsData} isLoading={isLoading || isStatsLoading} />

              {/* Improved Layout: Staff and Inventory Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ClinicStaffList
                  variant="top"
                  onViewAll={() => {
                    handleTabChange("doctors");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <ClinicInventory
                  data={inventoryData}
                  isLoading={isLoading || isInventoryLoading}
                  onViewAll={() => {
                    handleTabChange("inventory");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>

              {/* Recent Activity Full Width */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-right">
                    <History size={18} className="text-primary" />
                    أحدث النشاطات والطلبات
                  </h3>
                </div>
                <RecentRequests
                  onViewAll={() => {
                    setInventoryView("requests");
                    handleTabChange("inventory");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </section>
            </div>
          )}

          {activeTab === "doctors" && (
            <div className="animate-in fade-in duration-300">
              <ClinicStaffList
                variant="full"
              />
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="animate-in fade-in duration-300">
              <ClinicInventory 
                data={inventoryData}
                isLoading={isLoading || isInventoryLoading} 
                showRequests={true} 
                defaultView={inventoryView}
              />
            </div>
          )}

          {activeTab === "departments" && (
            <div className="animate-in fade-in duration-300">
              <ClinicDepartments />
            </div>
          )}

          {activeTab === "leader" && (
            <div className="animate-in fade-in duration-300">
              <ManagerSection />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
