"use client"

import {
    Users,
    Hospital,
    UserRound,
    TrendingUp,
} from "lucide-react";

import { motion } from "framer-motion";
interface IStats {
    label: string;
    value: string;
    icon: any;
    color: string;
    bgColor: string;
}

const stats: IStats[] = [
    { label: "إجمالي المرضى", value: "1,250", icon: Users, color: "text-chart-2", bgColor: "bg-chart-2/15" },
    { label: "النقاط الطبية", value: "48", icon: Hospital, color: "text-chart-1", bgColor: "bg-chart-1/15" },
    { label: "الأطباء", value: "156", icon: UserRound, color: "text-chart-4", bgColor: "bg-chart-4/15" },
    { label: "الأدوية المتاحة", value: "24", icon: Hospital, color: "text-chart-3", bgColor: "bg-chart-3/15" },
];

export default function StatsGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, ...stat }, i) => (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1, y: 0,
                        transition: { delay:(i * 0.3) }
                    }}
                    whileHover={{ scale: 1.03 }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 18
                    }}
                    key={i}
                    className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md cursor-pointer group"
                >
                    <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center transition-all`}>
                            <Icon className={`${stat.color}`} size={24} />
                        </div>
                        <div className="flex items-center gap-1 text-success font-medium text-sm">
                            <span>+12%</span>
                            <TrendingUp size={14} />
                        </div>
                    </div>
                    <div className="mt-4">
                        <p className="text-muted-foreground text-sm font-medium">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-foreground mt-1">{stat.value}</h3>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
