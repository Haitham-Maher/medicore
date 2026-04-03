"use client";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Search, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

interface MedicalPointsTableViewProps {
    points: any[];
    onDelete: (point: any) => void;
    isAdmin?: boolean;
    searchQuery?: string;
}

const MotionTr = motion.create("tr");

export function MedicalPointsTableView({
    points,
    onDelete,
    isAdmin = true,
    searchQuery = "",
}: MedicalPointsTableViewProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden"
        >
            <div className="overflow-x-auto">
                <table className="w-full text-right">
                    <thead className="bg-muted/30 border-b border-border/50">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-sm">{isAdmin ? "اسم النقطة" : "اسم القسم"}</th>
                            <th className="px-6 py-4 font-semibold text-sm">الموقع</th>
                            <th className="px-6 py-4 font-semibold text-sm">{isAdmin ? "المسؤول" : "رئيس القسم"}</th>
                            <th className="px-6 py-4 font-semibold text-sm">الحالة</th>
                            <th className="px-6 py-4 font-semibold text-sm">التقييم</th>
                            <th className="px-6 py-4 font-semibold text-sm">الإحصائيات</th>
                            <th className="px-6 py-4 font-semibold text-sm">إجراءات</th>
                        </tr>
                    </thead>
                    {/* AnimatePresence on tbody so it re-runs when search changes */}
                    <AnimatePresence mode="wait">
                        <motion.tbody
                            key={searchQuery}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            className="divide-y divide-border/50"
                        >
                            <AnimatePresence initial={false}>
                                {points.length > 0 ? (
                                    points.map((point, i) => (
                                        <MotionTr
                                            key={point.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -80, scale: 0.95 }}
                                            transition={{
                                                duration: 0.25,
                                                // delay: i * 0.04,
                                                // layout: { type: "spring", stiffness: 500, damping: 50 },
                                            }}
                                            className="group hover:bg-muted/20 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0">
                                                        <img
                                                            src={point.image}
                                                            alt=""
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <span className="font-semibold text-foreground">
                                                        {point.name}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {point.location}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium">
                                                {point.manager}
                                            </td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={point.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 font-bold text-sm">
                                                    {point.rating}
                                                    <Star size={12} className="text-orange-400 fill-orange-400" />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-muted-foreground">
                                                {point.doctorsCount} طبيب • {point.departmentsCount} {isAdmin ? "قسم" : "غرفة"}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        href={isAdmin ? `/admin/medical-points/clinics/${point.id}` : `/manager/departments/clinics/${point.id}`}
                                                        className="p-2 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                                                    >
                                                        <ArrowRight size={18} className="rotate-180" />
                                                    </Link>
                                                    <button
                                                        onClick={() => onDelete(point)}
                                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors cursor-pointer"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </MotionTr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className="h-40 text-center">
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex flex-col items-center gap-3 text-muted-foreground"
                                            >
                                                <Search className="h-10 w-10 opacity-20" />
                                                <p className="font-bold">لا توجد نتائج مطابقة لبحثك</p>
                                                {searchQuery && (
                                                    <p className="text-sm">
                                                        لا يوجد ما يطابق &quot;<span className="text-primary font-medium">{searchQuery}</span>&quot;
                                                    </p>
                                                )}
                                            </motion.div>
                                        </td>
                                    </tr>
                                )}
                            </AnimatePresence>
                        </motion.tbody>
                    </AnimatePresence>
                </table>
            </div>
        </motion.div>
    );
}
