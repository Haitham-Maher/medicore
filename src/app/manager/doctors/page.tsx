"use client";

import { useState } from "react";
import { Users, ShieldCheck, Shield, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/ui";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { motion, AnimatePresence } from "framer-motion";

// Components
import DoctorFilters from "@/components/doctors/DoctorFilters";
import DoctorSection from "@/components/doctors/DoctorSection";
import { DoctorSectionSkeleton } from "@/components/doctors/DoctorSkeleton";

// Mock Data
import { pointHeads, departmentHeads, regularDoctors } from "@/components/doctors/mockData";
import { useEffect } from "react";

export default function DoctorsPage() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    const counts = {
        all: departmentHeads.length + regularDoctors.length,
        deptHeads: departmentHeads.length,
        doctors: regularDoctors.length,
    };

    const handleDeleteClick = (person: any) => {
        setSelectedPerson(person);
        setIsDeleteModalOpen(true);
    };

    const handleTabChange = (tabId: string) => {
        if (tabId === activeTab) return;
        setActiveTab(tabId);
    };

    /////////////////////////////////////////////////////////////
    // HANDLE SEARCH DOCTORS
    const filteredPointHeads = pointHeads.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.pointName.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredDeptHeads = departmentHeads.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.pointName.toLowerCase().includes(searchQuery.toLowerCase()) || d.department.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredDoctors = regularDoctors.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.pointName.toLowerCase().includes(searchQuery.toLowerCase()) || d.department.toLowerCase().includes(searchQuery.toLowerCase()));

    /////////////////////////////////////////////////////////////
    // HANDLE TABS DOCTORS
    const showPointHeads = (activeTab === "all" || activeTab === "point-heads") && filteredPointHeads.length > 0;
    const showDeptHeads = (activeTab === "all" || activeTab === "dept-heads") && filteredDeptHeads.length > 0;
    const showDoctors = (activeTab === "all" || activeTab === "doctors") && filteredDoctors.length > 0;
    const hasResults = showPointHeads || showDeptHeads || showDoctors;
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <PageHeader
                title="إدارة الكادر الطبي"
                description="عرض وإدارة جميع الأطباء ورؤساء الأقسام "
                icon={Users}
            />

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
                        <DoctorSectionSkeleton />
                        <DoctorSectionSkeleton />
                    </>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${activeTab}-${searchQuery}`}
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
                                    onDelete={handleDeleteClick}
                                    isAdmin={false}
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
                                    onDelete={handleDeleteClick}
                                    isAdmin={false}
                                />
                            )}

                            {/* Empty State */}
                            {filteredPointHeads.length === 0 && filteredDeptHeads.length === 0 && filteredDoctors.length === 0 && (
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

            {/* Delete Confirmation Modal */}
            <DeleteConfirmation
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={() => {
                    setIsDeleteModalOpen(false);
                    setSelectedPerson(null);
                }}
                title="حذف من الكادر الطبي"
                description={`هل أنت متأكد من رغبتك في حذف "${selectedPerson?.name}"؟ سيتم إزالته من منصبه الحالي ولا يمكن التراجع عن هذا الإجراء.`}
            />
        </div>
    );
}
