"use client"

import { Activity, Baby, HeartPulse, Stethoscope, Hospital } from "lucide-react";
import { motion } from "framer-motion";

// TopDepartments.tsx
// بيانات النقاط الطبية للأدمن (Admin View)
const topMedicalPoints = [
    { name: "نقطة الأمل الطبية", value: 92, count: "450 مريض", color: "bg-blue-600", icon: Hospital },
    { name: "نقطة النصر الطبية", value: 78, count: "380 مريض", color: "bg-emerald-600", icon: Hospital },
    { name: "نقطة السلام الطبية", value: 65, count: "290 مريض", color: "bg-orange-500", icon: Hospital },
    { name: "نقطة الوحدة الطبية", value: 48, count: "150 مريض", color: "bg-red-500", icon: Hospital },
];

// بيانات الأقسام للمدير (Manager View)
const topDepartments = [
    { name: "قسم الأطفال", value: 85, count: "120 مريض", color: "bg-blue-500", icon: Baby },
    { name: "العناية المركزة", value: 62, count: "86 مريض", color: "bg-red-500", icon: Activity },
    { name: "قسم الجراحة", value: 45, count: "54 مريض", color: "bg-orange-500", icon: Stethoscope },
    { name: "قسم الطوارئ", value: 30, count: "32 مريض", color: "bg-emerald-500", icon: HeartPulse },
];

export default function TopDepartments({ title, isAdmin }: { title: string, isAdmin: boolean }) {
    const data = isAdmin ? topMedicalPoints : topDepartments;
    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm h-full flex flex-col">
            <h3 className="text-lg font-bold mb-6">{title}</h3>

            {/* flex-1 وتوزيع المساحة سيجعل العناصر تتمدد لتملأ الطول المتاح */}
            <div className="flex-1 flex flex-col justify-between">
                {data.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 mb-4 md:mb-0">
                        <div className={`w-10 h-10 rounded-lg ${item.color} bg-opacity-10 flex items-center justify-center text-${item.color.replace('bg-', '')}`}>
                            <item.icon size={20} className="text-white" />
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium">{item.name}</span>
                                <span className="text-muted-foreground text-xs">{item.count} ({item.value}%)</span>
                            </div>

                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${item.color} rounded-full`}
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${item.value}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}