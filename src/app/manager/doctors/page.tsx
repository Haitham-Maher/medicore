"use client";

import { useState } from "react";
import { Users, Shield, Stethoscope, LayoutGrid, TableIcon } from "lucide-react";
import { PageHeader } from "@/components/ui";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

// Components
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorSection from "@/components/doctors/DoctorSection";
import { DoctorSectionSkeleton } from "@/components/doctors/DoctorSkeleton";
import DoctorDetailsModal from "@/components/doctors/DoctorDetailsModal";

export default function DoctorsPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<"point-head" | "dept-head" | "doctor">("doctor");
    const [view, setView] = useState<"grid" | "list">("list");

    // جلب البيانات من الـ API
    const { data: staffResponse, isLoading } = useQuery({
        queryKey: ["manager-staff-list"],
        queryFn: async () => {
            const res = await api.get("/point-manager/staff");
            return res.data;
        }
    });

    // تحويل البيانات لتناسب واجهة المستخدم
    const mapDoctor = (doc: any, isHead: boolean) => ({
        id: doc.id.toString(),
        name: doc.name,
        role: isHead ? "رئيس قسم" : "طبيب",
        specialize: doc.specialize,
        pointName: doc.pointName,
        department: doc.department?.name || "عام",
        rating: doc.rating,
        phone: doc.phone_number,
        email: doc.email,
        status: doc.status,
        is_department_head: isHead,
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
    });

    const departmentHeads = (staffResponse?.department_Heads || []).map((doc: any) => mapDoctor(doc, true));
    const regularDoctors = (staffResponse?.point_doctors || []).map((doc: any) => mapDoctor(doc, false));

    const counts = {
        all: departmentHeads.length + regularDoctors.length,
        deptHeads: departmentHeads.length,
        doctors: regularDoctors.length,
    };

    const handleDeleteClick = (person: any) => {
        setSelectedPerson(person);
        setIsDeleteModalOpen(true);
    };

    const handleViewClick = (person: any, type: "point-head" | "dept-head" | "doctor") => {
        setSelectedPerson(person);
        setSelectedType(type);
        setIsDetailsModalOpen(true);
    };

    const handleTabChange = (tabId: string) => {
        if (tabId === activeTab) return;
        setActiveTab(tabId);
    };

    /////////////////////////////////////////////////////////////
    // HANDLE SEARCH DOCTORS
    const filteredDeptHeads = departmentHeads.filter((d: any) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const filteredDoctors = regularDoctors.filter((d: any) =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    /////////////////////////////////////////////////////////////
    // HANDLE TABS DOCTORS
    const showDeptHeads = (activeTab === "all" || activeTab === "dept-heads") && filteredDeptHeads.length > 0;
    const showDoctors = (activeTab === "all" || activeTab === "doctors") && filteredDoctors.length > 0;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="إدارة الكادر الطبي"
                    description="عرض وإدارة جميع الأطباء ورؤساء الأقسام "
                    icon={Users}
                />

                {/* View Toggler */}
                <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50">
                    <button
                        onClick={() => setView("grid")}
                        className={cn(
                            "p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium cursor-pointer",
                            view === "grid"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LayoutGrid size={18} />
                        <span className="hidden sm:inline">بطاقات</span>
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={cn(
                            "p-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium cursor-pointer",
                            view === "list"
                                ? "bg-background text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <TableIcon size={18} />
                        <span className="hidden sm:inline">جدول</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <DoctorFilters
                activeTab={activeTab}
                onTabChange={handleTabChange}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                counts={counts}
                isAdmin={false}
            />

            {/* Content Area */}
            <div className="space-y-8">
                {isLoading ? (
                    <>
                        <DoctorSectionSkeleton />
                    </>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTab}-${searchQuery}-${view}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Department Heads Section */}
                            {showDeptHeads && (
                                <DoctorSection
                                    title="رؤساء الأقسام"
                                    icon={Shield}
                                    iconColor="text-blue-500"
                                    iconBg="bg-blue-500/10"
                                    data={filteredDeptHeads}
                                    type="dept-head"
                                    // onDelete={handleDeleteClick}
                                    onView={handleViewClick}
                                    isAdmin={false}
                                    view={view}
                                />
                            )}

                            {/* Regular Doctors Section */}
                            {showDoctors && (
                                <DoctorSection
                                    title="الأطباء"
                                    icon={Stethoscope}
                                    iconColor="text-purple-500"
                                    iconBg="bg-purple-500/10"
                                    data={filteredDoctors}
                                    type="doctor"
                                    onView={handleViewClick}
                                    isAdmin={false}
                                    view={view}
                                />
                            )}

                            {/* Empty State */}
                            {filteredDeptHeads.length === 0 && filteredDoctors.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-20 bg-card rounded-3xl border border-dashed border-border/60"
                                >
                                    <div className="w-20 h-20 rounded-full bg-muted/30 flex items-center justify-center text-muted-foreground/30 mb-5">
                                        <Users size={40} />
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-1">لا توجد نتائج بحث</h3>
                                    <p className="text-sm text-muted-foreground italic">
                                        لم نجد أي تطابق لـ "<span className="text-primary font-bold">{searchQuery}</span>" في الكادر الطبي
                                    </p>
                                </motion.div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>

            {/* Doctor Details Modal */}
            <DoctorDetailsModal
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                person={selectedPerson}
                type={selectedType}
            />
        </div>
    );
}
