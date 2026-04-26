"use client";

import {
    ShieldCheck,
    UserCheck,
    CreditCard,
    Phone,
    Mail,
    Star,
    Trash2,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import DeleteConfirmation from "@/components/ui/DeleteConfirmation";
import ManagerSectionSkeleton from "../../skeletons/ManagerSectionSkeleton";
import { cn } from "@/lib/utils";

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

interface DeptHeadProfileProps {
    isLoading?: boolean;
    head: {
        name: string;           // persons.name
        specialization: string;
        rating: number;         // department_managers.rating
        image: string;
        email: string;          // users.email
        phone: string;          // persons.phone_number
    };
}

export default function DeptHeadProfile({
    isLoading = false,
    head,
}: DeptHeadProfileProps) {
    if (isLoading) return <ManagerSectionSkeleton />;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsDeleting(false);
        setIsDeleteModalOpen(false);
        console.log("Head deleted");
    };

    return (
        <motion.div
            initial={{ translateY: 30 }}
            animate={{ translateY: 0 }}
            transition={{ duration: .3 }}
            variants={itemVariants}
            className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-sm relative group"
        >
            {/* Background Decorative Element */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110 duration-700" />

            <div className="p-5 md:p-8 flex flex-col md:flex-row gap-6 md:gap-10 items-center md:items-start relative">
                {/* Image Section */}
                <div className="relative shrink-0">
                    <div className="size-24 md:size-32 rounded-2xl overflow-hidden border-4 border-background shadow-xl group-hover:rotate-3 transition-transform duration-700">
                        <img
                            src={head.image}
                            alt={head.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 md:p-2 rounded-xl shadow-lg border-2 border-background animate-pulse">
                        <ShieldCheck className="size-4 md:size-5" />
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 space-y-6 text-center md:text-right w-full">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-1">
                            <div className="flex items-center justify-center md:justify-start gap-2">
                                <h3 className="text-xl md:text-3xl font-black text-foreground tracking-tight">{head.name}</h3>
                                <UserCheck className="size-5 md:size-6 text-primary hidden md:block" />
                            </div>
                            <p className="text-primary font-black text-xs md:text-base tracking-wide opacity-90">{head.specialization}</p>
                        </div>

                        <div className="flex items-center justify-center gap-3">
                            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-xl border border-primary/10 shadow-sm">
                                <CreditCard size={14} className="text-primary" />
                                <span className="text-[10px] md:text-xs font-black text-primary uppercase tracking-wider">
                                    رئيس القسم
                                </span>
                            </div>
                            <button
                                onClick={() => setIsDeleteModalOpen(true)}
                                className="p-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-all cursor-pointer border border-red-500/5 hover:scale-105 active:scale-95"
                                title="حذف رئيس القسم"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Contact & Metrics Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6 border-t border-border/20">
                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-2xl border border-border/5 justify-start">
                            <div className="size-9 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 shadow-sm">
                                <Phone size={16} />
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-wider opacity-60 mb-0.5">رقم الجوال</p>
                                <p className="text-xs md:text-sm font-bold text-foreground font-mono">{head.phone}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-2xl border border-border/5 justify-start">
                            <div className="size-9 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 shadow-sm">
                                <Mail size={16} />
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-wider opacity-60 mb-0.5">البريد الإلكتروني</p>
                                <p className="text-xs md:text-sm font-bold text-foreground truncate max-w-[150px]">{head.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 bg-muted/20 p-3 rounded-2xl border border-border/5 justify-start sm:col-span-2 lg:col-span-1">
                            <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-sm">
                                <Star size={16} className="fill-amber-500" />
                            </div>
                            <div className="text-right">
                                <p className="text-[9px] md:text-[10px] text-muted-foreground uppercase font-black tracking-wider opacity-60 mb-0.5">التقييم العام</p>
                                <div className="flex items-center gap-1.5">
                                    <p className="text-xs md:text-sm font-black text-foreground">{head.rating}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DeleteConfirmation
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="حذف رئيس القسم"
                description={`هل أنت متأكد من رغبتك في حذف "${head.name}" من رئاسة هذا القسم؟`}
                isLoading={isDeleting}
                confirmText="حذف الرئيس"
            />
        </motion.div>
    );
}
