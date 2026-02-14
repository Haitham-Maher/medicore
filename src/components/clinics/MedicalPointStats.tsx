"use client";

import {
    UserRound,
    Stethoscope,
    Building2,
    Activity,
    ShieldCheck,
    UserCheck,
    CreditCard,
    Phone,
    Mail,
    Calendar,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming cn utility is available here
import MedicalPointStatsSkeleton from "../dashboard/skeletons/MedicalPointStatsSkeleton";
import ManagerSectionSkeleton from "../dashboard/skeletons/ManagerSectionSkeleton";

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
        color: "bg-orange-500/10 text-orange-500",
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

import { useState } from "react";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import { Trash2 } from "lucide-react";

export function ManagerSection({
    compact = false,
    isLoading = false
}: {
    compact?: boolean;
    isLoading?: boolean;
}) {
    if (isLoading) return <ManagerSectionSkeleton />;
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        // Toast can be added here
        console.log("Manager deleted");
    };

    const manager = {
        name: "د. عبد الرحمن العتيبي",
        title: "رئيس النقطة الطبية",
        idNumber: "1092837465",
        phone: "+966 50 123 4567",
        email: "a.otaibi@medicore.com",
        joinedDate: "15 يناير 2022",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=200",
    };

    return (
        <motion.div
            initial={{ translateY: 30 }}
            animate={{ translateY: 0 }}
            transition={{ duration: .3 }}
            variants={itemVariants}
            className={cn(
                "bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm relative group",
                compact ? "h-full" : ""
            )}
        >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

            <div className={cn(
                "p-6 flex flex-col gap-8 items-center md:items-start relative",
                compact ? "h-full" : "md:flex-row"
            )}>
                {/* Manager Image */}
                <div className="relative shrink-0">
                    <div className={cn(
                        "rounded-2xl overflow-hidden border-4 border-background shadow-lg group-hover:rotate-2 transition-transform duration-500",
                        compact ? "w-20 h-20" : "w-28 h-28"
                    )}>
                        <img
                            src={manager.image}
                            alt={manager.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-success text-success-foreground p-1.5 rounded-lg shadow-lg border-2 border-background">
                        <ShieldCheck size={16} />
                    </div>
                </div>

                {/* Manager Info */}
                <div className="flex-1 space-y-4 text-center md:text-right w-full">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                <h3 className={cn("font-black text-foreground", compact ? "text-lg" : "text-xl")}>{manager.name}</h3>
                                <UserCheck size={18} className="text-primary hidden md:block" />
                            </div>
                            <p className="text-primary font-bold text-sm tracking-wide">{manager.title}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center justify-center md:justify-end gap-2 bg-muted/50 px-4 py-2 rounded-xl border border-border/50">
                                <CreditCard size={16} className="text-muted-foreground" />
                                <span className="text-xs font-mono font-bold text-foreground opacity-80">
                                    {manager.idNumber}
                                </span>
                            </div>
                            {/* Delete Button */}
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors cursor-pointer"
                                title="حذف رئيس النقطة"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    <div className={cn(
                        "grid grid-cols-1 gap-4 pt-4 border-t border-border/30",
                        compact ? "sm:grid-cols-1" : "sm:grid-cols-3"
                    )}>
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Phone size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">رقم الجوال</p>
                                <p className="text-xs font-bold text-foreground">{manager.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                                <Mail size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">البريد الإلكتروني</p>
                                <p className="text-xs font-bold text-foreground">{manager.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-500">
                                <Calendar size={14} />
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">تاريخ الانضمام</p>
                                <p className="text-xs font-bold text-foreground">{manager.joinedDate}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmation
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="حذف رئيس النقطة"
                description={`هل أنت متأكد من رغبتك في حذف "${manager.name}" من رئاسة هذه النقطة؟`}
                isLoading={isDeleting}
                confirmText="حذف المدير"
            />
        </motion.div>
    );
}

export default function MedicalPointStats({ isLoading = false }: { isLoading?: boolean }) {
    if (isLoading) return <MedicalPointStatsSkeleton />;
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
