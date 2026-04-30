"use client"

import { Hospital, Inbox, TrendingUp, Activity, Stethoscope, Building2, Microscope } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import TopVisitedSkeleton from "../skeletons/TopVisited";

export default function TopDepartments({ title, isAdmin }: { title: string, isAdmin: boolean }) {

    const { data: response, isLoading, error } = useQuery({
        queryKey: ["dashboard-top-visited", isAdmin],
        queryFn: async () => {
            const endpoint = isAdmin ? `/dashboard/medical-points/top-visited` : `/point-manager/top-departments`;
            try {
                const res = await api.get(endpoint);
                return res.data;
            } catch (err) {
                console.error("TopDepartments API error:", err);
                throw err;
            }
        }
    });

    if (isLoading) {
        return <TopVisitedSkeleton />;
    }

    // استخراج المصفوفة والتأكد من وجود بيانات
    const topVisitedArray = response?.data || [];
    const colors = ["blue-500", "emerald-500", "orange-500", "red-500", "purple-500"];
    const icons = [Activity, Stethoscope, Hospital, Building2, Microscope];

    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <TrendingUp className="text-primary w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold">{title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">تحليل النشاط والزيارات</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                {topVisitedArray.length > 0 ? (
                    topVisitedArray.map((item: any, i: number) => {
                        // تنظيف النسبة المئوية من أي علامة % إذا وجدت وتحويلها لرقم
                        const percentageValue = parseFloat(String(item.load_percentage).replace('%', '')) || 0;
                        const colorName = colors[i % colors.length];
                        const Icon = icons[i % icons.length];

                        return (
                            <div key={i} className="flex items-center gap-4 mb-5 last:mb-0">
                                <div className={`w-10 h-10 rounded-lg bg-${colorName}/10 flex items-center justify-center shrink-0`}>
                                    <Icon size={20} className={`text-${colorName}`} />
                                </div>

                                <div className="flex-1 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="font-medium">
                                            {/* إذا كان أدمن يعرض اسم النقطة، إذا كان مدير يعرض اسم القسم */}
                                            {isAdmin ? item.point_name : (item.department_name || item.name)}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {item.total_visits} زيارة ({item.load_percentage})
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                        <motion.div
                                            className={`h-full bg-${colorName} rounded-full`}
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${percentageValue}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    // حالة عدم وجود بيانات (Empty State)
                    <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
                        <Inbox size={40} strokeWidth={1} className="mb-2 opacity-20" />
                        <p className="text-sm">لا توجد بيانات متاحة حالياً</p>
                    </div>
                )}
            </div>
        </div>
    );
}