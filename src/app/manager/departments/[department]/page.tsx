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

import { departmentData } from "@/constants/departments-data";

export default function DepartmentDetailsPage({ isAdmin = true }: { isAdmin?: boolean }) {
    const params = useParams();
    // Support both admin and manager param naming conventions
    const departmentId = (params.departmentId ?? params.department) as string;
    const clinicId = (params.id ?? params.clinicId) as string;

    const [activeTab, setActiveTab] = useState("overview");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 2000);
        return () => clearTimeout(timer);
    }, []);

    const department = departmentData[departmentId];

    if (!department) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-muted-foreground">القسم غير موجود</p>
            </div>
        );
    }

    const handleTabChange = (tabId: string) => {
        if (tabId === activeTab) return;

        setIsLoading(true);
        setActiveTab(tabId);

        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
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
