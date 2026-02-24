"use client";

import {
    UserRound,
    Stethoscope,
    Star,
    ClipboardList,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import MedicalPointStatsSkeleton from "../../stats/MedicalPointStatsSkeleton";

interface StatItemProps {
    label: string;
    value: string | number;
    icon: any;
    color: string;
}

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut",
        },
    },
};

function StatItem({ label, value, icon: Icon, color }: StatItemProps) {
    return (
        <motion.div
            variants={itemVariants}
            className="bg-card border border-border/50 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow group cursor-default"
        >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300 ${color}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-muted-foreground text-[10px] md:text-xs font-medium uppercase tracking-wider">{label}</p>
                <h4 className="text-lg md:text-xl font-bold text-foreground mt-0.5">{value}</h4>
            </div>
        </motion.div>
    );
}

interface DeptStatsProps {
    isLoading: boolean;
    stats: {
        patients: number;       // COUNT from prescriptions (unique patients)
        doctors: number;        // COUNT from doctors table
        avgRating: number;      // AVG(doctors.rating)
        prescriptions: number;  // COUNT from prescriptions table
    };
}

export default function DeptStats({ isLoading, stats }: DeptStatsProps) {
    if (isLoading) return <MedicalPointStatsSkeleton />;

    const statsData = [
        {
            label: "إجمالي المرضى",
            value: stats.patients.toLocaleString(),
            icon: UserRound,
            color: "bg-blue-500/10 text-blue-500",
        },
        {
            label: "الكادر الطبي",
            value: stats.doctors.toString(),
            icon: Stethoscope,
            color: "bg-emerald-500/10 text-emerald-500",
        },
        {
            label: "متوسط التقييم",
            value: stats.avgRating.toFixed(1),
            icon: Star,
            color: "bg-orange-500/10 text-orange-500",
        },
        {
            label: "الوصفات الطبية",
            value: stats.prescriptions.toLocaleString(),
            icon: ClipboardList,
            color: "bg-purple-500/10 text-purple-500",
        },
    ];

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
            {statsData.map((stat, index) => (
                <StatItem
                    key={index}
                    label={stat.label}
                    value={stat.value}
                    icon={stat.icon}
                    color={stat.color}
                />
            ))}
        </motion.div>
    );
}
