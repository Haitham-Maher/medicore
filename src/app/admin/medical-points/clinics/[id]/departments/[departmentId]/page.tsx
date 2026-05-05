"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

import DeptDetailsHeader from "@/components/medical-points/departments/details/DeptDetailsHeader";
import DeptOverview from "@/components/medical-points/departments/details/DeptOverview";
import DeptDoctorsList from "@/components/medical-points/departments/details/DeptDoctorsList";
import DeptHeadProfile from "@/components/medical-points/departments/details/DeptHeadProfile";
import DeptBreadcrumbs from "@/components/medical-points/departments/details/DeptBreadcrumbs";
import DeptTabs from "@/components/medical-points/departments/details/DeptTabs";

import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Stethoscope, HeartPulse, Baby, Bone, FlaskConical, Pill } from "lucide-react";

export default function DepartmentDetailsPage({ isAdmin = true }: { isAdmin?: boolean }) {
    const params = useParams();
    const departmentId = params.departmentId as string;
    const clinicId = params.id as string;

    const [activeTab, setActiveTab] = useState("overview");

    const { data: response, isLoading: isSummaryLoading } = useQuery({
        queryKey: ["department-summary", departmentId],
        queryFn: async () => {
            const res = await api.get(`/departments/${departmentId}/summary`);
            return res.data;
        }
    });

    const { data: staffResponse, isLoading: isStaffLoading } = useQuery({
        queryKey: ["department-staff", departmentId],
        queryFn: async () => {
            const res = await api.get(`/departments/${departmentId}/staff`);
            return res.data;
        }
    });

    const { data: headResponse, isLoading: isHeadLoading } = useQuery({
        queryKey: ["department-head", departmentId],
        queryFn: async () => {
            const res = await api.get(`/departments/${departmentId}/head`);
            return res.data;
        }
    });

    const { data: weeklyStatsResponse, isLoading: isWeeklyLoading } = useQuery({
        queryKey: ["department-weekly-stats", departmentId],
        queryFn: async () => {
            const res = await api.get(`/medical-points/departments/${departmentId}/weekly-stats`);
            return res.data;
        }
    });

    const getDeptAssets = (name: string) => {
        const n = (name || "").toLowerCase();
        if (n.includes("قلب")) return { icon: HeartPulse, color: "bg-red-500/10 text-red-500 border-red-500/20", accent: "#ef4444" };
        if (n.includes("أطفال")) return { icon: Baby, color: "bg-blue-500/10 text-blue-500 border-blue-500/20", accent: "#3b82f6" };
        if (n.includes("عظام")) return { icon: Bone, color: "bg-orange-500/10 text-orange-500 border-orange-400/20", accent: "#f97316" };
        if (n.includes("مختبر")) return { icon: FlaskConical, color: "bg-purple-500/10 text-purple-500 border-purple-500/20", accent: "#a855f7" };
        if (n.includes("صيدلية")) return { icon: Pill, color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", accent: "#10b981" };
        return { icon: Stethoscope, color: "bg-primary/10 text-primary border-primary/20", accent: "#10b981" };
    };

    const summaryData = response?.summary;
    const assets = getDeptAssets(response?.department_name);

    // Map Staff Data
    const doctorsList = (staffResponse?.data || []).map((doc: any) => ({
        id: doc.id,
        name: doc.name,
        specialization: doc.specialization,
        rating: doc.rating,
        image: `https://i.pravatar.cc/150?u=${doc.id}`, // Placeholder image
        phone: doc.phone_number,
        email: `${doc.id}@medicore.com`,
        status: doc.status === "active" ? "available" : "busy"
    }));

    // Map Head Data
    const headData = headResponse?.data;
    const departmentHead = {
        name: headData?.name || "غير محدد",
        specialization: headData?.specialization || response?.department_name || "أخصائي",
        rating: headData?.rating || 0,
        image: headData?.avatar || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
        email: headData?.email || "-----------",
        phone: headData?.phone_number || "-----------"
    };

    // Dynamic department object from API
    const department = {
        name: response?.department_name || "جاري التحميل...",
        icon: assets.icon,
        color: assets.color,
        accentColor: assets.accent,
        image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=1000",
        stats: {
            avgRating: 4.5,
            patients: summaryData?.patients_count || 0,
            doctors: summaryData?.doctors_count || 0,
            prescriptions: summaryData?.prescriptions_count || 0,
        },
        head: departmentHead,
        doctors: doctorsList
    };

    const isLoading = isSummaryLoading || isStaffLoading || isHeadLoading || isWeeklyLoading;

    const handleTabChange = (tabId: string) => {
        if (tabId === activeTab) return;
        setActiveTab(tabId);
    };

    return (
        <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumb / Back Navigation */}
            <DeptBreadcrumbs
                clinicId={clinicId}
                departmentName={department.name}
                isLoading={isLoading}
                isAdmin={true}
            />

            {/* Header Section */}
            <DeptDetailsHeader
                name={department.name}
                icon={department.icon}
                color={department.color}
                image={department.image}
                rating={department.stats.avgRating}
                isLoading={isLoading}
            />

            {/* Main Content Tabs */}
            <motion.div
                initial={{ translateY: 30 }}
                animate={{ translateY: 0 }}
                transition={{ duration: .5 }}
                className="w-full"
            >
                <DeptTabs
                    activeTab={activeTab}
                    onTabChange={handleTabChange}
                    isLoading={isLoading}
                />

                {/* Tab Content */}
                <div className="mt-0">
                    {activeTab === "overview" && (
                        <DeptOverview
                            isLoading={isLoading}
                            stats={department.stats}
                            head={department.head}
                            doctors={department.doctors}
                            accentColor={department.accentColor}
                            weeklyData={weeklyStatsResponse?.weekly_data}
                            onViewAllDoctors={() => {
                                handleTabChange("doctors");
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                        />
                    )}

                    {activeTab === "doctors" && (
                        <div className="animate-in fade-in duration-300">
                            <DeptDoctorsList
                                variant="full"
                                isLoading={isLoading}
                                doctors={department.doctors}
                            />
                        </div>
                    )}

                    {activeTab === "leader" && (
                        <div className="animate-in fade-in duration-300">
                            <DeptHeadProfile
                                isLoading={isLoading}
                                head={department.head}
                            />
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
