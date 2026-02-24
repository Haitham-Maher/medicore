"use client";

import { motion } from "framer-motion";
import { ArrowRight, Star, Trash2 } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "./StatusBadge";

interface MedicalPointsTableViewProps {
    points: any[];
    onDelete: (point: any) => void;
    isAdmin?: boolean;
}

export function MedicalPointsTableView({ points, onDelete, isAdmin = true }: MedicalPointsTableViewProps) {
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
                            <th className="px-6 py-4 font-semibold text-sm">
                                الإحصائيات
                            </th>
                            <th className="px-6 py-4 font-semibold text-sm">إجراءات</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {points.map((point) => (
                            <tr
                                key={point.id}
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
                                        <Star
                                            size={12}
                                            className="text-orange-400 fill-orange-400"
                                        />
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
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
