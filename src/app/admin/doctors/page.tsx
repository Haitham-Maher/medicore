"use client";

import { useState } from "react";
import { Users, ShieldCheck, LayoutGrid, TableIcon, Search } from "lucide-react";
import { PageHeader } from "@/components/ui";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

// Components
import DoctorSection from "@/components/doctors/DoctorSection";
import { DoctorSectionSkeleton } from "@/components/doctors/DoctorSkeleton";
import DoctorDetailsModal from "@/components/doctors/DoctorDetailsModal";

// Mock Data
import { pointHeads } from "@/components/doctors/mockData";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export default function DoctorsPage() {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<any>(null);
    const [selectedType, setSelectedType] = useState<any>("doctor");
    const [view, setView] = useState<"grid" | "list">("grid");

    const { data: doctors, isLoading } = useQuery({
        queryKey: ['doctors'],
        queryFn: async () => {
            const doctors = await api.get('/inventory/alerts');
            return doctors.data;
        }
    })



    const doctorsData = doctors || [];


    const handleDeleteClick = (person: any) => {
        setSelectedPerson(person);
        setIsDeleteModalOpen(true);
    };

    const handleViewClick = (person: any, type: "point-head" | "dept-head" | "doctor") => {
        setSelectedPerson(person);
        setSelectedType(type);
        setIsDetailsModalOpen(true);
    };

    /////////////////////////////////////////////////////////////
    // HANDLE SEARCH DOCTORS
    const filteredPointHeads = pointHeads.filter(d => d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.pointName.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <PageHeader
                    title="إدارة الكادر الطبي"
                    description="عرض وإدارة جميع الأطباء ورؤساء الأقسام والنقاط الطبية"
                    icon={Users}
                    regionName={doctorsData.region}
                />

                {/* View Toggler */}
                <div className="flex bg-muted/50 p-1 rounded-xl border border-border/50 w-full sm:w-auto">
                    <button
                        onClick={() => setView("grid")}
                        className={cn(
                            "flex-1 sm:flex-none p-2 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-black cursor-pointer",
                            view === "grid"
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <LayoutGrid size={16} className={cn(view === "grid" ? "text-primary" : "text-muted-foreground")} />
                        <span>بطاقات</span>
                    </button>
                    <button
                        onClick={() => setView("list")}
                        className={cn(
                            "flex-1 sm:flex-none p-2 rounded-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm font-black cursor-pointer",
                            view === "list"
                                ? "bg-background text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        )}
                    >
                        <TableIcon size={16} className={cn(view === "list" ? "text-primary" : "text-muted-foreground")} />
                        <span>جدول</span>
                    </button>
                </div>
            </div>

            <div className="relative w-full">
                <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    size={16}
                />
                <input
                    type="text"
                    placeholder="بحث بالاسم أو النقطة الطبية..."
                    className="w-full bg-background border border-border rounded-xl pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>



            {/* Content Area */}
            <div className="space-y-8">
                {isLoading ? (
                    <>
                        <DoctorSectionSkeleton />
                    </>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`${searchQuery}-${view}`}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-8"
                        >
                            {/* Point Heads Section */}
                            <DoctorSection
                                title="رؤساء النقاط الطبية"
                                icon={ShieldCheck}
                                iconColor="text-emerald-500"
                                iconBg="bg-emerald-500/10"
                                data={filteredPointHeads}
                                type="point-head"
                                onDelete={handleDeleteClick}
                                onView={handleViewClick}
                                view={view}
                            />

                            {/* Empty State */}
                            {filteredPointHeads.length === 0 && (
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
        </div>
    );
}
