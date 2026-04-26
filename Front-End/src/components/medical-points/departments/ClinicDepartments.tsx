"use client";

import {
    Stethoscope,
    Baby,
    HeartPulse,
    FlaskConical,
    Pill,
    Bone,
    ChevronLeft,
    Users,
    Star
} from "lucide-react";
import { motion } from "framer-motion";
import ClinicDepartmentsSkeleton from "./ClinicDepartmentsSkeleton";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Department {
    id: string;
    name: string;
    head: string;
    staffCount: number;
    icon: any;
    color: string;
    rating: number;
}

const departments: Department[] = [
    {
        id: "1",
        name: "قسم القلبية",
        head: "د. خالد منصور",
        staffCount: 8,
        icon: HeartPulse,
        color: "bg-red-500/10 text-red-500 border-red-500/20",
        rating: 4.8
    },
    {
        id: "2",
        name: "قسم الأطفال",
        head: "د. مريم العلي",
        staffCount: 12,
        icon: Baby,
        color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        rating: 4.9
    },
    {
        id: "3",
        name: "قسم العظام",
        head: "د. فهد السعد",
        staffCount: 6,
        icon: Bone,
        color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
        rating: 4.7
    },
    {
        id: "4",
        name: "المختبر",
        head: "أ. منى التميمي",
        staffCount: 10,
        icon: FlaskConical,
        color: "bg-purple-500/10 text-purple-500 border-purple-500/20",
        rating: 4.6
    },
    {
        id: "5",
        name: "الصيدلية",
        head: "ص. يحيى القحطاني",
        staffCount: 5,
        icon: Pill,
        color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
        rating: 4.5
    },
    {
        id: "6",
        name: "الطوارئ",
        head: "د. سامي الحربي",
        staffCount: 15,
        icon: Stethoscope,
        color: "bg-rose-500/10 text-rose-500 border-rose-500/20",
        rating: 4.8
    }
];

export default function ClinicDepartments({ isLoading = false }: { isLoading?: boolean }) {
    const params = useParams();
    const clinicId = params?.id as string;

    if (isLoading) return <ClinicDepartmentsSkeleton />;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-right">
            {departments.map((dept, i) => (
                <Link
                    key={dept.id}
                    href={`/admin/medical-points/clinics/${clinicId}/departments/${dept.id}`}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group bg-card border border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all p-4 md:p-5 cursor-pointer"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`size-10 md:size-12 rounded-xl flex items-center justify-center border transition-transform group-hover:scale-105 ${dept.color}`}>
                                <dept.icon className="size-5 md:size-6" />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <button className="text-muted-foreground/40 hover:text-primary transition-colors">
                                    <ChevronLeft size={16} />
                                </button>
                                <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 md:py-1 rounded-lg border border-amber-500/5">
                                    <Star size={10} className="fill-amber-500 text-amber-500" />
                                    <span className="text-[10px] md:text-xs font-black text-foreground">{dept.rating}</span>
                                </div>
                            </div>
                        </div>

                        <h3 className="text-sm md:text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors truncate">
                            {dept.name}
                        </h3>

                        <div className="space-y-2 mt-4">
                            <div className="flex items-center gap-2 text-[11px] md:text-[13px] text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors p-2 rounded-lg justify-between border border-border/5">
                                <div className="font-bold opacity-60">رئيس القسم:</div>
                                <div className="font-bold text-foreground ">{dept.head}</div>
                            </div>

                            <div className="flex justify-between items-center gap-2 text-[11px] md:text-[13px] text-muted-foreground bg-muted/20 hover:bg-muted/40 transition-colors p-2 rounded-lg border border-border/5">
                                <div className="font-bold opacity-60">عدد الموظفين:</div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-black text-foreground">{dept.staffCount}</span>
                                    <Users size={12} className="text-primary/60" />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </Link>
            ))}
        </div>
    );
}
