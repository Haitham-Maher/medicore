"use client"

import { Hospital } from "lucide-react"; 
import { motion } from "framer-motion";
import api from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import TopVisitedSkeleton from "../skeletons/TopVisited";

export default function TopDepartments({ title, isAdmin }: { title: string, isAdmin: boolean }) {

    const { data: response, isLoading } = useQuery({
        queryKey: ["dashboard-top-visited", isAdmin], 
        queryFn: async () => {
            const res = await api.get(`/dashboard/medical-points/top-visited`);
            return res.data;
        }
    });

    if (isLoading) {
        return <TopVisitedSkeleton />;
    }

    const topVisitedArray = response?.data || [];
    const colors = ["bg-blue-500", "bg-emerald-500", "bg-orange-500", "bg-red-500", "bg-purple-500"];

    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">{title}</h3>
            </div>

            <div className="flex-1 flex flex-col justify-between">
                {topVisitedArray.map((item: any, i: number) => {
                    const percentageValue = parseFloat(item.load_percentage) || 0;
                    const color = colors[i % colors.length];

                    const iconColor = "text-blue-100"; 

                    return (
                        <div key={i} className="flex items-center gap-4 mb-4 md:mb-0">
                            
                            {/* قسم الأيقونة - يبقى كما هو مع خلفية ملونة وشفافة */}
                            <div className={`w-10 h-10 rounded-lg ${color} bg-opacity-10 flex items-center justify-center`}>
                                {/* ✅ تم تعديل الكلاس هنا لاستخدام اللون الفاتح */}
                                <Hospital size={20} className={iconColor} />
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="font-medium">{item.point_name}</span>
                                    <span className="text-muted-foreground text-xs">
                                        {item.total_visits} زيارة ({item.load_percentage})
                                    </span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${color} rounded-full`}
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${percentageValue}%` }} 
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}