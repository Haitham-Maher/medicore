"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui";
import { motion } from "framer-motion";
import { HeartPulse, Baby } from "lucide-react";

import DeptDetailsHeader from "@/components/medical-points/departments/details/DeptDetailsHeader";
import DeptOverview from "@/components/medical-points/departments/details/DeptOverview";
import DeptDoctorsList from "@/components/medical-points/departments/details/DeptDoctorsList";
import DeptHeadProfile from "@/components/medical-points/departments/details/DeptHeadProfile";
import DeptKPIs from "@/components/medical-points/departments/details/DeptKPIs";

/**
 * Mock data structured to match the ERD schema:
 * - departments: id, points_id, department_manager_id, name
 * - department_managers: id, rating, users_id → users → persons (name, phone)
 * - doctors: id, departments_id, specialize, status (ENUM), rating, bio, users_id → users → persons
 * - reports: id, text, department_manager_id, medicine_id (nullable)
 * - prescriptions: id, doctors_id, patients_id → used to count patients per doctor
 */
const departmentData: any = {
    "1": {
        id: "1",
        name: "قسم القلبية",
        icon: HeartPulse,
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?auto=format&fit=crop&q=80&w=1200",
        // department_managers table
        head: {
            name: "د. خالد منصور",           // persons.name
            email: "khalid.mansour@clinic.com", // users.email
            phone: "+966 50 123 4567",          // persons.phone_number
            rating: 4.8,                        // department_managers.rating
            specialization: "أمراض القلب والأوعية الدموية",
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200"
        },
        stats: {
            patients: 342,      // COUNT from prescriptions WHERE doctor in this dept
            doctors: 5,         // COUNT from doctors WHERE departments_id = this
            avgRating: 4.6,     // AVG(doctors.rating) in this dept
            prescriptions: 890  // COUNT from prescriptions WHERE doctor in this dept
        },
        accentColor: "#14b8a6",
        // doctors table
        doctors: [
            { id: "1", name: "د. أحمد السالم", specialize: "قلب تداخلي", rating: 4.7, patients: 45, status: "available", bio: "طبيب قلب تداخلي بخبرة 10 سنوات في القسطرة القلبية" },
            { id: "2", name: "د. فاطمة الزهراني", specialize: "قلب أطفال", rating: 4.9, patients: 38, status: "busy", bio: "متخصصة في أمراض القلب الخلقية عند الأطفال" },
            { id: "3", name: "د. محمد العتيبي", specialize: "فسيولوجيا القلب", rating: 4.5, patients: 52, status: "available", bio: "متخصص في الفحوصات الفسيولوجية للقلب" },
            { id: "4", name: "د. نورة القحطاني", specialize: "جراحة القلب", rating: 4.8, patients: 41, status: "off-duty", bio: "جراحة قلب مفتوح وعمليات الصمامات" },
            { id: "5", name: "د. عبدالله الدوسري", specialize: "قلب عام", rating: 4.6, patients: 47, status: "available", bio: "طب القلب العام والفحوصات الدورية" }
        ],
        // reports table (linked via department_manager_id)
        reports: [
            { id: 1, text: "تم استقبال 45 حالة طوارئ قلبية خلال الأسبوع الماضي، وتم تحويل 3 حالات للعناية المركزة. الأداء العام للقسم جيد مع ملاحظة الحاجة لزيادة الكادر في فترة المساء.", date: "2026-02-18", managerName: "د. خالد منصور" },
            { id: 2, text: "تقرير شهري عن حالة الأجهزة الطبية في القسم: جميع أجهزة تخطيط القلب تعمل بشكل سليم، يُطلب صيانة دورية لجهاز الإيكو رقم 3.", date: "2026-02-10", managerName: "د. خالد منصور" },
            { id: 3, text: "تم إجراء 12 عملية قسطرة قلبية ناجحة هذا الشهر بنسبة نجاح 100%. لا توجد مضاعفات مسجلة.", date: "2026-02-01", managerName: "د. خالد منصور" },
        ]
    },
    "2": {
        id: "2",
        name: "قسم الأطفال",
        icon: Baby,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?auto=format&fit=crop&q=80&w=1200",
        head: {
            name: "د. مريم العلي",
            email: "maryam.ali@clinic.com",
            phone: "+966 50 234 5678",
            rating: 4.9,
            specialization: "طب الأطفال العام",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964ac31?auto=format&fit=crop&q=80&w=200"
        },
        stats: {
            patients: 521,
            doctors: 3,
            avgRating: 4.7,
            prescriptions: 1240
        },
        accentColor: "#3b82f6",
        doctors: [
            { id: "1", name: "د. سارة الشمري", specialize: "حديثي الولادة", rating: 4.8, patients: 62, status: "available", bio: "متخصصة في رعاية حديثي الولادة والخداج" },
            { id: "2", name: "د. يوسف المطيري", specialize: "أطفال عام", rating: 4.6, patients: 55, status: "busy", bio: "طب أطفال عام وتطعيمات" },
            { id: "3", name: "د. هند الغامدي", specialize: "طوارئ أطفال", rating: 4.9, patients: 48, status: "available", bio: "طوارئ أطفال والحالات الحرجة" }
        ],
        reports: [
            { id: 1, text: "ارتفاع ملحوظ في حالات الأنفلونزا الموسمية عند الأطفال. تم تخصيص عيادة إضافية للتعامل مع الضغط. يُنصح بتوفير كميات إضافية من لقاح الأنفلونزا.", date: "2026-02-17", managerName: "د. مريم العلي" },
            { id: 2, text: "تقرير حملة التطعيمات الشهرية: تم تطعيم 180 طفل هذا الشهر، بنسبة تغطية 92% من المستهدف.", date: "2026-02-05", managerName: "د. مريم العلي" },
        ]
    }
};

export default function DepartmentDetailsPage() {
    const params = useParams();
    const departmentId = params.departmentId as string;
    const clinicId = params.id as string;

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

    const tabs = [
        { id: "overview", label: "نظرة عامة" },
        { id: "doctors", label: "الكادر الطبي" },
        { id: "leader", label: "رئيس القسم" },
    ];

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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link
                    href="/admin/medical-points"
                    className="hover:text-primary transition-colors"
                >
                    النقاط الطبية
                </Link>
                <ArrowLeft size={14} />
                <Link
                    href={`/admin/medical-points/clinics/${clinicId}`}
                    className="hover:text-primary transition-colors"
                >
                    تفاصيل النقطة
                </Link>
                <ArrowLeft size={14} />
                <span className="text-foreground font-medium">
                    {isLoading ? <Skeleton className="h-4 w-32 inline-block" /> : department.name}
                </span>
            </div>

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
                <div className="flex items-center justify-between mb-6">
                    <div className="bg-muted/50 p-1 rounded-xl h-auto flex gap-1 overflow-x-auto no-scrollbar max-w-full">
                        {isLoading ? (
                            [...Array(4)].map((_, i) => (
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
