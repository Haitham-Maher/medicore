"use client";

import {
    Stethoscope,
    Baby,
    HeartPulse,
    FlaskConical,
    Pill,
    Bone,
    ChevronLeft,
    Users
} from "lucide-react";
import { motion } from "framer-motion";
import ClinicDepartmentsSkeleton from "../dashboard/skeletons/ClinicDepartmentsSkeleton";

interface Department {
    id: string;
    name: string;
    head: string;
    staffCount: number;
    icon: any;
    color: string;
}

const departments: Department[] = [
    {
        id: "1",
        name: "قسم القلبية",
        head: "د. خالد منصور",
        staffCount: 8,
        icon: HeartPulse,
        color: "bg-red-500/10 text-red-500 border-red-500/20"
    },
    {
        id: "2",
        name: "قسم الأطفال",
        head: "د. مريم العلي",
        staffCount: 12,
        icon: Baby,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20"
    },
    {
        id: "3",
        name: "قسم العظام",
        head: "د. فهد السعد",
        staffCount: 6,
        icon: Bone,
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20"
    },
    {
        id: "4",
        name: "المختبر",
        head: "أ. منى التميمي",
        staffCount: 10,
        icon: FlaskConical,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20"
    },
    {
        id: "5",
        name: "الصيدلية",
        head: "ص. يحيى القحطاني",
        staffCount: 5,
        icon: Pill,
        color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
    },
    {
        id: "6",
        name: "الطوارئ",
        head: "د. سامي الحربي",
        staffCount: 15,
        icon: Stethoscope,
        color: "bg-rose-500/10 text-rose-500 border-rose-500/20"
    }
];

export default function ClinicDepartments({ isLoading = false }: { isLoading?: boolean }) {
    if (isLoading) return <ClinicDepartmentsSkeleton />;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
            {departments.map((dept, i) => (
                <motion.div
                    key={dept.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all p-5 cursor-pointer"
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${dept.color}`}>
                            <dept.icon size={24} />
                        </div>
                        <button className="text-muted-foreground hover:text-primary transition-colors">
                            <ChevronLeft size={20} />
                        </button>
                    </div>

                    <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                        {dept.name}
                    </h3>

                    <div className="space-y-3 mt-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg justify-between">
                            <div>رئيس القسم:</div>
                            <div className="font-medium text-foreground ">{dept.head}</div>
                        </div>

                        <div className="flex justify-between items-center gap-2 text-sm text-muted-foreground bg-muted/30 p-2 rounded-lg">
                            <div className="">عدد الموظفين:</div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold text-foreground">{dept.staffCount}</span>
                                <Users size={14} className="text-primary" />
                            </div>

                        </div>
                    </div>

                    {/* <div className="mt-5 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.random() * 40 + 60}%` }}
                        />
                    </div> */}
                </motion.div>
            ))}
        </div>
    );
}
