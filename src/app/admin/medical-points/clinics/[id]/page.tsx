"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import MedicalPointHeader from "@/components/medical-points/header/MedicalPointHeader";
import MedicalPointStats, { ManagerSection } from "@/components/medical-points/stats/MedicalPointStats";
import ClinicStaffList from "@/components/medical-points/staff/ClinicStaffList";
import ClinicInventory from "@/components/medical-points/inventory/ClinicInventory";
import ClinicDepartments from "@/components/medical-points/departments/ClinicDepartments";
import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import RecentRequests from "@/components/dashboard/RecentRequests";
import { cn } from "@/lib/utils";
import MedicalPointDetailsSkeleton from "@/components/medical-points/skeletons/MedicalPointDetailsSkeleton";
import { Skeleton } from "@/components/ui";
import { motion } from "framer-motion";

export default function MedicalPointDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Mock Data Fetching based on ID (In real app, fetch from API)
  const clinicData = {
    name: "نقطة الشفاء الطبية",
    location: "الرياض - حي النسيم",
    rating: 4.8,
    status: "active" as const,
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1200",
  };

  const tabs = [
    { id: "overview", label: "نظرة عامة" },
    { id: "doctors", label: "الكادر الطبي" },
    { id: "inventory", label: "المخزون والطلبات" },
    { id: "departments", label: "الأقسام" },
    { id: "leader", label: "رئيس النقطة" },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === activeTab) return;

    setIsLoading(true);
    setActiveTab(tabId);

    // Simulate data fetching for the new tab
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
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
          {isLoading ? <Skeleton className="h-4 w-32 inline-block" /> : clinicData.name}
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
              <MedicalPointStats isLoading={isLoading} />

              {/* Improved Layout: Staff and Inventory Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ClinicStaffList
                  variant="top"
                  isLoading={isLoading}
                  onViewAll={() => {
                    handleTabChange("doctors");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
                <ClinicInventory
                  isLoading={isLoading}
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
                  isLoading={isLoading}
                  onViewAll={() => {
                    handleTabChange("inventory");
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </section>
            </div>
          )}

          {activeTab === "doctors" && (
            <div className="animate-in fade-in duration-300">
              <ClinicStaffList variant="full" isLoading={isLoading} />
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="animate-in fade-in duration-300">
              <ClinicInventory isLoading={isLoading} showRequests={true} />
            </div>
          )}

          {activeTab === "departments" && (
            <div className="animate-in fade-in duration-300">
              <ClinicDepartments isLoading={isLoading} />
            </div>
          )}

          {activeTab === "leader" && (
            <div className="animate-in fade-in duration-300">
              <ManagerSection isLoading={isLoading} />
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
