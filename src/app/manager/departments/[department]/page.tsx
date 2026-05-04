"use client";
import { Activity, ChevronRight, SearchX } from "lucide-react";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

import DeptDetailsHeader from "@/components/medical-points/departments/details/DeptDetailsHeader";
import DeptOverview from "@/components/medical-points/departments/details/DeptOverview";
import DeptDoctorsList from "@/components/medical-points/departments/details/DeptDoctorsList";
import DeptHeadProfile from "@/components/medical-points/departments/details/DeptHeadProfile";
import DeptBreadcrumbs from "@/components/medical-points/departments/details/DeptBreadcrumbs";
import DeptTabs from "@/components/medical-points/departments/details/DeptTabs";

import { departmentData } from "@/constants/departments-data";

export default function DepartmentDetailsPage({ isAdmin = true }: { isAdmin?: boolean }) {
    const params = useParams();
    const router = useRouter();
    // Support both admin and manager param naming conventions
    const departmentId = (params.departmentId ?? params.department) as string;
    const clinicId = (params.id ?? params.clinicId) as string;

    const [activeTab, setActiveTab] = useState("overview");

    const { data: weeklyStatsResponse, isLoading: isWeeklyLoading } = useQuery({
        queryKey: ["dept-weekly-stats", departmentId],
        queryFn: async () => {
            const res = await api.get(`/point-manager/departments/${departmentId}/weekly-stats`);
            return res.data;
        },
        enabled: !!departmentId
    });

    // جلب قائمة الأقسام للعثور على بيانات القسم الحالي
    const { data: listResponse, isLoading: isListLoading } = useQuery({
        queryKey: ["manager-departments-list"],
        queryFn: async () => {
            const res = await api.get("/point-manager/departments-detailed");
            return res.data;
        }
    });

    // جلب قائمة الأطباء
    const { data: doctorsResponse, isLoading: isDoctorsLoading } = useQuery({
        queryKey: ["dept-doctors", departmentId],
        queryFn: async () => {
            const res = await api.get(`/point-manager/departments/${departmentId}/doctors`);
            return res.data;
        },
        enabled: !!departmentId
    });

    const isLoading = isWeeklyLoading || isDoctorsLoading || isListLoading;
    const weeklyData = weeklyStatsResponse?.weekly_data || [];

    // تحويل بيانات الأطباء لتناسب واجهة المكونات
    const doctors = (doctorsResponse?.data || []).map((doc: any) => ({
        id: doc.id.toString(),
        name: doc.name,
        specialize: doc.specialize,
        rating: doc.rating,
        patients: Math.floor(Math.random() * 100),
        status: doc.status === "active" ? "available" : "off-duty",
        phone: doc.phone_number
    }));

    // محاولة إيجاد القسم في البيانات الوهمية أولاً، ثم في بيانات الـ API
    const mockDept = departmentData[departmentId];
    const apiDept = (listResponse?.data || []).find((d: any) => d.id.toString() === departmentId);

    const department = mockDept || (apiDept ? {
        id: apiDept.id.toString(),
        name: apiDept.name,
        icon: Activity,
        color: "bg-primary/10 text-primary border-primary/20",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1200",
        head: {
            name: apiDept.manager_name,
            email: "manager@medicore.com",
            phone: "+966 50 000 0000",
            rating: apiDept.rating,
            specialization: "رئيس القسم",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
        },
        stats: {
            patients: apiDept.total_visits || 0,
            doctors: apiDept.doctors_count || 0,
            avgRating: apiDept.rating || 0,
            prescriptions: (apiDept.total_visits || 0) * 2,
        },
        accentColor: "#14b8a6",
        doctors: [],
        reports: []
    } : null);

    if (!department && !isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4" dir="rtl">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.5, type: "spring", damping: 20 }}
                    className="text-center space-y-6"
                >
                    <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                        <div className="relative bg-card border-2 border-dashed border-border w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                            <SearchX size={64} className="text-primary/40" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-3xl font-black text-foreground">القسم غير موجود</h2>
                        <p className="text-muted-foreground max-w-md mx-auto font-medium leading-relaxed">
                            عذراً، لم نتمكن من العثور على القسم الذي تبحث عنه. قد يكون الرابط خاطئاً أو تم نقل القسم لمكان آخر.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={() => router.back()}
                            className="inline-flex items-center gap-3 bg-primary text-white px-10 py-4 rounded-2xl font-black hover:opacity-90 hover:scale-[1.02] transition-all shadow-lg shadow-primary/25 group cursor-pointer"
                        >
                            <ChevronRight size={22} className="transition-transform group-hover:translate-x-1" />
                            <span>العودة للخلف</span>
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const handleTabChange = (tabId: string) => {
        if (tabId === activeTab) return;
        setActiveTab(tabId);
    };

    return (
        <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Breadcrumb / Back Navigation */}
            <DeptBreadcrumbs
                clinicId={clinicId}
                departmentName={department?.name || "جاري التحميل..."}
                isLoading={isLoading}
                isAdmin={false}
            />

            {/* Header Section */}
            <DeptDetailsHeader
               name={department?.name || "جاري التحميل..."}
                icon={department?.icon || Activity}
                color={department?.color || ""}
                image={department?.image || ""}
                rating={department?.stats?.avgRating || 0}
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
                            stats={department?.stats || {}}
                            head={department?.head || {}}
                            doctors={doctors}
                            accentColor={department?.accentColor || ""}
                            weeklyData={weeklyData}
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
                                doctors={doctors}
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
