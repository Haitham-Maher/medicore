"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import ErrorData from "@/components/inventory/table/components/errorData";

// Components
import PrescriptionsSkeleton from "@/components/patient/prescriptions/PrescriptionsSkeleton";
import PrescriptionCard from "@/components/patient/prescriptions/PrescriptionCard";
import PrescriptionHeader from "@/components/patient/prescriptions/PrescriptionHeader";
import PrescriptionSearch from "@/components/patient/prescriptions/PrescriptionSearch";
import PrescriptionStats from "@/components/patient/prescriptions/PrescriptionStats";

// Types
import { Prescription } from "@/types/prescription";

export default function PatientPrescriptionsPage() {
    const [search, setSearch] = useState("");

    const { data: rxResponse, isLoading, refetch } = useQuery({
        queryKey: ["all-patient-prescriptions"],
        queryFn: async () => {
            const res = await api.get("/patient/prescriptions");
            return res.data.data as { total_prescriptions: number; prescriptions: Prescription[] };
        }
    });

    if (isLoading) return <PrescriptionsSkeleton />;
    if (!rxResponse) return <ErrorData refetch={refetch} />;

    const allPrescriptions = rxResponse.prescriptions;
    const q = search.trim().toLowerCase();

    // Total Medicines
    const totalMeds = allPrescriptions.reduce((s, rx) => s + (rx.medicines_count || 0), 0);

    // Filtered Prescriptions
    const filteredPrescriptions = allPrescriptions.filter(
        (rx) => {
            if (!q) return true;
            
            const rxId = String(rx.prescription_id || "").toLowerCase();
            const rxNum = String(rx.prescription_number || "").toLowerCase();
            const docName = String(rx.doctor_name || "").toLowerCase();
            const matchesHeader = rxId.includes(q) || rxNum.includes(q) || docName.includes(q);
            
            const matchesMeds = rx.medicines?.some((m) => {
                const name = String(m.name || "").toLowerCase();
                const instr = String(m.instructions || "").toLowerCase();
                return name.includes(q) || instr.includes(q);
            });

            return matchesHeader || matchesMeds;
        }
    );

    return (
        <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" dir="rtl">

            {/* ── Header ── */}
            <PrescriptionHeader 
                count={allPrescriptions.length} 
                totalMeds={totalMeds} 
                filteredCount={filteredPrescriptions.length} 
            />

            {/* ── Search ── */}
            <PrescriptionSearch search={search} setSearch={setSearch} />

            {/* ── Summary Stats ── */}
            <PrescriptionStats count={allPrescriptions.length} totalMeds={totalMeds} />

            {/* ── Prescriptions List ── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={search}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                >
                    {filteredPrescriptions.length === 0 ? (
                        <div className="py-16 flex flex-col items-center gap-4 bg-card border border-dashed border-border/50 rounded-2xl">
                            <div className="size-14 rounded-2xl bg-muted/30 flex items-center justify-center text-muted-foreground/30">
                                <Search className="size-7" />
                            </div>
                            <div className="text-center">
                                <p className="font-bold text-sm text-foreground mb-1">
                                    {allPrescriptions.length === 0 ? "لا توجد وصفات" : "لا توجد نتائج"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {allPrescriptions.length === 0
                                        ? "لم يتم تسجيل أي وصفات طبية لك في النظام بعد."
                                        : "لا يوجد دواء أو وصفة تطابق بحثك"}
                                </p>
                            </div>
                        </div>
                    ) : (
                        filteredPrescriptions.map((rx, i) => (
                            <PrescriptionCard
                                key={rx.prescription_id}
                                rx={rx}
                                searchQuery={q}
                            />
                        ))
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
