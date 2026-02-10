"use client";

import { UserRound, Stethoscope, Building2, Activity } from "lucide-react";
import { motion, Variants } from "framer-motion";

interface StatItemProps {
    label: string;
    value: string | number;
    icon: any;
    color: string;
}

const statsData = [
    {
        label: "إجمالي المرضى",
        value: "1,240",
        icon: UserRound,
        color: "bg-blue-500/10 text-blue-500",
    },
    {
        label: "الكادر الطبي",
        value: "12",
        icon: Stethoscope,
        color: "bg-emerald-500/10 text-emerald-500",
    },
    {
        label: "الأقسام",
        value: "6",
        icon: Building2,
        color: "bg-purple-500/10 text-purple-500",
    },
    {
        label: "مواعيد اليوم",
        value: "45",
        icon: Activity,
        color: "bg-amber-500/10 text-amber-500",
    },
];

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

export default function MedicalPointStats() {
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
