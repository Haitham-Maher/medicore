"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import MedicalPointHeader from "@/components/clinics/MedicalPointHeader";
import MedicalPointStats from "@/components/clinics/MedicalPointStats";
import ClinicStaffList from "@/components/clinics/ClinicStaffList";
import ClinicInventory from "@/components/clinics/ClinicInventory";
import ClinicDepartments from "@/components/clinics/ClinicDepartments";
import { ArrowLeft, History } from "lucide-react";
import Link from "next/link";
import RecentRequests from "@/components/dashboard/RecentRequests";
import { cn } from "@/lib/utils";

export default function MedicalPointDetailsPage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("overview");

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
    { id: "inventory", label: "المخزون" },
    { id: "departments", label: "الأقسام" },
  ];

  return (
    <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Breadcrumb / Back Navigation */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Link
          href="/medical-points"
          className="hover:text-primary transition-colors"
        >
          النقاط الطبية
        </Link>
        <ArrowLeft size={14} />
        <span className="text-foreground font-medium">{clinicData.name}</span>
      </div>

      {/* Header Section */}
      <MedicalPointHeader {...clinicData} />

      {/* Main Content Tabs */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="bg-muted/50 p-1 rounded-xl h-auto flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-3 md:px-4 py-2 rounded-lg text-xs sm:text-sm md:text-base font-medium transition-all cursor-pointer",
                  activeTab === tab.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-0">
          {activeTab === "overview" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <MedicalPointStats />

              {/* Improved Layout: Staff and Inventory Side by Side */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <ClinicStaffList />
                <ClinicInventory />
              </div>

              {/* Recent Activity Full Width or spanning most of it */}
              <section className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold flex items-center gap-2 text-right">
                    <History size={18} className="text-primary" />
                    أحدث النشاطات والطلبات
                  </h3>
                </div>
                <RecentRequests />
              </section>
            </div>
          )}

          {activeTab === "doctors" && (
            <div className="animate-in fade-in duration-300">
              <ClinicStaffList />
            </div>
          )}

          {activeTab === "inventory" && (
            <div className="animate-in fade-in duration-300">
              <ClinicInventory />
            </div>
          )}

          {activeTab === "departments" && (
            <div className="animate-in fade-in duration-300">
              <ClinicDepartments />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
